import { useState } from 'react'
import { Search, Filter, Download, MoreVertical, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockStudents } from '@/lib/mock-data'

export default function AdminAlunos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filtered = mockStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.ra.includes(searchTerm)
  )

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(s => s.id)))
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Alunos</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Base de alunos sincronizada com o sistema acadêmico.</p>
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
              placeholder="Buscar por nome ou RA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-slate-200"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {selectedIds.size > 0 && (
              <button className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-sm font-medium flex items-center gap-2 mr-2">
                <Mail className="w-4 h-4" /> Enviar Mensagem ({selectedIds.size})
              </button>
            )}
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
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
                <th className="px-6 py-3 font-medium">Nome / RA</th>
                <th className="px-6 py-3 font-medium">Curso</th>
                <th className="px-6 py-3 font-medium">Semestre / Turno</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" 
                      checked={selectedIds.has(student.id)} 
                      onChange={() => toggleSelect(student.id)} 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{student.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{student.ra}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-slate-300">{student.course}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-slate-300 capitalize">{student.semester}º - {student.period}</td>
                  <td className="px-6 py-4">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium',
                      student.status === 'regular' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      student.status === 'irregular' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                      'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300'
                    )}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                      <MoreVertical className="w-4 h-4" />
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
