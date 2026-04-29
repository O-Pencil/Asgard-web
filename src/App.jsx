/**
 * [WHO]: Provides main application component with page state management, renders Layout with child page components (AgentMarket, Console)
 * [FROM]: Depends on React for hooks (useState), Layout component for structure, AgentMarket for marketplace, Console for developer tools
 * [TO]: Consumed by main.jsx as root component, rendered to DOM root element
 * [HERE]: packages/web/src/App.jsx - Main application component; manages page routing state and renders appropriate page
 */
import { useState } from 'react'
import Layout from './components/Layout'
import AgentMarket from './pages/AgentMarket'
import Console from './pages/Console'

const PAGES = {
  market: 'market',
  console: 'console',
}

function App() {
  const [page, setPage] = useState(PAGES.market)

  return (
    <Layout page={page} onNavigate={setPage}>
      {page === PAGES.market && <AgentMarket />}
      {page === PAGES.console && <Console />}
    </Layout>
  )
}

export default App
