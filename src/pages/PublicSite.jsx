/**
 * [WHO]: Provides public Catea website, privacy policy, terms, refund, and AI acceptable-use pages
 * [FROM]: Depends on React, @radix-ui/themes; rendered by App.jsx before authenticated product routes
 * [TO]: Consumed by App.jsx for public routes /, /privacy, /terms, /acceptable-use
 * [HERE]: packages/web/src/pages/PublicSite.jsx - Public Catea product website and compliance pages for catea.pencil.chat
 */

import { useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Link,
  Section,
  Separator,
  Text,
  Theme,
} from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'

const SITE_URL = 'https://catea.pencil.chat'
const OFFICIAL_EMAIL = 'support@pencil.chat'
const SUPPORT_EMAIL = OFFICIAL_EMAIL
const PRIVACY_EMAIL = OFFICIAL_EMAIL
const SAFETY_EMAIL = OFFICIAL_EMAIL
const BILLING_EMAIL = OFFICIAL_EMAIL
const LAST_UPDATED = 'October 1, 2026'

const copy = {
  en: {
    langLabel: '中文',
    nav: {
      features: 'Features',
      philosophy: 'Philosophy',
      pricing: 'Pricing',
      get: 'Get Catea',
      privacy: 'Privacy',
      terms: 'Terms',
      aup: 'Acceptable Use',
    },
    footer: {
      title: 'Catea',
      body: 'A desktop AI workspace for Obsidian users. Catea Pro is delivered digitally through the Catea Obsidian plugin and the Catea hosted model service.',
      contact: 'Contact',
      legal: 'Legal',
      copy: 'Copy email',
      copied: 'Copied',
    },
    home: {
      eyebrow: 'For Obsidian · Knowledge-first AI',
      title: 'Make your knowledge think.',
      lead:
        'Catea is an AI workspace built for Obsidian knowledge bases — helping you read, connect, write, and act across your vault without moving your work into another app.',
      primary: 'See plans',
      secondary: 'Features',
      points: ['Built for knowledge bases', 'Obsidian-native workflow', 'BYOK or Catea Pro', 'Reviewable note actions'],
      mock: {
        vault: 'knowledge-vault',
        activeNote: 'knowledge-os.md',
        question: 'What is the strongest thread in my notes about knowledge work?',
        answer:
          'I found three recurring ideas: durable context, linked reasoning, and reviewable AI actions. Sources: [[ai-memory]], [[zettelkasten]], [[project-catea]].',
      },
      featuresKicker: 'Features',
      featuresTitle: 'One plugin, built around your knowledge base.',
      features: [
        {
          eyebrow: '01 / KNOWLEDGE WORKSPACE',
          title: 'Knowledge-first workspace',
          body: 'Catea is not a detached chatbot. It works around your vault, notes, links, sessions, and long-lived context.',
        },
        {
          eyebrow: '02 / VAULT CHAT',
          title: 'Chat with your vault',
          body: 'Ask across related notes, keep context traceable, and use your own knowledge as the ground for every answer.',
        },
        {
          eyebrow: '03 / NOTE ACTIONS',
          title: 'Act on notes, with review',
          body: 'Draft, rewrite, create, and organize Markdown notes. Important vault changes stay reviewable before they land.',
        },
        {
          eyebrow: '04 / MODEL CHOICE',
          title: 'BYOK or Catea Pro',
          body: 'Use your own API key on Free, or activate Catea Pro for hosted model access and managed usage inside the plugin.',
        },
      ],
      philosophyKicker: 'Philosophy',
      philosophyTitle: 'Bring AI into your knowledge base — not your knowledge into another app.',
      philosophyBody:
        'Your notes are the system of record. Catea keeps the workspace centered on Obsidian, so AI becomes a way to understand and shape your knowledge rather than a place where your knowledge disappears.',
      pricingKicker: 'Pricing',
      pricingTitle: 'Start with your own model. Upgrade when you want it ready-made.',
      plans: [
        {
          name: 'Free',
          price: '$0',
          description: 'For users who want full control over their own model setup.',
          items: ['Base Catea workspace', 'Bring your own model API key', 'Vault-local sessions and memory', 'No hosted model included'],
          action: 'Install in Obsidian',
        },
        {
          name: 'Catea Pro',
          price: '$3 / month',
          description: 'For users who want Catea to provide the model route and managed quota.',
          items: ['Everything in Free', 'Hosted model access', 'Monthly managed usage', 'Future premium knowledge features'],
          action: 'Subscribe to Pro',
          featured: true,
        },
      ],
      billingNote: 'Catea Pro is billed monthly. Payment details are handled by Waffo Pancake and are not stored on Catea servers.',
    },
    privacy: {
      title: 'Privacy Policy',
      intro: 'This policy explains what Catea collects, why we collect it, and how customers can contact us.',
      sections: [
        {
          title: '1. Controller and contact',
          body: [
            `Catea is operated as an independent software project. Website: ${SITE_URL}. Privacy requests can be sent to ${PRIVACY_EMAIL}. We have not appointed a formal data protection officer.`,
          ],
        },
        {
          title: '2. Information we collect',
          bullets: [
            'Email address used to check subscription status or receive customer support.',
            'Subscription and billing metadata: plan, payment status, renewal period, and provider event IDs.',
            'Hosted-model usage counters used to enforce monthly and short-window PRO quotas.',
            'Technical logs such as request time, API route, status code, and error information for security and debugging.',
            'Support messages you send to us by email.',
          ],
          body: [
            "The desktop Catea plugin stores vault sessions, memory, settings, and BYOK model configuration locally in the user's Obsidian environment. Payment card data is processed by Waffo Pancake and is not stored on our servers.",
          ],
        },
        {
          title: '3. How we use information',
          bullets: [
            'Provide the Catea Pro subscription and hosted model access.',
            'Verify entitlement, prevent abuse, enforce quota, and debug service errors.',
            'Answer support, billing, privacy, and safety requests.',
            'Comply with legal, security, and payment requirements.',
          ],
        },
        {
          title: '4. Sharing, retention, and rights',
          body: [
            'We share payment-related information with our payment processor only as needed to complete billing and subscription management. We may also use hosting, database, and email providers to operate the service.',
            'Subscription records are kept while the account is active and for a reasonable period afterwards for tax, fraud-prevention, audit, and dispute purposes. Logs are kept only as long as needed for security and debugging.',
            `You may request access, correction, deletion, or export by contacting ${PRIVACY_EMAIL}. Some records may be retained where required for legal, tax, security, or dispute reasons.`,
          ],
        },
      ],
    },
    terms: {
      title: 'Terms & Refund Policy',
      intro: 'These terms describe the Catea Pro subscription, delivery, cancellation, and refund rules.',
      sections: [
        {
          title: '1. Service',
          body: [
            'Catea is a desktop Obsidian plugin. Catea Pro is a monthly digital subscription that unlocks hosted model access in the plugin for eligible users.',
            'Catea does not provide professional legal, financial, medical, or safety advice. AI output may be incomplete or wrong and must be reviewed by the user.',
          ],
        },
        {
          title: '2. Billing and delivery',
          body: [
            'Payment is processed by Waffo Pancake. After successful payment confirmation, the user can refresh plan status inside the plugin and use the Catea hosted model route.',
            'Prices are shown at checkout before payment. Catea Pro is currently offered as a monthly subscription.',
          ],
        },
        {
          title: '3. Cancellation and refunds',
          body: [
            `Customers can request cancellation of future renewal by contacting ${BILLING_EMAIL}.`,
            'Refund review is available within 7 days when the paid service cannot be accessed after successful payment, duplicate charges occur for the same billing period, or required by applicable law. We may decline refunds for abusive, fraudulent, or already-consumed service usage.',
          ],
        },
        {
          title: '4. Suspension',
          body: ['We may suspend or terminate access for payment failure, fraud, security risk, or violation of the AI acceptable-use policy.'],
        },
      ],
    },
    aup: {
      title: 'AI Acceptable Use Policy',
      intro: 'Catea is intended for lawful personal and professional writing, research, and knowledge-work use inside Obsidian.',
      sections: [
        {
          title: '1. Prohibited content and conduct',
          bullets: [
            'Sexual or pornographic content, including sexual services or exploitation.',
            'Child sexual abuse material, grooming, or any child-safety violation. This is zero tolerance.',
            'Graphic violence, gore, terrorism support, weapon construction, or WMD assistance.',
            'Hate, harassment, threats, or content targeting protected characteristics.',
            'Non-consensual deepfakes, impersonation, fraud, credential theft, or deceptive automation.',
            'Intellectual-property abuse, including requests to reproduce copyrighted works beyond lawful limits.',
          ],
        },
        {
          title: '2. Enforcement',
          body: [
            'We may review reported abuse, restrict access, revoke hosted-model entitlement, or terminate a subscription when this policy is violated. Severe safety issues may be reported to appropriate authorities or service providers.',
            `Reports and appeals can be sent to ${SAFETY_EMAIL}.`,
          ],
        },
        {
          title: '3. AI disclosure',
          body: [
            'Catea provides AI-generated assistance. Users are responsible for reviewing outputs, respecting applicable law, and avoiding high-risk reliance on unverified AI responses.',
          ],
        },
      ],
    },
  },
  zh: {
    langLabel: 'EN',
    nav: {
      features: '功能',
      philosophy: '理念',
      pricing: '价格',
      get: 'Get Catea',
      privacy: '隐私',
      terms: '条款',
      aup: 'AI 使用规范',
    },
    footer: {
      title: 'Catea',
      body: '面向 Obsidian 用户的桌面 AI 工作区。Catea Pro 通过 Catea Obsidian 插件和 Catea 托管模型服务以数字方式交付。',
      contact: '联系方式',
      legal: '法律信息',
      copy: '复制邮箱',
      copied: '已复制',
    },
    home: {
      eyebrow: 'For Obsidian · Knowledge-first AI',
      title: 'Make your knowledge think.',
      lead:
        'Catea 是为 Obsidian 知识库打造的 AI 工作区，帮助你在 vault 中阅读、连接、写作和执行，而不是把知识搬到另一个应用里。',
      primary: '查看套餐',
      secondary: '功能介绍',
      points: ['为知识库打造', 'Obsidian 原生工作流', 'BYOK 或 Catea Pro', '可审阅的笔记操作'],
      mock: {
        vault: 'knowledge-vault',
        activeNote: 'knowledge-os.md',
        question: '我的知识工作笔记里，最核心的线索是什么？',
        answer: '我找到了三个反复出现的主题：持久上下文、链接式推理、可审阅的 AI 行动。来源：[[ai-memory]]、[[zettelkasten]]、[[project-catea]]。',
      },
      featuresKicker: 'Features',
      featuresTitle: '一个围绕知识库打造的插件。',
      features: [
        {
          eyebrow: '01 / KNOWLEDGE WORKSPACE',
          title: '知识优先的工作区',
          body: 'Catea 不是一个孤立聊天框。它围绕你的 vault、笔记、链接、会话和长期上下文工作。',
        },
        {
          eyebrow: '02 / VAULT CHAT',
          title: '和你的知识库对话',
          body: '跨相关笔记提问，让上下文可追溯，并把你已有的知识作为回答的基础。',
        },
        {
          eyebrow: '03 / NOTE ACTIONS',
          title: '让 AI 参与整理和写作',
          body: '草拟、改写、创建和整理 Markdown 笔记。重要的 vault 修改都保留可审阅步骤。',
        },
        {
          eyebrow: '04 / MODEL CHOICE',
          title: 'BYOK 或 Catea Pro',
          body: '免费版使用你自己的 API Key；Pro 版直接启用 Catea 托管模型和额度管理。',
        },
      ],
      philosophyKicker: 'Philosophy',
      philosophyTitle: '把 AI 带进你的知识库，而不是把知识搬到另一个应用。',
      philosophyBody:
        '你的笔记才是系统的中心。Catea 让工作区继续围绕 Obsidian 展开，让 AI 成为理解和塑造知识的方式，而不是吞掉知识的地方。',
      pricingKicker: 'Pricing',
      pricingTitle: '先用自己的模型开始，需要开箱即用时再升级。',
      plans: [
        {
          name: 'Free',
          price: '$0',
          description: '适合想完全控制模型配置的用户。',
          items: ['基础 Catea 工作区', '配置自己的模型 API Key', 'vault 本地会话与记忆', '不包含托管模型'],
          action: '在 Obsidian 中安装',
        },
        {
          name: 'Catea Pro',
          price: '$3 / 月',
          description: '适合希望由 Catea 提供模型入口和额度管理的用户。',
          items: ['包含 Free 的全部能力', '托管模型访问', '月度托管用量', '未来高级知识功能'],
          action: '订阅 Pro',
          featured: true,
        },
      ],
      billingNote: 'Catea Pro 按月计费。支付信息由 Waffo Pancake 处理，不保存在 Catea 服务器上。',
    },
    privacy: {
      title: '隐私政策',
      intro: '本政策说明 Catea 会收集哪些信息、收集原因，以及用户如何联系我们。',
      sections: [
        {
          title: '1. 控制者和联系方式',
          body: [
            `Catea 由独立软件项目运营。网站：${SITE_URL}。隐私请求可发送至 ${PRIVACY_EMAIL}。我们目前没有任命正式的数据保护官。`,
          ],
        },
        {
          title: '2. 我们收集的信息',
          bullets: [
            '用于查询订阅状态或获得客户支持的邮箱地址。',
            '订阅和账单元数据：套餐、支付状态、续费周期和支付提供商事件 ID。',
            '用于执行 PRO 月度额度和短周期额度的托管模型用量计数。',
            '用于安全和调试的技术日志，例如请求时间、API 路由、状态码和错误信息。',
            '你通过邮件发送给我们的支持消息。',
          ],
          body: [
            'Catea 桌面插件会把会话、记忆、设置和 BYOK 模型配置保存在用户自己的 Obsidian 环境中。支付卡信息由 Waffo Pancake 处理，不保存在我们的服务器上。',
          ],
        },
        {
          title: '3. 信息用途',
          bullets: ['提供 Catea Pro 订阅和托管模型访问。', '校验权益、防止滥用、执行额度并排查服务错误。', '回复支持、账单、隐私和安全请求。', '满足法律、安全和支付要求。'],
        },
        {
          title: '4. 共享、保留和权利',
          body: [
            '我们只会在完成账单和订阅管理所需范围内，与支付处理方共享支付相关信息。我们也可能使用托管、数据库和邮件服务商来运行服务。',
            '订阅记录会在账户有效期间以及之后的合理期限内保留，用于税务、反欺诈、审计和争议处理。日志仅在安全和调试所需期限内保留。',
            `你可以联系 ${PRIVACY_EMAIL} 请求访问、更正、删除或导出数据。出于法律、税务、安全或争议原因，部分记录可能需要继续保留。`,
          ],
        },
      ],
    },
    terms: {
      title: '服务条款与退款政策',
      intro: '本条款说明 Catea Pro 订阅、交付、取消和退款规则。',
      sections: [
        {
          title: '1. 服务',
          body: [
            'Catea 是桌面端 Obsidian 插件。Catea Pro 是按月计费的数字订阅，为符合条件的用户在插件中解锁托管模型访问。',
            'Catea 不提供法律、金融、医疗或安全等专业建议。AI 输出可能不完整或错误，用户需要自行审阅。',
          ],
        },
        {
          title: '2. 账单与交付',
          body: ['支付由 Waffo Pancake 处理。支付确认成功后，用户可以在插件中刷新套餐状态，并使用 Catea 托管模型入口。', '价格会在付款前显示。当前 Catea Pro 以月度订阅形式提供。'],
        },
        {
          title: '3. 取消和退款',
          body: [
            `用户可以通过 ${BILLING_EMAIL} 请求取消后续续费。`,
            '如果支付成功后无法访问付费服务、同一账期重复扣费，或适用法律要求退款，用户可在 7 天内申请退款审核。对于滥用、欺诈或已经大量消耗的服务，我们可能拒绝退款。',
          ],
        },
        { title: '4. 暂停服务', body: ['如果存在支付失败、欺诈、安全风险或违反 AI 使用规范的情况，我们可能暂停或终止访问。'] },
      ],
    },
    aup: {
      title: 'AI 可接受使用政策',
      intro: 'Catea 面向 Obsidian 内合法的个人和专业写作、研究、知识工作场景。',
      sections: [
        {
          title: '1. 禁止内容和行为',
          bullets: [
            '色情或成人内容，包括性服务或剥削。',
            '儿童性虐待材料、诱导儿童或任何儿童安全违规。对此我们零容忍。',
            '血腥暴力、恐怖主义支持、武器制造或大规模杀伤性武器协助。',
            '仇恨、骚扰、威胁，或针对受保护特征的内容。',
            '未经同意的深度伪造、冒充、欺诈、窃取凭证或欺骗性自动化。',
            '知识产权滥用，包括要求超出合法范围复制受版权保护的作品。',
          ],
        },
        {
          title: '2. 执行',
          body: [
            '我们可能审核被举报的滥用行为，并在违反本政策时限制访问、撤销托管模型权益或终止订阅。严重安全问题可能被报告给相关机构或服务提供商。',
            `举报和申诉可发送至 ${SAFETY_EMAIL}。`,
          ],
        },
        { title: '3. AI 说明', body: ['Catea 提供 AI 生成的辅助内容。用户需要自行审阅输出、遵守适用法律，并避免在未经验证的 AI 回复上进行高风险决策。'] },
      ],
    },
  },
}

const pages = {
  '/privacy': { key: 'privacy', active: 'privacy' },
  '/terms': { key: 'terms', active: 'terms' },
  '/acceptable-use': { key: 'aup', active: 'aup' },
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

  const site = useMemo(() => ({ lang, setLang, t }), [lang, t])
  const page = pages[route]

  return (
    <Theme asChild appearance="light" accentColor="green" grayColor="sage" radius="medium" scaling="100%">
      <div className="catea-site">
        <PublicShell active={page?.active ?? 'home'} site={site}>
          {page ? <PolicyPage page={t[page.key]} /> : <HomePage site={site} />}
        </PublicShell>
      </div>
    </Theme>
  )
}

function PublicShell({ children, active, site }) {
  const { lang, setLang, t } = site
  const nav = [
    { key: 'features', label: t.nav.features, href: '/#features' },
    { key: 'philosophy', label: t.nav.philosophy, href: '/#philosophy' },
    { key: 'pricing', label: t.nav.pricing, href: '/#pricing' },
  ]

  return (
    <Box className="catea-site-shell">
      <Box asChild className="catea-site-header">
        <header>
          <Container size="4" px="5">
            <Flex className="catea-header-row" align="center" justify="between" gap="4">
              <Link href="/" className="catea-brand" underline="none" aria-label="Catea home">
                <span className="catea-brand-mark">C</span>
                <span>Catea v1.0</span>
              </Link>
              <nav className="catea-nav">
                {nav.map(item => (
                  <Link key={item.key} href={item.href} underline="none" className={active === item.key ? 'is-active' : undefined}>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Flex align="center" gap="2" className="catea-header-actions">
                <Button variant="soft" className="catea-button-ghost" onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}>
                  {t.langLabel}
                </Button>
                <Button asChild className="catea-button-primary">
                  <a href="/#pricing">{t.nav.get}</a>
                </Button>
              </Flex>
            </Flex>
          </Container>
        </header>
      </Box>
      {children}
      <footer className="catea-site-footer">
        <Container size="4" px="5">
          <Grid columns={{ initial: '1', md: '4' }} gap="6" py="8">
            <Box className="catea-footer-intro">
              <Heading as="h2" size="4">
                {t.footer.title}
              </Heading>
              <Text as="p" mt="2">
                {t.footer.body}
              </Text>
            </Box>
            <Box>
              <Heading as="h3" size="3" mb="3">
                Product
              </Heading>
              <FooterLink label={t.nav.features} href="/#features" />
              <FooterLink label={t.nav.pricing} href="/#pricing" />
              <FooterLink label={t.nav.philosophy} href="/#philosophy" />
            </Box>
            <Box>
              <Heading as="h3" size="3" mb="3">
                {t.footer.legal}
              </Heading>
              <FooterLink label={t.nav.privacy} href="/privacy" />
              <FooterLink label={t.nav.terms} href="/terms" />
              <FooterLink label={t.nav.aup} href="/acceptable-use" />
            </Box>
          </Grid>
        </Container>
      </footer>
    </Box>
  )
}

function FooterLink({ label, href }) {
  return (
    <Text as="p" size="2">
      <Link href={href} className="catea-text-link">
        {label}
      </Link>
    </Text>
  )
}

function HomePage({ site }) {
  const { t } = site

  return (
    <main>
      <Section size="4" className="catea-hero-section">
        <Container size="4" px="5">
          <Box className="catea-hero-copy">
            <Text as="div" className="catea-hero-eyebrow">
              {t.home.eyebrow}
            </Text>
            <Heading as="h1" className="catea-hero-title">
              {t.home.title}
            </Heading>
            <Text as="p" className="catea-hero-lead">
              {t.home.lead}
            </Text>
            <Flex mt="6" gap="3" wrap="wrap" justify="center">
              <Button asChild size="3" className="catea-button-primary">
                <a href="#pricing">{t.home.primary}</a>
              </Button>
              <Button asChild size="3" className="catea-button-outline">
                <a href="#features">{t.home.secondary}</a>
              </Button>
            </Flex>
            <Flex mt="5" gap="2" wrap="wrap" justify="center" className="catea-hero-points">
              {t.home.points.map(point => (
                <span key={point}>{point}</span>
              ))}
            </Flex>
          </Box>
          <Box className="catea-screenshot-bg">
            <ProductPreview t={t.home.mock} />
          </Box>
        </Container>
      </Section>

      <ContentSection id="features" kicker={t.home.featuresKicker} title={t.home.featuresTitle}>
        <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="5">
          {t.home.features.map(feature => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </Grid>
      </ContentSection>

      <ContentSection id="philosophy" kicker={t.home.philosophyKicker} title={t.home.philosophyTitle}>
        <Card className="catea-philosophy-card">
          <Text as="p">{t.home.philosophyBody}</Text>
        </Card>
      </ContentSection>

      <ContentSection id="pricing" kicker={t.home.pricingKicker} title={t.home.pricingTitle}>
        <Grid columns={{ initial: '1', md: '2' }} gap="5">
          {t.home.plans.map(plan => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </Grid>
        <Text as="p" mt="4" className="catea-small-muted">
          {t.home.billingNote}
        </Text>
      </ContentSection>

      <Section size="3" className="catea-final-cta">
        <Container size="4" px="5">
          <Card className="catea-panel">
            <Flex align={{ initial: 'start', md: 'center' }} justify="between" gap="5" direction={{ initial: 'column', md: 'row' }}>
              <Box>
                <Heading as="h2" size="7">
                  {t.home.title}
                </Heading>
                <Text as="p" mt="2">
                  {t.home.lead}
                </Text>
              </Box>
              <Button asChild size="3" className="catea-button-primary">
                <a href="#pricing">{t.home.primary}</a>
              </Button>
            </Flex>
          </Card>
        </Container>
      </Section>
    </main>
  )
}

function FeatureCard({ feature }) {
  return (
    <Card className="catea-feature-card">
      <Text as="div" className="catea-feature-index">
        {feature.eyebrow}
      </Text>
      <Heading as="h3" size="4" mt="4" mb="3">
        {feature.title}
      </Heading>
      <Text as="p">{feature.body}</Text>
    </Card>
  )
}

function PlanCard({ plan }) {
  return (
    <Card className={plan.featured ? 'catea-plan-card is-featured' : 'catea-plan-card'}>
      <Flex justify="between" align="start" gap="4">
        <Box>
          <Heading as="h3" size="5">
            {plan.name}
          </Heading>
          <Text as="p" mt="2">
            {plan.description}
          </Text>
        </Box>
        {plan.featured && <Badge className="catea-badge">Pro</Badge>}
      </Flex>
      <Text as="div" className="catea-plan-price">
        {plan.price}
      </Text>
      <ul>
        {plan.items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Button asChild className={plan.featured ? 'catea-button-primary' : 'catea-button-outline'}>
        <a href={plan.featured ? '#' : '#features'}>{plan.action}</a>
      </Button>
    </Card>
  )
}

function ProductPreview({ t }) {
  return (
    <Card className="catea-preview-card">
      <Box className="catea-obsidian-mock">
        <Flex align="center" justify="between" className="catea-mock-titlebar">
          <Flex align="center" gap="2">
            <span className="catea-dot" />
            <span className="catea-dot" />
            <span className="catea-dot" />
          </Flex>
          <Text as="div" size="2">
            obsidian — {t.vault}
          </Text>
        </Flex>
        <Grid className="catea-mock-grid">
          <Box className="catea-mock-sidebar">
            <Text as="div" className="catea-mock-label">
              FILES
            </Text>
            <ul>
              <li>▾ {t.vault}</li>
              <li>— index.md</li>
              <li>— ai-memory.md</li>
              <li>— zettelkasten.md</li>
              <li>— project-catea.md</li>
            </ul>
          </Box>
          <Box className="catea-mock-note">
            <Text as="div" className="catea-mock-label">
              {t.activeNote}
            </Text>
            <Heading as="h2" size="5">
              ## Knowledge OS
            </Heading>
            <Text as="p">
              Knowledge becomes useful when it can be recalled, connected, and turned into careful action.
            </Text>
            <Text as="p">
              Related: [[ai-memory]], [[zettelkasten]], [[project-catea]]
            </Text>
          </Box>
          <Box className="catea-mock-agent">
            <Text as="div" className="catea-mock-agent-title">
              Catea · Agent
            </Text>
            <Box className="catea-mock-bubble is-user">
              {t.question}
            </Box>
            <Box className="catea-mock-bubble is-agent">
              <Text as="div" className="catea-mock-label">
                AGENT · STREAMING
              </Text>
              {t.answer}
            </Box>
          </Box>
        </Grid>
      </Box>
    </Card>
  )
}

function ContentSection({ id, kicker, title, children }) {
  return (
    <Section id={id} size="3" className="catea-content-section">
      <Container size="4" px="5">
        <Text as="div" className="catea-kicker">
          {kicker}
        </Text>
        <Heading as="h2" className="catea-section-title">
          {title}
        </Heading>
        {children}
      </Container>
    </Section>
  )
}

function PolicyPage({ page }) {
  return (
    <main>
      <Section size="3">
        <Container size="3" px="5">
          <Badge className="catea-badge">Last updated: {LAST_UPDATED}</Badge>
          <Heading as="h1" className="catea-policy-title">
            {page.title}
          </Heading>
          <Text as="p" className="catea-policy-intro">
            {page.intro}
          </Text>
          <Card className="catea-policy-card">
            {page.sections.map((section, index) => (
              <Box key={section.title} className="catea-policy-section">
                {index > 0 && <Separator size="4" my="6" />}
                <Heading as="h2" size="5">
                  {section.title}
                </Heading>
                {section.body?.map(paragraph => (
                  <Text key={paragraph} as="p" mt="3">
                    {paragraph}
                  </Text>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </Box>
            ))}
          </Card>
        </Container>
      </Section>
    </main>
  )
}
