import React from 'react';
import { 
  Activity, CheckCircle, AlertTriangle, XCircle, Clock, Server
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockServices = [
  { name: 'API Principal', status: 'operacional', latency: '45ms', uptime: '99.99%' },
  { name: 'Banco de Dados', status: 'operacional', latency: '12ms', uptime: '99.99%' },
  { name: 'Inteligência Artificial (GPT-4o)', status: 'operacional', latency: '1.2s', uptime: '99.95%' },
  { name: 'Serviço de E-mail (SMTP)', status: 'operacional', latency: '210ms', uptime: '99.90%' },
  { name: 'Integração Financeira (ERP)', status: 'degradado', latency: '4.5s', uptime: '98.50%' },
  { name: 'Armazenamento de Arquivos', status: 'operacional', latency: '85ms', uptime: '99.99%' },
];

export default function AdminSaude() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Saúde do Sistema
        </h1>
        <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150">
          <Activity className="w-4 h-4" />
          Verificar Agora
        </button>
      </div>

      <div className="bg-brand-50 border border-brand-200 dark:bg-brand-900/20 dark:border-brand-900/50 rounded-xl p-4 flex items-center gap-4">
        <div className="p-2 bg-brand-100 dark:bg-brand-900/50 rounded-full text-brand-600 dark:text-brand-400">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-900 dark:text-brand-100">Sistemas Operacionais</h2>
          <p className="text-sm text-brand-700 dark:text-brand-300">Última verificação: Há 2 minutos (atualização automática ativa)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockServices.map((service, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 hover:border-gray-300 dark:hover:border-slate-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                <Server className="w-4 h-4 text-gray-400" />
                {service.name}
              </h3>
              <span className={cn("flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full", {
                'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400': service.status === 'operacional',
                'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400': service.status === 'degradado',
                'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400': service.status === 'offline',
              })}>
                {service.status === 'operacional' && <CheckCircle className="w-3.5 h-3.5" />}
                {service.status === 'degradado' && <AlertTriangle className="w-3.5 h-3.5" />}
                {service.status === 'offline' && <XCircle className="w-3.5 h-3.5" />}
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-slate-400 text-xs mb-0.5">Latência</p>
                <p className="font-medium text-gray-900 dark:text-slate-100">{service.latency}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-slate-400 text-xs mb-0.5">Uptime (30d)</p>
                <p className="font-medium text-gray-900 dark:text-slate-100">{service.uptime}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
              <button className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                Ver detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6 mt-6">
        <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Histórico de Incidentes Recentes</h3>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700">
            <div className="mt-1">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100">Lentidão na Integração Financeira (Resolvido)</h4>
              <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">A API do ERP apresentou tempo de resposta elevado ({'>'} 5s) afetando a emissão de boletos.</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>12 de Junho, 14:20 - 15:45 (Duração: 1h 25m)</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-center text-gray-500 dark:text-slate-400 pt-2">Nenhum outro incidente nos últimos 7 dias.</p>
        </div>
      </div>
    </div>
  );
}
