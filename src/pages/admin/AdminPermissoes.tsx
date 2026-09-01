import { useState } from 'react'
import { Save } from 'lucide-react'
import { cn } from '@/lib/utils'

const roles = ['Administrador', 'Supervisor', 'ASA', 'Analista', 'Visualizador']
const permissionGroups = [
  {
    name: 'Chamados',
    permissions: [
      { id: 'view_tickets', label: 'Visualizar chamados' },
      { id: 'create_tickets', label: 'Criar chamados' },
      { id: 'edit_tickets', label: 'Editar chamados' },
      { id: 'close_tickets', label: 'Fechar chamados' },
      { id: 'delete_tickets', label: 'Deletar chamados' },
    ]
  },
  {
    name: 'Usuários',
    permissions: [
      { id: 'view_users', label: 'Visualizar usuários' },
      { id: 'create_users', label: 'Criar usuários' },
      { id: 'edit_users', label: 'Editar usuários' },
      { id: 'delete_users', label: 'Deletar usuários' },
    ]
  },
  {
    name: 'Base de Conhecimento',
    permissions: [
      { id: 'view_kb', label: 'Visualizar documentos' },
      { id: 'create_kb', label: 'Criar documentos' },
      { id: 'publish_kb', label: 'Publicar documentos' },
    ]
  },
  {
    name: 'Sistema',
    permissions: [
      { id: 'manage_settings', label: 'Configurações' },
      { id: 'view_audit', label: 'Auditoria' },
      { id: 'view_logs', label: 'Logs' },
    ]
  },
  {
    name: 'Inteligência',
    permissions: [
      { id: 'view_ai_analytics', label: 'Ver análises IA' },
      { id: 'validate_ai_rec', label: 'Validar recomendações' },
      { id: 'edit_ai_prompts', label: 'Editar prompts' },
    ]
  }
]

export default function AdminPermissoes() {
  const [activeTab, setActiveTab] = useState(roles[0])
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({
    'Administrador': Object.fromEntries(permissionGroups.flatMap(g => g.permissions.map(p => [p.id, true]))),
    'Supervisor': Object.fromEntries(permissionGroups.flatMap(g => g.permissions.map(p => [p.id, !p.id.includes('delete') && !p.id.includes('settings')]))),
    'ASA': Object.fromEntries(permissionGroups.flatMap(g => g.permissions.map(p => [p.id, p.id.includes('tickets') && !p.id.includes('delete') || p.id === 'view_users' || p.id === 'view_kb' || p.id === 'view_ai_analytics']))),
  })

  const togglePermission = (role: string, permId: string) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...(prev[role] || {}),
        [permId]: !(prev[role]?.[permId] || false)
      }
    }))
  }

  const rolePermissions = permissions[activeTab] || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Permissões</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Gerencie as permissões de cada perfil.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100 dark:border-slate-700">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setActiveTab(role)}
              className={cn(
                'px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
                activeTab === role
                  ? 'border-brand-600 text-brand-600 dark:border-brand-500 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/10'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/50'
              )}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-8">
          {permissionGroups.map(group => (
            <div key={group.name}>
              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-4 uppercase tracking-wider">{group.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.permissions.map(perm => (
                  <label key={perm.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{perm.label}</span>
                    <div className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-opacity-75',
                      rolePermissions[perm.id] ? 'bg-brand-600' : 'bg-gray-200 dark:bg-slate-600'
                    )}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={rolePermissions[perm.id] || false}
                        onChange={() => togglePermission(activeTab, perm.id)}
                      />
                      <span className={cn(
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        rolePermissions[perm.id] ? 'translate-x-4' : 'translate-x-0'
                      )} />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700 flex justify-end">
          <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar permissões
          </button>
        </div>
      </div>
    </div>
  )
}
