import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = [
  { id: '1', name: 'Matrícula', description: 'Problemas e dúvidas sobre matrícula semestral', tickets: 120, sla: 'Matrícula (Período)', color: 'bg-blue-500' },
  { id: '2', name: 'Financeiro', description: 'Bolsas, mensalidades, boletos, FIES e ProUni', tickets: 345, sla: 'Problemas Financeiros', color: 'bg-emerald-500' },
  { id: '3', name: 'Acadêmico', description: 'Notas, faltas, estágio e aproveitamento', tickets: 234, sla: 'Dúvidas Gerais', color: 'bg-amber-500' },
  { id: '4', name: 'Documentos', description: 'Solicitação de histórico, declarações', tickets: 189, sla: 'Documentos Padrão', color: 'bg-purple-500' },
  { id: '5', name: 'Infraestrutura', description: 'Problemas no portal do aluno, laboratórios', tickets: 56, sla: 'Atendimento Crítico', color: 'bg-red-500' },
  { id: '6', name: 'Cancelamento', description: 'Trancamento e cancelamento de curso', tickets: 23, sla: 'Dúvidas Gerais', color: 'bg-gray-500' },
  { id: '7', name: 'Outros', description: 'Assuntos não categorizados', tickets: 12, sla: 'Dúvidas Gerais', color: 'bg-indigo-500' },
]

export default function AdminCategorias() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Categorias</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Gerencie os tipos de assuntos para os chamados.</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova categoria
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Descrição</th>
                <th className="px-6 py-3 font-medium">Regra SLA Padrão</th>
                <th className="px-6 py-3 font-medium">Chamados Totais</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2.5 h-2.5 rounded-full', category.color)}></span>
                      <span className="font-medium text-gray-900 dark:text-slate-100">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-slate-400">{category.description}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-slate-300">{category.sla}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-200">{category.tickets}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
