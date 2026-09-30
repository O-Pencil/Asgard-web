/**
 * [WHO]: Provides main application component with public landing route and console auto-login for development
 * [FROM]: Depends on React for useState/useEffect/useCallback, Landing component, Layout component, all page components, api.js for auth helpers
 * [TO]: Consumed by main.jsx as root component, rendered to DOM root element
 * [HERE]: packages/web/src/App.jsx - Main application component; serves Catea landing at / and Asgard console at /app
 * 
 * Page types: market, console, my-agents, agent-form, conversations, chat, settings
 */
import { useState, useEffect, useCallback } from 'react'
import Layout from './components/Layout'
import AgentMarket from './pages/AgentMarket'
import Console from './pages/Console'
import Login from './pages/Login'
import MyAgents from './pages/MyAgents'
import AgentForm from './pages/AgentForm'
import Conversations from './pages/Conversations'
import Chat from './pages/Chat'
import { getToken, getMe, clearToken, login } from './api'
import Landing from './Landing'
import './App.css'

// Admin credentials for SINGLE_USER_MODE auto-login.
// Read from runtime config (public/config.js) or fall back to build-time env vars.
// Never hardcode real credentials here — config.js is the injection point.
const config = window.__ASGARD_CONFIG__ || {}
const DEFAULT_ADMIN = {
  email: config.adminEmail || import.meta.env.VITE_ADMIN_EMAIL || 'admin@asgard.dev',
  password: config.adminPassword || import.meta.env.VITE_ADMIN_PASSWORD || '',
}

function App() {
  const isConsoleRoute = window.location.pathname.startsWith('/app')
  const [page, setPage] = useState('market')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Context state for passing between pages
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [selectedConversation, setSelectedConversation] = useState(null)

  useEffect(() => {
    if (!isConsoleRoute) {
      setLoading(false)
      return
    }

    const initAuth = async () => {
      let token = getToken()
      
      // If explicitly configured, auto-login as admin for private deployments.
      if (!token && DEFAULT_ADMIN.password) {
        try {
          const loginRes = await login(DEFAULT_ADMIN.email, DEFAULT_ADMIN.password)
          token = loginRes.access_token
        } catch (err) {
          console.warn('Auto-login failed, trying single-user backend fallback:', err)
        }
      }

      // Fetch user info
      try {
        const u = await getMe()
        setUser(u)
      } catch (err) {
        console.error('Get user failed:', err)
        clearToken()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [isConsoleRoute])

  const handleLogin = async () => {
    const u = await getMe()
    setUser(u)
  }

  const handleLogout = () => {
    clearToken()
    setUser(null)
    // Auto re-login
    window.location.reload()
  }

  // Navigation handler with context
  const handleNavigate = useCallback((newPage) => {
    // Clear selection when navigating away from related pages
    if (newPage !== 'chat' && newPage !== 'agent-form') {
      // Keep agent/conversation selection only when appropriate
    }
    setPage(newPage)
  }, [])

  // Handle opening chat with an agent
  const handleOpenChat = useCallback((agent) => {
    setSelectedAgent(agent)
    setSelectedConversation(null)
  }, [])

  // Handle editing an agent
  const handleEditAgent = useCallback((agent) => {
    setSelectedAgent(agent)
  }, [])

  // Handle selecting a conversation to resume
  const handleSelectConversation = useCallback((conversation) => {
    setSelectedConversation(conversation)
    // Load associated agent if available
    if (conversation.agent) {
      setSelectedAgent(conversation.agent)
    } else if (conversation.agent_id) {
      // Fetch agent details if needed
      setSelectedAgent({ agent_id: conversation.agent_id, name: conversation.agent_name })
    }
  }, [])

  // Handle new session created in Chat
  const handleNewSession = useCallback((sessionId) => {
    setSelectedConversation({ id: sessionId })
  }, [])

  // Success callback after agent creation/edit
  const handleAgentSuccess = useCallback(() => {
    // Could refresh agent list here if needed
  }, [])

  if (!isConsoleRoute) return <Landing />

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Loading...
      </div>
    )
  }

  // Show login page when auto-login fails (e.g., when public deploy doesn't
  // expose admin password via config.js — the safe default for any non-private
  // hosting). Removing this gate would expose every API to anonymous callers
  // through `getMe()` since the SPA never re-authenticates.
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  // Render current page
  const renderPage = () => {
    switch (page) {
      case 'market':
        return <AgentMarket user={user} />
      
      case 'console':
        return <Console user={user} />
      
      case 'my-agents':
        return (
          <MyAgents
            user={user}
            onNavigate={handleNavigate}
            onOpenChat={handleOpenChat}
            onEditAgent={handleEditAgent}
          />
        )
      
      case 'agent-form':
        return (
          <AgentForm
            editAgent={selectedAgent}
            onNavigate={handleNavigate}
            onSuccess={handleAgentSuccess}
          />
        )
      
      case 'conversations':
        return (
          <Conversations
            onNavigate={handleNavigate}
            onSelectConversation={handleSelectConversation}
          />
        )
      
      case 'chat':
        return (
          <Chat
            agent={selectedAgent}
            conversationId={selectedConversation?.id}
            onNavigate={handleNavigate}
            onNewSession={handleNewSession}
          />
        )
      
      case 'settings':
        // Redirect to console's credential tab or show a settings page
        return (
          <Console user={user} activeTab={1} />
        )
      
      default:
        return <AgentMarket user={user} />
    }
  }

  return (
    <Layout page={page} onNavigate={handleNavigate} user={user} onLogout={handleLogout}>
      {renderPage()}
    </Layout>
  )
}

export default App
