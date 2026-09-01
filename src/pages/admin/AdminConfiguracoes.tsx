import React, { useState } from 'react';
import { 
  Settings, Bell, Mail, Monitor, ShieldAlert, Save, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminConfiguracoes() {
  const [tab, setTab] = useState('geral');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Configurações do Sistema
        </h1>
        <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150">
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            {[
              { id: 'geral', label: 'Geral', icon: Settings },
              { id: 'notificacoes', label: 'Notificações', icon: Bell },
              { id: 'email', label: 'E-mail (SMTP)', icon: Mail },
              { id: 'aparencia', label: 'Aparência', icon: Monitor },
              { id: 'avancado', label: 'Avançado', icon: ShieldAlert },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                  tab === item.id 
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400" 
                    : "text-gray-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6 min-h-[400px]">
          {tab === 'geral' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Configurações Gerais</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Nome da Plataforma</label>
                  <input type="text" defaultValue="Álvaro AI" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Instituição</label>
                  <input type="text" defaultValue="FECAP" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:text-slate-100" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">E-mail de Suporte Geral</label>
                  <input type="email" defaultValue="suporte@fecap.br" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Fuso Horário</label>
                  <select className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:text-slate-100">
                    <option>America/Sao_Paulo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Idioma Padrão</label>
                  <select className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:text-slate-100">
                    <option>Português (Brasil)</option>
                    <option>Inglês</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === 'avancado' && (
            <div className="max-w-2xl space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">Manutenção e Debug</h2>
                <div className="space-y-4 mt-4">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-brand-600 rounded" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Modo de Manutenção (Bloqueia novos acessos)</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-brand-600 rounded" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Modo de Depuração (Logs detalhados)</span>
                  </label>
                </div>
                <button className="mt-4 flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                  <RefreshCw className="w-4 h-4" /> Limpar Cache do Sistema
                </button>
              </div>

              <div className="pt-6 border-t border-red-200 dark:border-red-900/30">
                <h2 className="text-lg font-bold text-red-600 dark:text-red-500 mb-2">Zona de Perigo</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Ações irreversíveis que afetam o funcionamento da plataforma.</p>
                <button className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40">
                  Redefinir Configurações de Fábrica
                </button>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['notificacoes', 'email', 'aparencia'].includes(tab) && (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Configurações de {tab} - Disponível em breve.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
