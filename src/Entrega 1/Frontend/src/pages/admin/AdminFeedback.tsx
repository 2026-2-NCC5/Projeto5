import React, { useState } from 'react';
import { 
  ThumbsUp, ThumbsDown, MessageSquare, Search, Filter, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockFeedback = [
  { id: 1, student: 'Ana Clara', type: 'positive', comment: 'Ajudou a resolver muito rápido, nem precisei esperar a secretaria.', date: 'Hoje, 10:20', snippet: 'Como peço segunda chamada?' },
  { id: 2, student: 'Pedro Paulo', type: 'negative', comment: 'Não entendeu o que eu queria. Ficou dando voltas.', date: 'Hoje, 09:15', snippet: 'Erro 404 ao gerar boleto' },
  { id: 3, student: 'Marina Silva', type: 'positive', comment: '', date: 'Ontem, 16:40', snippet: 'Onde vejo minhas notas do semestre passado?' },
  { id: 4, student: 'João Silva', type: 'negative', comment: 'Resposta muito genérica.', date: 'Ontem, 11:10', snippet: 'Preciso trancar a matrícula' },
];

export default function AdminFeedback() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Feedback da Inteligência Artificial
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6 flex flex-col items-center justify-center text-center">
          <ThumbsUp className="w-10 h-10 text-brand-500 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">89%</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Feedback Positivo</p>
          <p className="text-xs text-brand-600 dark:text-brand-400 mt-2 font-medium">+2% essa semana</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6 flex flex-col items-center justify-center text-center">
          <ThumbsDown className="w-10 h-10 text-red-500 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">11%</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Feedback Negativo</p>
          <p className="text-xs text-brand-600 dark:text-brand-400 mt-2 font-medium">-2% essa semana</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6 flex flex-col items-center justify-center text-center">
          <MessageSquare className="w-10 h-10 text-blue-500 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">1.240</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Avaliações (30 dias)</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">28% de taxa de resposta</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-full transition-colors", filter === 'all' ? "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-slate-100" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800")}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('positive')}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-full transition-colors flex items-center gap-1.5", filter === 'positive' ? "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800")}
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Positivos
            </button>
            <button 
              onClick={() => setFilter('negative')}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-full transition-colors flex items-center gap-1.5", filter === 'negative' ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800")}
            >
              <ThumbsDown className="w-3.5 h-3.5" /> Negativos
            </button>
          </div>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select className="pl-9 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-slate-300 outline-none">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Este Mês</option>
            </select>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {mockFeedback.filter(f => filter === 'all' || f.type === filter).map(item => (
            <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-900/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-full mt-1",
                  item.type === 'positive' ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                )}>
                  {item.type === 'positive' ? <ThumbsUp className="w-5 h-5" /> : <ThumbsDown className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-slate-100">{item.student}</h4>
                    <span className="text-sm text-gray-500 dark:text-slate-400">{item.date}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-3 mb-3 border border-gray-100 dark:border-slate-700 text-sm">
                    <span className="text-gray-500 dark:text-slate-400 font-medium mr-2">Interação:</span>
                    <span className="text-gray-700 dark:text-slate-300">"{item.snippet}"</span>
                  </div>
                  {item.comment && (
                    <p className="text-gray-700 dark:text-slate-300 italic bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border-l-4 border-blue-400">
                      "{item.comment}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
