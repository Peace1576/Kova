export const kovaProducts = [
  {
    slug: "saver",
    name: "Money saver",
    badge: "Free to start",
    color: "green",
    price: "Free",
    priceSuffix: "15% of savings only",
    summary:
      "Kova compares live rates, negotiates bills, and only charges when the savings are real.",
    heroTitle: "Lower the bills that keep creeping up.",
    heroCopy:
      "Connect accounts, scan statements, and queue the first negotiation without paying upfront.",
    features: [
      "Connect accounts",
      "Scan bills",
      "Negotiate automatically",
      "Win card and fee only on success",
    ],
    metrics: [
      { label: "Savings this month", value: "$247", sub: "Comcast won" },
      { label: "Win rate", value: "68%", sub: "First attempt" },
      { label: "Fee", value: "15%", sub: "Of savings only" },
    ],
    details: [
      "Compare live provider rates.",
      "Use loyalty, competitor quotes, and escalation tactics.",
      "Pay only when Kova actually saves money.",
    ],
    colorValue: "#1A9E76",
    accent: "#1A9E76",
  },
  {
    slug: "legal",
    name: "Legal shield",
    badge: "Most popular",
    color: "purple",
    price: "$39/mo",
    summary:
      "Upload leases, NDAs, or vendor agreements and get a risk report in under a minute.",
    heroTitle: "Protect every agreement.",
    heroCopy:
      "Kova reads every clause, flags what is risky, and drafts pushback language.",
    features: ["Instant risk scan", "Pushback language", "Document vault", "Renewal alerts"],
    metrics: [
      { label: "Clauses reviewed", value: "12", sub: "3 need attention" },
      { label: "Speed", value: "60 sec", sub: "To first report" },
      { label: "Action", value: "Pushback", sub: "Ready to send" },
    ],
    details: [
      "Plain-English explanations for every clause.",
      "State-aware citations and legal basis.",
      "Encrypted vault with revocation controls.",
    ],
    colorValue: "#7B72E9",
    accent: "#7B72E9",
  },
  {
    slug: "build",
    name: "Build smarter",
    badge: "$299/mo",
    color: "amber",
    price: "$299/mo",
    summary:
      "Keep cities, trades, and rule changes in sync so teams know exactly what to file and when.",
    heroTitle: "Move permits without losing weeks.",
    heroCopy:
      "Kova keeps permit rules, forms, and project deadlines aligned for contractors and developers.",
    features: ["Live permit database", "Auto-filled applications", "Rule change alerts", "Multi-project tracker"],
    metrics: [
      { label: "Projects tracked", value: "9", sub: "2 municipalities" },
      { label: "Permit readiness", value: "Ready", sub: "Phoenix ADU" },
      { label: "Team seats", value: "$79", sub: "Per seat / mo" },
    ],
    details: [
      "Municipal APIs and zoning data stay synchronized.",
      "Permit checklists and applications are pre-filled.",
      "Rule change alerts reduce delays and rejections.",
    ],
    colorValue: "#C98B12",
    accent: "#C98B12",
  },
];

export const pricingPlans = [
  {
    slug: "saver",
    name: "Money saver",
    monthly: "Free",
    annual: "Free",
    subMonthly: "15% of savings only",
    subAnnual: "15% of savings only",
    features: ["Bill negotiation", "Live competitor rates", "Win card", "No win, no charge"],
  },
  {
    slug: "legal",
    name: "Legal shield",
    monthly: "$39",
    annual: "$31",
    subMonthly: "per month · cancel anytime",
    subAnnual: "per month · billed $374/yr",
    featured: true,
    features: ["Unlimited document analysis", "Risk scoring", "Pushback language", "Encrypted vault"],
  },
  {
    slug: "build",
    name: "Build smarter",
    monthly: "$299",
    annual: "$239",
    subMonthly: "per firm · team seats $79/mo",
    subAnnual: "per month · billed $2,868/yr",
    features: ["Municipal permit database", "Auto-filled applications", "Rule alerts", "Project tracker"],
  },
];

export const mobileScreens = {
  onboarding: {
    title: "Choose the path that fits right now.",
    summary:
      "Kova starts by asking what matters most. That keeps the app focused and makes the first minute feel simple.",
    points: ["No cluttered first run.", "One account across all paths.", "Clear next step after every screen."],
  },
  dashboard: {
    title: "Your advocate is active.",
    summary:
      "The dashboard shows what Kova is doing now, what it already won, and what needs your approval next.",
    points: ["Live savings and risk at a glance.", "Recent activity is always visible.", "One tap to jump into any path."],
  },
  report: {
    title: "Find the clauses that matter.",
    summary:
      "Kova highlights what is risky, explains why it matters, and gives the exact next move in plain English.",
    points: ["Red, amber, green risk structure.", "Legal basis shown beside each issue.", "Pushback language is one tap away."],
  },
  approval: {
    title: "You stay in control.",
    summary:
      "Kova prepares the action, shows the tactics, and waits for your approval before anything is sent or executed.",
    points: ["See exactly what Kova will do.", "Know the potential savings first.", "Approve or stop with one tap."],
  },
};

export const systemTree = [
  {
    title: "Platform core",
    items: ["SSO", "JWT sessions", "Billing", "Notifications", "MFA"],
  },
  {
    title: "Money saver",
    accent: "green",
    items: ["Plaid and bill upload", "Negotiation agent", "Savings ledger", "Win card"],
  },
  {
    title: "Legal shield",
    accent: "purple",
    items: ["PDF parser", "Clause classifier", "Jurisdiction engine", "Document vault"],
  },
  {
    title: "Build smarter",
    accent: "amber",
    items: ["Municipal APIs", "Permit checker", "Rule alerts", "Project tracker"],
  },
];

export const homeSections = {
  steps: [
    {
      label: "01",
      title: "Tell Kova your situation",
      body: "Choose what you need most. Start with money, legal, or permits.",
    },
    {
      label: "02",
      title: "Kova analyzes and prepares",
      body: "It reads your contract, bill, or project info and generates the right action.",
    },
    {
      label: "03",
      title: "You approve, Kova executes",
      body: "One tap to authorize. Then Kova does the hard part and reports back.",
    },
  ],
  faqs: [
    {
      q: "Is Kova authorized to act for me?",
      a: "Yes. The flow uses a limited authorization step so Kova only acts on the actions you approve.",
    },
    {
      q: "What if the saver module does not win?",
      a: "You do not pay the performance fee unless Kova actually lowers the bill.",
    },
    {
      q: "Can I use all three paths?",
      a: "Yes. The shared account, vault, and notifications are designed to make cross-sell natural without extra friction.",
    },
    {
      q: "What makes the product defensible?",
      a: "A shared data flywheel, switching costs from the vault, and domain depth generic AI chat cannot match.",
    },
  ],
};

export const agreementDocs = [
  {
    slug: "kova-lpoa-v2-1-0",
    name: "Limited Power of Attorney",
    fileName: "kova_lpoa_v2.1.0.docx",
    path: "/agreements/kova_lpoa_v2.1.0.docx",
    version: "v2.1.0",
    reviewedByCounsel: false,
    summary: "Authorization flow for the saver module and other approved actions.",
    use: "Required before Kova can negotiate on your behalf.",
    excerpt:
      "Limited authority for bill negotiation only. The user can revoke the authorization at any time, and the document is not required for other Kova services.",
    highlights: ["Limited authority", "Revocable at any time", "Negotiation only"],
    requiredFor: ["saver"],
  },
  {
    slug: "kova-terms-of-service-v1-0-0",
    name: "Terms of Service",
    fileName: "kova_terms_of_service_v1.0.0.docx",
    path: "/agreements/kova_terms_of_service_v1.0.0.docx",
    version: "v1.0.0",
    reviewedByCounsel: false,
    summary: "Core platform terms covering account use, limitations, and permissions.",
    use: "Standard app terms every user accepts at signup.",
    excerpt:
      "By creating an account or using Kova, the user agrees to the Terms. The service covers legal shield, money saver, and build modules, and users must be at least 18 years old.",
    highlights: ["Account acceptance", "18+ requirement", "Covers all modules"],
    requiredFor: ["saver", "legal", "build"],
  },
  {
    slug: "kova-privacy-policy-v1-0-0",
    name: "Privacy Policy",
    fileName: "kova_privacy_policy_v1.0.0.docx",
    path: "/agreements/kova_privacy_policy_v1.0.0.docx",
    version: "v1.0.0",
    reviewedByCounsel: false,
    summary: "How Kova stores, processes, and protects personal and legal data.",
    use: "Explains storage, sharing, retention, and user rights.",
    excerpt:
      "Kova collects account details, uploaded documents, and payment metadata. Payment information is processed by Stripe, and complete card numbers are not stored by Kova.",
    highlights: ["Stripe processing", "Document storage", "User data rights"],
    requiredFor: ["saver", "legal", "build"],
  },
  {
    slug: "kova-beta-nda-v1-0-0",
    name: "Beta NDA",
    fileName: "kova_beta_nda_v1.0.0.docx",
    path: "/agreements/kova_beta_nda_v1.0.0.docx",
    version: "v1.0.0",
    reviewedByCounsel: false,
    summary: "Confidentiality terms for early access and beta product testing.",
    use: "For private pilots, demos, and invite-only testing.",
    excerpt:
      "This mutual confidentiality agreement is for beta testers evaluating Kova's pre-release platform. Confidential and proprietary information must stay private during the evaluation period.",
    highlights: ["Beta access only", "Mutual confidentiality", "Pre-release testing"],
    requiredFor: ["build"],
  },
];

export const agreementPlanRequirements = {
  saver: ["kova-terms-of-service-v1-0-0", "kova-privacy-policy-v1-0-0", "kova-lpoa-v2-1-0"],
  legal: ["kova-terms-of-service-v1-0-0", "kova-privacy-policy-v1-0-0"],
  build: ["kova-terms-of-service-v1-0-0", "kova-privacy-policy-v1-0-0", "kova-beta-nda-v1-0-0"],
};

export const agreementPlanDisclosures = {
  saver: [
    "You are authorizing bill negotiation only, and the limited power of attorney can be revoked.",
    "Performance fees apply only when Kova actually produces savings.",
    "Your account will record a signed consent log for the negotiation authority.",
  ],
  legal: [
    "Kova is a document-review tool, not a law firm or substitute for a licensed attorney.",
    "The service can flag risk and suggest edits, but you decide what to send or sign.",
    "Your privacy policy, retention notice, and support contacts are part of the signup review.",
  ],
  build: [
    "Beta features may change, break, or disappear while the product is in evaluation.",
    "The beta NDA covers confidential product details and pre-release access.",
    "Only the terms you approve are logged for launch and compliance records.",
  ],
};

export const supportContacts = {
  supportEmail: "support@kova.app",
  billingEmail: "billing@kova.app",
  disputesEmail: "disputes@kova.app",
  privacyEmail: "privacy@kova.app",
  responseTime: "within 2 business days",
};

export const privacyNotice = [
  "Kova stores account details, accepted agreements, consent logs, and activity necessary to run your account.",
  "This build does not include third-party analytics; optional analytics consent is off by default.",
  "You can request a copy of your records, revoke consent, or delete your account from the compliance tools in the dashboard.",
];
