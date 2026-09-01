import React, { useState } from 'react';
import { 
  Download, Filter, Clock, Terminal, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLogs() {
  const [level, setLevel] = useState('ALL');

  const mockLogs = [
    { time: '2023-10-24 14:32:01.123', level: 'INFO', msg: 'System initialized successfully' },
    { time: '2023-10-24 14:32:05.441', level: 'INFO', msg: 'User admin@fecap.br authenticated via SSO' },
    { time: '2023-10-24 14:35:12.001', level: 'WARNING', msg: 'Rate limit approaching for API key ending in 4F2A' },
    { time: '2023-10-24 14:40:22.987', level: 'ERROR', msg: 'Failed to connect to ERP database: timeout after 5000ms' },
    { time: '2023-10-24 14:40:23.001', level: 'CRITICAL', msg: 'Financial sync job aborted due to persistent DB failures' },
    { time: '2023-10-24 14:45:01.111', level: 'INFO', msg: 'RAG indexer started batch processing' },
    { time: '2023-10-24 14:45:10.555', level: 'INFO', msg: 'RAG indexer completed. Processed 124 chunks.' },
  ];

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
          <Terminal className="w-6 h-6" />
          Logs do Sistema
        </h1>
        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-all">
          <Download className="w-4 h-4" />
          Baixar Logs (.log)
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-3 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                level === l 
                  ? "bg-gray-800 text-white dark:bg-slate-200 dark:text-slate-900" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-700"
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-2" />
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" defaultChecked className="rounded text-brand-600" />
          Auto-scroll
        </label>
      </div>

      <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden flex flex-col min-h-[500px] shadow-inner font-mono text-sm">
        <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-2 flex items-center justify-between text-gray-400 text-xs">
          <span>server-production-01.log</span>
          <span>Atualizado ao vivo</span>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-1">
          {mockLogs.filter(log => level === 'ALL' || log.level === level).map((log, i) => (
            <div key={i} className="flex gap-4 hover:bg-white/5 px-2 py-0.5 rounded transition-colors break-all">
              <span className="text-gray-500 shrink-0 select-none">[{log.time}]</span>
              <span className={cn("shrink-0 font-bold min-w-[70px]", {
                'text-green-400': log.level === 'INFO',
                'text-amber-400': log.level === 'WARNING',
                'text-red-400': log.level === 'ERROR',
                'text-red-500 bg-red-500/10 px-1 rounded': log.level === 'CRITICAL',
              })}>
                [{log.level}]
              </span>
              <span className="text-gray-300 whitespace-pre-wrap">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
