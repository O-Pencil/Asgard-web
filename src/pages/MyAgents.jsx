/**
 * [WHO]: Provides My Agents page listing user's PencilAgents with CRUD operations
 * [FROM]: Depends on React for useState/useEffect, usePencilAgents hook, api.js, Layout context
 * [TO]: Consumed by App.jsx as child component, navigates to AgentForm and Chat
 * [HERE]: packages/web/src/pages/MyAgents.jsx - User's PencilAgent list page
 * See: Pencil-Agent-Gateway/docs/12-asgard-web-ui-guide.md §2.1
 */
import { useState, useEffect, useCallback } from 'react'
import { listPencilAgents, deletePencilAgent, gatewayAgentId, userFacing } from '../api'
import { formatRelativeTime, truncate } from '../hooks/usePencilAgents'

const STATUS_LABELS = {
  syncing: { label: '同步中', className: 'bg-yellow-100 text-yellow-700' },
  ready: { label: '就绪', className: 'bg-green-100 text-green-700' },
  error: { label: '错误', className: 'bg-red-100 text-red-700' },
}

export default function MyAgents({ onNavigate, onOpenChat, onEditAgent }) {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

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

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const handleDelete = async (agent) => {
    const id = gatewayAgentId(agent)
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      return
    }
    try {
      await deletePencilAgent(id)
      setAgents(prev => prev.filter(a => gatewayAgentId(a) !== id))
    } catch (err) {
      alert(userFacing(err))
    } finally {
      setDeleteConfirm(null)
    }
  }

  const handleEdit = (agent) => {
    onEditAgent?.(agent)
    onNavigate('agent-form')
  }

  const handleOpenChat = (agent) => {
    onOpenChat?.(agent)
    onNavigate('chat')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">我的 Agent</h1>
        <button
          onClick={() => onNavigate('agent-form')}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors"
        >
          + 创建新 Agent
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center text-slate-400 py-12">加载中...</div>
      )}

      {/* Empty state */}
      {!loading && !error && agents.length === 0 && (
        <div className="text-center py-16">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">还没有创建 Agent</p>
            <p className="text-sm mt-1">从模板市场选择一个，或从零开始创建</p>
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => onNavigate('market')}
              className="px-4 py-2 border border-indigo-600 text-indigo-600 text-sm font-medium rounded hover:bg-indigo-50"
            >
              浏览模板市场
            </button>
            <button
              onClick={() => onNavigate('agent-form')}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700"
            >
              从零开始创建
            </button>
          </div>
        </div>
      )}

      {/* Agent list */}
      {!loading && agents.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {agents.map((agent) => {
            const id = gatewayAgentId(agent)
            const status = agent.gateway_status || agent.status || 'ready'
            const statusInfo = STATUS_LABELS[status] || STATUS_LABELS.ready
            
            return (
              <div
                key={id}
                className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">{agent.name}</h3>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded mt-1 ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
                
                {/* Soul preview */}
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {agent.soulPreview || agent.soul_prompt || agent.system_prompt
                    ? truncate(agent.soulPreview || agent.soul_prompt || agent.system_prompt, 80)
                    : <span className="text-slate-400 italic">未设置系统提示词</span>
                  }
                </p>
                
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span>Model: {agent.model || agent.model_name || '默认'}</span>
                  <span>{formatRelativeTime(agent.updated_at || agent.updatedAt)}</span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenChat(agent)}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700"
                  >
                    聊天
                  </button>
                  <button
                    onClick={() => handleEdit(agent)}
                    className="px-3 py-1.5 border border-slate-300 text-slate-700 text-xs font-medium rounded hover:bg-slate-50"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(agent)}
                    className={`px-3 py-1.5 text-xs font-medium rounded ${
                      deleteConfirm === id
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'border border-red-300 text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {deleteConfirm === id ? '确认删除' : '删除'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}