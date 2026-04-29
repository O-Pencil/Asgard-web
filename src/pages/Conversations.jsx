/**
 * [WHO]: Provides Conversations list page with history management
 * [FROM]: Depends on React for state, api.js for conversations API
 * [TO]: Consumed by App.jsx as child component, navigates to Chat
 * [HERE]: packages/web/src/pages/Conversations.jsx - Conversation history list
 * See: Pencil-Agent-Gateway/docs/12-asgard-web-ui-guide.md §2.3
 */
import { useState, useEffect, useCallback } from 'react'
import { listConversations, deleteConversation, userFacing } from '../api'
import { formatRelativeTime } from '../hooks/usePencilAgents'

export default function Conversations({ onNavigate, onSelectConversation }) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchConversations = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listConversations({ page })
      // Handle both array and { items: [], total_pages: N } formats
      if (Array.isArray(data)) {
        setConversations(data)
      } else {
        setConversations(data.items || data.conversations || [])
        setTotalPages(data.total_pages || 1)
      }
      setCurrentPage(page)
    } catch (err) {
      setError(userFacing(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const handleSelect = (conversation) => {
    onSelectConversation?.(conversation)
    onNavigate('chat')
  }

  const handleDelete = async (conversation, e) => {
    e.stopPropagation()
    
    if (deleteConfirm !== conversation.id && deleteConfirm !== conversation.conversation_id) {
      setDeleteConfirm(conversation.id || conversation.conversation_id)
      return
    }
    
    try {
      await deleteConversation(conversation.id || conversation.conversation_id)
      setConversations(prev => prev.filter(c => 
        (c.id || c.conversation_id) !== (conversation.id || conversation.conversation_id)
      ))
    } catch (err) {
      alert(userFacing(err))
    } finally {
      setDeleteConfirm(null)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchConversations(newPage)
    }
  }

  // Generate title from first user message
  const getTitle = (conversation) => {
    if (conversation.title) return conversation.title
    if (conversation.first_message) {
      return conversation.first_message.slice(0, 30) + (conversation.first_message.length > 30 ? '...' : '')
    }
    return '新对话'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">对话历史</h1>
        <button
          onClick={() => onNavigate('my-agents')}
          className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
        >
          + 新建对话
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
      {!loading && !error && conversations.length === 0 && (
        <div className="text-center py-16">
          <div className="text-slate-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg">暂无对话记录</p>
            <p className="text-sm mt-1">去和 Agent 聊聊吧</p>
          </div>
          <button
            onClick={() => onNavigate('my-agents')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700"
          >
            选择一个 Agent 开始聊天
          </button>
        </div>
      )}

      {/* Conversation list */}
      {!loading && conversations.length > 0 && (
        <>
          <div className="space-y-2">
            {conversations.map((conversation) => {
              const id = conversation.id || conversation.conversation_id
              const isConfirmDelete = deleteConfirm === id
              
              return (
                <div
                  key={id}
                  onClick={() => handleSelect(conversation)}
                  className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-800 truncate">
                        {getTitle(conversation)}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>{conversation.agent_name || 'Agent'}</span>
                        <span>•</span>
                        <span>{conversation.message_count || 0} 条消息</span>
                        <span>•</span>
                        <span>{formatRelativeTime(conversation.last_message_at || conversation.updated_at)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(conversation, e)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ml-3 ${
                        isConfirmDelete
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'border border-slate-300 text-slate-600 hover:border-red-300 hover:text-red-600'
                      }`}
                    >
                      {isConfirmDelete ? '确认删除' : '删除'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 border border-slate-300 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                上一页
              </button>
              <span className="text-sm text-slate-600">
                第 {currentPage} / {totalPages} 页
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 border border-slate-300 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}