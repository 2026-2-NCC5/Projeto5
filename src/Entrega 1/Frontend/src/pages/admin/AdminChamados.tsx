import { useState } from 'react'
import { Search, Filter, Download, Trash2, CheckCircle2, UserPlus, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockTickets, Ticket } from '@/lib/mock-data'

export default function AdminChamados() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filtered = mockTickets.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.number.toString().includes(searchTerm)
  )

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(t => t.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Chamados</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Gerenciamento completo de todos os tickets do sistema.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título ou #ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-slate-200"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {selectedIds.size > 0 && (
              <>
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-lg text-sm font-medium flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Atribuir
                </button>
                <button className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 dark:text-brand-400 rounded-lg text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Fechar
                </button>
                <button className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Excluir
                </button>
              </>
            )}
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors ml-auto sm:ml-0">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium w-12">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" 
                    checked={selectedIds.size === filtered.length && filtered.length > 0} 
                    onChange={toggleSelectAll} 
                  />
                </th>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Título</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Prioridade</th>
                <th className="px-6 py-3 font-medium">Data Criação</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filtered.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" 
                      checked={selectedIds.has(ticket.id)} 
                      onChange={() => toggleSelect(ticket.id)} 
                    />
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500 dark:text-slate-400">#{ticket.number}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {ticket.slaStatus === 'risk' && <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />}
                      <span className="font-medium text-gray-900 dark:text-slate-100 max-w-[200px] sm:max-w-[300px] truncate">{ticket.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium',
                      ticket.status === 'aberto' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                      ticket.status === 'em_atendimento' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                      ticket.status === 'resolvido' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400' :
                      'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                    )}>
                      {ticket.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('px-2 py-1 rounded text-xs font-medium uppercase tracking-wider',
                      ticket.priority === 'critica' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                      ticket.priority === 'alta' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                      ticket.priority === 'media' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                      'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                    )}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                    {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
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
