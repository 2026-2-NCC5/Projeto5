// Teste de carga sem dependências (Node >= 18). Estágios de concorrência crescente (ramp), mix de endpoints,
// coleta p50/p95/p99, throughput, erros e amostras de CPU/RSS da API via /metrics.
//
// Uso:
//   BASE_URL=https://localhost:8443 JWT_SECRET=... METRICS_URL=http://localhost:9100/metrics \
//   node loadtest/load.mjs --stages 5,20,50,100 --seconds 30 --out evidencias/loadtest-X.json
import jwt from '../app/backend/node_modules/jsonwebtoken/index.js'
import { writeFileSync } from 'node:fs'

const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d }
const BASE = process.env.BASE_URL || 'http://localhost:3001'
const METRICS = process.env.METRICS_URL || ''
const stages = arg('stages', '5,20,50').split(',').map(Number)
const seconds = Number(arg('seconds', 20))
const out = arg('out', 'evidencias/loadtest.json')
if (process.env.INSECURE_TLS === '1') process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const token = process.env.TOKEN || jwt.sign({ id: 'load-admin', name: 'Load Test', email: 'load@test.local', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' })
const auth = { Authorization: `Bearer ${token}` }
// Mix aproximado do uso real: leitura de painel/métricas, listagens e health.
const MIX = [
  { name: 'health', w: 30, path: '/api/health' },
  { name: 'tickets-page', w: 20, path: '/api/tickets?limit=20', headers: auth },
  { name: 'tickets', w: 25, path: '/api/tickets', headers: auth },
  { name: 'kb', w: 10, path: '/api/knowledge-base', headers: auth },
  { name: 'metrics/overview', w: 10, path: '/api/metrics/overview?days=30', headers: auth },
  { name: 'unauthorized', w: 5, path: '/api/tickets' }, // 401 esperado (valida controle de acesso sob carga)
]
const pick = () => { let r = Math.random() * 100; for (const e of MIX) { if ((r -= e.w) < 0) return e } return MIX[0] }
const pct = (a, p) => a.length ? a[Math.min(a.length - 1, Math.floor(a.length * p))] : 0

async function sampleProc() {
  if (!METRICS) return null
  try {
    const t = await (await fetch(METRICS)).text()
    const g = (re) => Number((t.match(re) || [])[1])
    return { cpu_s: g(/^process_cpu_seconds_total\{[^}]*\} ([\d.e+-]+)/m), rss_mb: g(/^process_resident_memory_bytes\{[^}]*\} ([\d.e+-]+)/m) / 1048576, lag_p99_ms: g(/^nodejs_eventloop_lag_p99_seconds\{[^}]*\} ([\d.e+-]+)/m) * 1000 }
  } catch { return null }
}

async function runStage(conc) {
  const lat = [], byEp = {}, codes = {}
  let errors = 0, net = 0
  const end = Date.now() + seconds * 1000
  const cpu0 = await sampleProc(), t0 = Date.now()
  let peakRss = cpu0?.rss_mb || 0, peakLag = 0
  const poll = setInterval(async () => { const s = await sampleProc(); if (s) { peakRss = Math.max(peakRss, s.rss_mb); peakLag = Math.max(peakLag, s.lag_p99_ms) } }, 1000)
  const worker = async () => {
    while (Date.now() < end) {
      const e = pick(), s = performance.now()
      try {
        const r = await fetch(BASE + e.path, { headers: e.headers })
        await r.arrayBuffer()
        const d = performance.now() - s
        lat.push(d); (byEp[e.name] ||= []).push(d); codes[r.status] = (codes[r.status] || 0) + 1
        const expected = e.name === 'unauthorized' ? r.status === 401 : r.status < 400
        if (!expected) errors++
      } catch { net++; errors++ }
    }
  }
  await Promise.all(Array.from({ length: conc }, worker))
  clearInterval(poll)
  const elapsed = (Date.now() - t0) / 1000, cpu1 = await sampleProc()
  lat.sort((a, b) => a - b)
  const perEp = Object.fromEntries(Object.entries(byEp).map(([k, v]) => { v.sort((a, b) => a - b); return [k, { n: v.length, p50: +pct(v, .5).toFixed(1), p95: +pct(v, .95).toFixed(1), p99: +pct(v, .99).toFixed(1) }] }))
  return {
    concurrency: conc, duration_s: +elapsed.toFixed(1), requests: lat.length + net, rps: +((lat.length + net) / elapsed).toFixed(1),
    error_rate_pct: +((errors / Math.max(1, lat.length + net)) * 100).toFixed(2), network_errors: net, status_codes: codes,
    latency_ms: { p50: +pct(lat, .5).toFixed(1), p95: +pct(lat, .95).toFixed(1), p99: +pct(lat, .99).toFixed(1), max: +(lat.at(-1) || 0).toFixed(1) },
    api_cpu_cores_avg: cpu0 && cpu1 ? +((cpu1.cpu_s - cpu0.cpu_s) / elapsed).toFixed(2) : null,
    api_rss_peak_mb: +peakRss.toFixed(0), api_eventloop_lag_p99_peak_ms: +peakLag.toFixed(1), per_endpoint: perEp,
  }
}

const results = []
for (const c of stages) { console.log(`>> estágio: ${c} usuários virtuais por ${seconds}s`); const r = await runStage(c); results.push(r); console.log(JSON.stringify({ c, rps: r.rps, p95: r.latency_ms.p95, err: r.error_rate_pct, cpu: r.api_cpu_cores_avg, rss: r.api_rss_peak_mb })) }
const doc = { base: BASE, started: new Date().toISOString(), seconds_per_stage: seconds, stages: results }
writeFileSync(out, JSON.stringify(doc, null, 2)); console.log('salvo em', out)
