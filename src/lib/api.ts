import type { Ticket, TicketCategory, TicketPriority, TicketStatus, UserRole } from './mock-data'

const BASE_URL = '/api'

function getAuthHeaders() {
  const token = localStorage.getItem('asaia_auth_token')
  const storeData = localStorage.getItem('asaia-app-store')
  let demoRole = 'aluno'
  let demoUserId = 'aluno-01'

  try {
    if (storeData) {
      const parsed = JSON.parse(storeData)
      if (parsed?.state?.currentUser) {
        demoRole = parsed.state.currentUser.role || 'aluno'
        demoUserId = parsed.state.currentUser.id || 'aluno-01'
      } else if (parsed?.state?.activeRole) {
        demoRole = parsed.state.activeRole
      }
    }
  } catch (e) {
    // fallback
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-demo-role': demoRole,
    'x-demo-user-id': demoUserId,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const authHeaders = getAuthHeaders()
  if (options.body instanceof FormData) {
    delete authHeaders['Content-Type']
  }

  const headers = {
    ...authHeaders,
    ...(options.headers || {}),
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Erro na requisição: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  auth: {
    login: (email: string, password?: string) =>
      request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    demoLogin: (role: UserRole) =>
      request<{ token: string; user: any }>('/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify({ role }),
      }),
    me: () => request<{ user: any }>('/auth/me'),
  },

  tickets: {
    list: (params?: { status?: string; category?: string; priority?: string; search?: string; studentId?: string }) => {
      const query = new URLSearchParams()
      if (params?.status) query.set('status', params.status)
      if (params?.category) query.set('category', params.category)
      if (params?.priority) query.set('priority', params.priority)
      if (params?.search) query.set('search', params.search)
      if (params?.studentId) query.set('studentId', params.studentId)
      const qs = query.toString()
      return request<Ticket[]>(`/tickets${qs ? `?${qs}` : ''}`)
    },
    get: (id: string) => request<Ticket>(`/tickets/${id}`),
    create: (data: { title: string; description: string; category: string; priority?: string; tags?: string[]; conversationId?: string }) =>
      request<Ticket>('/tickets', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Ticket>) =>
      request<Ticket>(`/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    addMessage: (id: string, data: { content: string; isInternal?: boolean; attachments?: any[] }) =>
      request<any>(`/tickets/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  chat: {
    getConversations: () => request<any[]>('/chat/conversations'),
    getConversation: (id: string) => request<any>(`/chat/conversations/${id}`),
    createConversation: (title?: string) =>
      request<any>('/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({ title }),
      }),
    sendMessage: (conversationId: string, content: string) =>
      request<{ userMessage: any; aiMessage: any }>(`/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
  },

  kb: {
    list: (params?: { category?: string; search?: string }) => {
      const query = new URLSearchParams()
      if (params?.category) query.set('category', params.category)
      if (params?.search) query.set('search', params.search)
      const qs = query.toString()
      return request<any[]>(`/knowledge-base${qs ? `?${qs}` : ''}`)
    },
    get: (id: string) => request<any>(`/knowledge-base/${id}`),
    upload: (formData: FormData) =>
      request<any>('/kb/upload', {
        method: 'POST',
        body: formData,
      }),
    search: (query: string) =>
      request<any[]>(`/kb/search?q=${encodeURIComponent(query)}`),
    create: (data: any) =>
      request<any>('/knowledge-base', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<any>(`/knowledge-base/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<any>(`/knowledge-base/${id}`, {
        method: 'DELETE',
      }),
  },

  students: {
    list: (params?: { search?: string; course?: string; status?: string }) => {
      const query = new URLSearchParams()
      if (params?.search) query.set('search', params.search)
      if (params?.course) query.set('course', params.course)
      if (params?.status) query.set('status', params.status)
      const qs = query.toString()
      return request<any[]>(`/students${qs ? `?${qs}` : ''}`)
    },
    get: (id: string) => request<any>(`/students/${id}`),
  },

  metrics: {
    overview: () => request<any>('/metrics/overview'),
    queue: () => request<any[]>('/metrics/queue'),
  },

  admin: {
    getSLARules: () => request<any[]>('/admin/sla-rules'),
    createSLARule: (data: any) =>
      request<any>('/admin/sla-rules', { method: 'POST', body: JSON.stringify(data) }),
    getAutomations: () => request<any[]>('/admin/automations'),
    createAutomation: (data: any) =>
      request<any>('/admin/automations', { method: 'POST', body: JSON.stringify(data) }),
    getAuditLogs: (params?: { limit?: number; action?: string }) => {
      const query = new URLSearchParams()
      if (params?.limit) query.set('limit', String(params.limit))
      if (params?.action) query.set('action', params.action)
      const qs = query.toString()
      return request<any[]>(`/admin/audit-logs${qs ? `?${qs}` : ''}`)
    },
    getPrompts: () => request<any[]>('/admin/prompts'),
    updatePrompt: (id: string, data: any) =>
      request<any>(`/admin/prompts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getIntegrations: () => request<any[]>('/admin/integrations'),
    getUsers: (role?: string) => {
      const qs = role ? `?role=${role}` : ''
      return request<any[]>(`/admin/users${qs}`)
    },
    getNotifications: () => request<any[]>('/admin/notifications'),
    markNotificationRead: (id: string) =>
      request<any>(`/admin/notifications/${id}/read`, { method: 'PATCH' }),
  },
}
