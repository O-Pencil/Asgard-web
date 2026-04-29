/**
 * [WHO]: Provides ChatMessage component for rendering user/assistant messages with streaming support
 * [FROM]: Depends on React, react-markdown for rendering
 * [TO]: Consumed by Chat.jsx page component
 * [HERE]: packages/web/src/components/ChatMessage.jsx - Message bubble component
 */
import ReactMarkdown from 'react-markdown'

/**
 * Status types for assistant messages
 * @typedef {'streaming' | 'done' | 'error'} AssistantStatus
 */

/**
 * @param {Object} props
 * @param {{ role: 'user' | 'assistant', content: string, status?: AssistantStatus, error?: string }} props.message
 */
export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'
  
  const containerClass = isUser
    ? 'flex justify-end'
    : 'flex justify-start'
  
  const bubbleClass = isUser
    ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm max-w-[80%]'
    : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm max-w-[80%]'
  
  return (
    <div className={containerClass}>
      <div className={`px-4 py-2.5 ${bubbleClass}`}>
        {isUser && (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}
        
        {isAssistant && (
          <>
            {message.status === 'streaming' && (
              <div className="relative">
                <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none prose-slate">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                {/* Streaming cursor */}
                <span className="inline-block w-0.5 h-4 bg-indigo-600 ml-0.5 animate-pulse align-middle" />
              </div>
            )}
            
            {message.status === 'done' && (
              <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none prose-slate">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
            
            {message.status === 'error' && (
              <div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap opacity-70">
                  <ReactMarkdown>{message.content || '（消息内容不可用）'}</ReactMarkdown>
                </div>
                {message.error && (
                  <p className="text-xs text-red-500 mt-1">
                    错误: {message.error}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Loading placeholder for assistant
 */
export function AssistantLoading() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-sm">思考中</span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    </div>
  )
}