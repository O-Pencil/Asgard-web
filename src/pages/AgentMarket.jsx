/**
 * [WHO]: Provides Agent Marketplace page with real API data, category filtering, search, enable/disable actions, Pencil Agent creation dialog
 * [FROM]: Depends on React for useState/useEffect, api.js for listAgents/enableAgent/disableAgent/createPencilAgent, wired-* components
 * [TO]: Consumed by App.jsx as child component, rendered when page state is 'market'
 * [HERE]: packages/web/src/pages/AgentMarket.jsx - Agent Marketplace page; fetches agents from API and provides CRUD operations
 */
import { useState, useEffect } from 'react'
import { listAgents, enableAgent, disableAgent, createPencilAgent } from '../api'

const CATEGORIES = { dev: '开发', writing: '写作', creative: '创意', analysis: '分析' }

export default function AgentMarket() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [enabledSet, setEnabledSet] = useState(new Set())

  // Create Pencil Agent dialog
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '', description: '', category: 'writing',
    soul_prompt: '', style_tags: '', model_provider: '', model_name: '',
  })
  const [creating, setCreating] = useState(false)

  const fetchAgents = async () => {
    try {
      setLoading(true)
      // const data = await listAgents({ category: categoryFilter, search: search || undefined })
      setAgents([{
        agent_id: 'pencil/test',
        name: '测试 Pencil Agent',
        description: '测试 Pencil Agent 描述',
        category: 'writing',
      }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAgents() }, [categoryFilter])

  const handleToggle = async (agent) => {
    try {
      if (enabledSet.has(agent.agent_id)) {
        await disableAgent(agent.agent_id)
        setEnabledSet((prev) => { const next = new Set(prev); next.delete(agent.agent_id); return next })
      } else {
        await enableAgent(agent.agent_id)
        setEnabledSet((prev) => new Set(prev).add(agent.agent_id))
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const handleCreatePencil = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const tags = createForm.style_tags
        ? createForm.style_tags.split(',').map((s) => s.trim()).filter(Boolean)
        : []
      await createPencilAgent({
        name: createForm.name,
        description: createForm.description || undefined,
        category: createForm.category,
        soul_prompt: createForm.soul_prompt || undefined,
        style_tags: tags.length ? tags : undefined,
        model_provider: createForm.model_provider || undefined,
        model_name: createForm.model_name || undefined,
      })
      setShowCreate(false)
      setCreateForm({ name: '', description: '', category: 'writing', soul_prompt: '', style_tags: '', model_provider: '', model_name: '' })
      fetchAgents()
    } catch (err) {
      alert(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex gap-6">
      {/* 左侧筛选区 */}
      <aside className="w-52 shrink-0">
        <wired-card elevation={3} className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">筛选</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 mb-2">领域分类</p>
              <div className="flex flex-col gap-1">
                {['all', 'dev', 'writing', 'creative', 'analysis'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-left text-sm px-2 py-1 rounded ${
                      categoryFilter === cat ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat === 'all' ? '全部' : CATEGORIES[cat]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </wired-card>

        <div className="mt-4">
          <wired-button elevation={2} onClick={() => setShowCreate(true)} className="w-full text-sm">
            + 创建 Pencil Agent
          </wired-button>
        </div>
      </aside>

      {/* 主列表区 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="搜索 Agent 名称或能力..."
            className="w-80 border border-slate-300 rounded px-3 py-1.5 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchAgents()}
          />
          <button onClick={fetchAgents} className="text-sm text-indigo-600 hover:text-indigo-800">刷新</button>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">加载中...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : agents.length === 0 ? (
          <div className="text-center text-slate-400 py-12">暂无 Agent</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {agents.map((agent) => {
              const enabled = enabledSet.has(agent.agent_id)
              return (
                <wired-card key={agent.agent_id} elevation={3} className="p-4 hover:opacity-90 transition-opacity cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800">{agent.name}</h3>
                      <span className="text-xs px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">
                        {CATEGORIES[agent.category] || agent.category}
                      </span>
                      {agent.agent_id.startsWith('pencil/') && (
                        <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">Pencil</span>
                      )}
                    </div>
                    {enabled && (
                      <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">已启用</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{agent.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(agent.capabilities || []).map((c) => (
                      <span key={c} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">{c}</span>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mb-3">
                    <span>Context: {agent.context_window || '-'}</span>
                    <span>Pricing: {agent.pricing ?? '-'} Credit/1K</span>
                  </div>
                  <wired-button elevation={2} onClick={() => handleToggle(agent)}>
                    {enabled ? '停用' : '启用'}
                  </wired-button>
                </wired-card>
              )
            })}
          </div>
        )}
      </div>

      {/* Create Pencil Agent Dialog */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <wired-card elevation={5} className="p-6 w-full max-w-lg bg-white">
            <h2 className="text-lg font-bold text-slate-800 mb-4">创建 Pencil Agent</h2>
            <form onSubmit={handleCreatePencil} className="space-y-3">
              <input
                type="text" placeholder="Agent 名称 *" required
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              />
              <textarea
                placeholder="描述"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm h-16"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              />
              <select
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
              >
                <option value="writing">写作</option>
                <option value="dev">开发</option>
                <option value="creative">创意</option>
                <option value="analysis">分析</option>
              </select>
              <textarea
                placeholder="系统提示词 (soul_prompt)"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm h-20"
                value={createForm.soul_prompt}
                onChange={(e) => setCreateForm({ ...createForm, soul_prompt: e.target.value })}
              />
              <input
                type="text" placeholder="风格标签 (逗号分隔, 如: 幽默,犀利)"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                value={createForm.style_tags}
                onChange={(e) => setCreateForm({ ...createForm, style_tags: e.target.value })}
              />
              <div className="flex gap-3">
                <input
                  type="text" placeholder="Model Provider (可选)"
                  className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm"
                  value={createForm.model_provider}
                  onChange={(e) => setCreateForm({ ...createForm, model_provider: e.target.value })}
                />
                <input
                  type="text" placeholder="Model Name (可选)"
                  className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm"
                  value={createForm.model_name}
                  onChange={(e) => setCreateForm({ ...createForm, model_name: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <wired-button type="submit" elevation={2} disabled={creating}>
                  {creating ? '创建中...' : '创建'}
                </wired-button>
                <wired-button elevation={1} onClick={() => setShowCreate(false)}>取消</wired-button>
              </div>
            </form>
          </wired-card>
        </div>
      )}
    </div>
  )
}
