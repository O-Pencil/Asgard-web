/**
 * [WHO]: Provides useStreamChat hook for SSE streaming with PencilAgent
 * [FROM]: Depends on api.js streamChat function, uses AbortController for cancellation
 * [TO]: Consumed by Chat.jsx page component for real-time message streaming
 * [HERE]: packages/web/src/hooks/useStreamChat.js - SSE streaming hook for chat
 */
import { useRef, useCallback, useState } from 'react'
import { streamChat } from '../api'

/**
 * Hook for streaming chat with a PencilAgent
 * 
 * @param {Object} options
 * @param {string} options.agentId - The PencilAgent ID
 * @param {string} options.sessionId - Session UUID (generate with crypto.randomUUID())
 * @param {Array} options.messages - Current conversation messages
 * @param {Function} options.onMessageComplete - Called when assistant finishes
 * @returns {Object} { content, setContent, isStreaming, error, send, stop, appendMessage, clearMessages }
 */
export function useStreamChat({ agentId, sessionId, messages = [], onMessageComplete }) {
  const [content, setContent] = useState('')      // Current streaming content
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  
  const controllerRef = useRef(null)
  const accumulatedRef = useRef('')
  
  const send = useCallback(async (text) => {
    // Abort any existing stream
    controllerRef.current?.abort()
    
    const controller = new AbortController()
    controllerRef.current = controller
    
    // Start fresh
    setContent('')
    setError(null)
    setIsStreaming(true)
    accumulatedRef.current = ''
    
    const userMessage = { role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    
    try {
      await streamChat({
        agentId,
        sessionId,
        messages: newMessages,
        onDelta: (delta) => {
          accumulatedRef.current += delta
          setContent(accumulatedRef.current)
        },
        onDone: () => {
          setIsStreaming(false)
          onMessageComplete?.({
            role: 'assistant',
            content: accumulatedRef.current,
          })
        },
        onError: (err) => {
          setError(err)
          setIsStreaming(false)
        },
        signal: controller.signal,
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err)
        setIsStreaming(false)
      }
    }
  }, [agentId, sessionId, messages, onMessageComplete])
  
  const stop = useCallback(() => {
    controllerRef.current?.abort()
    setIsStreaming(false)
  }, [])
  
  const clearMessages = useCallback(() => {
    setContent('')
    setError(null)
    accumulatedRef.current = ''
  }, [])
  
  return {
    content,
    setContent,
    isStreaming,
    error,
    send,
    stop,
    clearMessages,
  }
}