import React, { useState } from 'react';
import { 
  Plus, Search, Filter, FileText, Edit, Database, Archive, Eye 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockDocs = [
  { id: 1, title: 'Política de Bolsas 2024', category: 'Financeiro', version: 'v1.2', status: 'ativo', views: 1250, updated: 'Hoje, 09:15' },
  { id: 2, title: 'Manual do Aluno - Moodle', category: 'Acadêmico', version: 'v3.0', status: 'ativo', views: 3420, updated: 'Ontem, 16:40' },
  { id: 3, title: 'Regulamento de DP e Adaptação', category: 'Secretaria', version: 'v1.0', status: 'rascunho', views: 0, updated: 'Há 2 dias' },
  { id: 4, title: 'Calendário Acadêmico 2023', category: 'Acadêmico', version: 'v1.0', status: 'arquivado', views: 5600, updated: 'Há 1 ano' },
];

export default function AdminBaseConhecimento() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Base de Conhecimento
        </h1>
        <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150">
          <Plus className="w-4 h-4" />
          Novo Documento
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Total Docs</p>
            <p className="text-xl font-bold text-gray-900 dark:text-slate-100">248</p>
          </div>
          <FileText className="w-8 h-8 text-blue-500 opacity-20" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Indexados (RAG)</p>
            <p className="text-xl font-bold text-gray-900 dark:text-slate-100">230</p>
          </div>
          <Database className="w-8 h-8 text-brand-500 opacity-20" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Rascunhos</p>
            <p className="text-xl font-bold text-gray-900 dark:text-slate-100">12</p>
          </div>
          <Edit className="w-8 h-8 text-amber-500 opacity-20" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Visitas Mensais</p>
            <p className="text-xl font-bold text-gray-900 dark:text-slate-100">14.5k</p>
          </div>
          <Eye className="w-8 h-8 text-purple-500 opacity-20" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar documentos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-slate-100"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Todas Categorias</option>
              <option value="financeiro">Financeiro</option>
              <option value="academico">Acadêmico</option>
              <option value="secretaria">Secretaria</option>
            </select>
            <button className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Versão</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Views</th>
                <th className="px-4 py-3 font-medium">Atualização</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {mockDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {doc.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{doc.category}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300 font-mono text-xs">{doc.version}</td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-1 text-xs font-medium rounded-full", {
                      'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400': doc.status === 'ativo',
                      'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400': doc.status === 'rascunho',
                      'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400': doc.status === 'arquivado',
                    })}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{doc.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{doc.updated}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors" title="Indexar RAG">
                        <Database className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors" title="Arquivar">
                        <Archive className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors" title="Ver">
                        <Eye className="w-4 h-4" />
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
  );
}
