import React from 'react';
import { 
  FileText, Download, FileBarChart, PieChart, Clock, Users 
} from 'lucide-react';

const mockReports = [
  { id: 1, name: 'Resumo Geral de Chamados', desc: 'Volume, categorias e status atual de todos os chamados no período.', icon: FileBarChart, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', date: 'Hoje, 08:00' },
  { id: 2, name: 'Conformidade de SLA', desc: 'Análise detalhada de cumprimento e quebra de SLAs por prioridade.', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', date: 'Ontem, 18:30' },
  { id: 3, name: 'Desempenho da Equipe', desc: 'Produtividade por atendente, tempo médio de resposta e resolução.', icon: Users, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20', date: 'Há 2 dias' },
  { id: 4, name: 'Satisfação do Aluno (CSAT)', desc: 'Resultados de pesquisa de satisfação e análise de feedback.', icon: PieChart, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', date: 'Há 1 semana' },
];

export default function AdminRelatorios() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Relatórios
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockReports.map((report) => (
          <div key={report.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6 flex flex-col h-full hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-xl ${report.bg} ${report.color}`}>
                <report.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-slate-100">{report.name}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{report.desc}</p>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-slate-400">Última geração: {report.date}</span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors">
                  Visualizar
                </button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-brand-600 rounded-xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div>
          <h2 className="text-xl font-bold mb-2">Precisa de um relatório personalizado?</h2>
          <p className="text-brand-100">Crie visões customizadas utilizando o Construtor de Relatórios do Álvaro AI, selecionando métricas específicas, filtros avançados e exportações automatizadas.</p>
        </div>
        <button className="whitespace-nowrap px-6 py-3 bg-white text-brand-600 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm">
          Criar Relatório
        </button>
      </div>
    </div>
  );
}
