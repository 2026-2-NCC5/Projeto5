import React from 'react';
import { 
  ShieldAlert, User, Shield, Key, AlertTriangle, CheckCircle, Search, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSeguranca() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Segurança e Controle de Acesso
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-brand-600 text-white rounded-xl shadow-card p-6 flex flex-col items-center justify-center text-center">
          <Shield className="w-10 h-10 mb-2 opacity-80" />
          <p className="text-4xl font-bold">94<span className="text-xl opacity-80">/100</span></p>
          <p className="text-sm font-medium text-brand-100 mt-1">Score de Segurança</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-slate-300">Sessões Ativas</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">8</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="font-medium text-gray-600 dark:text-slate-300">Falhas de Login (24h)</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">3</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-5 h-5 text-amber-500" />
            <span className="font-medium text-gray-600 dark:text-slate-300">Adesão 2FA</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">71%</p>
          <p className="text-xs text-gray-500 mt-1">5 de 7 administradores</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 dark:text-slate-100">Eventos de Segurança Recentes</h3>
          </div>
          <div className="flex-1 overflow-auto max-h-96 p-2">
            {[
              { type: 'login_success', user: 'Fernanda Costa', ip: '189.34.12.98', time: 'Hoje, 08:30', icon: CheckCircle, color: 'text-brand-500' },
              { type: 'login_fail', user: 'Desconhecido (admin)', ip: '45.22.11.90', time: 'Hoje, 03:15', icon: ShieldAlert, color: 'text-red-500' },
              { type: '2fa_enabled', user: 'Carlos Silva', ip: '177.56.43.21', time: 'Ontem, 16:40', icon: Key, color: 'text-blue-500' },
            ].map((ev, i) => (
              <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-900/50 rounded-lg transition-colors">
                <ev.icon className={`w-5 h-5 mt-0.5 ${ev.color}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                    {ev.type === 'login_success' && 'Login bem sucedido'}
                    {ev.type === 'login_fail' && 'Tentativa de login falha'}
                    {ev.type === '2fa_enabled' && '2FA Habilitado'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Usuário: {ev.user} • IP: {ev.ip}</p>
                </div>
                <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">{ev.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 dark:text-slate-100">Sessões Ativas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Usuário</th>
                  <th className="px-4 py-3 font-medium">IP / Dispositivo</th>
                  <th className="px-4 py-3 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-100">
                    Você (Admin)
                    <span className="ml-2 text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full dark:bg-brand-900/30 dark:text-brand-400">Atual</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-slate-400">189.34.12.98<br/>Windows / Chrome</td>
                  <td className="px-4 py-3 text-right">
                    <button disabled className="text-xs text-gray-400 opacity-50 cursor-not-allowed">Revogar</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-100">Fernanda Costa</td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-slate-400">177.56.43.21<br/>Mac / Safari</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium">Revogar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
