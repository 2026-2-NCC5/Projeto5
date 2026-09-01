import React, { useState } from 'react';
import { 
  Bot, Activity, MessageSquare, CheckCircle, Zap, Settings, 
  ThumbsUp, UserX, Info, AlertTriangle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';
import { mockChartData } from '@/lib/mock-data';

export default function AdminAgenteIA() {
  const [model, setModel] = useState('gpt-4o');
  const [behavior, setBehavior] = useState('moderado');
  const [confidence, setConfidence] = useState(80);
  const [handoff, setHandoff] = useState(60);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            Inteligência do Álvaro AI
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 rounded-full text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Operacional
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500 dark:text-slate-400">Modelo Atual</h3>
            <Bot className="w-5 h-5 text-brand-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">GPT-4o</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Tempo médio: 1.2s</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500 dark:text-slate-400">Conversas (30 dias)</h3>
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">1.847</p>
          <p className="text-sm text-brand-600 dark:text-brand-400 mt-1 flex items-center gap-1">
            <Zap className="w-4 h-4" /> +12% que mês anterior
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500 dark:text-slate-400">Resolução Autônoma</h3>
            <CheckCircle className="w-5 h-5 text-brand-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">73.2%</p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
            Encaminhamento: 26.8%
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500 dark:text-slate-400">Satisfação IA</h3>
            <ThumbsUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">89%</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Feedback positivo
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-6">Métricas da IA</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData?.aiMetrics || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorResolvidos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEncaminhados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="resolvidos_ia" name="Resolvidos IA" stroke="#16a34a" fillOpacity={1} fill="url(#colorResolvidos)" />
                <Area type="monotone" dataKey="encaminhados" name="Encaminhados" stroke="#f59e0b" fillOpacity={1} fill="url(#colorEncaminhados)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">Configuração do Agente</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Modelo de Linguagem
              </label>
              <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
              >
                <option value="gpt-4o">GPT-4o (Recomendado)</option>
                <option value="gpt-4o-mini">GPT-4o-mini (Mais rápido)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Comportamento
              </label>
              <select 
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
              >
                <option value="conservador">Conservador (Mais encaminhamentos)</option>
                <option value="moderado">Moderado</option>
                <option value="proativo">Proativo (Tenta resolver tudo)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Confiança Mínima: {confidence}%
              </label>
              <input 
                type="range" 
                min="0" max="100" 
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Encaminhamento humano abaixo de: {handoff}%
              </label>
              <input 
                type="range" 
                min="0" max="100" 
                value={handoff}
                onChange={(e) => setHandoff(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <button className="w-full mt-4 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150">
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
        <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">Recomendações Pendentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">Chamado</th>
                <th className="px-4 py-3 font-medium">Recomendação IA</th>
                <th className="px-4 py-3 font-medium">Confiança</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-slate-900/50">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-100">#1024 - Dúvida sobre DP</td>
                <td className="px-4 py-3 text-gray-600 dark:text-slate-300">Sugerir abertura de protocolo via Secretaria Online</td>
                <td className="px-4 py-3 text-brand-600 font-medium">92%</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-xs px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 rounded-md hover:bg-brand-100 dark:hover:bg-brand-900/40">Aplicar</button>
                    <button className="text-xs px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40">Rejeitar</button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-slate-900/50">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-100">#1025 - Erro no Moodle</td>
                <td className="px-4 py-3 text-gray-600 dark:text-slate-300">Encaminhar para suporte técnico N2</td>
                <td className="px-4 py-3 text-amber-600 font-medium">78%</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-xs px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 rounded-md hover:bg-brand-100 dark:hover:bg-brand-900/40">Aplicar</button>
                    <button className="text-xs px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40">Rejeitar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
