/**
 * [WHO]: Provides main layout wrapper component with sticky header navigation, page toggle buttons, balance display, user avatar, renders children in main content area
 * [FROM]: Depends on React for functional component, wired-button for styled buttons, accepts page and onNavigate props
 * [TO]: Consumed by App.jsx to wrap page components, provides consistent navigation and header across all pages
 * [HERE]: packages/web/src/components/Layout.jsx - Layout wrapper component; header with navigation and user info, main content area
 */
export default function Layout({ children, page, onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 顶部导航 */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <span className="font-bold text-xl text-slate-800">Asgard</span>
            <nav className="flex gap-6">
              <button
                onClick={() => onNavigate('market')}
                className={`text-sm font-medium ${page === 'market' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Agent 市场
              </button>
              <button
                onClick={() => onNavigate('console')}
                className={`text-sm font-medium ${page === 'console' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                控制台
              </button>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                文档
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <wired-button onClick={() => {}} elevation={3}>
              获取 API Key
            </wired-button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <span className="text-sm text-slate-500">余额:</span>
              <span className="text-sm font-medium text-slate-700">1,280 Credits</span>
              <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-medium text-slate-600">
                用户
              </div>
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
