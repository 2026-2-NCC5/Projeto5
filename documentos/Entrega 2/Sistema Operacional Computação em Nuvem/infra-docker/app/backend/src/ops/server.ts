/**
 * Entrypoint operacional (Entrega 2 - SO & Computação em Nuvem).
 *
 * Envolve a aplicação Express original (src/app.ts) SEM alterá-la, adicionando:
 *   - logs estruturados em JSON (1 linha por requisição, com request-id);
 *   - métricas Prometheus (latência, throughput, erros, CPU/memória do processo,
 *     event-loop lag) expostas em uma porta interna separada (METRICS_PORT);
 *   - encerramento gracioso (SIGTERM) para deploys sem perda de requisições.
 */
import { randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import express, { NextFunction, Request, Response } from 'express'
import client from 'prom-client'
import app from '../app'

const SERVICE = process.env.SERVICE_NAME || 'alvaro-api'
const PORT = Number(process.env.PORT || 3001)
const METRICS_PORT = Number(process.env.METRICS_PORT || 9100)

// ---------- logger estruturado ----------
type Level = 'debug' | 'info' | 'warn' | 'error'
const LEVELS: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 }
const MIN = LEVELS[(process.env.LOG_LEVEL as Level) || 'info'] ?? 20
export function log(level: Level, msg: string, extra: Record<string, unknown> = {}) {
  if (LEVELS[level] < MIN) return
  process.stdout.write(JSON.stringify({ ts: new Date().toISOString(), level, service: SERVICE, msg, ...extra }) + '\n')
}
// Redireciona console.* da aplicação original para o mesmo formato JSON.
console.log = (...a: unknown[]) => log('info', a.map(String).join(' '))
console.warn = (...a: unknown[]) => log('warn', a.map(String).join(' '))
console.error = (...a: unknown[]) => log('error', a.map(x => (x instanceof Error ? x.stack || x.message : typeof x === 'object' ? JSON.stringify(x) : String(x))).join(' '))

// ---------- métricas ----------
const registry = new client.Registry()
registry.setDefaultLabels({ service: SERVICE })
client.collectDefaultMetrics({ register: registry }) // CPU, memória RSS/heap, event-loop lag, GC, handles
const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds', help: 'Latência HTTP', labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10], registers: [registry],
})
const httpTotal = new client.Counter({ name: 'http_requests_total', help: 'Total de requisições', labelNames: ['method', 'route', 'status'], registers: [registry] })
const httpErrors = new client.Counter({ name: 'http_errors_total', help: 'Respostas 5xx', labelNames: ['method', 'route'], registers: [registry] })
const inflight = new client.Gauge({ name: 'http_requests_in_flight', help: 'Requisições em andamento', registers: [registry] })

// Normaliza rota para evitar explosão de cardinalidade (ids/uuids viram :id).
function routeLabel(req: Request): string {
  const base = (req.baseUrl || '') + (req.route?.path && req.route.path !== '/' ? req.route.path : '')
  const raw = base || req.path
  return raw.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/gi, ':id').replace(/\/\d+/g, '/:n').slice(0, 80)
}

const root = express()
root.disable('x-powered-by')
root.set('trust proxy', true) // atrás do Nginx

root.use((req: Request, res: Response, next: NextFunction) => {
  const id = (req.headers['x-request-id'] as string) || randomUUID()
  res.setHeader('x-request-id', id)
  const start = process.hrtime.bigint()
  inflight.inc()
  res.on('finish', () => {
    inflight.dec()
    const seconds = Number(process.hrtime.bigint() - start) / 1e9
    const route = routeLabel(req)
    const status = String(res.statusCode)
    httpDuration.labels(req.method, route, status).observe(seconds)
    httpTotal.labels(req.method, route, status).inc()
    if (res.statusCode >= 500) httpErrors.labels(req.method, route).inc()
    if (req.path === '/api/health' && res.statusCode < 400) return // reduz ruído de health-checks
    log(res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info', 'http_request', {
      request_id: id, method: req.method, route, path: req.path, status: res.statusCode,
      duration_ms: Math.round(seconds * 1000 * 100) / 100, ip: req.ip, bytes: Number(res.getHeader('content-length') || 0),
      user_agent: req.headers['user-agent'],
    })
  })
  next()
})

// Liveness simples (não depende do banco) — usado pelo orquestrador.
root.get('/livez', (_req, res) => { res.json({ status: 'alive', uptime_s: Math.round(process.uptime()) }) })
root.use(app)

const server = root.listen(PORT, () => log('info', 'api_started', { port: PORT, node: process.version, env: process.env.NODE_ENV }))
server.keepAliveTimeout = 65_000 // > keepalive do proxy para evitar 502 intermitentes

// Porta de métricas separada: nunca publicada para fora da rede Docker.
createServer(async (req, res) => {
  if (req.url === '/metrics') {
    res.setHeader('Content-Type', registry.contentType)
    res.end(await registry.metrics())
  } else { res.statusCode = 404; res.end() }
}).listen(METRICS_PORT, () => log('info', 'metrics_started', { port: METRICS_PORT }))

// ---------- shutdown gracioso ----------
function shutdown(signal: string) {
  log('warn', 'shutdown_signal', { signal })
  server.close(() => { log('info', 'shutdown_complete'); process.exit(0) })
  setTimeout(() => process.exit(1), 10_000).unref()
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('unhandledRejection', (e) => log('error', 'unhandled_rejection', { error: String(e) }))
