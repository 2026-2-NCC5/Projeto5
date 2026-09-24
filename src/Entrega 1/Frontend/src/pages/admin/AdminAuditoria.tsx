import React, { useState } from 'react';
import { 
  Download, Filter, Eye, List, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminAuditoria() {
  const [view, setView] = useState<'table' | 'timeline'>('timeline');

  const mockEvents = [
    { id: 1, user: 'Admin (Você)', action: 'Alteração de Configuração', desc: 'Alterou o modelo de IA de gpt-4 para gpt-4o', date: 'Hoje, 09:12', severity: 'info' },
    { id: 2, user: 'Sistema', action: 'Execução de Automação', desc: 'Regra "Fechamento Automático" executada. 12 chamados fechados.', date: 'Hoje, 00:00', severity: 'info' },
    { id: 3, user: 'João Atendente', action: 'Exportação de Dados', desc: 'Exportou relatório de chamados em CSV (450 linhas)', date: 'Ontem, 16:45', severity: 'warning' },
    { id: 4, user: 'Desconhecido', action: 'Falha de Login', desc: 'Múltiplas tentativas de login falhas para usuário admin', date: 'Ontem, 03:15', severity: 'critical' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Auditoria de Sistema
        </h1>
        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-all">
          <Download className="w-4 h-4" />
          Exportar PDF
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-1 gap-4 items-center">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar eventos..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none dark:text-slate-100"
            />
          </div>
          <button className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700">
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-lg">
          <button onClick={() => setView('timeline')} className={cn("p-1.5 rounded-md transition-colors", view === 'timeline' ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-slate-100" : "text-gray-500")}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setView('table')} className={cn("p-1.5 rounded-md transition-colors", view === 'table' ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-slate-100" : "text-gray-500")}>
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
        {view === 'timeline' ? (
          <div className="relative border-l border-gray-200 dark:border-slate-700 ml-4 space-y-8 pb-4">
            {mockEvents.map((ev) => (
              <div key={ev.id} className="relative pl-6 sm:pl-8">
                <span className={cn("absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-slate-800", {
                  'bg-blue-500': ev.severity === 'info',
                  'bg-amber-500': ev.severity === 'warning',
                  'bg-red-500': ev.severity === 'critical',
                })} />
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-slate-100">{ev.action}</h3>
                  <span className="text-xs text-gray-500 dark:text-slate-400">{ev.date} • {ev.user}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-300">{ev.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 -mt-6">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 font-medium">Data/Hora</th>
                  <th className="px-6 py-3 font-medium">Usuário</th>
                  <th className="px-6 py-3 font-medium">Ação</th>
                  <th className="px-6 py-3 font-medium">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {mockEvents.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-3 text-gray-500 dark:text-slate-400 whitespace-nowrap">{ev.date}</td>
                    <td className="px-6 py-3 text-gray-900 dark:text-slate-100 font-medium">{ev.user}</td>
                    <td className="px-6 py-3 text-gray-900 dark:text-slate-100">
                      <span className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", {
                          'bg-blue-500': ev.severity === 'info',
                          'bg-amber-500': ev.severity === 'warning',
                          'bg-red-500': ev.severity === 'critical',
                        })} />
                        {ev.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600 dark:text-slate-300">{ev.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
