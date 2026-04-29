/**
 * [WHO]: Provides Developer Console page with real API data: Overview (balance, stats), Credential Management (keys CRUD), Integration Guides, Usage Statistics
 * [FROM]: Depends on React for useState/useEffect, api.js for listKeys/createKey/deleteKey/rotateKey/getBalance/getUsageStats, wired-* components
 * [TO]: Consumed by App.jsx as child component, rendered when page state is 'console'
 * [HERE]: packages/web/src/pages/Console.jsx - Developer Console page; all data fetched from backend API
 */
import { useState, useEffect, useCallback } from 'react'
import { listKeys, createKey, deleteKey, rotateKey, getBalance, getUsageStats } from '../api'

const TABS = ['概览', '凭证管理', '集成指南', '用量统计']

export default function Console() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      {/* 控制台子导航 */}
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
              activeTab === i
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && <OverviewTab />}
      {activeTab === 1 && <CredentialTab />}
      {activeTab === 2 && <GuideTab />}
      {activeTab === 3 && <UsageTab />}
    </div>
  )
}

// ============ Overview Tab ============

function OverviewTab() {
  const [balance, setBalance] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getBalance(), getUsageStats('week')])
      .then(([b, s]) => { setBalance(b); setStats(s) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-slate-400 text-center py-8">加载中...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <wired-card elevation={3} className="p-5">
          <p className="text-sm text-slate-500 mb-1">当前余额</p>
          <p className="text-2xl font-bold text-slate-800">{balance?.balance?.toFixed(0) ?? '0'} Credits</p>
        </wired-card>
        <wired-card elevation={3} className="p-5">
          <p className="text-sm text-slate-500 mb-1">本周 Token 消耗</p>
          <p className="text-2xl font-bold text-slate-800">
            {stats ? ((stats.total_prompt_tokens + stats.total_completion_tokens) / 1000).toFixed(1) + 'K' : '0'}
          </p>
        </wired-card>
        <wired-card elevation={3} className="p-5">
          <p className="text-sm text-slate-500 mb-1">本周请求数</p>
          <p className="text-2xl font-bold text-slate-800">{stats?.total_requests ?? 0}</p>
        </wired-card>
      </div>
      <wired-card elevation={3} className="p-5">
        <h3 className="font-semibold text-slate-800 mb-4">快捷操作</h3>
        <div className="flex gap-4">
          <wired-button elevation={2} onClick={() => { /* switch to credential tab handled by parent */ }}>
            创建 Key
          </wired-button>
          <wired-button elevation={2}>查看集成指南</wired-button>
          <wired-button elevation={2}>用量明细</wired-button>
        </div>
      </wired-card>
    </div>
  )
}

// ============ Credential Tab ============

function CredentialTab() {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [createdKey, setCreatedKey] = useState(null) // shown once after creation

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listKeys()
      setKeys(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchKeys() }, [fetchKeys])

  const handleCreate = async () => {
    try {
      const result = await createKey({ name: newKeyName || undefined })
      setCreatedKey(result)
      setNewKeyName('')
      setShowCreate(false)
      fetchKeys()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (keyUuid) => {
    if (!confirm('确定要删除这个 Key 吗？')) return
    try {
      await deleteKey(keyUuid)
      fetchKeys()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleRotate = async (keyUuid) => {
    if (!confirm('轮换会生成新 Key，旧 Key 立即失效。继续？')) return
    try {
      const result = await rotateKey(keyUuid)
      setCreatedKey(result)
      fetchKeys()
    } catch (err) {
      alert(err.message)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div className="space-y-4">
      {/* Newly created key banner */}
      {createdKey && (
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <p className="text-sm text-green-800 font-medium mb-1">
            {createdKey.name ? `${createdKey.name} — ` : ''}Key 已创建（仅显示一次，请妥善保存）
          </p>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-green-100 px-2 py-1 rounded flex-1 overflow-x-auto">{createdKey.api_key}</code>
            <button onClick={() => copyToClipboard(createdKey.api_key)} className="text-xs text-green-700 hover:text-green-900">复制</button>
            <button onClick={() => setCreatedKey(null)} className="text-xs text-green-400 hover:text-green-600">关闭</button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <wired-button elevation={3} onClick={() => setShowCreate(true)}>新建 Key</wired-button>
      </div>

      {/* Create form */}
      {showCreate && (
        <wired-card elevation={2} className="p-4">
          <div className="flex items-center gap-3">
            <input
              type="text" placeholder="Key 名称（可选）"
              className="border border-slate-300 rounded px-3 py-2 text-sm flex-1"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
            <wired-button elevation={2} onClick={handleCreate}>创建</wired-button>
            <wired-button elevation={1} onClick={() => setShowCreate(false)}>取消</wired-button>
          </div>
        </wired-card>
      )}

      {/* Key list */}
      {loading ? (
        <div className="text-slate-400 text-center py-8">加载中...</div>
      ) : keys.length === 0 ? (
        <div className="text-slate-400 text-center py-8">暂无 API Key</div>
      ) : (
        <wired-card elevation={3} className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">名称</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">标签</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">创建时间</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">状态</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.uuid} className="border-b border-slate-100">
                  <td className="py-3 px-4">{key.name || '-'}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{key.key_prefix}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {key.created_at ? new Date(key.created_at).toLocaleString('zh-CN') : '-'}
                  </td>
                  <td className="py-3 px-4">
                    {key.is_active
                      ? <span className="text-green-600">启用</span>
                      : <span className="text-slate-400">禁用</span>
                    }
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <wired-button elevation={1} onClick={() => handleRotate(key.uuid)}>轮换</wired-button>
                      <wired-button elevation={1} onClick={() => handleDelete(key.uuid)}>删除</wired-button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </wired-card>
      )}
    </div>
  )
}

// ============ Guide Tab ============

function GuideTab() {
  return (
    <wired-card elevation={3} className="p-5">
      <div className="flex gap-2 mb-4 border-b border-slate-200 pb-2">
        {['Cursor', 'VS Code', 'Notion', '飞书', 'Figma', 'Raycast', 'Github Actions'].map((tool) => (
          <button key={tool} className="px-3 py-1 text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-700">
            {tool}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-slate-800 mb-2">步骤 1: 获取 API Key</h4>
          <p className="text-sm text-slate-600 mb-2">在控制台 → 凭证管理 中创建 Key</p>
        </div>
        <div>
          <h4 className="font-medium text-slate-800 mb-2">步骤 2: 配置 Base URL</h4>
          <pre className="text-sm bg-slate-100 p-3 rounded font-mono text-slate-700">http://localhost:8000/v1</pre>
        </div>
        <div>
          <h4 className="font-medium text-slate-800 mb-2">步骤 3: 设置 Model 字段</h4>
          <pre className="text-sm bg-slate-100 p-3 rounded font-mono text-slate-700">model: "asgard/code-refactor"  // 或 pencil/xxx 自定义 Agent</pre>
        </div>
      </div>
    </wired-card>
  )
}

// ============ Usage Tab ============

function UsageTab() {
  const [period, setPeriod] = useState('week')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getUsageStats(period)
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [period])

  const byAgent = stats?.by_agent || {}
  const agentNames = Object.keys(byAgent)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">时间维度:</span>
        <div className="flex gap-2">
          {[['day', '日'], ['week', '周'], ['month', '月']].map(([val, label]) => (
            <wired-button
              key={val}
              elevation={period === val ? 3 : 1}
              onClick={() => setPeriod(val)}
            >
              {label}
            </wired-button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-8">加载中...</div>
      ) : !stats || stats.total_requests === 0 ? (
        <div className="text-slate-400 text-center py-8">暂无使用数据</div>
      ) : (
        <>
          <wired-card elevation={3} className="p-5">
            <h3 className="font-semibold text-slate-800 mb-4">按 Agent 维度</h3>
            {agentNames.length > 0 ? (
              <div className="h-48 flex items-end gap-4">
                {agentNames.map((name, i) => {
                  const a = byAgent[name]
                  const maxReq = Math.max(...agentNames.map((n) => byAgent[n].requests), 1)
                  const pct = (a.requests / maxReq) * 100
                  return (
                    <div key={name} className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-slate-500 mb-1">{a.requests}</div>
                      <div
                        className="w-full bg-indigo-200 rounded-t min-h-[20px]"
                        style={{ height: `${Math.max(pct, 10)}%` }}
                      />
                      <span className="text-xs text-slate-500 mt-2 truncate w-full text-center">{name}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400">暂无数据</div>
            )}
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-4 gap-4 text-sm text-slate-600">
              <div>
                <p className="text-slate-400">总请求数</p>
                <p className="font-medium">{stats.total_requests}</p>
              </div>
              <div>
                <p className="text-slate-400">Input Tokens</p>
                <p className="font-medium">{stats.total_prompt_tokens.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400">Output Tokens</p>
                <p className="font-medium">{stats.total_completion_tokens.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400">总费用</p>
                <p className="font-medium">{stats.total_cost.toFixed(2)} Credits</p>
              </div>
            </div>
          </wired-card>
        </>
      )}
    </div>
  )
}
