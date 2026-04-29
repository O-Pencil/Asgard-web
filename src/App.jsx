/**
 * [WHO]: Provides main application component with auto-login for development, renders Layout with child page components
 * [FROM]: Depends on React for useState/useEffect, Layout component, Login page, AgentMarket, Console, api.js for getMe/setToken
 * [TO]: Consumed by main.jsx as root component, rendered to DOM root element
 * [HERE]: packages/web/src/App.jsx - Main application component; auto-logs in as admin for development
 */
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import AgentMarket from './pages/AgentMarket'
import Console from './pages/Console'
import Login from './pages/Login'
import { getToken, getMe, setToken, clearToken, login } from './api'

const PAGES = {
  market: 'market',
  console: 'console',
}

// Default admin credentials for development
const DEFAULT_ADMIN = {
  email: 'admin@asgard.dev',
  password: 'password'
}

function App() {
  const [page, setPage] = useState(PAGES.market)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      let token = getToken()
      
      // If no token, auto-login as admin
      if (!token) {
        try {
          const loginRes = await login(DEFAULT_ADMIN.email, DEFAULT_ADMIN.password)
          token = loginRes.access_token
        } catch (err) {
          console.error('Auto-login failed:', err)
          setLoading(false)
          return
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
  }, [])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Loading...
      </div>
    )
  }

  // if (!user) {
  //   return <Login onLogin={handleLogin} />
  // }

  return (
    <Layout page={page} onNavigate={setPage} user={user} onLogout={handleLogout}>
      {page === PAGES.market && <AgentMarket user={user} />}
      {page === PAGES.console && <Console user={user} />}
    </Layout>
  )
}

export default App
