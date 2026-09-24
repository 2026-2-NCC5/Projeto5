// ============================================================
// Álvaro AI — Mock Data
// ============================================================

export type UserRole = 'aluno' | 'asa' | 'admin'
export type TicketStatus = 'aberto' | 'em_atendimento' | 'aguardando_aluno' | 'resolvido' | 'fechado'
export type TicketPriority = 'baixa' | 'media' | 'alta' | 'critica'
export type TicketCategory =
  | 'matricula'
  | 'financeiro'
  | 'academico'
  | 'documentos'
  | 'outros'
  | 'infraestrutura'
  | 'cancelamento'

// -------------------------------------------------------
// USERS
// -------------------------------------------------------

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  department?: string
  status: 'ativo' | 'inativo'
  lastAccess: string
  createdAt: string
}

export const mockUsers: User[] = [
  {
    id: 'admin-01',
    name: 'Ricardo Mendes',
    email: 'ricardo.mendes@fecap.br',
    role: 'admin',
    status: 'ativo',
    department: 'TI',
    lastAccess: '2026-08-30T08:10:00',
    createdAt: '2024-01-15T00:00:00',
  },
  {
    id: 'admin-02',
    name: 'Patricia Lemos',
    email: 'patricia.lemos@fecap.br',
    role: 'admin',
    status: 'ativo',
    department: 'Gestão',
    lastAccess: '2026-08-29T17:45:00',
    createdAt: '2024-01-15T00:00:00',
  },
  {
    id: 'asa-01',
    name: 'Fernanda Costa',
    email: 'fernanda.costa@fecap.br',
    role: 'asa',
    status: 'ativo',
    department: 'ASA',
    lastAccess: '2026-08-30T08:05:00',
    createdAt: '2024-03-10T00:00:00',
  },
  {
    id: 'asa-02',
    name: 'Marcos Oliveira',
    email: 'marcos.oliveira@fecap.br',
    role: 'asa',
    status: 'ativo',
    department: 'ASA',
    lastAccess: '2026-08-30T07:55:00',
    createdAt: '2024-03-10T00:00:00',
  },
  {
    id: 'asa-03',
    name: 'Juliana Pereira',
    email: 'juliana.pereira@fecap.br',
    role: 'asa',
    status: 'ativo',
    department: 'ASA',
    lastAccess: '2026-08-29T18:20:00',
    createdAt: '2024-05-01T00:00:00',
  },
  {
    id: 'asa-04',
    name: 'Bruno Almeida',
    email: 'bruno.almeida@fecap.br',
    role: 'asa',
    status: 'ativo',
    department: 'ASA',
    lastAccess: '2026-08-30T08:00:00',
    createdAt: '2024-05-01T00:00:00',
  },
  {
    id: 'asa-05',
    name: 'Camila Rocha',
    email: 'camila.rocha@fecap.br',
    role: 'asa',
    status: 'inativo',
    department: 'ASA',
    lastAccess: '2026-07-15T14:30:00',
    createdAt: '2024-07-01T00:00:00',
  },
]

// -------------------------------------------------------
// STUDENTS
// -------------------------------------------------------

export interface Student {
  id: string
  name: string
  ra: string
  email: string
  course: string
  semester: number
  period: 'manha' | 'tarde' | 'noite'
  status: 'regular' | 'irregular' | 'trancado'
  phone?: string
  createdAt: string
}

export const mockStudents: Student[] = [
  {
    id: 'aluno-01',
    name: 'Esther Rodrigues',
    ra: '24001523',
    email: 'esther.rodrigues@aluno.fecap.br',
    course: 'Administração',
    semester: 3,
    period: 'noite',
    status: 'regular',
    phone: '(11) 98765-4321',
    createdAt: '2024-02-01T00:00:00',
  },
  {
    id: 'aluno-02',
    name: 'Lucas Ferreira',
    ra: '23008742',
    email: 'lucas.ferreira@aluno.fecap.br',
    course: 'Ciências Contábeis',
    semester: 5,
    period: 'noite',
    status: 'regular',
    phone: '(11) 91234-5678',
    createdAt: '2023-02-01T00:00:00',
  },
  {
    id: 'aluno-03',
    name: 'Ana Beatriz Santos',
    ra: '25002847',
    email: 'ana.santos@aluno.fecap.br',
    course: 'Sistemas de Informação',
    semester: 1,
    period: 'manha',
    status: 'regular',
    createdAt: '2025-02-01T00:00:00',
  },
  {
    id: 'aluno-04',
    name: 'Gabriel Moura',
    ra: '22015634',
    email: 'gabriel.moura@aluno.fecap.br',
    course: 'Administração',
    semester: 7,
    period: 'tarde',
    status: 'irregular',
    createdAt: '2022-02-01T00:00:00',
  },
  {
    id: 'aluno-05',
    name: 'Sofia Lima',
    ra: '24007891',
    email: 'sofia.lima@aluno.fecap.br',
    course: 'Marketing',
    semester: 2,
    period: 'noite',
    status: 'regular',
    createdAt: '2024-08-01T00:00:00',
  },
  {
    id: 'aluno-06',
    name: 'Rafael Pinto',
    ra: '23011234',
    email: 'rafael.pinto@aluno.fecap.br',
    course: 'Economia',
    semester: 4,
    period: 'tarde',
    status: 'trancado',
    createdAt: '2023-02-01T00:00:00',
  },
  {
    id: 'aluno-07',
    name: 'Isabella Carvalho',
    ra: '24003657',
    email: 'isabella.carvalho@aluno.fecap.br',
    course: 'Ciências Contábeis',
    semester: 2,
    period: 'noite',
    status: 'regular',
    createdAt: '2024-02-01T00:00:00',
  },
  {
    id: 'aluno-08',
    name: 'Thiago Nascimento',
    ra: '21022145',
    email: 'thiago.nascimento@aluno.fecap.br',
    course: 'Administração',
    semester: 9,
    period: 'noite',
    status: 'irregular',
    createdAt: '2021-02-01T00:00:00',
  },
  {
    id: 'aluno-09',
    name: 'Mariana Duarte',
    ra: '25000198',
    email: 'mariana.duarte@aluno.fecap.br',
    course: 'Marketing',
    semester: 1,
    period: 'manha',
    status: 'regular',
    createdAt: '2025-08-01T00:00:00',
  },
  {
    id: 'aluno-10',
    name: 'Pedro Henrique Vieira',
    ra: '23019876',
    email: 'pedro.vieira@aluno.fecap.br',
    course: 'Sistemas de Informação',
    semester: 5,
    period: 'noite',
    status: 'regular',
    createdAt: '2023-02-01T00:00:00',
  },
]

// -------------------------------------------------------
// TICKETS
// -------------------------------------------------------

export interface Ticket {
  id: string
  number: number
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  studentId: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  slaDeadline: string
  slaStatus: 'ok' | 'risk' | 'breached'
  tags?: string[]
  aiSuggestion?: AIAnalysis
}

export interface AIAnalysis {
  intent: string
  category: TicketCategory
  priority: TicketPriority
  summary: string
  confidence: number
  recommendation: string
  sentiment: 'positivo' | 'neutro' | 'negativo'
}

export const mockTickets: Ticket[] = [
  {
    id: 'ticket-01',
    number: 1052,
    title: 'Problema com matrícula no semestre',
    description: 'Não consigo realizar minha matrícula nas disciplinas. O sistema exibe erro ao tentar confirmar as disciplinas selecionadas.',
    status: 'em_atendimento',
    priority: 'alta',
    category: 'matricula',
    studentId: 'aluno-01',
    assignedTo: 'asa-01',
    createdAt: '2026-08-28T09:15:00',
    updatedAt: '2026-08-30T14:32:00',
    slaDeadline: '2026-08-30T17:00:00',
    slaStatus: 'risk',
    tags: ['matrícula', 'sistema', 'urgente'],
    aiSuggestion: {
      intent: 'Dificuldade técnica no processo de matrícula',
      category: 'matricula',
      priority: 'alta',
      summary: 'Aluno relata impossibilidade de realizar matrícula por erro no sistema. Pode ser relacionado ao período de bloqueio por pendências financeiras ou erro no portal.',
      confidence: 0.92,
      recommendation: 'Verificar situação financeira do aluno e confirmar se há bloqueio no sistema. Se não, escalar para TI.',
      sentiment: 'negativo',
    },
  },
  {
    id: 'ticket-02',
    number: 1051,
    title: 'Solicitação de histórico escolar',
    description: 'Preciso do histórico escolar para fins de transferência. Necessito com urgência.',
    status: 'resolvido',
    priority: 'media',
    category: 'documentos',
    studentId: 'aluno-02',
    assignedTo: 'asa-02',
    createdAt: '2026-08-27T14:20:00',
    updatedAt: '2026-08-29T16:45:00',
    slaDeadline: '2026-08-29T14:00:00',
    slaStatus: 'ok',
    tags: ['histórico', 'documento'],
    aiSuggestion: {
      intent: 'Solicitação de documento acadêmico',
      category: 'documentos',
      priority: 'media',
      summary: 'Aluno solicita histórico escolar para transferência de instituição. Documento pode ser emitido pelo portal ou presencialmente na secretaria.',
      confidence: 0.97,
      recommendation: 'Orientar o aluno sobre o processo de solicitação de documentos pelo portal do aluno. Prazo padrão: 5 dias úteis.',
      sentiment: 'neutro',
    },
  },
  {
    id: 'ticket-03',
    number: 1053,
    title: 'Dúvida sobre bolsa de estudos e mensalidade',
    description: 'Minha bolsa do ProUni estava ativa mas aparece cobrança no portal financeiro. Preciso entender o motivo.',
    status: 'aberto',
    priority: 'alta',
    category: 'financeiro',
    studentId: 'aluno-03',
    createdAt: '2026-08-30T07:30:00',
    updatedAt: '2026-08-30T07:30:00',
    slaDeadline: '2026-08-30T11:30:00',
    slaStatus: 'risk',
    tags: ['bolsa', 'financeiro', 'ProUni'],
    aiSuggestion: {
      intent: 'Inconsistência no benefício de bolsa de estudos',
      category: 'financeiro',
      priority: 'alta',
      summary: 'Aluno com bolsa ProUni registra cobrança indevida. Pode ser erro de processamento ou suspensão temporária do benefício.',
      confidence: 0.88,
      recommendation: 'Verificar status da bolsa no sistema financeiro e confirmar se houve processamento correto junto ao MEC. Contatar setor financeiro.',
      sentiment: 'negativo',
    },
  },
  {
    id: 'ticket-04',
    number: 1054,
    title: 'Solicitação de aproveitamento de disciplinas',
    description: 'Já cursei Cálculo I em outra instituição e gostaria de solicitar o aproveitamento da matéria.',
    status: 'aguardando_aluno',
    priority: 'baixa',
    category: 'academico',
    studentId: 'aluno-04',
    assignedTo: 'asa-03',
    createdAt: '2026-08-25T11:00:00',
    updatedAt: '2026-08-28T09:20:00',
    slaDeadline: '2026-09-02T11:00:00',
    slaStatus: 'ok',
    tags: ['aproveitamento', 'disciplina'],
    aiSuggestion: {
      intent: 'Solicitação de aproveitamento de estudos anteriores',
      category: 'academico',
      priority: 'baixa',
      summary: 'Aluno solicita aproveitamento de disciplina cursada em outra IES. Requer análise de ementa e documentação comprobatória.',
      confidence: 0.94,
      recommendation: 'Solicitar histórico e ementa da disciplina cursada. Encaminhar para coordenação do curso para análise.',
      sentiment: 'neutro',
    },
  },
  {
    id: 'ticket-05',
    number: 1055,
    title: 'Problema no acesso ao portal do aluno',
    description: 'Não consigo logar no portal desde ontem. Senha redefinida mas continua dando erro 403.',
    status: 'em_atendimento',
    priority: 'media',
    category: 'infraestrutura',
    studentId: 'aluno-05',
    assignedTo: 'asa-01',
    createdAt: '2026-08-29T20:15:00',
    updatedAt: '2026-08-30T08:10:00',
    slaDeadline: '2026-08-30T20:15:00',
    slaStatus: 'ok',
    tags: ['acesso', 'portal', 'senha'],
    aiSuggestion: {
      intent: 'Falha técnica de acesso ao sistema',
      category: 'infraestrutura',
      priority: 'media',
      summary: 'Aluno relata erro 403 no portal após redefinição de senha. Possível problema de cache de sessão ou permissão de conta.',
      confidence: 0.85,
      recommendation: 'Solicitar limpeza de cache e cookies. Se persistir, verificar status da conta no sistema de autenticação.',
      sentiment: 'negativo',
    },
  },
  {
    id: 'ticket-06',
    number: 1050,
    title: 'Cancelamento de matrícula semestral',
    description: 'Preciso cancelar minha matrícula neste semestre por motivos pessoais.',
    status: 'resolvido',
    priority: 'alta',
    category: 'cancelamento',
    studentId: 'aluno-06',
    assignedTo: 'asa-02',
    createdAt: '2026-08-20T10:00:00',
    updatedAt: '2026-08-22T15:30:00',
    slaDeadline: '2026-08-21T10:00:00',
    slaStatus: 'ok',
    tags: ['cancelamento', 'matrícula'],
    aiSuggestion: {
      intent: 'Solicitação de cancelamento de matrícula',
      category: 'cancelamento',
      priority: 'alta',
      summary: 'Aluno solicita cancelamento de matrícula semestral por razões pessoais. Requer verificação de implicações financeiras e acadêmicas.',
      confidence: 0.96,
      recommendation: 'Orientar sobre implicações do cancelamento (financeiras, prazo, situação acadêmica). Verificar se é possível trancamento em vez de cancelamento.',
      sentiment: 'neutro',
    },
  },
  {
    id: 'ticket-07',
    number: 1049,
    title: 'Nota lançada incorretamente',
    description: 'O professor lançou 3,5 mas minha prova tirou 7,0. Preciso de revisão.',
    status: 'em_atendimento',
    priority: 'alta',
    category: 'academico',
    studentId: 'aluno-07',
    assignedTo: 'asa-04',
    createdAt: '2026-08-29T16:40:00',
    updatedAt: '2026-08-30T09:15:00',
    slaDeadline: '2026-08-31T16:40:00',
    slaStatus: 'ok',
    tags: ['nota', 'revisão', 'acadêmico'],
    aiSuggestion: {
      intent: 'Contestação de lançamento de nota',
      category: 'academico',
      priority: 'alta',
      summary: 'Aluno relata discrepância entre nota lançada pelo professor e nota obtida. Requer verificação de lançamento e possível revisão.',
      confidence: 0.91,
      recommendation: 'Solicitar comprovante de nota ao aluno e encaminhar ao coordenador do curso para verificação junto ao professor.',
      sentiment: 'negativo',
    },
  },
  {
    id: 'ticket-08',
    number: 1048,
    title: 'Solicitação de declaração de matrícula',
    description: 'Preciso de declaração de matrícula para stage.',
    status: 'resolvido',
    priority: 'baixa',
    category: 'documentos',
    studentId: 'aluno-08',
    assignedTo: 'asa-03',
    createdAt: '2026-08-26T13:00:00',
    updatedAt: '2026-08-27T10:30:00',
    slaDeadline: '2026-08-28T13:00:00',
    slaStatus: 'ok',
    tags: ['declaração', 'estágio'],
  },
  {
    id: 'ticket-09',
    number: 1047,
    title: 'Dúvida sobre período de rematrícula',
    description: 'Quando abre o período de rematrícula para o próximo semestre?',
    status: 'resolvido',
    priority: 'baixa',
    category: 'matricula',
    studentId: 'aluno-09',
    assignedTo: 'asa-01',
    createdAt: '2026-08-24T09:00:00',
    updatedAt: '2026-08-24T11:15:00',
    slaDeadline: '2026-08-25T09:00:00',
    slaStatus: 'ok',
    tags: ['rematrícula', 'prazo'],
  },
  {
    id: 'ticket-10',
    number: 1046,
    title: 'Problema com emissão de boleto',
    description: 'O boleto do mês não foi gerado no portal e o prazo está próximo.',
    status: 'resolvido',
    priority: 'alta',
    category: 'financeiro',
    studentId: 'aluno-10',
    assignedTo: 'asa-02',
    createdAt: '2026-08-23T17:00:00',
    updatedAt: '2026-08-24T09:00:00',
    slaDeadline: '2026-08-24T17:00:00',
    slaStatus: 'ok',
    tags: ['boleto', 'financeiro'],
  },
  {
    id: 'ticket-11',
    number: 1056,
    title: 'Solicitação de abono de faltas',
    description: 'Fui internado e preciso de abono de faltas para o período de 20 a 25/08.',
    status: 'aberto',
    priority: 'media',
    category: 'academico',
    studentId: 'aluno-01',
    createdAt: '2026-08-30T06:45:00',
    updatedAt: '2026-08-30T06:45:00',
    slaDeadline: '2026-09-01T06:45:00',
    slaStatus: 'ok',
    tags: ['abono', 'faltas', 'atestado'],
    aiSuggestion: {
      intent: 'Solicitação de justificativa de ausências por motivo de saúde',
      category: 'academico',
      priority: 'media',
      summary: 'Aluno solicita abono de faltas por internação hospitalar. Requer documentação médica.',
      confidence: 0.93,
      recommendation: 'Solicitar atestado de internação. Encaminhar para coordenação com a documentação para análise de abono conforme regulamento.',
      sentiment: 'neutro',
    },
  },
  {
    id: 'ticket-12',
    number: 1057,
    title: 'Dúvida sobre estágio obrigatório',
    description: 'Quero saber os requisitos para iniciar o estágio obrigatório no próximo semestre.',
    status: 'aberto',
    priority: 'baixa',
    category: 'academico',
    studentId: 'aluno-02',
    createdAt: '2026-08-30T08:00:00',
    updatedAt: '2026-08-30T08:00:00',
    slaDeadline: '2026-09-02T08:00:00',
    slaStatus: 'ok',
    tags: ['estágio', 'dúvida'],
  },
]

// -------------------------------------------------------
// MESSAGES
// -------------------------------------------------------

export interface Message {
  id: string
  ticketId?: string
  conversationId?: string
  sender: 'aluno' | 'asa' | 'ia'
  senderName: string
  content: string
  timestamp: string
  attachments?: Attachment[]
  isRead?: boolean
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

export const mockMessages: Message[] = [
  {
    id: 'msg-01',
    ticketId: 'ticket-01',
    sender: 'aluno',
    senderName: 'Esther Rodrigues',
    content: 'Olá! Estou tentando realizar minha matrícula mas o sistema apresenta erro ao confirmar. Aparece a mensagem "Operação não permitida" mas não sei o motivo.',
    timestamp: '2026-08-28T09:15:00',
  },
  {
    id: 'msg-02',
    ticketId: 'ticket-01',
    sender: 'ia',
    senderName: 'Álvaro AI',
    content: 'Olá, Esther! Identifiquei que seu chamado está relacionado a uma dificuldade no processo de matrícula. Nossa equipe irá analisar sua situação. Enquanto isso, verifique se há alguma pendência financeira em aberto no portal que possa estar bloqueando a matrícula.',
    timestamp: '2026-08-28T09:15:45',
  },
  {
    id: 'msg-03',
    ticketId: 'ticket-01',
    sender: 'asa',
    senderName: 'Fernanda Costa',
    content: 'Esther, verificamos aqui e identificamos que havia uma pendência de atualização cadastral no sistema. Acabamos de liberar. Pode tentar realizar a matrícula novamente?',
    timestamp: '2026-08-30T14:32:00',
  },
  {
    id: 'msg-04',
    ticketId: 'ticket-01',
    sender: 'aluno',
    senderName: 'Esther Rodrigues',
    content: 'Tentei agora mas continua com o mesmo erro. :(',
    timestamp: '2026-08-30T14:45:00',
  },
]

// -------------------------------------------------------
// CONVERSATIONS (Chat IA)
// -------------------------------------------------------

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  actions?: ChatAction[]
  sources?: string[]
}

export interface ChatAction {
  label: string
  action: string
}

export interface Conversation {
  id: string
  studentId: string
  title: string
  lastMessage: string
  timestamp: string
  messages: ChatMessage[]
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv-01',
    studentId: 'aluno-01',
    title: 'Problema com matrícula',
    lastMessage: 'Você pode abrir um chamado diretamente aqui!',
    timestamp: '2026-08-28T09:10:00',
    messages: [
      {
        id: 'cm-01',
        role: 'user',
        content: 'Não consigo fazer minha matrícula, aparece um erro no sistema.',
        timestamp: '2026-08-28T09:10:00',
      },
      {
        id: 'cm-02',
        role: 'assistant',
        content: 'Olá, Esther! Entendo que está com dificuldades para realizar sua matrícula. Esse é um problema que pode ter algumas causas. Vou te ajudar a identificar.\n\nPrimeiro, verifique se há alguma pendência financeira no portal — um boleto em aberto pode bloquear o processo. Depois, confira se seu cadastro está completo e atualizado.',
        timestamp: '2026-08-28T09:10:15',
        actions: [
          { label: 'Ver situação financeira', action: 'financeiro' },
          { label: 'Abrir chamado', action: 'novo-chamado' },
          { label: 'Falar com ASA', action: 'fila' },
        ],
        sources: ['Manual do Aluno 2026', 'FAQ Matrícula'],
      },
      {
        id: 'cm-03',
        role: 'user',
        content: 'Não tenho pendência financeira. O erro aparece na hora de confirmar as disciplinas.',
        timestamp: '2026-08-28T09:12:00',
      },
      {
        id: 'cm-04',
        role: 'assistant',
        content: 'Entendido! Se não há pendências financeiras, esse erro pode estar relacionado a uma restrição acadêmica ou um problema técnico no sistema. Recomendo abrir um chamado para que nossa equipe do ASA verifique diretamente na sua conta.',
        timestamp: '2026-08-28T09:12:20',
        actions: [
          { label: 'Abrir chamado agora', action: 'novo-chamado' },
          { label: 'Ver meus chamados', action: 'chamados' },
        ],
      },
    ],
  },
  {
    id: 'conv-02',
    studentId: 'aluno-01',
    title: 'Prazo de entrega do TCC',
    lastMessage: 'O prazo final é 30 de novembro de 2026.',
    timestamp: '2026-08-15T14:30:00',
    messages: [
      {
        id: 'cm-05',
        role: 'user',
        content: 'Qual é o prazo de entrega do TCC?',
        timestamp: '2026-08-15T14:30:00',
      },
      {
        id: 'cm-06',
        role: 'assistant',
        content: 'Para o curso de Administração, o prazo de entrega do TCC neste semestre (2026.2) é:\n\n**Entrega do rascunho para o orientador:** 15 de outubro de 2026\n**Entrega final:** 30 de novembro de 2026\n**Apresentação:** 1ª quinzena de dezembro de 2026\n\nLembre-se de verificar com seu orientador as datas específicas de revisão.',
        timestamp: '2026-08-15T14:30:20',
        sources: ['Calendário Acadêmico 2026.2', 'Regulamento TCC - Administração'],
      },
    ],
  },
]

// -------------------------------------------------------
// KNOWLEDGE BASE
// -------------------------------------------------------

export interface KBDocument {
  id: string
  title: string
  category: string
  content: string
  version: string
  status: 'ativo' | 'rascunho' | 'arquivado'
  author: string
  tags: string[]
  createdAt: string
  updatedAt: string
  views: number
  indexed: boolean
}

export const mockKBDocuments: KBDocument[] = [
  {
    id: 'kb-01',
    title: 'Processo de Matrícula Semestral',
    category: 'Matrícula',
    content: 'Guia completo do processo de matrícula...',
    version: '3.2',
    status: 'ativo',
    author: 'Ricardo Mendes',
    tags: ['matrícula', 'semestre', 'processo'],
    createdAt: '2024-01-10T00:00:00',
    updatedAt: '2026-07-15T00:00:00',
    views: 1847,
    indexed: true,
  },
  {
    id: 'kb-02',
    title: 'Solicitação de Documentos Acadêmicos',
    category: 'Documentos',
    content: 'Procedimentos para solicitação de histórico, declarações...',
    version: '2.1',
    status: 'ativo',
    author: 'Patricia Lemos',
    tags: ['documentos', 'histórico', 'declaração'],
    createdAt: '2024-02-05T00:00:00',
    updatedAt: '2026-06-20T00:00:00',
    views: 2341,
    indexed: true,
  },
  {
    id: 'kb-03',
    title: 'FAQ Financeiro — Bolsas e Mensalidades',
    category: 'Financeiro',
    content: 'Perguntas frequentes sobre bolsas de estudo e mensalidades...',
    version: '1.8',
    status: 'ativo',
    author: 'Fernanda Costa',
    tags: ['financeiro', 'bolsa', 'mensalidade', 'ProUni', 'FIES'],
    createdAt: '2024-03-01T00:00:00',
    updatedAt: '2026-08-01T00:00:00',
    views: 3102,
    indexed: true,
  },
  {
    id: 'kb-04',
    title: 'Regulamento de Aproveitamento de Estudos',
    category: 'Acadêmico',
    content: 'Normas para aproveitamento de disciplinas cursadas em outra IES...',
    version: '1.3',
    status: 'ativo',
    author: 'Ricardo Mendes',
    tags: ['aproveitamento', 'disciplina', 'transferência'],
    createdAt: '2024-04-10T00:00:00',
    updatedAt: '2025-12-01T00:00:00',
    views: 892,
    indexed: true,
  },
  {
    id: 'kb-05',
    title: 'Calendário Acadêmico 2026.2',
    category: 'Acadêmico',
    content: 'Datas importantes do semestre 2026.2...',
    version: '1.0',
    status: 'ativo',
    author: 'Patricia Lemos',
    tags: ['calendário', 'datas', 'prazos'],
    createdAt: '2026-07-01T00:00:00',
    updatedAt: '2026-07-01T00:00:00',
    views: 4521,
    indexed: true,
  },
  {
    id: 'kb-06',
    title: 'Processo de Cancelamento de Matrícula',
    category: 'Matrícula',
    content: 'Como solicitar cancelamento ou trancamento de matrícula...',
    version: '2.0',
    status: 'ativo',
    author: 'Fernanda Costa',
    tags: ['cancelamento', 'trancamento', 'matrícula'],
    createdAt: '2024-01-15T00:00:00',
    updatedAt: '2026-02-10T00:00:00',
    views: 1205,
    indexed: true,
  },
  {
    id: 'kb-07',
    title: 'Política de Abono de Faltas',
    category: 'Acadêmico',
    content: 'Regulamento de justificativa e abono de faltas...',
    version: '1.5',
    status: 'ativo',
    author: 'Ricardo Mendes',
    tags: ['faltas', 'abono', 'atestado'],
    createdAt: '2024-02-01T00:00:00',
    updatedAt: '2025-08-01T00:00:00',
    views: 2876,
    indexed: true,
  },
  {
    id: 'kb-08',
    title: 'Guia de Estágio Obrigatório',
    category: 'Estágio',
    content: 'Requisitos e processo para realização de estágio obrigatório...',
    version: '3.0',
    status: 'ativo',
    author: 'Patricia Lemos',
    tags: ['estágio', 'obrigatório', 'requisitos'],
    createdAt: '2024-05-01T00:00:00',
    updatedAt: '2026-03-15T00:00:00',
    views: 1543,
    indexed: true,
  },
  {
    id: 'kb-09',
    title: 'Manual do Aluno 2026',
    category: 'Geral',
    content: 'Manual completo com todas as informações para o aluno FECAP...',
    version: '2026.1',
    status: 'ativo',
    author: 'Ricardo Mendes',
    tags: ['manual', 'aluno', 'regras', 'normas'],
    createdAt: '2026-01-10T00:00:00',
    updatedAt: '2026-01-10T00:00:00',
    views: 8921,
    indexed: true,
  },
  {
    id: 'kb-10',
    title: 'Procedimentos TCC 2026.2',
    category: 'Acadêmico',
    content: 'Orientações para desenvolvimento e entrega do TCC...',
    version: '1.2',
    status: 'ativo',
    author: 'Fernanda Costa',
    tags: ['TCC', 'orientação', 'prazo'],
    createdAt: '2026-07-15T00:00:00',
    updatedAt: '2026-07-15T00:00:00',
    views: 3214,
    indexed: true,
  },
  {
    id: 'kb-11',
    title: 'Guia de Revisão de Notas',
    category: 'Acadêmico',
    content: 'Processo para solicitação de revisão de notas...',
    version: '1.1',
    status: 'ativo',
    author: 'Marcos Oliveira',
    tags: ['nota', 'revisão', 'processo'],
    createdAt: '2024-06-01T00:00:00',
    updatedAt: '2025-06-01T00:00:00',
    views: 982,
    indexed: true,
  },
  {
    id: 'kb-12',
    title: 'Política de Privacidade e LGPD',
    category: 'Institucional',
    content: 'Política de privacidade e tratamento de dados pessoais...',
    version: '2.1',
    status: 'ativo',
    author: 'Ricardo Mendes',
    tags: ['LGPD', 'privacidade', 'dados'],
    createdAt: '2023-09-01T00:00:00',
    updatedAt: '2025-01-01T00:00:00',
    views: 456,
    indexed: true,
  },
  {
    id: 'kb-13',
    title: 'Atendimento Remoto — Guia',
    category: 'Geral',
    content: 'Como utilizar o atendimento remoto via Álvaro AI...',
    version: '1.0',
    status: 'rascunho',
    author: 'Camila Rocha',
    tags: ['atendimento', 'remoto', 'guia'],
    createdAt: '2026-08-20T00:00:00',
    updatedAt: '2026-08-20T00:00:00',
    views: 12,
    indexed: false,
  },
  {
    id: 'kb-14',
    title: 'FAQ Geral Álvaro AI',
    category: 'Geral',
    content: 'Perguntas frequentes sobre a plataforma Álvaro AI...',
    version: '1.0',
    status: 'rascunho',
    author: 'Patricia Lemos',
    tags: ['FAQ', 'Álvaro AI', 'plataforma'],
    createdAt: '2026-08-25T00:00:00',
    updatedAt: '2026-08-25T00:00:00',
    views: 5,
    indexed: false,
  },
  {
    id: 'kb-15',
    title: 'Regulamento Disciplinar',
    category: 'Institucional',
    content: 'Normas disciplinares da instituição...',
    version: '4.0',
    status: 'ativo',
    author: 'Ricardo Mendes',
    tags: ['disciplinar', 'regulamento', 'normas'],
    createdAt: '2020-01-01T00:00:00',
    updatedAt: '2024-01-15T00:00:00',
    views: 2147,
    indexed: true,
  },
]

// -------------------------------------------------------
// SLA RULES
// -------------------------------------------------------

export interface SLARule {
  id: string
  name: string
  priority: TicketPriority
  category?: TicketCategory
  firstResponseMinutes: number
  resolutionHours: number
  active: boolean
  createdAt: string
}

export const mockSLARules: SLARule[] = [
  {
    id: 'sla-01',
    name: 'Crítico — Resposta Imediata',
    priority: 'critica',
    firstResponseMinutes: 15,
    resolutionHours: 2,
    active: true,
    createdAt: '2024-01-15T00:00:00',
  },
  {
    id: 'sla-02',
    name: 'Alta Prioridade — Padrão',
    priority: 'alta',
    firstResponseMinutes: 30,
    resolutionHours: 4,
    active: true,
    createdAt: '2024-01-15T00:00:00',
  },
  {
    id: 'sla-03',
    name: 'Média Prioridade — Padrão',
    priority: 'media',
    firstResponseMinutes: 120,
    resolutionHours: 24,
    active: true,
    createdAt: '2024-01-15T00:00:00',
  },
  {
    id: 'sla-04',
    name: 'Baixa Prioridade — Padrão',
    priority: 'baixa',
    firstResponseMinutes: 480,
    resolutionHours: 72,
    active: true,
    createdAt: '2024-01-15T00:00:00',
  },
  {
    id: 'sla-05',
    name: 'Financeiro — Alta',
    priority: 'alta',
    category: 'financeiro',
    firstResponseMinutes: 20,
    resolutionHours: 3,
    active: true,
    createdAt: '2024-03-01T00:00:00',
  },
  {
    id: 'sla-06',
    name: 'Matrícula — Período de Inscrição',
    priority: 'alta',
    category: 'matricula',
    firstResponseMinutes: 15,
    resolutionHours: 2,
    active: true,
    createdAt: '2024-08-01T00:00:00',
  },
  {
    id: 'sla-07',
    name: 'Documentos — Padrão',
    priority: 'media',
    category: 'documentos',
    firstResponseMinutes: 240,
    resolutionHours: 48,
    active: true,
    createdAt: '2024-03-01T00:00:00',
  },
  {
    id: 'sla-08',
    name: 'Documentos — Urgente',
    priority: 'alta',
    category: 'documentos',
    firstResponseMinutes: 60,
    resolutionHours: 8,
    active: true,
    createdAt: '2024-03-01T00:00:00',
  },
  {
    id: 'sla-09',
    name: 'Acadêmico — Revisão de Notas',
    priority: 'alta',
    category: 'academico',
    firstResponseMinutes: 120,
    resolutionHours: 24,
    active: false,
    createdAt: '2024-06-01T00:00:00',
  },
  {
    id: 'sla-10',
    name: 'Infraestrutura — Acesso',
    priority: 'media',
    category: 'infraestrutura',
    firstResponseMinutes: 60,
    resolutionHours: 8,
    active: true,
    createdAt: '2024-05-15T00:00:00',
  },
]

// -------------------------------------------------------
// AUTOMATIONS
// -------------------------------------------------------

export interface AutomationRule {
  id: string
  name: string
  description: string
  active: boolean
  trigger: AutomationTrigger
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  runs: number
  createdAt: string
}

export interface AutomationTrigger {
  type: 'ticket_created' | 'ticket_updated' | 'sla_breach' | 'time_elapsed' | 'status_changed'
  label: string
}

export interface AutomationCondition {
  field: string
  operator: string
  value: string
}

export interface AutomationAction {
  type: 'assign' | 'notify' | 'change_priority' | 'change_status' | 'send_email' | 'add_tag'
  label: string
  value: string
}

export const mockAutomations: AutomationRule[] = [
  {
    id: 'auto-01',
    name: 'Alerta de SLA em Risco',
    description: 'Notifica o responsável quando o SLA está prestes a vencer.',
    active: true,
    trigger: { type: 'sla_breach', label: 'SLA em risco' },
    conditions: [
      { field: 'sla_remaining', operator: '<', value: '30 minutos' },
    ],
    actions: [
      { type: 'notify', label: 'Notificar responsável', value: 'responsavel' },
      { type: 'notify', label: 'Notificar supervisor', value: 'supervisor' },
    ],
    runs: 147,
    createdAt: '2024-02-01T00:00:00',
  },
  {
    id: 'auto-02',
    name: 'Auto-atribuição por Categoria',
    description: 'Atribui automaticamente chamados financeiros para a equipe financeira.',
    active: true,
    trigger: { type: 'ticket_created', label: 'Chamado criado' },
    conditions: [
      { field: 'category', operator: '=', value: 'financeiro' },
    ],
    actions: [
      { type: 'assign', label: 'Atribuir para', value: 'Equipe Financeira' },
      { type: 'add_tag', label: 'Adicionar tag', value: 'financeiro' },
    ],
    runs: 89,
    createdAt: '2024-03-15T00:00:00',
  },
  {
    id: 'auto-03',
    name: 'Escalonamento Automático',
    description: 'Eleva prioridade se chamado alto não receber resposta em 2h.',
    active: true,
    trigger: { type: 'time_elapsed', label: 'Tempo decorrido' },
    conditions: [
      { field: 'priority', operator: '=', value: 'alta' },
      { field: 'time_without_response', operator: '>', value: '2 horas' },
    ],
    actions: [
      { type: 'change_priority', label: 'Alterar prioridade para', value: 'critica' },
      { type: 'notify', label: 'Notificar administrador', value: 'admin' },
    ],
    runs: 23,
    createdAt: '2024-04-01T00:00:00',
  },
  {
    id: 'auto-04',
    name: 'Feedback Pós-resolução',
    description: 'Envia pesquisa de satisfação quando chamado é resolvido.',
    active: true,
    trigger: { type: 'status_changed', label: 'Status alterado' },
    conditions: [
      { field: 'new_status', operator: '=', value: 'resolvido' },
    ],
    actions: [
      { type: 'send_email', label: 'Enviar e-mail de satisfação', value: 'template_satisfaction' },
    ],
    runs: 312,
    createdAt: '2024-05-01T00:00:00',
  },
  {
    id: 'auto-05',
    name: 'Fechar Chamados Inativos',
    description: 'Fecha automaticamente chamados aguardando aluno por mais de 7 dias.',
    active: true,
    trigger: { type: 'time_elapsed', label: 'Tempo decorrido' },
    conditions: [
      { field: 'status', operator: '=', value: 'aguardando_aluno' },
      { field: 'days_inactive', operator: '>', value: '7' },
    ],
    actions: [
      { type: 'change_status', label: 'Alterar status para', value: 'fechado' },
      { type: 'notify', label: 'Notificar aluno', value: 'aluno' },
    ],
    runs: 56,
    createdAt: '2024-06-01T00:00:00',
  },
]

// -------------------------------------------------------
// AUDIT LOG
// -------------------------------------------------------

export interface AuditEvent {
  id: string
  userId: string
  userName: string
  userRole: UserRole
  action: string
  resource: string
  resourceId: string
  details: string
  ip: string
  timestamp: string
  severity: 'info' | 'warning' | 'critical'
}

export const mockAuditEvents: AuditEvent[] = [
  {
    id: 'audit-01',
    userId: 'asa-01',
    userName: 'Fernanda Costa',
    userRole: 'asa',
    action: 'ticket.status_changed',
    resource: 'Chamado',
    resourceId: '#1052',
    details: 'Status alterado de "Aberto" para "Em atendimento"',
    ip: '192.168.1.10',
    timestamp: '2026-08-30T14:32:00',
    severity: 'info',
  },
  {
    id: 'audit-02',
    userId: 'admin-01',
    userName: 'Ricardo Mendes',
    userRole: 'admin',
    action: 'user.created',
    resource: 'Usuário',
    resourceId: 'asa-04',
    details: 'Novo usuário ASA criado: Bruno Almeida',
    ip: '192.168.1.1',
    timestamp: '2026-08-29T10:15:00',
    severity: 'info',
  },
  {
    id: 'audit-03',
    userId: 'asa-02',
    userName: 'Marcos Oliveira',
    userRole: 'asa',
    action: 'ticket.priority_changed',
    resource: 'Chamado',
    resourceId: '#1053',
    details: 'Prioridade alterada de "Média" para "Alta"',
    ip: '192.168.1.11',
    timestamp: '2026-08-30T09:45:00',
    severity: 'warning',
  },
  {
    id: 'audit-04',
    userId: 'admin-01',
    userName: 'Ricardo Mendes',
    userRole: 'admin',
    action: 'sla.rule_updated',
    resource: 'Regra SLA',
    resourceId: 'sla-06',
    details: 'Regra "Matrícula — Período de Inscrição" atualizada: tempo de resposta reduzido para 15min',
    ip: '192.168.1.1',
    timestamp: '2026-08-28T16:00:00',
    severity: 'warning',
  },
  {
    id: 'audit-05',
    userId: 'admin-02',
    userName: 'Patricia Lemos',
    userRole: 'admin',
    action: 'kb.document_published',
    resource: 'Base de Conhecimento',
    resourceId: 'kb-05',
    details: 'Documento "Calendário Acadêmico 2026.2" publicado',
    ip: '192.168.1.2',
    timestamp: '2026-07-01T09:00:00',
    severity: 'info',
  },
  {
    id: 'audit-06',
    userId: 'asa-03',
    userName: 'Juliana Pereira',
    userRole: 'asa',
    action: 'ticket.resolved',
    resource: 'Chamado',
    resourceId: '#1051',
    details: 'Chamado resolvido: Histórico escolar enviado por e-mail',
    ip: '192.168.1.12',
    timestamp: '2026-08-29T16:45:00',
    severity: 'info',
  },
  {
    id: 'audit-07',
    userId: 'admin-01',
    userName: 'Ricardo Mendes',
    userRole: 'admin',
    action: 'ai.prompt_updated',
    resource: 'Prompt IA',
    resourceId: 'prompt-main',
    details: 'Prompt principal atualizado para versão v2.4',
    ip: '192.168.1.1',
    timestamp: '2026-08-25T11:30:00',
    severity: 'warning',
  },
  {
    id: 'audit-08',
    userId: 'asa-01',
    userName: 'Fernanda Costa',
    userRole: 'asa',
    action: 'ticket.assigned',
    resource: 'Chamado',
    resourceId: '#1055',
    details: 'Chamado atribuído para Fernanda Costa',
    ip: '192.168.1.10',
    timestamp: '2026-08-30T08:10:00',
    severity: 'info',
  },
  {
    id: 'audit-09',
    userId: 'admin-02',
    userName: 'Patricia Lemos',
    userRole: 'admin',
    action: 'user.deactivated',
    resource: 'Usuário',
    resourceId: 'asa-05',
    details: 'Usuário Camila Rocha desativado',
    ip: '192.168.1.2',
    timestamp: '2026-07-15T15:00:00',
    severity: 'warning',
  },
  {
    id: 'audit-10',
    userId: 'admin-01',
    userName: 'Ricardo Mendes',
    userRole: 'admin',
    action: 'system.integration_configured',
    resource: 'Integração',
    resourceId: 'email-smtp',
    details: 'Configuração SMTP atualizada',
    ip: '192.168.1.1',
    timestamp: '2026-08-22T14:00:00',
    severity: 'warning',
  },
]

// -------------------------------------------------------
// PROMPTS
// -------------------------------------------------------

export interface AIPrompt {
  id: string
  name: string
  description: string
  content: string
  version: string
  status: 'ativo' | 'inativo' | 'teste'
  author: string
  createdAt: string
  updatedAt: string
  uses: number
  successRate: number
}

export const mockPrompts: AIPrompt[] = [
  {
    id: 'prompt-01',
    name: 'Atendimento Principal',
    description: 'Prompt principal para atendimento de alunos pelo agente Álvaro AI.',
    content: 'Você é o Álvaro AI, assistente inteligente de atendimento acadêmico da FECAP...',
    version: 'v2.4',
    status: 'ativo',
    author: 'Ricardo Mendes',
    createdAt: '2024-06-01T00:00:00',
    updatedAt: '2026-08-25T00:00:00',
    uses: 8734,
    successRate: 0.87,
  },
  {
    id: 'prompt-02',
    name: 'Classificação de Chamados',
    description: 'Prompt para classificação automática de categoria e prioridade.',
    content: 'Analise o chamado a seguir e classifique...',
    version: 'v1.8',
    status: 'ativo',
    author: 'Patricia Lemos',
    createdAt: '2024-09-01T00:00:00',
    updatedAt: '2026-07-10T00:00:00',
    uses: 3241,
    successRate: 0.92,
  },
  {
    id: 'prompt-03',
    name: 'Resumo de Chamado',
    description: 'Gera resumo executivo de chamados para o painel do ASA.',
    content: 'Com base no histórico do chamado, gere um resumo...',
    version: 'v1.3',
    status: 'ativo',
    author: 'Fernanda Costa',
    createdAt: '2025-01-15T00:00:00',
    updatedAt: '2026-05-20T00:00:00',
    uses: 1892,
    successRate: 0.94,
  },
  {
    id: 'prompt-04',
    name: 'Sugestão de Resposta',
    description: 'Sugere resposta personalizada para o atendente.',
    content: 'Com base no contexto do chamado, sugira uma resposta...',
    version: 'v2.1',
    status: 'ativo',
    author: 'Ricardo Mendes',
    createdAt: '2025-03-01T00:00:00',
    updatedAt: '2026-08-01T00:00:00',
    uses: 2456,
    successRate: 0.89,
  },
  {
    id: 'prompt-05',
    name: 'Atendimento V3 (Teste)',
    description: 'Versão experimental com novo comportamento de empatia.',
    content: 'Você é o Álvaro AI versão 3.0...',
    version: 'v3.0-beta',
    status: 'teste',
    author: 'Ricardo Mendes',
    createdAt: '2026-08-15T00:00:00',
    updatedAt: '2026-08-28T00:00:00',
    uses: 124,
    successRate: 0.91,
  },
]

// -------------------------------------------------------
// INTEGRATIONS
// -------------------------------------------------------

export interface Integration {
  id: string
  name: string
  description: string
  type: string
  status: 'operacional' | 'degradado' | 'offline' | 'nao_configurado'
  lastSync: string
  config?: Record<string, string>
  icon: string
}

export const mockIntegrations: Integration[] = [
  {
    id: 'int-01',
    name: 'E-mail SMTP',
    description: 'Envio de notificações e documentos por e-mail institucional.',
    type: 'email',
    status: 'operacional',
    lastSync: '2026-08-30T08:00:00',
    icon: 'mail',
  },
  {
    id: 'int-02',
    name: 'Sistema Acadêmico',
    description: 'Integração com o sistema de gestão acadêmica para dados de alunos.',
    type: 'academic',
    status: 'operacional',
    lastSync: '2026-08-30T06:00:00',
    icon: 'graduation-cap',
  },
  {
    id: 'int-03',
    name: 'API Financeira',
    description: 'Consulta de situação financeira e boletos.',
    type: 'financial',
    status: 'degradado',
    lastSync: '2026-08-29T22:00:00',
    icon: 'credit-card',
  },
  {
    id: 'int-04',
    name: 'OpenAI / GPT-4o',
    description: 'Modelo de linguagem para o agente conversacional Álvaro AI.',
    type: 'ai',
    status: 'operacional',
    lastSync: '2026-08-30T08:25:00',
    icon: 'cpu',
  },
  {
    id: 'int-05',
    name: 'Notificações Push',
    description: 'Envio de notificações push para o aplicativo móvel.',
    type: 'notification',
    status: 'operacional',
    lastSync: '2026-08-30T08:20:00',
    icon: 'bell',
  },
  {
    id: 'int-06',
    name: 'Storage / S3',
    description: 'Armazenamento de arquivos e anexos dos chamados.',
    type: 'storage',
    status: 'operacional',
    lastSync: '2026-08-30T08:15:00',
    icon: 'hard-drive',
  },
]

// -------------------------------------------------------
// NOTIFICATIONS
// -------------------------------------------------------

export interface Notification {
  id: string
  type: 'ticket_updated' | 'new_ticket' | 'sla_risk' | 'ai_recommendation' | 'system' | 'resolved'
  title: string
  message: string
  read: boolean
  timestamp: string
  link?: string
  priority: 'low' | 'medium' | 'high'
}

export const mockNotifications: Notification[] = [
  {
    id: 'notif-01',
    type: 'sla_risk',
    title: 'SLA em risco',
    message: 'Chamado #1052 vence em 30 minutos',
    read: false,
    timestamp: '2026-08-30T14:00:00',
    link: '/asa/chamados/ticket-01',
    priority: 'high',
  },
  {
    id: 'notif-02',
    type: 'new_ticket',
    title: 'Novo chamado',
    message: '#1057 — Dúvida sobre estágio obrigatório',
    read: false,
    timestamp: '2026-08-30T08:00:00',
    link: '/asa/chamados/ticket-12',
    priority: 'medium',
  },
  {
    id: 'notif-03',
    type: 'ai_recommendation',
    title: 'Recomendação da IA',
    message: '12 recomendações aguardando validação',
    read: false,
    timestamp: '2026-08-30T07:30:00',
    link: '/admin/agente-ia',
    priority: 'medium',
  },
  {
    id: 'notif-04',
    type: 'ticket_updated',
    title: 'Chamado atualizado',
    message: 'Esther respondeu no chamado #1052',
    read: true,
    timestamp: '2026-08-30T06:45:00',
    link: '/asa/chamados/ticket-01',
    priority: 'low',
  },
  {
    id: 'notif-05',
    type: 'resolved',
    title: 'Chamado resolvido',
    message: '#1051 foi resolvido por Marcos Oliveira',
    read: true,
    timestamp: '2026-08-29T16:45:00',
    link: '/asa/chamados/ticket-02',
    priority: 'low',
  },
  {
    id: 'notif-06',
    type: 'system',
    title: 'Atualização do sistema',
    message: 'Álvaro AI v2.4 foi implantado com sucesso',
    read: true,
    timestamp: '2026-08-25T10:00:00',
    priority: 'low',
  },
]

// -------------------------------------------------------
// CHART DATA (Metrics / Analytics)
// -------------------------------------------------------

export const mockChartData = {
  ticketsOverTime: [
    { date: '24/08', abertos: 8, resolvidos: 5, em_atendimento: 3 },
    { date: '25/08', abertos: 12, resolvidos: 9, em_atendimento: 4 },
    { date: '26/08', abertos: 7, resolvidos: 11, em_atendimento: 2 },
    { date: '27/08', abertos: 15, resolvidos: 8, em_atendimento: 5 },
    { date: '28/08', abertos: 10, resolvidos: 14, em_atendimento: 3 },
    { date: '29/08', abertos: 9, resolvidos: 7, em_atendimento: 4 },
    { date: '30/08', abertos: 12, resolvidos: 6, em_atendimento: 5 },
  ],
  ticketsByCategory: [
    { name: 'Matrícula', value: 34, color: '#16a34a' },
    { name: 'Financeiro', value: 28, color: '#f59e0b' },
    { name: 'Acadêmico', value: 22, color: '#3b82f6' },
    { name: 'Documentos', value: 18, color: '#8b5cf6' },
    { name: 'Infraestrutura', value: 10, color: '#ec4899' },
    { name: 'Outros', value: 8, color: '#6b7280' },
  ],
  satisfactionOverTime: [
    { date: '24/08', score: 4.2 },
    { date: '25/08', score: 4.5 },
    { date: '26/08', score: 4.1 },
    { date: '27/08', score: 4.7 },
    { date: '28/08', score: 4.4 },
    { date: '29/08', score: 4.6 },
    { date: '30/08', score: 4.8 },
  ],
  aiMetrics: [
    { date: '24/08', conversas: 45, resolvidos_ia: 31, encaminhados: 14 },
    { date: '25/08', conversas: 67, resolvidos_ia: 48, encaminhados: 19 },
    { date: '26/08', conversas: 52, resolvidos_ia: 38, encaminhados: 14 },
    { date: '27/08', conversas: 78, resolvidos_ia: 57, encaminhados: 21 },
    { date: '28/08', conversas: 61, resolvidos_ia: 44, encaminhados: 17 },
    { date: '29/08', conversas: 55, resolvidos_ia: 40, encaminhados: 15 },
    { date: '30/08', conversas: 43, resolvidos_ia: 32, encaminhados: 11 },
  ],
}

// -------------------------------------------------------
// CURRENT USER (for switching between roles)
// -------------------------------------------------------

export const mockCurrentUser = {
  aluno: mockStudents[0],
  asa: mockUsers.find(u => u.id === 'asa-01')!,
  admin: mockUsers.find(u => u.id === 'admin-01')!,
}

export const mockSystemStatus = {
  api: { status: 'operacional' as const, latency: '24ms', uptime: '99.97%' },
  ai: { status: 'operacional' as const, latency: '1.2s', uptime: '99.85%' },
  database: { status: 'operacional' as const, latency: '8ms', uptime: '99.99%' },
  email: { status: 'operacional' as const, latency: '380ms', uptime: '99.90%' },
  rag: { status: 'operacional' as const, latency: '540ms', uptime: '99.78%' },
  notifications: { status: 'operacional' as const, latency: '45ms', uptime: '99.95%' },
  storage: { status: 'operacional' as const, latency: '62ms', uptime: '99.99%' },
  financial_api: { status: 'degradado' as const, latency: '3.4s', uptime: '97.20%' },
}
