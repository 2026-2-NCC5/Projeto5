import { mockUsers, mockTickets } from '@/lib/mock-data'
import { Ticket, Clock, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminFila() {
  const asaTeam = mockUsers.filter(u => u.role === 'asa')
  const unassigned = mockTickets.filter(t => !t.assignedTo)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Fila de Atendimento</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Visão da distribuição de chamados por atendente.</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-140px)]">
        {/* Unassigned Column */}
        <div className="w-80 shrink-0 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-gray-500" />
              Não Atribuídos
            </h3>
            <span className="bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs font-medium">
              {unassigned.length}
            </span>
          </div>
          <div className="p-3 flex-1 overflow-y-auto space-y-3">
            {unassigned.map(ticket => (
              <div key={ticket.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-grab">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-gray-500">#{ticket.number}</span>
                  <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider',
                    ticket.priority === 'critica' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                    ticket.priority === 'alta' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                    ticket.priority === 'media' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                    'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                  )}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100 line-clamp-2 mb-2">{ticket.title}</p>
                <div className="flex items-center text-xs text-gray-500 dark:text-slate-400 mt-2">
                  <Clock className="w-3 h-3 mr-1" /> Há 2 horas
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ASA Team Columns */}
        {asaTeam.map(member => {
          const memberTickets = mockTickets.filter(t => t.assignedTo === member.id)
          return (
            <div key={member.id} className="w-80 shrink-0 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800 flex flex-col">
              <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[10px] uppercase">
                    {member.name.slice(0, 2)}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 truncate w-32" title={member.name}>{member.name}</h3>
                </div>
                <span className="bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 px-2 py-0.5 rounded-full text-xs font-medium">
                  {memberTickets.length}
                </span>
              </div>
              <div className="p-3 flex-1 overflow-y-auto space-y-3 border-2 border-dashed border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-colors rounded-b-xl">
                {memberTickets.map(ticket => (
                  <div key={ticket.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-grab">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-gray-500">#{ticket.number}</span>
                      <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider',
                        ticket.priority === 'critica' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                        ticket.priority === 'alta' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                        ticket.priority === 'media' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                        'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                      )}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-100 line-clamp-2 mb-2">{ticket.title}</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-slate-400 mt-2">
                      <UserIcon className="w-3 h-3 mr-1" /> {member.name.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
