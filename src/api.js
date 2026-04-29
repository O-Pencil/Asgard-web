/**
 * [WHO]: Provides API client functions: auth, agents, console, and JWT token management
 * [FROM]: Depends on browser fetch API and localStorage for token persistence
 * [TO]: Consumed by all page components (Login, AgentMarket, Console) and Layout for API calls
 * [HERE]: packages/web/src/api.js - Centralized API client; handles auth headers and error responses
 */

// ============ Token Management ============

const TOKEN_KEY = 'asgard_token'

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

  const res = await fetch(path, { ...options, headers })

  if (res.status === 401) {
    clearToken()
    window.location.reload()
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
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ email, password }),
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
