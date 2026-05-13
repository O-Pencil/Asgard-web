/**
 * [WHO]: Provides Chat page with SSE streaming, message history, and conversation management
 * [FROM]: Depends on React for state, useStreamChat hook, ChatMessage component, api.js
 * [TO]: Consumed by App.jsx as child component
 * [HERE]: packages/web/src/pages/Chat.jsx - Streaming chat window
 * See: Pencil-Agent-Gateway/docs/12-asgard-web-ui-guide.md §2.4
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { streamChat, createConversation, gatewayAgentId, pencilModelId, userFacing } from '../api'
import ChatMessage, { AssistantLoading } from '../components/ChatMessage'
import { safeUuid } from '../utils/uuid'

/**
 * @typedef {'user' | 'assistant'} Role
 * @typedef {'streaming' | 'done' | 'error'} AssistantStatus
 * @typedef {{ role: Role, content: string, status?: AssistantStatus, error?: string }} Message
 */

export default function Chat({ agent, conversationId: initialConversationId, onNavigate, onNewSession }) {
  // Session management
  const [sessionId, setSessionId] = useState(() => {
    // Use existing conversation ID or generate new UUID.
    // safeUuid handles insecure-context HTTP (where crypto.randomUUID is undefined).
    return initialConversationId || safeUuid()
  })
  
  // Message state
  const [messages, setMessages] = useState(/** @type {Message[]} */ ([]))
  const [streamingContent, setStreamingContent] = useState('')
  
  // UI state
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  
  // Refs
  const messagesEndRef = useRef(null)
  const controllerRef = useRef(null)
  const inputRef = useRef(null)
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  
  /**
   * Start a new conversation (new session)
   */
  const startNewSession = useCallback(async () => {
    const newSessionId = safeUuid()
    setSessionId(newSessionId)
    setMessages([])
    setStreamingContent('')
    setError(null)
    
    // Create conversation record in backend (optional, non-blocking)
    const agentId = gatewayAgentId(agent)
    if (agentId) {
      createConversation(agentId).catch(() => {})
    }
    
    onNewSession?.(newSessionId)
  }, [agent, onNewSession])
  
  /**
   * Send a message and stream the response
   */
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return
    if (isStreaming) return
    
    const agentId = gatewayAgentId(agent)
    if (!agentId) {
      setError('未选择 Agent')
      return
    }
    
    // Abort any existing stream
    controllerRef.current?.abort()
    
    const controller = new AbortController()
    controllerRef.current = controller
    
    // Add user message
    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    
    // Reset streaming state
    setIsStreaming(true)
    setError(null)
    setStreamingContent('')
    setInputValue('')
    
    // Build messages for API (exclude the current streaming one)
    const apiMessages = [...messages, userMessage].map(({ role, content }) => ({ role, content }))
    
    let accumulated = ''
    
    try {
      await streamChat({
        agentId,
        modelId: pencilModelId(agent),
        sessionId,
        messages: apiMessages,
        onDelta: (delta) => {
          accumulated += delta
          setStreamingContent(accumulated)
        },
        onDone: () => {
          // Add completed assistant message
          setMessages(prev => [...prev, { role: 'assistant', content: accumulated, status: 'done' }])
          setStreamingContent('')
        },
        onError: (err) => {
          setError(userFacing(err))
          // Add error message with partial content if any
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: accumulated,
            status: 'error',
            error: userFacing(err),
          }])
          setStreamingContent('')
        },
        signal: controller.signal,
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(userFacing(err))
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '',
          status: 'error',
          error: userFacing(err),
        }])
      }
    } finally {
      setIsStreaming(false)
    }
  }, [agent, sessionId, messages, isStreaming])

  /**
   * Handle retry on error message
   */
  const handleRetry = useCallback(() => {
    // Find the last user message
    const lastUserIndex = messages.map((m, i) => m.role === 'user' ? i : -1).filter(i => i >= 0).pop()
    if (lastUserIndex !== undefined) {
      const lastUserMessage = messages[lastUserIndex]
      sendMessage(lastUserMessage.content)
    }
  }, [messages, sendMessage])
  
  /**
   * Stop the current streaming
   */
  const stopStreaming = () => {
    controllerRef.current?.abort()
    setIsStreaming(false)
    // Keep the partial content as a message
    if (streamingContent) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: streamingContent,
        status: 'done',
      }])
      setStreamingContent('')
    }
  }
  
  /**
   * Handle form submit
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(inputValue)
  }
  
  /**
   * Handle keyboard: Enter to send, Shift+Enter for newline
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('my-agents')}
            className="text-slate-500 hover:text-slate-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="font-semibold text-slate-800">{agent?.name || '聊天'}</h2>
            {agent?.soul_prompt && (
              <p className="text-xs text-slate-500 truncate max-w-md">
                {agent.soul_prompt.slice(0, 60)}...
              </p>
            )}
          </div>
        </div>
        <button
          onClick={startNewSession}
          className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
        >
          新建对话
        </button>
      </div>
      
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1">
        {/* Empty state */}
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <svg className="w-12 h-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">开始一段对话吧</p>
            <p className="text-xs mt-1">发送消息与 {agent?.name || 'Agent'} 交流</p>
          </div>
        )}
        
        {/* Message list */}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        
        {/* Streaming indicator */}
        {isStreaming && streamingContent && (
          <ChatMessage message={{ role: 'assistant', content: streamingContent, status: 'streaming' }} />
        )}
        
        {/* Initial loading */}
        {isStreaming && !streamingContent && (
          <AssistantLoading />
        )}
        
        {/* Error with retry link */}
        {messages.length > 0 && messages[messages.length - 1]?.status === 'error' && (
          <div className="text-center">
            <button
              onClick={handleRetry}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              点击重试
            </button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-200 mt-4">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Shift+Enter 换行)"
            disabled={isStreaming}
            rows={3}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400"
          />
          <div className="flex flex-col gap-2">
            {/* Stop button (only visible during streaming) */}
            {isStreaming && (
              <button
                type="button"
                onClick={stopStreaming}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded hover:bg-slate-50 transition-colors"
              >
                停止
              </button>
            )}
            {/* Send button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isStreaming}
              className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              发送
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {isStreaming ? '正在接收回复...' : '按 Enter 发送，Shift+Enter 换行'}
        </p>
      </form>
    </div>
  )
}