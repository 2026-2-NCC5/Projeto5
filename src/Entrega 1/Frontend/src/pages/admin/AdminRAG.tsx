import React, { useState, useEffect } from 'react';
import { 
  Database, RefreshCw, Layers, CheckCircle, AlertTriangle, XCircle, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockRAGDocs = [
  { id: 1, name: 'politica_bolsas_2024.pdf', chunks: 142, status: 'indexed', lastSync: 'Hoje, 06:00' },
  { id: 2, name: 'manual_aluno_moodle.docx', chunks: 85, status: 'indexed', lastSync: 'Hoje, 06:05' },
  { id: 3, name: 'regulamento_dp.pdf', chunks: 34, status: 'pending', lastSync: '-' },
  { id: 4, name: 'calendario_2023.pdf', chunks: 0, status: 'error', lastSync: 'Ontem, 12:30' },
];

export default function AdminRAG() {
  const [indexing, setIndexing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleIndexAll = () => {
    setIndexing(true);
    setProgress(0);
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setIndexing(false), 500);
          return 100;
        }
        return p + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-3">
          <Database className="w-6 h-6 text-brand-600" />
          RAG — Base Vetorial
        </h1>
        <button 
          onClick={handleIndexAll}
          disabled={indexing}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
        >
          <RefreshCw className={cn("w-4 h-4", indexing && "animate-spin")} />
          {indexing ? 'Indexando...' : 'Indexar Tudo'}
        </button>
      </div>

      {indexing && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-brand-200 dark:border-brand-900/50 p-4 shadow-sm mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-brand-700 dark:text-brand-400">Processando embeddings...</span>
            <span className="text-brand-600 dark:text-brand-400">{progress}%</span>
          </div>
          <div className="w-full bg-brand-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-brand-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4">
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Status Indexador</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-lg font-bold text-gray-900 dark:text-slate-100">Operacional</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4">
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Documentos Indexados</p>
          <p className="text-lg font-bold text-gray-900 dark:text-slate-100">18 / 20</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4">
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Total Chunks Vetorizados</p>
          <p className="text-lg font-bold text-gray-900 dark:text-slate-100">1.247</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4">
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Erros de Indexação</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">1</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100">Status por Documento</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none dark:text-slate-100"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">Documento</th>
                <th className="px-4 py-3 font-medium">Chunks</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Última Indexação</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {mockRAGDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-100 flex items-center gap-2">
                    <Database className="w-4 h-4 text-gray-400" />
                    {doc.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{doc.chunks}</td>
                  <td className="px-4 py-3">
                    <span className={cn("flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full w-fit", {
                      'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400': doc.status === 'indexed',
                      'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400': doc.status === 'pending',
                      'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400': doc.status === 'error',
                    })}>
                      {doc.status === 'indexed' && <CheckCircle className="w-3.5 h-3.5" />}
                      {doc.status === 'pending' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {doc.status === 'error' && <XCircle className="w-3.5 h-3.5" />}
                      {doc.status === 'indexed' ? 'Indexado' : doc.status === 'pending' ? 'Pendente' : 'Erro'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{doc.lastSync}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                        Reindexar
                      </button>
                      <button className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                        Chunks
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">Configuração Avançada do RAG</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Modelo de Embedding</label>
            <select className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:text-slate-100">
              <option>text-embedding-3-large</option>
              <option>text-embedding-3-small</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tamanho do Chunk (Tokens)</label>
            <input type="number" defaultValue={512} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:text-slate-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Overlap de Chunks</label>
            <input type="number" defaultValue={50} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:text-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
