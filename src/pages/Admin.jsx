/**
 * [WHO]: Provides Admin page for platform operators to inspect users, subscriptions, quota policy, and hosted usage
 * [FROM]: Depends on React for state/effects and api.js admin endpoints
 * [TO]: Consumed by App.jsx when the current route starts with /admin
 * [HERE]: packages/web/src/pages/Admin.jsx - Admin-only dashboard for Asgard billing and hosted-model operations
 */
import { useEffect, useMemo, useState } from 'react'
import { getAdminOverview, listAdminUsers } from '../api'

function formatDate(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString('zh-CN')
  } catch {
    return '—'
  }
}

function StatCard({ label, value, hint }) {
  return (
    <wired-card elevation={3} className="p-5">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value ?? '—'}</p>
      {hint && <p className="text-xs text-slate-500 mt-2">{hint}</p>}
    </wired-card>
  )
}

function QuotaText({ quota }) {
  if (!quota) return <span className="text-slate-400">—</span>
  return (
    <div className="min-w-[160px]">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
        <span>{quota.used_credits} / {quota.included_credits}</span>
        <span>{Math.round(quota.remaining_percent ?? 0)}% left</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full"
          style={{ width: `${Math.max(0, Math.min(100, quota.used_percent || 0))}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-400 mt-1">重置：{formatDate(quota.reset_at)}</p>
    </div>
  )
}

export default function Admin({ user, onLogout }) {
  const [overview, setOverview] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const activeUsers = useMemo(
    () => users.filter((row) => row.subscription?.active),
    [users],
  )

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const [overviewData, usersData] = await Promise.all([
        getAdminOverview(),
        listAdminUsers(),
      ])
      setOverview(overviewData)
      setUsers(Array.isArray(usersData?.users) ? usersData.users : [])
    } catch (err) {
      setError(err.message || '管理员数据读取失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <a href="/" className="font-bold text-xl text-slate-800 no-underline">Asgard Admin</a>
            <a href="/app" className="text-sm text-slate-500 hover:text-slate-900">用户平台</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{user?.email}</span>
            <button onClick={onLogout} className="text-xs text-slate-400 hover:text-slate-600">退出</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">订阅、用户与额度</h1>
            <p className="text-sm text-slate-500 mt-1">
              管理员视图：从 Asgard 数据库读取用户、Creem 订阅、Catea Pro 额度和托管模型使用情况。
            </p>
          </div>
          <button
            onClick={load}
            className="px-3 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50"
          >
            刷新
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-slate-400 text-center py-12">加载管理员数据...</div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="用户数" value={overview?.totals?.users} />
              <StatCard label="订阅客户" value={overview?.totals?.billing_customers} />
              <StatCard label="活跃 Pro" value={overview?.totals?.active_subscriptions ?? activeUsers.length} />
              <StatCard
                label="近期托管额度消耗"
                value={overview?.totals?.recent_hosted_credits}
                hint={`${overview?.totals?.recent_hosted_events ?? 0} events`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <wired-card elevation={3} className="p-5">
                <h2 className="font-semibold text-slate-800 mb-4">额度策略</h2>
                {overview?.plans?.length ? (
                  <div className="space-y-3">
                    {overview.plans.map((plan) => (
                      <div key={plan.plan_id} className="border border-slate-200 rounded p-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-800">{plan.name} · {plan.plan_id}</p>
                          <span className={plan.active ? 'text-green-600 text-sm' : 'text-slate-400 text-sm'}>
                            {plan.active ? 'active' : 'inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                          月度 {plan.monthly_credits} credits · {plan.window_hours} 小时窗口 {plan.window_credits} credits
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">暂无 plan 记录；有用户查询或订阅后会自动创建。</p>
                )}
              </wired-card>

              <wired-card elevation={3} className="p-5">
                <h2 className="font-semibold text-slate-800 mb-4">MiniMax 服务商额度</h2>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>Provider: {overview?.provider_quota?.provider || 'minimax'}</p>
                  <p>模型: {overview?.provider_quota?.model || '—'}</p>
                  <p>Base URL: {overview?.provider_quota?.base_url || '—'}</p>
                  <p>
                    Key 状态:{' '}
                    <span className={overview?.provider_quota?.configured ? 'text-green-600' : 'text-orange-600'}>
                      {overview?.provider_quota?.configured ? '已配置' : '未配置'}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 pt-2">
                    {overview?.provider_quota?.note || 'MiniMax provider-level quota endpoint is not wired yet.'}
                  </p>
                </div>
              </wired-card>
            </div>

            <wired-card elevation={3} className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">用户</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">订阅</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">License</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">月度额度</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">5 小时窗口</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((row) => (
                    <tr key={row.user.uuid} className="border-b border-slate-100 align-top">
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{row.user.email}</p>
                        <p className="text-xs text-slate-400">{row.user.full_name || '—'}</p>
                      </td>
                      <td className="py-3 px-4">
                        {row.subscription ? (
                          <div>
                            <span className={row.subscription.active ? 'text-green-600' : 'text-slate-500'}>
                              {row.subscription.plan} · {row.subscription.status}
                            </span>
                            <p className="text-xs text-slate-400 mt-1">
                              到期：{formatDate(row.subscription.current_period_end)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400">Free / no subscription</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">
                        {row.billing_customer?.license_key ? `${row.billing_customer.license_key.slice(0, 16)}…` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <QuotaText quota={row.quota?.monthly} />
                      </td>
                      <td className="py-3 px-4">
                        <QuotaText quota={row.quota?.window} />
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {formatDate(row.user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!users.length && (
                <div className="text-slate-400 text-center py-10">暂无用户</div>
              )}
            </wired-card>
          </>
        )}
      </main>
    </div>
  )
}
