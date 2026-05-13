/**
 * [WHO]: Provides API client functions: auth, agents, console, JWT token management, PencilAgent CRUD, conversations, SSE streaming
 * [FROM]: Depends on browser fetch API and localStorage for token persistence
 * [TO]: Consumed by all page components (Login, AgentMarket, Console, MyAgents, Chat) and Layout for API calls
 * [HERE]: packages/web/src/api.js - Centralized API client; handles auth headers, error responses, SSE streaming
 */

// ============ Error Mapping (user-facing) ============

/**
 * Map backend error codes to user-friendly messages
 * See: Pencil-Agent-Gateway/docs/12-asgard-web-ui-guide.md §5
 */
const FRIENDLY_ERRORS = {
  agent_not_found: '这个 Agent 不存在或已被删除，请刷新列表',
  forbidden_agent: '你没有权限使用这个 Agent',
  client_cancelled: '', // silent
  engine_error: 'Agent 暂时无法响应，请稍后再试',
  unauthorized: '登录已过期，请重新登录',
  validation_error: '输入有误，请检查后重试',
  rate_limit_exceeded: '请求过于频繁，请稍后再试',
}

export function userFacing(err) {
  if (!err) return '未知错误'
  const code = err.code || (typeof err === 'object' && err.detail?.code) || ''
  const msg = err.message || (typeof err === 'object' && err.detail?.message) || ''
  // Try code first, then message pattern
  if (code && FRIENDLY_ERRORS[code] !== undefined) {
    return FRIENDLY_ERRORS[code] || null // null = silent
  }
  // Check for HTTP status
  if (err.status === 401) return FRIENDLY_ERRORS.unauthorized
  if (err.status === 403) return FRIENDLY_ERRORS.forbidden_agent
  if (err.status === 404) return FRIENDLY_ERRORS.agent_not_found
  if (err.status === 429) return FRIENDLY_ERRORS.rate_limit_exceeded
  if (err.status >= 500) return '服务暂时不可用，请稍后再试'
  // Fallback
  if (msg && msg.toLowerCase().includes('unauthorized')) return FRIENDLY_ERRORS.unauthorized
  return msg || '出了点问题，请稍后再试'
}

// ============ Token Management ============

const TOKEN_KEY = 'asgard_token'
const runtimeConfig = typeof window !== 'undefined' ? window.__ASGARD_CONFIG__ : {}
const API_ORIGIN = (runtimeConfig?.apiOrigin || import.meta.env.VITE_ASGARD_API_ORIGIN || '').replace(/\/$/, '')

function apiUrl(path) {
  if (/^https?:\/\//.test(path)) return path
  return `${API_ORIGIN}${path}`
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// ============ Core Fetch Wrapper ============

async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(apiUrl(path), { ...options, headers })

  if (res.status === 401) {
    // Only force-reload when we HAD a token (session expired / invalidated).
    // Initial pageload calls (auto-login attempt, getMe with no token, etc.)
    // would otherwise reload-loop forever — let them throw normally so the
    // App.jsx code path can fall through to <Login />.
    if (token) {
      clearToken()
      window.location.reload()
    }
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail || `HTTP ${res.status}`)
  }

  // 204 No Content
  if (res.status === 204) return null

  return res.json()
}

// ============ Auth API ============

export async function login(email, password) {
  // Backend signature: `login(email: str, password: str)` — without Form()
  // these become FastAPI query parameters, not body. Send as URL query
  // string accordingly. (Form-encoded body would silently 422.)
  const qs = new URLSearchParams({ email, password }).toString()
  const res = await fetch(apiUrl(`/api/v1/auth/login?${qs}`), {
    method: 'POST',
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail || 'Login failed')
  }

  const data = await res.json()
  setToken(data.access_token)
  return data
}

export async function register({ email, password, full_name }) {
  return apiFetch('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, full_name }),
  })
}

export async function getMe() {
  return apiFetch('/api/v1/auth/me')
}

// ============ Agents API ============

export async function listAgents({ category, search } = {}) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (search) params.set('search', search)
  const qs = params.toString()
  return apiFetch(`/api/v1/agents${qs ? '?' + qs : ''}`)
}

export async function getAgent(agentId) {
  return apiFetch(`/api/v1/agents/${agentId}`)
}

export async function enableAgent(agentId) {
  return apiFetch(`/api/v1/agents/${agentId}/enable`, { method: 'POST' })
}

export async function disableAgent(agentId) {
  return apiFetch(`/api/v1/agents/${agentId}/disable`, { method: 'POST' })
}

export async function createPencilAgent(data) {
  return apiFetch('/api/v1/agents/pencil', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ============ Model Providers API ============

export async function listModelProviders() {
  return apiFetch('/api/v1/agents/pencil/models')
}

// ============ Console API ============

export async function listKeys() {
  return apiFetch('/api/v1/console/keys')
}

export async function createKey(data = {}) {
  return apiFetch('/api/v1/console/keys', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deleteKey(keyUuid) {
  return apiFetch(`/api/v1/console/keys/${keyUuid}`, { method: 'DELETE' })
}

export async function rotateKey(keyUuid) {
  return apiFetch(`/api/v1/console/keys/${keyUuid}/rotate`, { method: 'POST' })
}

export async function getBalance() {
  return apiFetch('/api/v1/console/balance')
}

export async function getUsageStats(period = 'week') {
  return apiFetch(`/api/v1/console/usage/stats?period=${period}`)
}

// ============ PencilAgent API ============
// See: Pencil-Agent-Gateway/docs/12-asgard-web-ui-guide.md §6

export function gatewayAgentId(agentOrId) {
  const raw = typeof agentOrId === 'object'
    ? (agentOrId.gateway_agent_id || agentOrId.id || agentOrId.agent_id)
    : agentOrId
  return String(raw || '').replace(/^pencil\//, '')
}

export function pencilModelId(agentOrId) {
  if (typeof agentOrId === 'object' && agentOrId.agent_id?.startsWith('pencil/')) {
    return agentOrId.agent_id
  }
  const raw = typeof agentOrId === 'object'
    ? (agentOrId.gateway_agent_id || agentOrId.id || agentOrId.agent_id)
    : agentOrId
  const id = String(raw || '')
  return id.startsWith('pencil/') ? id : `pencil/${id}`
}

export async function listPencilAgents() {
  return apiFetch('/api/v1/agents/pencil/me')
}

export async function getPencilAgent(agentId) {
  return apiFetch(`/api/v1/agents/pencil/${gatewayAgentId(agentId)}`)
}

/**
 * Create a new PencilAgent
 * POST /api/v1/agents/pencil → Asgard calls Gateway POST /v1/agents
 */
export async function createPencilAgentAPI(data) {
  return apiFetch('/api/v1/agents/pencil', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Update an existing PencilAgent
 * PUT /api/v1/agents/pencil/:id → Asgard calls Gateway PUT /v1/agents/:id
 */
export async function updatePencilAgentAPI(agentId, data) {
  return apiFetch(`/api/v1/agents/pencil/${gatewayAgentId(agentId)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deletePencilAgent(agentId) {
  return apiFetch(`/api/v1/agents/pencil/${gatewayAgentId(agentId)}`, { method: 'DELETE' })
}

export async function retrySyncPencilAgent(agentId) {
  return apiFetch(`/api/v1/agents/pencil/${gatewayAgentId(agentId)}/retry-sync`, { method: 'POST' })
}

// ============ Conversations API ============
// See: Pencil-Agent-Gateway/docs/12-asgard-web-ui-guide.md §6

export async function listConversations({ agentId, page = 1 } = {}) {
  const params = new URLSearchParams({ page })
  if (agentId) params.set('agent_id', agentId)
  return apiFetch(`/api/pencil/conversations?${params}`)
}

export async function createConversation(agentId, title) {
  return apiFetch('/api/pencil/conversations', {
    method: 'POST',
    body: JSON.stringify({ agent_id: agentId, title }),
  })
}

export async function deleteConversation(conversationId) {
  return apiFetch(`/api/pencil/conversations/${conversationId}`, { method: 'DELETE' })
}

// ============ SSE Streaming Chat ============
// See: Pencil-Agent-Gateway/docs/12-asgard-web-ui-guide.md §3

/**
 * Stream chat with a PencilAgent via SSE
 * OpenAI-compatible endpoint: POST /v1/chat/completions
 * 
 * @param {Object} options
 * @param {string} options.agentId - PencilAgent ID
 * @param {string} options.sessionId - Session UUID
 * @param {Array} options.messages - [{role: 'user'|'assistant', content: string}]
 * @param {Function} options.onDelta - Called with each text chunk
 * @param {Function} options.onDone - Called when stream completes
 * @param {Function} options.onError - Called on error
 * @param {AbortSignal} options.signal - AbortSignal for cancellation
 */
export async function streamChat({
  agentId,
  modelId,
  sessionId,
  messages,
  onDelta,
  onDone,
  onError,
  signal,
}) {
  const token = getToken()
  
  const res = await fetch(apiUrl('/v1/chat/completions'), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId || pencilModelId(agentId),
      messages,
      session_id: sessionId,
      stream: true,
    }),
    signal,
  })

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`
    try {
      const errBody = await res.json()
      errMsg = errBody?.error?.message || errBody?.detail || errMsg
    } catch {
      // Keep the HTTP status fallback when the server returns non-JSON.
    }
    onError?.({ status: res.status, message: errMsg })
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  const handleBlock = (block) => {
    for (const line of block.split('\n')) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') {
        onDone?.()
        return true
      }
      try {
        const chunk = JSON.parse(data)
        const delta = chunk?.choices?.[0]?.delta?.content
        if (typeof delta === 'string') {
          onDelta?.(delta)
        }
      } catch {
        // Ignore malformed lines
      }
    }
    return false
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      
      // Process SSE events: lines separated by \n\n
      let idx
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const block = buffer.slice(0, idx)
        buffer = buffer.slice(idx + 2)
        if (handleBlock(block)) {
          return // [DONE] received
        }
      }
    }
    onDone?.()
  } catch (err) {
    if (err.name !== 'AbortError') {
      onError?.({ message: err.message })
    }
  }
}

// ============ Agent Templates (Market) ============

export async function listAgentTemplates() {
  return apiFetch('/api/pencil/templates')
}
