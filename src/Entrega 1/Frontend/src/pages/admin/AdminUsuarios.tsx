import { useState } from 'react'
import { Plus, Search, Filter, MoreVertical, Edit2, Shield, Ban, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { mockUsers, User } from '@/lib/mock-data'

export default function AdminUsuarios() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: mockUsers.length,
    ativos: mockUsers.filter(u => u.status === 'ativo').length,
    admins: mockUsers.filter(u => u.role === 'admin').length,
    asa: mockUsers.filter(u => u.role === 'asa').length
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Usuários</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Gerencie os acessos ao sistema interno.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo usuário
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Ativos', value: stats.ativos },
          { label: 'Administradores', value: stats.admins },
          { label: 'Equipe ASA', value: stats.asa },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-slate-200"
            />
          </div>
          <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Usuário</th>
                <th className="px-6 py-3 font-medium">Perfil</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Último acesso</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => setSelectedUser(user)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase">
                        {user.name.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-slate-100">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('px-2 py-1 rounded text-xs font-medium uppercase tracking-wider',
                      user.role === 'admin' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-slate-300">
                      <span className={cn('w-2 h-2 rounded-full', user.status === 'ativo' ? 'bg-green-500' : 'bg-gray-400')}></span>
                      <span className="capitalize">{user.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                    {new Date(user.lastAccess).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors" onClick={(e) => { e.stopPropagation(); setSelectedUser(user) }}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/20 dark:bg-black/40 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-gray-100 dark:border-slate-800 p-6 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Detalhes do Usuário</h2>
                <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200">
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xl uppercase">
                  {selectedUser.name.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Perfil</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-200 uppercase">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Departamento</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-200">{selectedUser.department || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Status</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-200 capitalize">{selectedUser.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-slate-300">
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-slate-300">
                  <Shield className="w-4 h-4" /> Permissões
                </button>
                <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Ban className="w-4 h-4" /> Desativar Usuário
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Novo Usuário</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">Adicione um novo membro à equipe.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Nome completo</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">E-mail corporativo</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Perfil de acesso</label>
                  <select className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-white">
                    <option value="asa">Equipe ASA</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors">
                  Enviar Convite
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
