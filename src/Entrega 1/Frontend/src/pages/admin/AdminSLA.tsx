import { useState } from 'react'
import { Plus, Edit2, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

const mockSLARules = [
  { id: '1', name: 'Atendimento Crítico', priority: 'critica', category: 'todas', firstResponse: '15m', resolution: '4h', status: 'ativo' },
  { id: '2', name: 'Problemas Financeiros', priority: 'alta', category: 'financeiro', firstResponse: '2h', resolution: '24h', status: 'ativo' },
  { id: '3', name: 'Matrícula (Período)', priority: 'alta', category: 'matricula', firstResponse: '4h', resolution: '48h', status: 'ativo' },
  { id: '4', name: 'Documentos Padrão', priority: 'media', category: 'documentos', firstResponse: '24h', resolution: '5d', status: 'ativo' },
  { id: '5', name: 'Dúvidas Gerais', priority: 'baixa', category: 'todas', firstResponse: '48h', resolution: '7d', status: 'inativo' },
]

const chartData = [
  { name: '01/08', compliance: 98 },
  { name: '05/08', compliance: 97 },
  { name: '10/08', compliance: 99 },
  { name: '15/08', compliance: 96 },
  { name: '20/08', compliance: 95 },
  { name: '25/08', compliance: 98 },
  { name: '30/08', compliance: 99 },
]

export default function AdminSLA() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Acordos de Nível de Serviço (SLA)</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Configure prazos de resposta e resolução.</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova regra SLA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">No prazo</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">845</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Em risco</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">12</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Vencidos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">3</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-6">Conformidade de SLA (%)</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '13px' }}
              />
              <Area type="monotone" dataKey="compliance" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorCompliance)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Regras de SLA Ativas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Prioridade</th>
                <th className="px-6 py-3 font-medium">Categoria</th>
                <th className="px-6 py-3 font-medium">1ª Resposta</th>
                <th className="px-6 py-3 font-medium">Resolução</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {mockSLARules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-100">{rule.name}</td>
                  <td className="px-6 py-4">
                    <span className={cn('px-2 py-1 rounded text-xs font-medium uppercase tracking-wider',
                      rule.priority === 'critica' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                      rule.priority === 'alta' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                      rule.priority === 'media' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                      'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                    )}>
                      {rule.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-slate-300 capitalize">{rule.category}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-200">{rule.firstResponse}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-200">{rule.resolution}</td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                      rule.status === 'ativo' ? 'bg-brand-600' : 'bg-gray-200 dark:bg-slate-600'
                    )}>
                      <span className={cn(
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        rule.status === 'ativo' ? 'translate-x-4' : 'translate-x-0'
                      )} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
