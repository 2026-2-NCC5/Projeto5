import React, { useState } from 'react';
import { 
  Plus, Edit, Copy, Power, Clock, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockPrompts = [
  { id: 1, name: 'Atendimento Inicial', version: 'v2.4', status: 'ativo', uses: 12450, successRate: 92, author: 'Admin', updated: 'Hoje, 08:30' },
  { id: 2, name: 'Triagem Financeiro', version: 'v1.1', status: 'ativo', uses: 3200, successRate: 85, author: 'Admin', updated: 'Ontem, 14:20' },
  { id: 3, name: 'Suporte Técnico', version: 'v3.0-beta', status: 'teste', uses: 450, successRate: 78, author: 'DevTeam', updated: 'Há 3 dias' },
  { id: 4, name: 'Fechamento Chamado', version: 'v1.0', status: 'inativo', uses: 8900, successRate: 65, author: 'Admin', updated: 'Há 1 mês' },
];

export default function AdminPrompts() {
  const [editingPrompt, setEditingPrompt] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Gerenciamento de Prompts
        </h1>
        <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150">
          <Plus className="w-4 h-4" />
          Novo Prompt
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 flex items-center gap-4">
          <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Prompts Ativos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">12</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Em Teste (A/B)</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">3</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Chamadas/dia</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">4.2k</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Versão</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Usos</th>
                <th className="px-4 py-3 font-medium w-48">Taxa de Sucesso</th>
                <th className="px-4 py-3 font-medium">Autor</th>
                <th className="px-4 py-3 font-medium">Atualização</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {mockPrompts.map((prompt) => (
                <tr key={prompt.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-100">{prompt.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300 font-mono text-xs">{prompt.version}</td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-1 text-xs font-medium rounded-full", {
                      'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400': prompt.status === 'ativo',
                      'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400': prompt.status === 'teste',
                      'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400': prompt.status === 'inativo',
                    })}>
                      {prompt.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{prompt.uses.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className={cn("h-2 rounded-full", prompt.successRate > 80 ? 'bg-brand-500' : prompt.successRate > 60 ? 'bg-amber-500' : 'bg-red-500')} 
                          style={{ width: `${prompt.successRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-slate-300">{prompt.successRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{prompt.author}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{prompt.updated}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditingPrompt(prompt)} className="p-1 text-gray-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors" title="Duplicar">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors" title="Ativar/Desativar">
                        <Power className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors" title="Histórico">
                        <Clock className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingPrompt && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                Editando Prompt: {editingPrompt.name} <span className="text-sm font-normal text-gray-500">({editingPrompt.version})</span>
              </h2>
              <button onClick={() => setEditingPrompt(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-slate-300">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-hidden">
              <div className="flex flex-col h-full">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Versão Anterior</label>
                <textarea 
                  className="flex-1 w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-4 font-mono text-sm text-gray-600 dark:text-slate-400 resize-none"
                  disabled
                  value="Você é um assistente virtual da FECAP..."
                />
              </div>
              <div className="flex flex-col h-full">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Nova Versão</label>
                <textarea 
                  className="flex-1 w-full bg-white dark:bg-slate-950 border border-brand-200 dark:border-brand-900 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-slate-100 resize-none focus:ring-2 focus:ring-brand-500 outline-none"
                  defaultValue="Você é um assistente virtual da FECAP. Seja cordial e sempre..."
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3">
              <button onClick={() => setEditingPrompt(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors">
                Cancelar
              </button>
              <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Salvar como Nova Versão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mock extra icon for this file
function Zap(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}
