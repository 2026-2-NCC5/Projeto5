import { useState } from 'react'
import { Plus, MoreVertical, Clock, Ticket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockUsers } from '@/lib/mock-data'

export default function AdminEquipeASA() {
  const asaTeam = mockUsers.filter(u => u.role === 'asa')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Equipe ASA</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Gerenciamento de atendentes e métricas individuais.</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Adicionar membro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {asaTeam.map(member => (
          <div key={member.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 relative overflow-hidden group">
            <div className="absolute top-4 right-4">
              <button className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xl uppercase">
                  {member.name.slice(0, 2)}
                </div>
                <span className={cn('absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800', member.status === 'ativo' ? 'bg-green-500' : 'bg-gray-400')}></span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-slate-100">{member.name}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Analista ASA</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 mb-1">
                  <Ticket className="w-4 h-4" />
                  <span className="text-xs font-medium">Chamados Ativos</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{Math.floor(Math.random() * 20)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">Tempo Médio</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{Math.floor(Math.random() * 3 + 1)}h {Math.floor(Math.random() * 59)}m</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-slate-400">Último acesso</span>
              <span className="font-medium text-gray-700 dark:text-slate-300">
                {new Date(member.lastAccess).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
