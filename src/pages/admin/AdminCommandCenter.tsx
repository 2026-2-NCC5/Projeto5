import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  MessageSquare,
  Ticket,
  TrendingDown,
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { cn } from '@/lib/utils'

const chartData = [
  { name: 'Seg', abertos: 40, resolvidos: 24 },
  { name: 'Ter', abertos: 30, resolvidos: 13 },
  { name: 'Qua', abertos: 20, resolvidos: 38 },
  { name: 'Qui', abertos: 27, resolvidos: 39 },
  { name: 'Sex', abertos: 18, resolvidos: 48 },
  { name: 'Sáb', abertos: 23, resolvidos: 38 },
  { name: 'Dom', abertos: 34, resolvidos: 43 },
]

const pieData = [
  { name: 'Matrícula', value: 400, color: '#3b82f6' },
  { name: 'Financeiro', value: 300, color: '#10b981' },
  { name: 'Acadêmico', value: 300, color: '#f59e0b' },
  { name: 'Outros', value: 200, color: '#6366f1' },
]

const auditEvents = [
  { id: 1, user: 'Ricardo Mendes', action: 'Alterou permissões do grupo ASA', time: 'Há 5 minutos' },
  { id: 2, user: 'Sistema', action: 'Backup diário concluído', time: 'Há 2 horas' },
  { id: 3, user: 'Patricia Lemos', action: 'Adicionou nova regra de SLA', time: 'Há 3 horas' },
  { id: 4, user: 'Álvaro AI (IA)', action: 'Processou 150 mensagens em lote', time: 'Há 5 horas' },
  { id: 5, user: 'Fernanda Costa', action: 'Fechou 12 chamados em massa', time: 'Há 6 horas' },
]

const teamStatus = [
  { id: 1, name: 'Fernanda Costa', tickets: 12, status: 'ativo', avatar: 'https://i.pravatar.cc/150?u=fernanda' },
  { id: 2, name: 'Marcos Oliveira', tickets: 8, status: 'ativo', avatar: 'https://i.pravatar.cc/150?u=marcos' },
  { id: 3, name: 'Juliana Pereira', tickets: 15, status: 'ativo', avatar: 'https://i.pravatar.cc/150?u=juliana' },
  { id: 4, name: 'Bruno Almeida', tickets: 0, status: 'inativo', avatar: 'https://i.pravatar.cc/150?u=bruno' },
]

export default function AdminCommandCenter() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Central de Controle</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Visão geral da operação e saúde do Álvaro AI.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'API', status: 'Operacional', color: 'bg-green-500' },
            { label: 'IA', status: 'Operacional', color: 'bg-green-500' },
            { label: 'Banco', status: 'Operacional', color: 'bg-green-500' },
            { label: 'E-mail', status: 'Operacional', color: 'bg-green-500' },
            { label: 'RAG', status: 'Operacional', color: 'bg-green-500' },
            { label: 'Financial API', status: 'Degradado', color: 'bg-amber-500' },
          ].map((service) => (
            <Link key={service.label} to="/admin/saude" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <span className={cn('w-2 h-2 rounded-full', service.color)}></span>
              {service.label} <span className="opacity-70 font-normal">● {service.status}</span>
            </Link>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4"
      >
        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400">Atenção Requerida</h3>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-amber-700 dark:text-amber-300/80">
            <Link to="/admin/sla" className="flex items-center gap-1 hover:underline">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 3 chamados com SLA em risco
            </Link>
            <Link to="/admin/fila" className="flex items-center gap-1 hover:underline">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 7 chamados aguardando atendimento
            </Link>
            <Link to="/admin/agente-ia" className="flex items-center gap-1 hover:underline">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 12 recomendações da IA aguardando validação
            </Link>
            <Link to="/admin/integracoes" className="flex items-center gap-1 hover:underline">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> API Financeira com latência elevada
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Conversas hoje', value: '401', icon: MessageSquare, trend: '+12%', up: true, color: 'text-blue-600' },
          { label: 'Chamados abertos', value: '7', icon: Ticket, trend: '-2%', up: false, color: 'text-brand-600' },
          { label: 'Resolvidos hoje', value: '6', icon: CheckCircle2, trend: '+5%', up: true, color: 'text-emerald-600' },
          { label: 'Satisfação', value: '4.8', icon: Activity, trend: '+0.1', up: true, color: 'text-purple-600', suffix: '/5.0' },
          { label: 'Uso da IA', value: '76%', icon: Bot, trend: '+4%', up: true, color: 'text-indigo-600' },
          { label: 'Tempo médio', value: '2h 14m', icon: Clock, trend: '-15m', up: true, color: 'text-orange-600' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div className={cn('p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn('flex items-center text-xs font-medium', stat.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                {stat.up ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {stat.value}<span className="text-sm font-normal text-gray-400">{stat.suffix}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-6">Chamados & Resoluções (Últimos 7 dias)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAbertos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolvidos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px' }}
                />
                <Area type="monotone" dataKey="abertos" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorAbertos)" />
                <Area type="monotone" dataKey="resolvidos" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorResolvidos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-6">Chamados por Categoria</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center text-xs">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-600 dark:text-slate-300">{item.name}</span>
                <span className="ml-auto font-medium text-gray-900 dark:text-slate-100">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4">Atividade Recente (Auditoria)</h3>
          <div className="space-y-4">
            {auditEvents.map((event) => (
              <div key={event.id} className="flex gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-brand-500 shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-slate-200">
                    <span className="font-medium">{event.user}</span> {event.action}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-slate-400">{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4">Status da Equipe ASA</h3>
          <div className="space-y-3">
            {teamStatus.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                    <span className={cn('absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800', member.status === 'ativo' ? 'bg-green-500' : 'bg-gray-400')}></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{member.name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">{member.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{member.tickets}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">chamados</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
