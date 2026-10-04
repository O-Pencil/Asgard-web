/**
 * [WHO]: Provides Landing component for the public Catea website
 * [FROM]: Depends on React JSX runtime only
 * [TO]: Consumed by App.jsx for the public root route
 * [HERE]: packages/web/src/Landing.jsx - Public bilingual landing page for Catea plans and product positioning
 */

const features = [
  {
    title: 'Local-first Obsidian agent',
    zh: '本地优先的 Obsidian Agent',
    body: 'Catea works inside your vault, reads your notes when you ask, and keeps everyday writing and research close to your workspace.',
    bodyZh: 'Catea 在你的 Obsidian 里运行，按需读取笔记，把写作、检索和 Agent 工作流留在同一个工作区。',
  },
  {
    title: 'Free BYOK, Pro hosted AI',
    zh: 'Free 自备 Key，Pro 托管模型',
    body: 'Start free with your own API key. Upgrade to Pro when you want a ready-to-use hosted model allowance managed by Catea.',
    bodyZh: '免费版使用你自己的 API Key。升级 Pro 后，可以直接使用 Catea 托管的模型额度。',
  },
  {
    title: 'Built for long notes',
    zh: '面向长文档和知识库',
    body: 'The agent is designed for vault editing, citations, memory, personas, and upcoming connector workflows.',
    bodyZh: '围绕笔记编辑、引用、记忆、Persona，以及后续连接器工作流设计。',
  },
]

const roadmap = ['Connectors', 'Custom personas', 'Team plans']

const creditPacks = [
  { credits: '20,000', usd: '$3', cny: '¥18', label: 'Small top-up' },
  { credits: '50,000', usd: '$6', cny: '¥36', label: 'More room' },
  { credits: '100,000', usd: '$9.9', cny: '¥60', label: 'Best one-time value' },
]

const usageRules = [
  '1 model token uses 1 credit.',
  'Pro includes 100,000 hosted AI credits every month.',
  'A 20,000-credit short window resets every 5 hours to keep service stable.',
  'When monthly credits run out, hosted AI pauses until renewal or extra credits are added.',
]

function Landing() {
  return (
    <main className="catea-site">
      <section className="catea-hero">
        <nav className="catea-nav" aria-label="Main navigation">
          <a className="catea-logo" href="/">
            Catea
          </a>
          <div className="catea-nav__links">
            <a href="#plans">Plans</a>
            <a href="#privacy">Privacy</a>
            <a href="/app">Asgard Console</a>
          </div>
        </nav>

        <div className="catea-hero__grid">
          <div>
            <p className="catea-pill">Obsidian AI agent · SaaS Pro plan</p>
            <h1>Use an AI writing agent in Obsidian, without leaving your vault.</h1>
            <p className="catea-hero__lead">
              Catea gives Obsidian a paper-style workspace and a local-first agent. Use Free
              with your own API key, or choose Pro for hosted AI usage managed by Catea.
            </p>
            <p className="catea-hero__lead catea-hero__lead--zh">
              Catea 为 Obsidian 提供纸张风格工作区和本地优先 Agent。Free 使用自备 API
              Key，Pro 提供开箱即用的托管模型额度。
            </p>
            <div className="catea-actions">
              <a className="catea-button catea-button--primary" href="#plans">
                View plans
              </a>
              <a className="catea-button" href="mailto:support@pencil.chat">
                Contact support
              </a>
            </div>
          </div>

          <div className="catea-preview" aria-label="Catea product preview">
            <div className="catea-preview__bar">
              <span />
              <span />
              <span />
            </div>
            <div className="catea-preview__paper">
              <p className="catea-preview__label">Catea Agent</p>
              <h2>“Summarize this research note and draft next steps.”</h2>
              <div className="catea-preview__reply">
                <p>✓ Read linked notes</p>
                <p>✓ Draft structured answer</p>
                <p>✓ Save follow-up tasks in the vault</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="catea-section">
        <div className="catea-section__intro">
          <p className="catea-eyebrow">Why Catea</p>
          <h2>Private by default, simple when you need hosted AI.</h2>
        </div>
        <div className="catea-feature-grid">
          {features.map((feature) => (
            <article className="catea-feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p className="catea-feature-card__zh">{feature.zh}</p>
              <p>{feature.body}</p>
              <p>{feature.bodyZh}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="catea-section" id="plans">
        <div className="catea-section__intro">
          <p className="catea-eyebrow">Plans</p>
          <h2>Start free. Upgrade when you want Catea-hosted usage.</h2>
          <p>Every paid option shows the credits, reset rules, and renewal behavior before checkout.</p>
          <p>付款前即可看到额度数量、扣费规则、重置窗口和用尽后的处理方式。</p>
        </div>

        <div className="catea-plan-grid">
          <article className="catea-plan-card">
            <p className="catea-plan-card__eyebrow">Free</p>
            <h3>$0</h3>
            <p>Bring your own API key. Catea keeps the agent workflow inside Obsidian.</p>
            <ul>
              <li>BYOK model configuration</li>
              <li>Local vault workflows</li>
              <li>Basic agent and note editing</li>
              <li>No Catea-hosted model credits included</li>
            </ul>
            <a className="catea-button" href="mailto:support@pencil.chat">
              Get started
            </a>
          </article>

          <article className="catea-plan-card catea-plan-card--pro">
            <p className="catea-plan-card__eyebrow">Limited-time offer</p>
            <h3>
              <span className="catea-price-old">$30</span>
              $9.9 <small>/ month</small>
            </h3>
            <p>Ready-to-use hosted AI usage. No API key setup required.</p>
            <ul>
              <li>100,000 Catea-hosted AI credits every month</li>
              <li>1 model token uses 1 credit</li>
              <li>20,000-credit short window resets every 5 hours</li>
              <li>Monthly subscription renews automatically until canceled</li>
              <li>Priority access to connectors and custom personas</li>
            </ul>
            <a className="catea-button catea-button--primary" href="mailto:support@pencil.chat">
              Subscribe in the plugin
            </a>
            <p className="catea-plan-card__muted">
              CNY: <span className="catea-price-old">¥180</span> ¥60 / 月 · 国内支付待开放
            </p>
          </article>
        </div>

        <div className="catea-credit-panel">
          <div className="catea-credit-panel__intro">
            <p className="catea-eyebrow">Extra credits</p>
            <h3>One-time credits when you need more room.</h3>
            <p>Credits packs do not renew automatically. They add hosted AI credits to your account and are used after the monthly Pro allowance is exhausted.</p>
            <p>一次性 credits 包不会自动续费；付款后增加到账号中，用于补充 Pro 月度额度。</p>
          </div>
          <div className="catea-credit-grid">
            {creditPacks.map((pack) => (
              <article className="catea-credit-card" key={pack.credits}>
                <p>{pack.label}</p>
                <h4>{pack.credits} credits</h4>
                <strong>{pack.usd}</strong>
                <span>{pack.cny} · CNY</span>
              </article>
            ))}
          </div>
        </div>

        <div className="catea-usage-rules" aria-label="Hosted AI usage rules">
          {usageRules.map((rule) => (
            <p key={rule}>{rule}</p>
          ))}
        </div>
      </section>

      <section className="catea-section catea-section--split" id="privacy">
        <article>
          <p className="catea-eyebrow">Privacy</p>
          <h2>Your vault remains yours.</h2>
          <p>
            Catea is designed as a desktop Obsidian plugin. Free usage sends model requests
            directly to the provider you configure. Pro sends only the prompts needed to serve
            hosted AI usage.
          </p>
        </article>
        <article>
          <p className="catea-eyebrow">Billing</p>
          <h2>Monthly subscription plus optional credits.</h2>
          <p>
            Pro renews monthly. Credits packs are one-time purchases and do not renew automatically. Refund and
            account support are handled by email at support@pencil.chat.
          </p>
        </article>
      </section>

      <section className="catea-section catea-section--roadmap">
        <p className="catea-eyebrow">Coming later</p>
        <div className="catea-roadmap">
          {roadmap.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Landing
