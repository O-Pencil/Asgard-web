/**
 * [WHO]: Provides Login/Register form with tab toggle, email/password authentication
 * [FROM]: Depends on React for useState hooks, api.js for login/register functions
 * [TO]: Consumed by App.jsx as authentication gate, shown when user is not logged in
 * [HERE]: packages/web/src/pages/Login.jsx - Authentication page; login and register forms
 */
import { useState } from 'react'
import { login, register } from '../api'

export default function Login({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (tab === 'register') {
        await register({ email, password, full_name: fullName || undefined })
      }
      await login(email, password)
      onLogin()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <wired-card elevation={5} className="p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-6">Asgard</h1>

        {/* Tab Toggle */}
        <div className="flex mb-6 border-b border-slate-200">
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 pb-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
                tab === t
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'login' ? '登录' : '注册'}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-sm text-slate-600 mb-1">姓名（可选）</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-600 mb-1">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <wired-button
            elevation={2}
            disabled={loading}
            onClick={handleSubmit}
            className="w-full"
          >
            {loading ? '...' : tab === 'login' ? '登录' : '注册'}
          </wired-button>
        </form>
      </wired-card>
    </div>
  )
}
