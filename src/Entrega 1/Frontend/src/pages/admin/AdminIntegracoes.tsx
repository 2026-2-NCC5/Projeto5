import { Activity, CreditCard, Database, Key, LayoutGrid, Mail, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const mockIntegrations = [
  { id: '1', name: 'Sistema Acadêmico Core', description: 'Sincronização de alunos, notas e grade curricular', status: 'operacional', lastSync: 'Há 5 minutos', icon: Database },
  { id: '2', name: 'API Financeira (ERP)', description: 'Sincronização de boletos, ProUni e FIES', status: 'degradado', lastSync: 'Há 1 hora', icon: CreditCard },
  { id: '3', name: 'Provedor de E-mail Institucional', description: 'Envio de notificações e alertas de SLA', status: 'operacional', lastSync: 'Há 2 minutos', icon: Mail },
  { id: '4', name: 'OpenAI (LLM)', description: 'Motor principal de IA para análise de chamados', status: 'operacional', lastSync: 'Em tempo real', icon: LayoutGrid },
  { id: '5', name: 'Pinecone (Vector DB)', description: 'Base de conhecimento RAG e busca semântica', status: 'operacional', lastSync: 'Em tempo real', icon: Database },
  { id: '6', name: 'SSO Institucional', description: 'Autenticação única para alunos e equipe', status: 'operacional', lastSync: 'Em tempo real', icon: Key },
]

export default function AdminIntegracoes() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            Integrações
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs font-medium text-green-700 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              98% Saúde do Sistema
            </span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Conectores e APIs externas que alimentam o Álvaro AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockIntegrations.map(integration => (
          <div key={integration.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                <integration.icon className="w-6 h-6 text-brand-600 dark:text-brand-500" />
              </div>
              <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5',
                integration.status === 'operacional' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                integration.status === 'degradado' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              )}>
                <span className={cn('w-1.5 h-1.5 rounded-full',
                  integration.status === 'operacional' ? 'bg-green-500' :
                  integration.status === 'degradado' ? 'bg-amber-500' :
                  'bg-red-500'
                )}></span>
                {integration.status}
              </span>
            </div>
            
            <div className="mb-6 flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">{integration.description}</p>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                <Activity className="w-3.5 h-3.5" />
                Sincronizado: {integration.lastSync}
              </div>
              <button className="flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                <Settings className="w-4 h-4" /> Configurar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
