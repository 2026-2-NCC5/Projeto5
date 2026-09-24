import React, { useState } from 'react';
import { 
  BarChart2, PieChart, TrendingUp, Calendar, Download 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { mockChartData } from '@/lib/mock-data';

export default function AdminMetricas() {
  const [tab, setTab] = useState('chamados');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Métricas e Analytics
        </h1>
        <div className="flex gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
          {['Hoje', '7 dias', '30 dias', '90 dias'].map(r => (
            <button key={r} className={`px-3 py-1.5 text-sm font-medium rounded-md ${r === '30 dias' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-slate-100' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
        {[
          { id: 'chamados', label: 'Chamados' },
          { id: 'atendimento', label: 'Atendimento' },
          { id: 'sla', label: 'SLA' },
          { id: 'satisfacao', label: 'Satisfação' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? 'border-brand-600 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'chamados' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Criados', value: '4.250', trend: '+12%' },
              { label: 'Resolvidos', value: '3.980', trend: '+15%' },
              { label: 'Em Aberto', value: '142', trend: '-5%' },
              { label: 'Tempo Médio', value: '2.4h', trend: '-10%' },
            ].map(k => (
              <div key={k.label} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-slate-400">{k.label}</p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{k.value}</p>
                  <span className={`text-xs font-medium mb-1 ${k.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{k.trend}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-6">Volume de Chamados (Últimos 30 dias)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData?.ticketsOverTime || []}>
                  <defs>
                    <linearGradient id="colorCriados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="criados" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCriados)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Outras abas podem ser implementadas de forma similar */}
      {tab !== 'chamados' && (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card flex flex-col items-center justify-center text-center">
          <BarChart2 className="w-12 h-12 text-gray-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100">Visão Detalhada</h3>
          <p className="text-gray-500 dark:text-slate-400 mt-2 max-w-md">Selecione os filtros acima para visualizar os dados detalhados para esta seção.</p>
        </div>
      )}
    </div>
  );
}
