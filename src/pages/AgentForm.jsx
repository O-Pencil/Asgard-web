/**
 * [WHO]: Provides Agent creation/edit form with soul, memory, and model configuration
 * [FROM]: Depends on React for form state, api.js for CRUD, receives editAgent prop from parent
 * [TO]: Consumed by App.jsx, navigates to MyAgents on success
 * [HERE]: packages/web/src/pages/AgentForm.jsx - Create/Edit PencilAgent form
 * See: Pencil-Agent-Gateway/docs/12-asgard-web-ui-guide.md §2.2
 */
import { useState, useEffect } from 'react'
import { createPencilAgentAPI, gatewayAgentId, updatePencilAgentAPI, userFacing, listModelProviders } from '../api'

const SOUL_PLACEHOLDER = `你是谁？
- 你是我的写作助手，专注于帮助用户创作高质量内容
- 擅长领域：技术文档、创意写作、分析报告

你的风格：
- 专业但不刻板
- 简洁明了，避免冗余
- 善于用例子解释复杂概念

你的原则：
- 始终以用户的成功为目标
- 如有疑问，主动确认需求
- 在不确定时，坦诚表达`

function formatProviderLabel(providerId) {
  const labels = {
    'dashscope-coding': '通义千问 (DashScope)',
    'minimax-coding': 'MiniMax (Coding Plan)',
    'zhipu-coding': '智谱 GLM',
    'qianfan-coding': '百度千帆',
    'ark-coding': '火山引擎 Ark',
    'anthropic-custom': 'Anthropic (自定义)',
  }
  return labels[providerId] || providerId
}

export default function AgentForm({ editAgent, onNavigate, onSuccess }) {
  const isEdit = Boolean(editAgent)
  const [form, setForm] = useState({
    name: '',
    soul_prompt: '',
    style_tags: '',
    memory_max_turns: 30,
    model_provider: '',
    model_name: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Model providers loaded from backend API
  const [modelProviders, setModelProviders] = useState([])
  const [modelOptions, setModelOptions] = useState([])

  // Load model providers from backend
  useEffect(() => {
    listModelProviders().then(providers => {
      const providerList = Object.entries(providers).map(([id, config]) => ({
        value: id,
        label: formatProviderLabel(id),
      }))
      setModelProviders(providerList)

      const optionsMap = { '': [{ value: '', label: '使用默认' }] }
      for (const [providerId, config] of Object.entries(providers)) {
        const modelList = config.models.map(m => ({
          value: m.id,
          label: m.name,
        }))
        optionsMap[providerId] = [{ value: '', label: '使用默认' }, ...modelList]
      }
      setModelOptions(optionsMap)
    }).catch(err => {
      console.error('Failed to load model providers:', err)
    })
  }, [])

  // Populate form when editing existing agent
  useEffect(() => {
    if (editAgent) {
      setForm(prev => ({
        ...prev,
        name: editAgent.name || '',
        soul_prompt: editAgent.soul_prompt || editAgent.system_prompt || '',
        style_tags: Array.isArray(editAgent.style_tags)
          ? editAgent.style_tags.join(', ')
          : (editAgent.style_tags || ''),
        memory_max_turns: editAgent.memory_max_turns || editAgent.max_turns || 30,
        model_provider: editAgent.model_provider || '',
        model_name: editAgent.model_name || '',
      }))
    }
  }, [editAgent])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Reset model_name when provider changes
    if (field === 'model_provider') {
      setForm(prev => ({ ...prev, model_name: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      alert('请输入 Agent 名称')
      return
    }
    if (!form.soul_prompt.trim()) {
      alert('请输入系统提示词（Soul）')
      return
    }

    setSaving(true)
    setError(null)

    const data = {
      name: form.name.trim(),
      soul_prompt: form.soul_prompt.trim(),
      style_tags: form.style_tags.trim() 
        ? form.style_tags.split(',').map(s => s.trim()).filter(Boolean)
        : undefined,
      memory_max_turns: form.memory_max_turns || undefined,
      model_provider: form.model_provider || undefined,
      model_name: form.model_name || undefined,
    }

    try {
      if (isEdit) {
        await updatePencilAgentAPI(gatewayAgentId(editAgent), data)
      } else {
        await createPencilAgentAPI(data)
      }
      onSuccess?.()
      onNavigate('my-agents')
    } catch (err) {
      setError(userFacing(err))
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    onNavigate('my-agents')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="text-slate-500 hover:text-slate-700"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-slate-800">
          {isEdit ? '编辑 Agent' : '创建新 Agent'}
        </h1>
      </div>

      {/* Soul modification warning (edit mode only) */}
      {isEdit && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-6 text-sm">
          <p className="font-medium mb-1">⚠️ 修改 Soul 后注意事项</p>
          <p>修改 Soul 后，<strong>新建对话</strong>才会使用新的 Soul，正在进行中的对话仍是旧人格。</p>
          <p className="mt-1">想立刻全部生效？打开一段老对话点击「新建对话」按钮。</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Agent 名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="给我的写作助手取个名字"
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        {/* Soul / System Prompt */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Soul / 系统提示词 <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-2">
            这是 Agent 的「灵魂」——定义它的性格、能力范围、回复风格
          </p>
          <textarea
            value={form.soul_prompt}
            onChange={(e) => handleChange('soul_prompt', e.target.value)}
            placeholder={SOUL_PLACEHOLDER}
            rows={12}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            required
          />
        </div>

        {/* Style Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            风格标签 <span className="text-slate-400">(可选)</span>
          </label>
          <input
            type="text"
            value={form.style_tags}
            onChange={(e) => handleChange('style_tags', e.target.value)}
            placeholder="幽默, 犀利, 专业, 简洁 (逗号分隔)"
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Memory Max Turns */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            记忆轮数 <span className="text-slate-400">(可选)</span>
          </label>
          <p className="text-xs text-slate-500 mb-2">
            对话中保留的最近 N 轮上下文，默认 30，范围 5-100
          </p>
          <input
            type="number"
            min={5}
            max={100}
            value={form.memory_max_turns}
            onChange={(e) => handleChange('memory_max_turns', parseInt(e.target.value) || 30)}
            className="w-32 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Model Provider / Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              模型提供商 <span className="text-slate-400">(可选)</span>
            </label>
            <select
              value={form.model_provider}
              onChange={(e) => handleChange('model_provider', e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">使用默认</option>
              {modelProviders.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              模型名称 <span className="text-slate-400">(可选)</span>
            </label>
            <select
              value={form.model_name}
              onChange={(e) => handleChange('model_name', e.target.value)}
              disabled={!form.model_provider || modelOptions.length === 0}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">使用默认</option>
              {(modelOptions[form.model_provider] || []).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? '保存中...' : (isEdit ? '保存修改' : '创建 Agent')}
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}