/**
 * [WHO]: Provides independent public Catea website, pricing, privacy, terms, and acceptable-use pages
 * [FROM]: Depends on React only; rendered by App.jsx before authenticated product routes
 * [TO]: Consumed by App.jsx for public routes /, /privacy, /terms, /acceptable-use
 * [HERE]: packages/web/src/pages/PublicSite.jsx - Public Catea product website for catea.pencil.chat
 */

import { useEffect, useState } from 'react'

const LAST_UPDATED = 'October 1, 2026'
const SUPPORT_EMAIL = 'hdu111111@gmail.com'
const OBSIDIAN_PLUGIN_URL = 'https://community.obsidian.md/plugins/catea-paper'

const copy = {
  en: {
    lang: '中文',
    nav: { features: 'Features', pricing: 'Pricing', philosophy: 'Philosophy', get: 'Get Catea' },
    hero: {
      eyebrow: 'Catea for Obsidian',
      titleHello: 'Hello,',
      titleName: 'Catea.',
      lead: 'Make Your Knowledge Think',
      primary: 'Get Catea',
      secondary: 'View in Obsidian',
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
      ['Free', 'Bring your own API key', '', '$0', '', 'For users who already have a model provider.', ['Use your own API key', 'Models and keys stay on this device', 'Basic agent and note workflows'], 'Current default plan', OBSIDIAN_PLUGIN_URL],
      ['Pro', 'Limited-time offer', '$10', '$3', '/ month', 'Ready out of the box. No API key setup required.', ['Includes Catea-hosted AI usage', 'More usage for long documents and agent workflows', 'Allowance restores automatically and resets monthly', 'Priority access to advanced features: connectors, custom personas, and media generation'], 'Subscribe to Pro', '#pricing'],
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
      support: 'Support',
      email: 'Email',
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
      eyebrow: 'Catea for Obsidian',
      titleHello: 'Hello,',
      titleName: 'Catea.',
      lead: 'Make Your Knowledge Think',
      primary: 'Get Catea',
      secondary: 'View in Obsidian',
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
      ['Free', '自备 API Key', '', '$0', '', '适合已有模型服务的用户。', ['使用你自己的 API Key', '模型和密钥仍保存在本机', '基础 Agent 和笔记工作流'], '当前默认套餐', OBSIDIAN_PLUGIN_URL],
      ['Pro', '限时折扣', '$10', '$3', '/ month', '开箱即用，无需配置 API Key。', ['包含 Catea 托管 AI 额度', '更多用量，适合长文档和 Agent 工作流', '额度自动恢复，月度周期重置', '高级功能优先开放：连接器、自定义 Persona、媒体生成'], '订阅 Pro', '#pricing'],
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
      support: '客服支持',
      email: '邮箱',
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
    [
      '1. Information we collect',
      [
        'Email address used to check subscription status, provide customer support, or respond to privacy and billing requests.',
        'Subscription metadata such as plan, payment status, renewal period, customer email, and payment provider event IDs.',
        'Hosted-model usage counters used to enforce Catea Pro quotas and prevent abuse.',
        'Technical logs such as request time, API route, status code, and error information used for security, fraud prevention, and debugging.',
        'Support messages and any information you voluntarily send to us.',
      ],
    ],
    [
      '2. How we use information',
      [
        'We use information to provide Catea Pro, verify entitlement, route hosted model requests, enforce quota, prevent abuse, debug service errors, process billing, and answer support, privacy, or safety requests.',
        'We do not sell personal data. Payment card details are handled by Waffo Pancake and are not stored on Catea servers.',
      ],
    ],
    [
      '3. Sharing and retention',
      [
        'Payment-related information is shared with payment processors only as needed for billing, subscription management, refunds, fraud prevention, and dispute handling.',
        'Subscription records are retained while the subscription is active and for a reasonable period afterwards for tax, fraud-prevention, audit, and dispute purposes.',
        'Technical logs are retained only as long as reasonably needed for security, debugging, quota enforcement, or legal compliance.',
      ],
    ],
    [
      '4. Data rights',
      [
        `You may request access to, correction of, export of, or deletion of your personal data by emailing ${SUPPORT_EMAIL}. Please include the email address used for your subscription so we can locate the record.`,
        'You may also request account closure or cancellation of Catea Pro. If your account is closed, hosted entitlement and related service records will be disabled or deleted unless retention is required for legal, tax, security, fraud-prevention, or dispute reasons.',
        'We will acknowledge privacy and data-rights requests within 5 business days and aim to complete valid requests within 30 days. If additional verification or time is required, we will explain the reason and expected timeline.',
        'Some data may be retained where necessary to comply with law, resolve disputes, enforce agreements, maintain security, prevent fraud or abuse, or keep required payment and tax records.',
      ],
    ],
  ],
  terms: [
    [
      '1. Service',
      [
        'Catea is a desktop Obsidian plugin for knowledge work. Catea Pro is a monthly digital subscription that unlocks hosted model access in the plugin for eligible users.',
        'The service is a digital and intangible software service. Access is delivered after payment confirmation by refreshing plan status in the plugin.',
        'Catea uses third-party infrastructure and AI model providers to provide hosted model access. Availability and output quality may depend on those providers.',
      ],
    ],
    [
      '2. Billing, cancellation, and refunds',
      [
        'Payment is processed by Waffo Pancake. Prices are shown at checkout before payment. Catea Pro is currently offered as a monthly subscription.',
        `Users may request cancellation or billing help by contacting ${SUPPORT_EMAIL}. Cancellation stops future renewal, but access may remain available until the end of the current paid period unless otherwise required by law.`,
        'Refund review is available within 7 days when the paid service cannot be accessed after successful payment, duplicate charges occur, or required by applicable law. We may decline refunds for abusive, fraudulent, or already-consumed service usage.',
      ],
    ],
    [
      '3. Product use rules',
      [
        'You may use Catea for lawful personal and professional knowledge work, writing, research, note organization, and productivity inside Obsidian.',
        'You are responsible for the content you submit, the notes you ask Catea to process, and any decisions you make based on AI output.',
        'You must not use Catea to generate or facilitate illegal, defamatory, harassing, fraudulent, hateful, sexually exploitative, child-safety-violating, violent, malware-related, phishing, privacy-invasive, or intellectual-property-infringing content.',
        'You must not attempt to bypass security controls, abuse hosted quota, resell access, scrape the service at scale, interfere with service operation, or use Catea to train or benchmark competing AI systems without permission.',
      ],
    ],
    [
      '4. AI content disclaimer',
      [
        'Catea provides AI-generated assistance. AI output may be inaccurate, incomplete, outdated, or unsuitable for your use case.',
        'Catea does not provide legal, medical, financial, safety, or other professional advice. You should verify important information with qualified professionals before relying on it.',
        'You retain responsibility for reviewing proposed note edits, generated content, tool actions, and any changes made to your vault.',
      ],
    ],
    [
      '5. Disclaimer and limitation of liability',
      [
        'The service is provided “as is” and “as available” without warranties of uninterrupted availability, error-free operation, fitness for a particular purpose, or accuracy of AI output.',
        'To the maximum extent permitted by law, Catea will not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages, lost profits, lost data, business interruption, or decisions made based on AI-generated output.',
        'To the maximum extent permitted by law, our total liability for any claim relating to Catea is limited to the amount you paid for Catea Pro during the 12 months before the event giving rise to the claim.',
      ],
    ],
    [
      '6. Termination and user breach',
      [
        'We may suspend or terminate access, revoke hosted-model entitlement, block abusive traffic, or cancel a subscription if you violate these terms, the acceptable-use policy, payment rules, security requirements, or applicable law.',
        'If access is terminated because of fraud, abuse, chargeback abuse, unlawful conduct, or serious policy violation, you may lose access to hosted features and may not be eligible for a refund.',
        'You may stop using Catea at any time. Requests about cancellation, account closure, or data deletion can be sent to the support email listed in the site footer.',
      ],
    ],
  ],
  aup: [
    ['1. Prohibited content and conduct', ['Sexual or pornographic content, child-safety violations, graphic violence, hate, non-consensual deepfakes, impersonation, fraud, credential theft, and intellectual-property abuse are prohibited.']],
    ['2. Hosted-model safety checks', ['Catea Pro hosted-model requests may be checked by automated content-safety systems before generation. Requests that are blocked or require review will not be sent to the hosted model.']],
    ['3. Enforcement', ['We may restrict access, revoke hosted-model entitlement, or terminate a subscription when this policy is violated. Severe safety issues may be reported to appropriate authorities or service providers.']],
    ['4. AI disclosure', ['Catea provides AI-generated assistance. Users are responsible for reviewing outputs and avoiding high-risk reliance on unverified AI responses.']],
  ],
}

function getInitialLang() {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem('catea-site-lang')
  if (stored === 'en' || stored === 'zh') return stored
  return 'en'
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
            <span>{t.hero.titleHello}</span>
            <span>
              {t.hero.titleName}
              <img className="catea-hero-cat" src="/cat-welcome.png" alt="" />
            </span>
          </h1>
          <p className="catea-yolo-lead">{t.hero.lead}</p>
          <div className="catea-yolo-cta">
            <a className="primary" href="#pricing">{t.hero.primary}</a>
            <a href={OBSIDIAN_PLUGIN_URL} target="_blank" rel="noreferrer">{t.hero.secondary}</a>
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
            {t.plans.map(([name, badge, original, sale, suffix, description, items, action, href], index) => (
              <article key={name} className={index === 1 ? 'catea-yolo-plan featured' : 'catea-yolo-plan'}>
                {index === 1 && <em>Most Popular</em>}
                <div className="topline"><h3>{name}</h3><small>{badge}</small></div>
                <div className="catea-site-plan-price">
                  {original && <del>{original}</del>}
                  <strong>{sale}</strong>
                  {suffix && <span>{suffix}</span>}
                </div>
                <p>{description}</p>
                <ul>{items.map(item => <li key={item}>— {item}</li>)}</ul>
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{action}</a>
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
      <div className="catea-yolo-window catea-ob-window">
        <div className="catea-yolo-titlebar">
          <i /><i /><i />
          <span>{t.title} · knowledge-base</span>
        </div>
        <aside className="catea-ob-sidebar">
          <div className="catea-ob-vault">
            <span className="catea-ob-vault-mark">C</span>
            <div>
              <strong>{t.vault}</strong>
              <small>Obsidian vault</small>
            </div>
          </div>
          <nav aria-label="Vault navigation">
            <a className="is-active" href="#features">⌘ Daily note</a>
            <a href="#features">◌ Research map</a>
            <a href="#features">◇ Reading queue</a>
            <a href="#features">✦ Catea memory</a>
          </nav>
          <div className="catea-ob-files">
            <b>Files</b>
            <p>▾ 00 Inbox</p>
            <p>▾ 10 Notes</p>
            <p className="is-selected">— {t.noteTitle}.md</p>
            <p>— ai-memory.md</p>
            <p>▸ .catea</p>
          </div>
        </aside>
        <article className="catea-ob-note">
          <div className="catea-ob-tabs">
            <span>{t.noteTitle}.md</span>
            <span>ai-memory.md</span>
          </div>
          <div className="catea-ob-paper">
            <p className="catea-ob-breadcrumb">Knowledge base / Catea</p>
            <h3>{t.noteTitle}</h3>
            <blockquote>{t.quote}</blockquote>
            <p>Three focus areas this quarter:</p>
            <ul>{t.bullets.map(item => <li key={item}>{item}</li>)}</ul>
            <p>{t.related}</p>
          </div>
        </article>
        <section className="catea-ob-agent">
          <header className="catea-ob-agent-header">
            <button type="button" aria-label="Session history">⌘</button>
            <strong>Catea</strong>
            <span>Catea Pro</span>
            <button type="button" aria-label="Settings">⚙</button>
          </header>
          <div className="catea-ob-agent-body">
            <aside className="catea-ob-history">
              <h4>Recent chats</h4>
              <p className="is-current">Knowledge threads</p>
              <p>Draft launch note</p>
              <p>Reading queue</p>
            </aside>
            <main className="catea-ob-chat">
              <div className="catea-ob-cat" aria-hidden="true">
                <img src="/cat-welcome.png" alt="" />
              </div>
              <div className="catea-ob-composer">
                <p>{t.question}</p>
                <div>
                  <span>Vault</span>
                  <span>Memory</span>
                  <button type="button" aria-label="Send">↑</button>
                </div>
              </div>
            </main>
          </div>
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
        <nav>
          <h3>{t.footer.support}</h3>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{t.footer.email}: {SUPPORT_EMAIL}</a>
        </nav>
      </div>
    </footer>
  )
}
