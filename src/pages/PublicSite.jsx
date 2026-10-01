/**
 * [WHO]: Provides public Catea website, privacy policy, terms, refund, and AI acceptable-use pages for payment-provider review
 * [FROM]: Depends on React only; rendered by App.jsx before authenticated product routes
 * [TO]: Consumed by App.jsx for public routes /, /privacy, /terms, /acceptable-use
 * [HERE]: packages/web/src/pages/PublicSite.jsx - Public Catea product website and compliance pages for catea.pencil.chat
 */

const SITE_URL = 'https://catea.pencil.chat'
const SUPPORT_EMAIL = 'support@pencil.chat'
const PRIVACY_EMAIL = 'privacy@pencil.chat'
const SAFETY_EMAIL = 'safety@pencil.chat'
const BILLING_EMAIL = 'billing@pencil.chat'
const LAST_UPDATED = 'October 1, 2026'

function PublicShell({ children, active = 'home' }) {
  const nav = [
    { key: 'home', label: 'Product', href: '/' },
    { key: 'privacy', label: 'Privacy', href: '/privacy' },
    { key: 'terms', label: 'Terms', href: '/terms' },
    { key: 'aup', label: 'Acceptable Use', href: '/acceptable-use' },
  ]

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-slate-900">
      <header className="border-b border-slate-200/80 bg-[#f8f5ef]/95 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="/" className="font-semibold tracking-tight text-xl">
            Catea
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {nav.map(item => (
              <a
                key={item.key}
                href={item.href}
                className={active === item.key ? 'text-indigo-700 font-medium' : 'text-slate-600 hover:text-slate-950'}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-700">
            Contact support
          </a>
        </div>
      </header>
      {children}
      <footer className="border-t border-slate-200 bg-white/55">
        <div className="max-w-6xl mx-auto px-5 py-10 grid gap-6 md:grid-cols-4 text-sm text-slate-600">
          <div className="md:col-span-2">
            <div className="font-semibold text-slate-900 mb-2">Catea by Pencil</div>
            <p>
              A desktop AI workspace for Obsidian users. Catea Pro subscriptions are delivered digitally through the
              Catea Obsidian plugin and the Catea hosted model service.
            </p>
          </div>
          <div>
            <div className="font-medium text-slate-900 mb-2">Contact</div>
            <p>Support: <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a></p>
            <p>Billing: <a href={`mailto:${BILLING_EMAIL}`} className="underline">{BILLING_EMAIL}</a></p>
            <p>Safety: <a href={`mailto:${SAFETY_EMAIL}`} className="underline">{SAFETY_EMAIL}</a></p>
          </div>
          <div>
            <div className="font-medium text-slate-900 mb-2">Legal</div>
            <p><a href="/privacy" className="underline">Privacy Policy</a></p>
            <p><a href="/terms" className="underline">Terms & Refund Policy</a></p>
            <p><a href="/acceptable-use" className="underline">AI Acceptable Use</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
      {children}
    </span>
  )
}

function Section({ title, kicker, children }) {
  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-5">
        {kicker && <div className="text-sm font-medium text-indigo-700 mb-2">{kicker}</div>}
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-950 mb-6">{title}</h2>
        {children}
      </div>
    </section>
  )
}

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-lg mb-3 text-slate-950">{title}</h3>
      <div className="text-slate-600 leading-7">{children}</div>
    </div>
  )
}

function PolicyPage({ active, title, intro, children }) {
  return (
    <PublicShell active={active}>
      <main className="max-w-4xl mx-auto px-5 py-14">
        <Badge>Last updated: {LAST_UPDATED}</Badge>
        <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{intro}</p>
        <article className="mt-10 prose prose-slate max-w-none">
          {children}
        </article>
      </main>
    </PublicShell>
  )
}

function HomePage() {
  return (
    <PublicShell active="home">
      <main>
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-5 py-20 md:py-28 grid gap-12 md:grid-cols-[1.05fr_0.95fr] items-center">
            <div>
              <Badge>Obsidian AI workspace · SaaS subscription</Badge>
              <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight text-slate-950">
                Catea makes your Obsidian vault AI-ready.
              </h1>
              <p className="mt-6 text-xl leading-9 text-slate-650">
                Catea is a desktop Obsidian plugin that adds a local paper-style agent workspace to your vault.
                Free users can bring their own model API key. Catea Pro adds a hosted model route managed by Catea,
                so subscribers can start using the assistant without configuring an API key.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/terms" className="rounded-full bg-slate-900 text-white px-6 py-3 font-medium hover:bg-slate-700">
                  View Catea Pro
                </a>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="rounded-full border border-slate-300 px-6 py-3 font-medium hover:bg-white">
                  Contact support
                </a>
              </div>
              <p className="mt-5 text-sm text-slate-500">
                Official product website for review: <span className="font-medium text-slate-700">{SITE_URL}</span>
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl rotate-1">
              <div className="rounded-2xl bg-slate-950 text-slate-100 p-6 min-h-[420px]">
                <div className="flex items-center gap-2 mb-8">
                  <span className="size-3 rounded-full bg-red-400" />
                  <span className="size-3 rounded-full bg-amber-300" />
                  <span className="size-3 rounded-full bg-emerald-400" />
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-sm text-slate-400">Catea Pro</div>
                    <div className="text-2xl font-semibold mt-1">Hosted model included</div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 text-slate-900">
                    <div className="font-medium">Ask over your vault</div>
                    <p className="text-sm text-slate-600 mt-1">Read notes, draft changes, and keep long-term memory in your own vault.</p>
                  </div>
                  <div className="rounded-2xl bg-indigo-500/20 p-4">
                    <div className="font-medium">Usage managed by Catea</div>
                    <p className="text-sm text-slate-300 mt-1">Monthly PRO quota and short reset windows keep the service predictable.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 p-4">
                    <div className="font-medium">No card data on our servers</div>
                    <p className="text-sm text-slate-400 mt-1">Payments are processed by Waffo Pancake.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Section title="What customers buy" kicker="Product and delivery">
          <div className="grid gap-5 md:grid-cols-3">
            <Card title="Free">
              Use the Catea Obsidian plugin with your own supported model API key. Your vault data stays on your device
              and in your Obsidian vault.
            </Card>
            <Card title="Catea Pro — $3 / month">
              A monthly digital subscription that unlocks hosted model access in the plugin. Delivery is instant after
              payment confirmation: refresh plan status in the plugin, then use the Catea model route.
            </Card>
            <Card title="Catea hosted service">
              Catea manages subscription state, entitlement checks, hosted model routing, and quota usage for Catea Pro.
              It does not sell a model API key for resale.
            </Card>
          </div>
        </Section>

        <Section title="Built for responsible AI use" kicker="Trust and safety">
          <div className="grid gap-5 md:grid-cols-2">
            <Card title="Independent brand">
              Catea is not marketed as an official application of any model provider. The product is a Pencil/Catea
              workspace and subscription service.
            </Card>
            <Card title="Clear AI disclosure">
              Assistant responses are AI-generated and may be inaccurate. Users should review outputs before relying on
              them for important decisions.
            </Card>
            <Card title="Content restrictions">
              We prohibit sexual content, graphic violence, hate, child-safety violations, non-consensual deepfakes,
              impersonation, and intellectual-property abuse.
            </Card>
            <Card title="Human contact channel">
              Reports, appeals, billing issues, and privacy requests can be sent to monitored Pencil email addresses
              listed on this website.
            </Card>
          </div>
        </Section>

        <Section title="Billing, refunds, and support" kicker="Customer information">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 text-slate-650 leading-8">
            <p>
              Catea Pro is billed monthly. Users may cancel future renewal by contacting <a className="underline" href={`mailto:${BILLING_EMAIL}`}>{BILLING_EMAIL}</a>.
              If a customer cannot access the paid service after a successful payment, or was charged twice for the same
              billing period, they may request help or a refund review within 7 days.
            </p>
            <p className="mt-4">
              Payment card details are handled by Waffo Pancake and are not stored on Catea servers.
            </p>
          </div>
        </Section>
      </main>
    </PublicShell>
  )
}

function PrivacyPage() {
  return (
    <PolicyPage
      active="privacy"
      title="Privacy Policy"
      intro="This policy explains what Catea collects, why we collect it, and how customers can contact us."
    >
      <h2>1. Controller and contact</h2>
      <p>
        Catea is operated as part of the Pencil independent developer project. Website: {SITE_URL}. Privacy
        requests can be sent to <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>. We have not appointed a formal
        data protection officer.
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li>Email address used to check subscription status or receive customer support.</li>
        <li>Subscription and billing metadata: plan, payment status, renewal period, and provider event IDs.</li>
        <li>Hosted-model usage counters used to enforce monthly and short-window PRO quotas.</li>
        <li>Technical logs such as request time, API route, status code, and error information for security and debugging.</li>
        <li>Support messages you send to us by email.</li>
      </ul>
      <p>
        The desktop Catea plugin stores vault sessions, memory, settings, and BYOK model configuration locally in the
        user's Obsidian environment. Payment card data is processed by Waffo Pancake and is not stored on our servers.
      </p>

      <h2>3. How we use information</h2>
      <ul>
        <li>Provide the Catea Pro subscription and hosted model access.</li>
        <li>Verify entitlement, prevent abuse, and enforce quota limits.</li>
        <li>Process customer support, billing questions, refunds, and safety reports.</li>
        <li>Maintain security, debug service issues, and comply with legal obligations.</li>
      </ul>

      <h2>4. Sharing</h2>
      <p>
        We do not sell personal information. We share limited information with service providers needed to operate the
        product, including cloud hosting, database infrastructure, payment processing through Waffo Pancake, and hosted
        model providers. These providers process data only for the service purposes described here.
      </p>

      <h2>5. Retention</h2>
      <ul>
        <li>Subscription records: retained while the subscription is active and for up to 7 years where needed for tax or accounting records.</li>
        <li>Support records: retained for up to 2 years after the issue is resolved.</li>
        <li>Security and diagnostic logs: generally retained for up to 12 months unless needed for investigation.</li>
        <li>Local vault data: controlled by the user inside their Obsidian vault and can be deleted by the user locally.</li>
      </ul>

      <h2>6. Security</h2>
      <p>
        We use HTTPS/TLS for transport, hashed passwords where accounts exist, access controls for production systems,
        provider secrets stored as deployment environment variables, and limited operational access. If we discover a
        security incident that materially affects users, we will notify affected users as required by law.
      </p>

      <h2>7. Your rights</h2>
      <p>
        You may request access, correction, deletion, export, or restriction of your personal information by contacting
        <a href={`mailto:${PRIVACY_EMAIL}`}> {PRIVACY_EMAIL}</a>. We aim to respond within 30 calendar days.
      </p>

      <h2>8. Children</h2>
      <p>
        Catea is intended for users aged 13 and older. We do not knowingly collect personal information from children
        under 13. If you believe a child has provided personal information, contact us so we can delete it.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may update this policy as the product evolves. Material changes will be posted on this website, and the
        "Last updated" date will be revised.
      </p>
    </PolicyPage>
  )
}

function TermsPage() {
  return (
    <PolicyPage
      active="terms"
      title="Terms of Service and Refund Policy"
      intro="These terms describe the Catea Pro subscription, digital delivery, cancellation, refunds, and customer support."
    >
      <h2>1. Service</h2>
      <p>
        Catea is an Obsidian desktop plugin and hosted subscription service. Free users may configure their own model API
        key. Catea Pro is a monthly SaaS subscription that provides hosted model access through Catea, subject to usage
        limits and fair-use controls.
      </p>

      <h2>2. Delivery</h2>
      <p>
        Catea Pro is delivered digitally. After payment confirmation, the customer refreshes plan status in the Catea
        plugin using the subscribed email address. No physical goods are shipped.
      </p>

      <h2>3. Pricing and renewal</h2>
      <p>
        The current introductory Catea Pro price is USD $3 per month unless a checkout page states a different amount.
        Subscriptions renew monthly until canceled. Taxes, if applicable, are calculated and handled by the payment
        processor or merchant-of-record provider.
      </p>

      <h2>4. Cancellation</h2>
      <p>
        You may request cancellation of future renewal by contacting <a href={`mailto:${BILLING_EMAIL}`}>{BILLING_EMAIL}</a>.
        Unless otherwise required by law, your Pro access remains available until the end of the paid billing period.
      </p>

      <h2>5. Refund policy</h2>
      <p>
        Because Catea Pro is a digital subscription, completed payments are generally non-refundable once access has been
        delivered. We will review refund requests made within 7 days for duplicate charges, accidental renewal, or a
        technical issue that prevents access to the paid service. Refund requests should include the subscribed email and
        payment receipt details.
      </p>

      <h2>6. Acceptable use</h2>
      <p>
        Users must follow our <a href="/acceptable-use">AI Acceptable Use Policy</a>. We may restrict or terminate access
        for abuse, fraud, safety violations, attacks on the service, or attempts to bypass moderation and quota controls.
      </p>

      <h2>7. AI output disclaimer</h2>
      <p>
        Catea uses AI models and may generate inaccurate, incomplete, or unsafe output. Users are responsible for
        reviewing AI output and should not rely on it as professional legal, medical, financial, or safety advice.
      </p>

      <h2>8. Support</h2>
      <p>
        For support, contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. For billing, contact{' '}
        <a href={`mailto:${BILLING_EMAIL}`}>{BILLING_EMAIL}</a>.
      </p>
    </PolicyPage>
  )
}

function AcceptableUsePage() {
  return (
    <PolicyPage
      active="aup"
      title="AI Acceptable Use Policy"
      intro="This policy explains content restrictions, reporting channels, and enforcement for Catea hosted model access."
    >
      <h2>1. Scope</h2>
      <p>
        This policy applies to user prompts, AI-generated text, code, summaries, and any content processed through Catea
        Pro hosted model access. Catea is not a general-purpose image, audio, or video generation product.
      </p>

      <h2>2. Prohibited content and behavior</h2>
      <p>Users may not use Catea to create, request, distribute, or facilitate:</p>
      <ul>
        <li>Sexual or NSFW content.</li>
        <li>Graphic violence, gore, or instructions for physical harm.</li>
        <li>Hate, harassment, or abusive content targeting protected classes.</li>
        <li>Child sexual abuse material or any sexual content involving minors.</li>
        <li>Non-consensual deepfakes, impersonation, or deceptive identity claims.</li>
        <li>Copyright, trademark, privacy, or publicity-right violations.</li>
        <li>Terrorism, extremist violence, mass violence, or weapons instructions.</li>
        <li>Fraud, spam, phishing, credential theft, malware, or security bypass attempts.</li>
      </ul>

      <h2>3. Moderation and safety controls</h2>
      <p>
        We use a combination of provider safety systems, abuse monitoring, request logging, quota limits, and manual
        review of reports. We may block or limit requests, pause access, or investigate accounts that show abnormal or
        unsafe usage patterns.
      </p>

      <h2>4. Reporting</h2>
      <p>
        To report prohibited content, abuse, impersonation, or a safety concern, email{' '}
        <a href={`mailto:${SAFETY_EMAIL}`}>{SAFETY_EMAIL}</a>. Billing or access issues should be sent to{' '}
        <a href={`mailto:${BILLING_EMAIL}`}>{BILLING_EMAIL}</a>.
      </p>

      <h2>5. Response targets</h2>
      <ul>
        <li>Severe child-safety, terrorism, or imminent-harm reports: initial review within 24 hours.</li>
        <li>High-risk abuse reports: initial review within 3 business days.</li>
        <li>General policy reports: initial review within 7 business days.</li>
      </ul>

      <h2>6. Enforcement</h2>
      <p>
        Depending on severity, we may warn the user, remove access to hosted model features, reduce quotas, suspend a
        subscription, terminate access, or report illegal content to appropriate authorities.
      </p>

      <h2>7. Appeals</h2>
      <p>
        If you believe we made an enforcement error, contact <a href={`mailto:${SAFETY_EMAIL}`}>{SAFETY_EMAIL}</a> with
        the subscribed email address and a short explanation. We aim to review appeals within 10 business days.
      </p>
    </PolicyPage>
  )
}

export default function PublicSite({ route }) {
  if (route === '/privacy') return <PrivacyPage />
  if (route === '/terms') return <TermsPage />
  if (route === '/acceptable-use') return <AcceptableUsePage />
  return <HomePage />
}
