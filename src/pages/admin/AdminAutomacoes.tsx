import React from 'react';
import { 
  Zap, Plus, Play, MoreVertical, ArrowRight, ToggleLeft, ToggleRight
} from 'lucide-react';

const mockAutomations = [
  { id: 1, name: 'Fechamento Automático', desc: 'Fecha chamados resolvidos após 48h sem resposta', runs: 124, active: true },
  { id: 2, name: 'Alerta SLA Crítico', desc: 'Notifica ASA se SLA crítico < 2h', runs: 12, active: true },
  { id: 3, name: 'Triagem Financeiro', desc: 'Atribui categoria Financeiro se contiver palavras-chave', runs: 340, active: false },
];

export default function AdminAutomacoes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Automações e Regras
        </h1>
        <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150">
          <Plus className="w-4 h-4" />
          Nova Automação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6">
          <p className="text-sm text-gray-500 dark:text-slate-400">Total de Regras</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1">14</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6">
          <p className="text-sm text-gray-500 dark:text-slate-400">Regras Ativas</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">11</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6">
          <p className="text-sm text-gray-500 dark:text-slate-400">Execuções Hoje</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1">1.842</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockAutomations.map((rule) => (
          <div key={rule.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-5">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  {rule.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{rule.desc}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  <Play className="w-3 h-3" /> {rule.runs} execuções
                </span>
                <button className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {rule.active ? <ToggleRight className="w-8 h-8 text-brand-600 dark:text-brand-500" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
                <button className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-300">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg text-sm font-medium">
                <span className="text-xs uppercase font-bold opacity-70">Gatilho</span>
                Status alterado para Resolvido
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg text-sm font-medium">
                <span className="text-xs uppercase font-bold opacity-70">Condição</span>
                Tempo {'>'} 48h
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800 rounded-lg text-sm font-medium">
                <span className="text-xs uppercase font-bold opacity-70">Ação</span>
                Alterar Status para Fechado
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
