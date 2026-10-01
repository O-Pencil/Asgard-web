/**
 * [WHO]: Provides public Catea website, privacy policy, terms, refund, and AI acceptable-use pages for payment-provider review
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
const SUPPORT_EMAIL = 'support@pencil.chat'
const PRIVACY_EMAIL = 'privacy@pencil.chat'
const SAFETY_EMAIL = 'safety@pencil.chat'
const BILLING_EMAIL = 'billing@pencil.chat'
const LAST_UPDATED = 'October 1, 2026'

const copy = {
  en: {
    langLabel: '中文',
    nav: { product: 'Product', privacy: 'Privacy', terms: 'Terms', aup: 'Acceptable Use', support: 'Contact support' },
    footer: {
      title: 'Catea by Pencil',
      body: 'A desktop AI workspace for Obsidian users. Catea Pro is delivered digitally through the Catea Obsidian plugin and the Catea hosted model service.',
      contact: 'Contact',
      legal: 'Legal',
    },
    home: {
      eyebrow: 'Obsidian AI workspace · SaaS subscription',
      title: 'Catea makes your Obsidian vault AI-ready.',
      lead:
        'Catea is a desktop Obsidian plugin that adds a paper-style AI workspace to your vault. Free users can bring their own model API key. Catea Pro adds hosted model access managed by Catea, so subscribers can start using the assistant without configuring an API key.',
      primary: 'View Catea Pro',
      secondary: 'Contact support',
      review: 'Official product website for review:',
      mock: {
        pro: 'Catea Pro',
        included: 'Hosted model included',
        ask: 'Ask over your vault',
        askBody: 'Read notes, draft changes, and keep long-term memory in your own vault.',
        quota: 'Usage managed by Catea',
        quotaBody: 'Monthly PRO quota and short reset windows keep the service predictable.',
        safe: 'No card data on our servers',
        safeBody: 'Payments are processed by Waffo Pancake.',
      },
      sections: [
        {
          kicker: 'Product and delivery',
          title: 'What customers buy',
          cards: [
            {
              title: 'Free',
              body: 'Use the Catea Obsidian plugin with your own supported model API key. Your vault data stays on your device and in your Obsidian vault.',
            },
            {
              title: 'Catea Pro — $3 / month',
              body: 'A monthly digital subscription that unlocks hosted model access in the plugin. Delivery is instant after payment confirmation: refresh plan status in the plugin, then use the Catea model route.',
            },
            {
              title: 'Catea hosted service',
              body: 'Catea manages subscription state, entitlement checks, hosted model routing, and quota usage for Catea Pro. It does not sell a model API key for resale.',
            },
          ],
        },
        {
          kicker: 'Trust and safety',
          title: 'Built for responsible AI use',
          cards: [
            {
              title: 'Independent brand',
              body: 'Catea is not marketed as an official application of any model provider. The product is a Pencil/Catea workspace and subscription service.',
            },
            {
              title: 'Clear AI disclosure',
              body: 'Assistant responses are AI-generated and may be inaccurate. Users should review outputs before relying on them for important decisions.',
            },
            {
              title: 'Content restrictions',
              body: 'We prohibit sexual content, graphic violence, hate, child-safety violations, non-consensual deepfakes, impersonation, and intellectual-property abuse.',
            },
            {
              title: 'Human contact channel',
              body: 'Reports, appeals, billing issues, and privacy requests can be sent to monitored Pencil email addresses listed on this website.',
            },
          ],
        },
      ],
      billingTitle: 'Billing, refunds, and support',
      billingKicker: 'Customer information',
      billingBody:
        'Catea Pro is billed monthly. Users may cancel future renewal by contacting billing support. If a customer cannot access the paid service after a successful payment, or was charged twice for the same billing period, they may request help or a refund review within 7 days.',
      billingNote: 'Payment card details are handled by Waffo Pancake and are not stored on Catea servers.',
    },
    privacy: {
      title: 'Privacy Policy',
      intro: 'This policy explains what Catea collects, why we collect it, and how customers can contact us.',
      sections: [
        {
          title: '1. Controller and contact',
          body: [
            `Catea is operated as part of the Pencil independent developer project. Website: ${SITE_URL}. Privacy requests can be sent to ${PRIVACY_EMAIL}. We have not appointed a formal data protection officer.`,
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
            'Comply with legal obligations and payment-provider review requirements.',
          ],
        },
        {
          title: '4. Sharing, retention, and rights',
          body: [
            'We share payment-related information with our payment processor only as needed to complete billing and subscription management. We may also use hosting, database, and email providers to operate the service.',
            'Subscription records are kept while the account is active and for a reasonable period afterwards for tax, fraud-prevention, audit, and dispute purposes. Logs are kept only as long as needed for security and debugging.',
            `You may request access, correction, deletion, or export by emailing ${PRIVACY_EMAIL}. Some records may be retained where required for legal, tax, security, or dispute reasons.`,
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
    nav: { product: '产品', privacy: '隐私', terms: '条款', aup: 'AI 使用规范', support: '联系支持' },
    footer: {
      title: 'Catea by Pencil',
      body: '面向 Obsidian 用户的桌面 AI 工作区。Catea Pro 通过 Catea Obsidian 插件和 Catea 托管模型服务以数字方式交付。',
      contact: '联系方式',
      legal: '法律信息',
    },
    home: {
      eyebrow: 'Obsidian AI 工作区 · SaaS 订阅',
      title: '让你的 Obsidian 知识库直接拥有 AI 助手。',
      lead:
        'Catea 是一个桌面端 Obsidian 插件，会在你的知识库里加入纸张式 AI 工作区。免费用户可以配置自己的模型 API Key；订阅 Catea Pro 后，可直接使用 Catea 管理的托管模型，无需自己配置 Key。',
      primary: '查看 Catea Pro',
      secondary: '联系支持',
      review: '用于审核的官方网站：',
      mock: {
        pro: 'Catea Pro',
        included: '已包含托管模型',
        ask: '围绕你的知识库提问',
        askBody: '读取笔记、草拟修改，并把长期记忆保存在你的本地知识库中。',
        quota: '由 Catea 管理用量',
        quotaBody: '月度 PRO 额度和短周期重置窗口，让服务更稳定可控。',
        safe: '我们不保存银行卡信息',
        safeBody: '支付由 Waffo Pancake 处理。',
      },
      sections: [
        {
          kicker: '产品与交付',
          title: '用户购买的内容',
          cards: [
            {
              title: 'Free',
              body: '使用 Catea Obsidian 插件，并配置你自己的模型 API Key。知识库数据保留在你的设备和 Obsidian vault 中。',
            },
            {
              title: 'Catea Pro — 每月 3 美元',
              body: '按月计费的数字订阅，在插件中解锁托管模型。支付成功后，在插件里刷新套餐状态即可使用 Catea 模型入口。',
            },
            {
              title: 'Catea 托管服务',
              body: 'Catea 负责订阅状态、权益校验、托管模型转发和额度管理。我们不售卖或转售模型 API Key。',
            },
          ],
        },
        {
          kicker: '信任与安全',
          title: '为负责任的 AI 使用而设计',
          cards: [
            {
              title: '独立品牌',
              body: 'Catea 不会被宣传为任何模型提供商的官方应用。它是 Pencil/Catea 提供的工作区和订阅服务。',
            },
            { title: '清晰的 AI 提醒', body: '助手回复由 AI 生成，可能不准确。用户在用于重要决策前需要自行检查。' },
            {
              title: '内容限制',
              body: '我们禁止色情、血腥暴力、仇恨、儿童安全违规、未经同意的深度伪造、冒充和知识产权滥用。',
            },
            { title: '人工联系渠道', body: '举报、申诉、账单问题和隐私请求都可以发送到本网站列出的 Pencil 邮箱。' },
          ],
        },
      ],
      billingTitle: '账单、退款和支持',
      billingKicker: '客户信息',
      billingBody:
        'Catea Pro 按月计费。用户可以联系账单支持取消后续续费。如果支付成功后无法访问付费服务，或同一账期被重复扣费，可在 7 天内请求帮助或退款审核。',
      billingNote: '银行卡等支付信息由 Waffo Pancake 处理，不保存在 Catea 服务器上。',
    },
    privacy: {
      title: '隐私政策',
      intro: '本政策说明 Catea 会收集哪些信息、收集原因，以及用户如何联系我们。',
      sections: [
        {
          title: '1. 控制者和联系方式',
          body: [
            `Catea 由 Pencil 独立开发者项目运营。网站：${SITE_URL}。隐私请求可发送至 ${PRIVACY_EMAIL}。我们目前没有任命正式的数据保护官。`,
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
          bullets: ['提供 Catea Pro 订阅和托管模型访问。', '校验权益、防止滥用、执行额度并排查服务错误。', '回复支持、账单、隐私和安全请求。', '满足法律义务和支付提供商审核要求。'],
        },
        {
          title: '4. 共享、保留和权利',
          body: [
            '我们只会在完成账单和订阅管理所需范围内，与支付处理方共享支付相关信息。我们也可能使用托管、数据库和邮件服务商来运行服务。',
            '订阅记录会在账户有效期间以及之后的合理期限内保留，用于税务、反欺诈、审计和争议处理。日志仅在安全和调试所需期限内保留。',
            `你可以通过 ${PRIVACY_EMAIL} 请求访问、更正、删除或导出数据。出于法律、税务、安全或争议原因，部分记录可能需要继续保留。`,
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
    { key: 'home', label: t.nav.product, href: '/' },
    { key: 'privacy', label: t.nav.privacy, href: '/privacy' },
    { key: 'terms', label: t.nav.terms, href: '/terms' },
    { key: 'aup', label: t.nav.aup, href: '/acceptable-use' },
  ]

  return (
    <Box className="catea-site-shell">
      <Box asChild className="catea-site-header">
        <header>
          <Container size="4" px="5">
            <Flex height="64px" align="center" justify="between" gap="4">
              <Link href="/" className="catea-brand" underline="none">
                Catea
              </Link>
              <Flex asChild align="center" gap="5" className="catea-nav">
                <nav>
                  {nav.map(item => (
                    <Link key={item.key} href={item.href} underline="none" className={active === item.key ? 'is-active' : undefined}>
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </Flex>
              <Flex align="center" gap="2">
                <Button variant="soft" className="catea-button-ghost" onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}>
                  {t.langLabel}
                </Button>
                <Button asChild className="catea-button-primary">
                  <a href={`mailto:${SUPPORT_EMAIL}`}>{t.nav.support}</a>
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
                {t.footer.contact}
              </Heading>
              <FooterLink label="Support" href={`mailto:${SUPPORT_EMAIL}`} />
              <FooterLink label="Billing" href={`mailto:${BILLING_EMAIL}`} />
              <FooterLink label="Safety" href={`mailto:${SAFETY_EMAIL}`} />
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
          <Grid columns={{ initial: '1', md: '2' }} gap="8" align="center">
            <Box>
              <Badge className="catea-badge">{t.home.eyebrow}</Badge>
              <Heading as="h1" className="catea-hero-title">
                {t.home.title}
              </Heading>
              <Text as="p" className="catea-hero-lead">
                {t.home.lead}
              </Text>
              <Flex mt="6" gap="3" wrap="wrap">
                <Button asChild size="3" className="catea-button-primary">
                  <a href="/terms">{t.home.primary}</a>
                </Button>
                <Button asChild size="3" variant="outline" className="catea-button-outline">
                  <a href={`mailto:${SUPPORT_EMAIL}`}>{t.home.secondary}</a>
                </Button>
              </Flex>
              <Text as="p" mt="5" className="catea-small-muted">
                {t.home.review} <Text weight="medium">{SITE_URL}</Text>
              </Text>
            </Box>
            <ProductPreview t={t.home.mock} />
          </Grid>
        </Container>
      </Section>

      {t.home.sections.map(section => (
        <ContentSection key={section.title} kicker={section.kicker} title={section.title}>
          <Grid columns={{ initial: '1', md: section.cards.length === 3 ? '3' : '2' }} gap="5">
            {section.cards.map(card => (
              <InfoCard key={card.title} title={card.title}>
                {card.body}
              </InfoCard>
            ))}
          </Grid>
        </ContentSection>
      ))}

      <ContentSection kicker={t.home.billingKicker} title={t.home.billingTitle}>
        <Card className="catea-panel">
          <Text as="p">{t.home.billingBody}</Text>
          <Text as="p" mt="4">
            {t.home.billingNote}
          </Text>
        </Card>
      </ContentSection>
    </main>
  )
}

function ProductPreview({ t }) {
  return (
    <Card className="catea-preview-card">
      <Box className="catea-preview-window">
        <Flex gap="2" mb="6">
          <span className="catea-dot" />
          <span className="catea-dot" />
          <span className="catea-dot" />
        </Flex>
        <Flex direction="column" gap="4">
          <Box className="catea-preview-tile catea-preview-tile-strong">
            <Text as="div" size="2">
              {t.pro}
            </Text>
            <Heading as="h2" size="6" mt="1">
              {t.included}
            </Heading>
          </Box>
          <Box className="catea-preview-tile catea-preview-tile-paper">
            <Text weight="medium">{t.ask}</Text>
            <Text as="p" size="2" mt="1">
              {t.askBody}
            </Text>
          </Box>
          <Box className="catea-preview-tile">
            <Text weight="medium">{t.quota}</Text>
            <Text as="p" size="2" mt="1">
              {t.quotaBody}
            </Text>
          </Box>
          <Box className="catea-preview-tile">
            <Text weight="medium">{t.safe}</Text>
            <Text as="p" size="2" mt="1">
              {t.safeBody}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Card>
  )
}

function ContentSection({ kicker, title, children }) {
  return (
    <Section size="3" className="catea-content-section">
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

function InfoCard({ title, children }) {
  return (
    <Card className="catea-info-card">
      <Heading as="h3" size="4" mb="3">
        {title}
      </Heading>
      <Text as="p">{children}</Text>
    </Card>
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
