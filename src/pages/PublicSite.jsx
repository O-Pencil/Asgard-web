/**
 * [WHO]: Provides independent public Catea website, pricing, privacy, terms, and acceptable-use pages
 * [FROM]: Depends on React only; rendered by App.jsx before authenticated product routes
 * [TO]: Consumed by App.jsx for public routes /, /privacy, /terms, /acceptable-use
 * [HERE]: packages/web/src/pages/PublicSite.jsx - Public Catea product website for catea.pencil.chat
 */

import { useEffect, useState } from 'react'

const LAST_UPDATED = 'October 1, 2026'

const copy = {
  en: {
    lang: '中文',
    nav: { features: 'Features', pricing: 'Pricing', philosophy: 'Philosophy', get: 'Get Catea' },
    hero: {
      eyebrow: 'For Obsidian · Knowledge-first AI',
      titleTop: 'Make your knowledge',
      titleBottom: 'think.',
      lead: "The AI workspace for Obsidian knowledge bases — and everything you'll do with them.",
      primary: 'See plans',
      secondary: 'Features',
    },
    mock: {
      title: 'obsidian — vault/knowledge-base',
      vault: 'knowledge-base',
      noteTitle: 'Knowledge OS — research threads',
      quote: 'Bring AI into your knowledge base — not the other way around.',
      bullets: ['Durable context', 'Linked reasoning', 'Reviewable AI actions'],
      related: 'Related: [[ai-memory]]、[[project-catea]]',
      question: 'Based on my vault, what should I focus on next?',
      answer: 'Scanned your notes. Main threads: durable context, linked reasoning, reviewable AI actions.',
    },
    featuresTitle: 'One plugin, built around your knowledge base.',
    features: [
      ['01 / KNOWLEDGE WORKSPACE', 'Knowledge-first workspace', 'Catea is not a detached chatbot. It works around your vault, notes, links, sessions, and long-lived context.'],
      ['02 / VAULT CHAT', 'Chat with your vault', 'Ask across related notes, keep context traceable, and use your own knowledge as the ground for every answer.'],
      ['03 / NOTE ACTIONS', 'Act on notes, with review', 'Draft, rewrite, create, and organize Markdown notes. Important vault changes stay reviewable before they land.'],
      ['04 / MODEL CHOICE', 'BYOK or Catea Pro', 'Use your own API key on Free, or activate Catea Pro for hosted model access and managed usage inside the plugin.'],
    ],
    philosophyTitle: 'Bring AI into your knowledge base — not your knowledge into another app.',
    philosophyBody:
      'Your notes are the system of record. Catea keeps the workspace centered on Obsidian, so AI becomes a way to understand and shape your knowledge rather than a place where your knowledge disappears.',
    pricingTitle: 'Start with your own model. Upgrade when you want it ready-made.',
    pricingSub: 'Use your own key for free, or subscribe to Catea Pro for hosted model access.',
    plans: [
      ['Free', 'Forever', '$0', 'For users who want full control over their own model setup.', ['Base Catea workspace', 'Bring your own model API key', 'Vault-local sessions and memory', 'No hosted model included'], 'Install in Obsidian'],
      ['Catea Pro', 'Subscription', '$3 / month', 'Hosted model access and managed monthly usage inside Catea.', ['Everything in Free', 'Hosted model access', 'Monthly managed usage', 'Future premium knowledge features'], 'Subscribe to Pro'],
    ],
    ready: ['Ready to think', 'Give your vault a mind.', 'See plans'],
    footer: {
      tagline: 'Make your knowledge think.',
      made: 'Made for Obsidian knowledge bases.',
      product: 'Product',
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms',
      aup: 'Acceptable Use',
    },
    policies: {
      privacy: {
        title: 'Privacy Policy',
        intro: 'This policy explains what Catea collects, why we collect it, and how customers can contact us.',
      },
      terms: {
        title: 'Terms & Refund Policy',
        intro: 'These terms describe the Catea Pro subscription, delivery, cancellation, and refund rules.',
      },
      aup: {
        title: 'AI Acceptable Use Policy',
        intro: 'Catea is intended for lawful personal and professional writing, research, and knowledge-work use inside Obsidian.',
      },
    },
  },
  zh: {
    lang: 'EN',
    nav: { features: '功能', pricing: '价格', philosophy: '理念', get: 'Get Catea' },
    hero: {
      eyebrow: 'For Obsidian · Knowledge-first AI',
      titleTop: 'Make your knowledge',
      titleBottom: 'think.',
      lead: '为 Obsidian 知识库打造的 AI 工作区，以及你接下来会用它完成的一切。',
      primary: '查看套餐',
      secondary: '功能介绍',
    },
    mock: {
      title: 'obsidian — vault/knowledge-base',
      vault: 'knowledge-base',
      noteTitle: 'Knowledge OS — research threads',
      quote: '把 AI 带进你的知识库，而不是把知识搬到另一个应用。',
      bullets: ['持久上下文', '链接式推理', '可审阅的 AI 行动'],
      related: 'Related: [[ai-memory]]、[[project-catea]]',
      question: '基于我的知识库，下一步最应该关注什么？',
      answer: '已扫描相关笔记。主要线索：持久上下文、链接式推理、可审阅的 AI 行动。',
    },
    featuresTitle: '一个围绕知识库打造的插件。',
    features: [
      ['01 / KNOWLEDGE WORKSPACE', '知识优先的工作区', 'Catea 不是孤立聊天框。它围绕你的 vault、笔记、链接、会话和长期上下文工作。'],
      ['02 / VAULT CHAT', '和你的知识库对话', '跨相关笔记提问，让上下文可追溯，并把你已有的知识作为回答的基础。'],
      ['03 / NOTE ACTIONS', '让 AI 参与整理和写作', '草拟、改写、创建和整理 Markdown 笔记。重要修改都保留可审阅步骤。'],
      ['04 / MODEL CHOICE', 'BYOK 或 Catea Pro', '免费版使用自己的 API Key；Pro 版直接启用 Catea 托管模型和额度管理。'],
    ],
    philosophyTitle: '把 AI 带进你的知识库，而不是把知识搬到另一个应用。',
    philosophyBody: '你的笔记才是系统中心。Catea 让工作区继续围绕 Obsidian 展开，让 AI 成为理解和塑造知识的方式，而不是吞掉知识的地方。',
    pricingTitle: '先用自己的模型开始，需要开箱即用时再升级。',
    pricingSub: '免费版使用自己的 Key；Catea Pro 提供托管模型和月度额度。',
    plans: [
      ['Free', 'Forever', '$0', '适合想完全控制模型配置的用户。', ['基础 Catea 工作区', '配置自己的模型 API Key', 'vault 本地会话与记忆', '不包含托管模型'], '在 Obsidian 中安装'],
      ['Catea Pro', 'Subscription', '$3 / month', '在 Catea 中使用托管模型和月度额度。', ['包含 Free 的全部能力', '托管模型访问', '月度托管用量', '未来高级知识功能'], '订阅 Pro'],
    ],
    ready: ['Ready to think', 'Give your vault a mind.', '查看套餐'],
    footer: {
      tagline: 'Make your knowledge think.',
      made: 'Made for Obsidian knowledge bases.',
      product: '产品',
      legal: '法律',
      privacy: '隐私',
      terms: '条款',
      aup: 'AI 使用规范',
    },
    policies: {
      privacy: { title: '隐私政策', intro: '本政策说明 Catea 会收集哪些信息、收集原因，以及用户如何联系我们。' },
      terms: { title: '服务条款与退款政策', intro: '本条款说明 Catea Pro 订阅、交付、取消和退款规则。' },
      aup: { title: 'AI 可接受使用政策', intro: 'Catea 面向 Obsidian 内合法的个人和专业写作、研究、知识工作场景。' },
    },
  },
}

const policySections = {
  privacy: [
    ['1. Information we collect', ['Email used to check subscription status or support requests.', 'Subscription metadata such as plan, payment status, renewal period, and provider event IDs.', 'Hosted-model usage counters used to enforce Catea Pro quotas.', 'Technical logs for security and debugging.']],
    ['2. How we use information', ['Provide Catea Pro, verify entitlement, prevent abuse, enforce quota, debug service errors, and answer support or privacy requests.']],
    ['3. Sharing and retention', ['Payment-related information is shared with payment processors only as needed for billing. Subscription records are retained while active and for a reasonable period for tax, fraud-prevention, audit, and dispute purposes.']],
  ],
  terms: [
    ['1. Service', ['Catea is a desktop Obsidian plugin. Catea Pro is a monthly digital subscription that unlocks hosted model access in the plugin for eligible users.']],
    ['2. Billing and delivery', ['Payment is processed by Waffo Pancake. After successful payment confirmation, users can refresh plan status inside the plugin and use the Catea hosted model route.']],
    ['3. Cancellation and refunds', ['Refund review is available within 7 days when the paid service cannot be accessed after successful payment, duplicate charges occur, or required by applicable law.']],
  ],
  aup: [
    ['1. Prohibited content and conduct', ['Sexual or pornographic content, child-safety violations, graphic violence, hate, non-consensual deepfakes, impersonation, fraud, credential theft, and intellectual-property abuse are prohibited.']],
    ['2. Enforcement', ['We may restrict access, revoke hosted-model entitlement, or terminate a subscription when this policy is violated. Severe safety issues may be reported to appropriate authorities or service providers.']],
    ['3. AI disclosure', ['Catea provides AI-generated assistance. Users are responsible for reviewing outputs and avoiding high-risk reliance on unverified AI responses.']],
  ],
}

function getInitialLang() {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem('catea-site-lang')
  if (stored === 'en' || stored === 'zh') return stored
  return window.navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export default function PublicSite({ route = '/' }) {
  const [lang, setLang] = useState(getInitialLang)
  const t = copy[lang]

  useEffect(() => {
    window.localStorage.setItem('catea-site-lang', lang)
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])

  const policyKey = route === '/privacy' ? 'privacy' : route === '/terms' ? 'terms' : route === '/acceptable-use' ? 'aup' : null

  return (
    <div className="catea-public">
      <Header t={t} lang={lang} setLang={setLang} />
      {policyKey ? <PolicyPage t={t} type={policyKey} /> : <Home t={t} />}
      <Footer t={t} />
    </div>
  )
}

function Header({ t, lang, setLang }) {
  return (
    <header className="catea-public-header">
      <div className="catea-public-header-inner">
        <a className="catea-public-brand" href="/">
          <span>C</span>
          <strong>Catea</strong>
          <small>v1.0</small>
        </a>
        <nav className="catea-public-nav">
          <a href="/#features">{t.nav.features}</a>
          <a href="/#pricing">{t.nav.pricing}</a>
          <a href="/#philosophy">{t.nav.philosophy}</a>
        </nav>
        <div className="catea-public-actions">
          <button type="button" onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}>
            {t.lang}
          </button>
          <a href="/#pricing">{t.nav.get}</a>
        </div>
      </div>
    </header>
  )
}

function Home({ t }) {
  return (
    <main>
      <section className="catea-yolo-hero">
        <div className="catea-yolo-container">
          <p className="catea-yolo-eyebrow">{t.hero.eyebrow}</p>
          <h1>
            <span>{t.hero.titleTop}</span>
            <span>{t.hero.titleBottom}</span>
          </h1>
          <p className="catea-yolo-lead">{t.hero.lead}</p>
          <div className="catea-yolo-cta">
            <a className="primary" href="#pricing">{t.hero.primary}</a>
            <a href="#features">{t.hero.secondary}</a>
          </div>
          <ProductMock t={t.mock} />
        </div>
      </section>

      <section id="features" className="catea-yolo-section">
        <div className="catea-yolo-container">
          <p className="catea-yolo-kicker">Features</p>
          <h2>{t.featuresTitle}</h2>
          <div className="catea-yolo-feature-grid">
            {t.features.map(([eyebrow, title, body]) => (
              <article key={title} className="catea-yolo-card">
                <p>{eyebrow}</p>
                <h3>{title}</h3>
                <span>{body}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="philosophy" className="catea-yolo-band">
        <div className="catea-yolo-container catea-yolo-split">
          <div>
            <p className="catea-yolo-kicker">Philosophy</p>
            <h2>{t.philosophyTitle}</h2>
          </div>
          <p>{t.philosophyBody}</p>
        </div>
      </section>

      <section id="pricing" className="catea-yolo-section catea-yolo-pricing">
        <div className="catea-yolo-container">
          <p className="catea-yolo-kicker">Pricing</p>
          <h2>{t.pricingTitle}</h2>
          <p className="catea-yolo-sub">{t.pricingSub}</p>
          <div className="catea-yolo-plan-grid">
            {t.plans.map(([name, badge, price, description, items, action], index) => (
              <article key={name} className={index === 1 ? 'catea-yolo-plan featured' : 'catea-yolo-plan'}>
                {index === 1 && <em>Most Popular</em>}
                <div className="topline"><h3>{name}</h3><small>{badge}</small></div>
                <strong>{price}</strong>
                <p>{description}</p>
                <ul>{items.map(item => <li key={item}>— {item}</li>)}</ul>
                <a href="#pricing">{action}</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="catea-yolo-ready">
        <div className="catea-yolo-container">
          <p className="catea-yolo-kicker">{t.ready[0]}</p>
          <h2>{t.ready[1]}</h2>
          <a href="#pricing">{t.ready[2]}</a>
        </div>
      </section>
    </main>
  )
}

function ProductMock({ t }) {
  return (
    <div className="catea-yolo-shot">
      <div className="catea-yolo-window">
        <div className="catea-yolo-titlebar">
          <i /><i /><i />
          <span>{t.title}</span>
        </div>
        <aside>
          <b>FILES</b>
          <p>▾ {t.vault}</p>
          <p>— index.md</p>
          <p>— ai-memory.md</p>
          <p>— project-catea.md</p>
        </aside>
        <article>
          <h3>{t.noteTitle}</h3>
          <blockquote>{t.quote}</blockquote>
          <p>Three focus areas this quarter:</p>
          <ul>{t.bullets.map(item => <li key={item}>— {item}</li>)}</ul>
          <p>{t.related}</p>
        </article>
        <section>
          <b>Catea · Agent</b>
          <div>{t.question}</div>
          <div><strong>AGENT · STREAMING</strong>{t.answer}</div>
        </section>
      </div>
    </div>
  )
}

function PolicyPage({ t, type }) {
  const page = t.policies[type]
  return (
    <main className="catea-policy-main">
      <section className="catea-yolo-container">
        <p className="catea-yolo-kicker">Last updated: {LAST_UPDATED}</p>
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
        <div className="catea-policy-card">
          {policySections[type].map(([title, items]) => (
            <section key={title}>
              <h2>{title}</h2>
              <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
            </section>
          ))}
        </div>
      </section>
    </main>
  )
}

function Footer({ t }) {
  return (
    <footer className="catea-public-footer">
      <div className="catea-yolo-container">
        <div>
          <a className="catea-public-brand" href="/"><span>C</span><strong>Catea</strong></a>
          <p>{t.footer.tagline}</p>
          <p>{t.footer.made}</p>
        </div>
        <nav>
          <h3>{t.footer.product}</h3>
          <a href="/#features">{t.nav.features}</a>
          <a href="/#pricing">{t.nav.pricing}</a>
          <a href="/#philosophy">{t.nav.philosophy}</a>
        </nav>
        <nav>
          <h3>{t.footer.legal}</h3>
          <a href="/privacy">{t.footer.privacy}</a>
          <a href="/terms">{t.footer.terms}</a>
          <a href="/acceptable-use">{t.footer.aup}</a>
        </nav>
      </div>
    </footer>
  )
}
