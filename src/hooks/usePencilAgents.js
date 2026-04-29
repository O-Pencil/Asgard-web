/**
 * [WHO]: Provides usePencilAgents hook for CRUD operations on PencilAgents
 * [FROM]: Depends on api.js functions: listPencilAgents, createPencilAgentAPI, updatePencilAgentAPI, deletePencilAgent
 * [TO]: Consumed by MyAgents.jsx and AgentForm.jsx page components
 * [HERE]: packages/web/src/hooks/usePencilAgents.js - Agent CRUD hook
 */
import { useState, useCallback } from 'react'
import {
  listPencilAgents,
  createPencilAgentAPI,
  updatePencilAgentAPI,
  deletePencilAgent,
  userFacing,
} from '../api'

/**
 * Hook for managing PencilAgent list and operations
 * 
 * @returns {Object} { agents, loading, error, fetchAgents, createAgent, updateAgent, removeAgent }
 */
export function usePencilAgents() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const fetchAgents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listPencilAgents()
      setAgents(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(userFacing(err))
    } finally {
      setLoading(false)
    }
  }, [])
  
  const createAgent = useCallback(async (agentData) => {
    const result = await createPencilAgentAPI(agentData)
    // Refresh list
    await fetchAgents()
    return result
  }, [fetchAgents])
  
  const updateAgent = useCallback(async (agentId, agentData) => {
    const result = await updatePencilAgentAPI(agentId, agentData)
    // Refresh list
    await fetchAgents()
    return result
  }, [fetchAgents])
  
  const removeAgent = useCallback(async (agentId) => {
    await deletePencilAgent(agentId)
    // Update local state immediately
    setAgents(prev => prev.filter(a => a.id !== agentId && a.agent_id !== agentId))
  }, [])
  
  return {
    agents,
    loading,
    error,
    fetchAgents,
    createAgent,
    updateAgent,
    removeAgent,
  }
}

/**
 * Format relative time (e.g., "2 天前更新")
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins} 分钟前`
  if (diffHours < 24) return `${diffHours} 小时前`
  if (diffDays < 30) return `${diffDays} 天前`
  return date.toLocaleDateString('zh-CN')
}

/**
 * Truncate text to specified length
 */
export function truncate(text, maxLength = 60) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}