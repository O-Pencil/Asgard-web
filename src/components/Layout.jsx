/**
 * [WHO]: Provides main layout wrapper component with sticky header navigation, real user info, balance display, logout button
 * [FROM]: Depends on React for functional component, wired-button, receives user/onLogout props from App.jsx
 * [TO]: Consumed by App.jsx to wrap page components, provides consistent navigation and header across all pages
 * [HERE]: packages/web/src/components/Layout.jsx - Layout wrapper component; header with navigation, user info, and logout
 */
export default function Layout({ children, page, onNavigate, user, onLogout }) {
  const navItems = [
    { key: 'market', label: 'Agent 市场' },
    { key: 'my-agents', label: '我的 Agent' },
    { key: 'conversations', label: '对话' },
    { key: 'console', label: '控制台' },
  ]
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 顶部导航 */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <span className="font-bold text-xl text-slate-800">Asgard</span>
            <nav className="flex gap-6">
              {navItems.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => onNavigate(key)}
                  className={`text-sm font-medium ${page === key ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {label}
                </button>
              ))}
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                文档
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">余额:</span>
              <span className="text-sm font-medium text-slate-700">
                {user?.balance?.toFixed(0) ?? '0'} Credits
              </span>
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <span className="text-sm text-slate-600">{user?.full_name || user?.email}</span>
              <button
                onClick={onLogout}
                className="text-xs text-slate-400 hover:text-slate-600 ml-1"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
