import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { useAppStore } from './store/app-store'

// Layouts síncronos para transição rápida de casca
import AlunoLayout from './components/layout/AlunoLayout'
import AsaLayout from './components/layout/AsaLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Componente de carregamento ultra-rápido para transição de rota
const PageLoading = () => (
  <div className="h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Carregando interface...</span>
    </div>
  </div>
)

// Auth & Public Portal (Lazy)
const FecapPortalPage = lazy(() => import('./pages/public/FecapPortalPage'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))

// Aluno pages (Lazy)
const AlunoDashboard = lazy(() => import('./pages/aluno/AlunoDashboard'))
const AlunoChat = lazy(() => import('./pages/aluno/AlunoChat'))
const AlunoChamados = lazy(() => import('./pages/aluno/AlunoChamados'))
const NovoChamado = lazy(() => import('./pages/aluno/NovoChamado'))
const DetalheChamadoAluno = lazy(() => import('./pages/aluno/DetalheChamadoAluno'))
const AlunoProfile = lazy(() => import('./pages/aluno/AlunoProfile'))
const AlunoDocumentos = lazy(() => import('./pages/aluno/AlunoDocumentos'))
const AlunoAgendamento = lazy(() => import('./pages/aluno/AlunoAgendamento'))

// ASA pages (Lazy)
const AsaDashboard = lazy(() => import('./pages/asa/AsaDashboard'))
const AsaFila = lazy(() => import('./pages/asa/AsaFila'))
const AsaAgendamentos = lazy(() => import('./pages/asa/AsaAgendamentos'))
const AsaDetalheChamado = lazy(() => import('./pages/asa/AsaDetalheChamado'))
const AsaConversas = lazy(() => import('./pages/asa/AsaConversas'))
const AsaAlunos = lazy(() => import('./pages/asa/AsaAlunos'))
const AsaAgenteIA = lazy(() => import('./pages/asa/AsaAgenteIA'))
const AsaBaseConhecimento = lazy(() => import('./pages/asa/AsaBaseConhecimento'))
const AsaSLA = lazy(() => import('./pages/asa/AsaSLA'))
const AsaMetricas = lazy(() => import('./pages/asa/AsaMetricas'))
const AsaRelatorios = lazy(() => import('./pages/asa/AsaRelatorios'))
const AsaNotificacoes = lazy(() => import('./pages/asa/AsaNotificacoes'))
const AsaAuditoria = lazy(() => import('./pages/asa/AsaAuditoria'))

// Admin pages (Lazy)
const AdminCommandCenter = lazy(() => import('./pages/admin/AdminCommandCenter'))
const AdminChamados = lazy(() => import('./pages/admin/AdminChamados'))
const AdminFila = lazy(() => import('./pages/admin/AdminFila'))
const AdminSLA = lazy(() => import('./pages/admin/AdminSLA'))
const AdminCategorias = lazy(() => import('./pages/admin/AdminCategorias'))
const AdminAutomacoes = lazy(() => import('./pages/admin/AdminAutomacoes'))
const AdminAgenteIA = lazy(() => import('./pages/admin/AdminAgenteIA'))
const AdminPrompts = lazy(() => import('./pages/admin/AdminPrompts'))
const AdminBaseConhecimento = lazy(() => import('./pages/admin/AdminBaseConhecimento'))
const AdminRAG = lazy(() => import('./pages/admin/AdminRAG'))
const AdminFeedback = lazy(() => import('./pages/admin/AdminFeedback'))
const AdminUsuarios = lazy(() => import('./pages/admin/AdminUsuarios'))
const AdminAlunos = lazy(() => import('./pages/admin/AdminAlunos'))
const AdminEquipeASA = lazy(() => import('./pages/admin/AdminEquipeASA'))
const AdminPermissoes = lazy(() => import('./pages/admin/AdminPermissoes'))
const AdminIntegracoes = lazy(() => import('./pages/admin/AdminIntegracoes'))
const AdminMetricas = lazy(() => import('./pages/admin/AdminMetricas'))
const AdminRelatorios = lazy(() => import('./pages/admin/AdminRelatorios'))
const AdminAuditoria = lazy(() => import('./pages/admin/AdminAuditoria'))
const AdminLogs = lazy(() => import('./pages/admin/AdminLogs'))
const AdminSeguranca = lazy(() => import('./pages/admin/AdminSeguranca'))
const AdminConfiguracoes = lazy(() => import('./pages/admin/AdminConfiguracoes'))
const AdminSaude = lazy(() => import('./pages/admin/AdminSaude'))

function App() {
  const { theme } = useAppStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Public Institutional Portal & Auth */}
          <Route path="/" element={<FecapPortalPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Aluno - Protegido por JWT e Sessão */}
          <Route element={<ProtectedRoute allowedRoles={['aluno', 'admin']} />}>
            <Route path="/aluno" element={<AlunoLayout />}>
              <Route index element={<AlunoDashboard />} />
              <Route path="chat" element={<AlunoChat />} />
              <Route path="chat/:id" element={<AlunoChat />} />
              <Route path="chamados" element={<AlunoChamados />} />
              <Route path="chamados/novo" element={<NovoChamado />} />
              <Route path="chamados/:id" element={<DetalheChamadoAluno />} />
              <Route path="documentos" element={<AlunoDocumentos />} />
              <Route path="agendamento" element={<AlunoAgendamento />} />
              <Route path="perfil" element={<AlunoProfile />} />
            </Route>
          </Route>

          {/* ASA - Protegido por JWT e Sessão */}
          <Route element={<ProtectedRoute allowedRoles={['asa', 'admin']} />}>
            <Route path="/asa" element={<AsaLayout />}>
              <Route index element={<AsaDashboard />} />
              <Route path="agendamentos" element={<AsaAgendamentos />} />
              <Route path="chamados" element={<AsaFila />} />
              <Route path="chamados/:id" element={<AsaDetalheChamado />} />
              <Route path="conversas" element={<AsaConversas />} />
              <Route path="alunos" element={<AsaAlunos />} />
              <Route path="agente-ia" element={<AsaAgenteIA />} />
              <Route path="base-conhecimento" element={<AsaBaseConhecimento />} />
              <Route path="sla" element={<AsaSLA />} />
              <Route path="metricas" element={<AsaMetricas />} />
              <Route path="relatorios" element={<AsaRelatorios />} />
              <Route path="notificacoes" element={<AsaNotificacoes />} />
              <Route path="auditoria" element={<AsaAuditoria />} />
            </Route>
          </Route>

          {/* Admin - Protegido por JWT e Sessão */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminCommandCenter />} />
              <Route path="chamados" element={<AdminChamados />} />
              <Route path="fila" element={<AdminFila />} />
              <Route path="sla" element={<AdminSLA />} />
              <Route path="categorias" element={<AdminCategorias />} />
              <Route path="automacoes" element={<AdminAutomacoes />} />
              <Route path="agente-ia" element={<AdminAgenteIA />} />
              <Route path="prompts" element={<AdminPrompts />} />
              <Route path="base-conhecimento" element={<AdminBaseConhecimento />} />
              <Route path="rag" element={<AdminRAG />} />
              <Route path="feedback" element={<AdminFeedback />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="alunos" element={<AdminAlunos />} />
              <Route path="asa" element={<AdminEquipeASA />} />
              <Route path="permissoes" element={<AdminPermissoes />} />
              <Route path="integracoes" element={<AdminIntegracoes />} />
              <Route path="metricas" element={<AdminMetricas />} />
              <Route path="relatorios" element={<AdminRelatorios />} />
              <Route path="auditoria" element={<AdminAuditoria />} />
              <Route path="logs" element={<AdminLogs />} />
              <Route path="seguranca" element={<AdminSeguranca />} />
              <Route path="configuracoes" element={<AdminConfiguracoes />} />
              <Route path="saude" element={<AdminSaude />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
