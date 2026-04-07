const root = document.documentElement;

const modules = {
  saver: {
    name: "Money saver",
    theme: {
      brand: "#1A9E76",
      brandSoft: "#8be0c1",
      rgb: "26, 158, 118",
    },
    kicker: "Money saver",
    title: "Lower the bills that keep creeping up.",
    copy:
      "Kova compares live rates, reaches providers, and negotiates for you. You pay only when savings are real.",
    metrics: [
      { label: "Savings this month", value: "$247", sub: "Comcast won" },
      { label: "Win rate", value: "68%", sub: "First attempt" },
      { label: "Fee", value: "15%", sub: "Of savings only" },
    ],
    list: [
      {
        tone: "green",
        title: "Compare rates instantly",
        copy: "Kova checks live offers so the negotiation starts with leverage.",
      },
      {
        tone: "purple",
        title: "Use the right tactics",
        copy: "Loyalty, competitor quotes, and escalation are all built in.",
      },
      {
        tone: "amber",
        title: "Pay only when it works",
        copy: "The saver module stays free until Kova actually lowers the bill.",
      },
    ],
    detail: {
      title: "Cut your monthly bills",
      copy:
        "Connect accounts, scan statements, and queue the first negotiation without paying upfront.",
      price: "Free",
      priceSuffix: "",
      cta: "Start saving free",
      features: [
        "Connect accounts",
        "Scan bills",
        "Negotiate automatically",
        "Win card and fee only on success",
      ],
      metricLabel: "Average savings",
      metricValue: "$247",
      metricSub: "Per active user",
      metricLabel2: "Time to first win",
      metricValue2: "15-45m",
      metricSub2: "Typical range",
      metricLabel3: "Current path",
      metricValue3: "Saver",
      metricSub3: "Free to start",
    },
    livePill: "Money saver active",
  },
  legal: {
    name: "Legal shield",
    theme: {
      brand: "#7B72E9",
      brandSoft: "#B0A9F5",
      rgb: "123, 114, 233",
    },
    kicker: "Legal shield",
    title: "Protect every agreement.",
    copy:
      "Upload a lease, NDA, or vendor agreement and get a risk report in under a minute.",
    metrics: [
      { label: "Clauses reviewed", value: "12", sub: "3 need attention" },
      { label: "Speed", value: "60 sec", sub: "To first report" },
      { label: "Action", value: "Pushback", sub: "Ready to send" },
    ],
    list: [
      {
        tone: "green",
        title: "Plain-English explanation",
        copy: "Every clause gets translated into something a real person can use.",
      },
      {
        tone: "purple",
        title: "State-aware citations",
        copy: "Kova adds the legal basis, so you are not guessing at next steps.",
      },
      {
        tone: "amber",
        title: "Vaulted and revocable",
        copy: "Your documents stay encrypted, private, and under your control.",
      },
    ],
    detail: {
      title: "Protect yourself legally",
      copy:
        "Upload any contract, lease, or NDA. Kova reads every clause, flags what is risky, and drafts pushback language.",
      price: "$39",
      priceSuffix: "/mo",
      cta: "Start Legal shield",
      features: [
        "Instant risk scan",
        "Pushback language",
        "Document vault",
        "Renewal alerts",
      ],
      metricLabel: "Clauses reviewed",
      metricValue: "12",
      metricSub: "3 need attention",
      metricLabel2: "Report speed",
      metricValue2: "60s",
      metricSub2: "Typical turnaround",
      metricLabel3: "Current path",
      metricValue3: "Legal",
      metricSub3: "Most popular",
    },
    livePill: "Legal shield active",
  },
  build: {
    name: "Build smarter",
    theme: {
      brand: "#C98B12",
      brandSoft: "#F7C863",
      rgb: "201, 139, 18",
    },
    kicker: "Build smarter",
    title: "Move permits without losing weeks.",
    copy:
      "Kova keeps cities, trades, and rule changes in sync so teams know exactly what to file, when to file it, and what changed.",
    metrics: [
      { label: "Projects tracked", value: "9", sub: "2 municipalities" },
      { label: "Permit readiness", value: "Ready", sub: "Phoenix ADU" },
      { label: "Team seats", value: "$79", sub: "Per seat / mo" },
    ],
    list: [
      {
        tone: "green",
        title: "Live municipal database",
        copy: "Permit rules stay aligned with city portals and code changes.",
      },
      {
        tone: "purple",
        title: "Auto-filled applications",
        copy: "Forms are pre-populated so teams spend less time retyping.",
      },
      {
        tone: "amber",
        title: "Rule change alerts",
        copy: "Kova flags jurisdiction changes before they cause delays.",
      },
    ],
    detail: {
      title: "Navigate permits faster",
      copy:
        "Real-time permit requirements, zoning intelligence, and rule change alerts for contractors and developers.",
      price: "$299",
      priceSuffix: "/mo",
      cta: "Start Build smarter",
      features: [
        "Live permit database",
        "Auto-filled applications",
        "Rule change alerts",
        "Multi-project tracker",
      ],
      metricLabel: "Projects tracked",
      metricValue: "9",
      metricSub: "By city and phase",
      metricLabel2: "Status",
      metricValue2: "Ready",
      metricSub2: "Phoenix ADU permit",
      metricLabel3: "Current path",
      metricValue3: "Build",
      metricSub3: "High value",
    },
    livePill: "Build smarter active",
  },
};

const mobileScreens = {
  onboarding: {
    kicker: "Onboarding",
    title: "Choose the path that fits right now.",
    description:
      "Kova starts by asking what matters most. That keeps the app focused and makes the first minute feel simple.",
    points: [
      "No cluttered first run.",
      "One account across all paths.",
      "Clear next step after every screen.",
    ],
    html: () => `
      <div class="phone-screen">
        <div class="phone-header">
          <div class="phone-logo">
            <svg viewBox="0 0 44 44" aria-hidden="true">
              <g transform="translate(7,6)">
                <rect x="0" y="0" width="7" height="32" rx="2.5" fill="currentColor"></rect>
                <path d="M7 16 L24 1" stroke="currentColor" stroke-width="7" stroke-linecap="round"></path>
                <path d="M7 16 L24 31" style="stroke: var(--brand-soft);" stroke-width="7" stroke-linecap="round"></path>
              </g>
            </svg>
            <span>kova.</span>
          </div>
          <span class="path-tag">Step 1 of 2</span>
        </div>
        <div class="phone-card">
          <span class="path-tag">Choose a path</span>
          <h3 class="phone-title">What brings you to Kova?</h3>
          <p class="phone-subtitle">Pick your primary need. You can unlock all three anytime.</p>
          <div class="path-card" style="border-color: rgba(var(--brand-rgb), .2); background: rgba(var(--brand-rgb), .06);">
            <div class="path-tag">Money saver</div>
            <div class="phone-path-title">Cut my monthly bills</div>
            <div class="phone-path-copy">Kova negotiates Comcast, AT&amp;T, insurance and more.</div>
          </div>
          <div class="path-card" style="border-color: rgba(var(--brand-rgb), .32); background: rgba(var(--brand-rgb), .1);">
            <div class="path-tag">Legal shield</div>
            <div class="phone-path-title">Protect me legally</div>
            <div class="phone-path-copy">Upload a contract. Get a risk report in 60 seconds.</div>
          </div>
          <div class="path-card" style="border-color: rgba(var(--warning-rgb), .2); background: rgba(var(--warning-rgb), .07);">
            <div class="path-tag">Build smarter</div>
            <div class="phone-path-title">Navigate permits faster</div>
            <div class="phone-path-copy">Live permit rules by city, trade, and project type.</div>
          </div>
          <div class="module-cta-row" style="margin-top: 12px;">
            <a class="btn btn-primary" href="#modules">Continue</a>
          </div>
        </div>
      </div>
    `,
  },
  dashboard: {
    kicker: "Dashboard",
    title: "Your advocate is active.",
    description:
      "The dashboard shows what Kova is doing now, what it already won, and what needs your approval next.",
    points: [
      "Live savings and risk at a glance.",
      "Recent activity is always visible.",
      "One tap to jump into any path.",
    ],
    html: () => `
      <div class="phone-screen">
        <div class="phone-header">
          <div class="phone-logo">
            <svg viewBox="0 0 44 44" aria-hidden="true">
              <g transform="translate(7,6)">
                <rect x="0" y="0" width="7" height="32" rx="2.5" fill="currentColor"></rect>
                <path d="M7 16 L24 1" stroke="currentColor" stroke-width="7" stroke-linecap="round"></path>
                <path d="M7 16 L24 31" style="stroke: var(--brand-soft);" stroke-width="7" stroke-linecap="round"></path>
              </g>
            </svg>
            <span>kova.</span>
          </div>
          <div class="path-tag" style="text-transform:none; letter-spacing:0;">JD</div>
        </div>
        <div class="phone-card">
          <span class="path-tag">Active</span>
          <h3 class="phone-title">Good morning, Jordan.</h3>
          <p class="phone-subtitle">Your advocate is working across money, rights, and permits.</p>
          <div class="phone-stat-grid">
            <div class="phone-stat">
              <span>Saved this month</span>
              <strong style="color: var(--success);">$247</strong>
            </div>
            <div class="phone-stat">
              <span>Docs analyzed</span>
              <strong style="color: var(--brand);">7</strong>
            </div>
            <div class="phone-stat">
              <span>Bills monitored</span>
              <strong>4</strong>
            </div>
            <div class="phone-stat">
              <span>Win rate</span>
              <strong style="color: var(--brand);">68%</strong>
            </div>
          </div>
        </div>
        <div class="phone-card">
          <span class="path-tag">Recent activity</span>
          <div class="phone-list">
            <div class="phone-item">
              <div class="phone-item-dot" style="background: var(--success);"></div>
              <div>
                <strong>Comcast negotiated</strong>
                <p>Today · <span style="color: var(--success);">-$48/mo</span></p>
              </div>
            </div>
            <div class="phone-item">
              <div class="phone-item-dot" style="background: var(--brand);"></div>
              <div>
                <strong>Lease analyzed</strong>
                <p>Yesterday · 12 clauses reviewed</p>
              </div>
            </div>
            <div class="phone-item">
              <div class="phone-item-dot" style="background: var(--warning);"></div>
              <div>
                <strong>AT&amp;T negotiation</strong>
                <p>In progress · awaiting response</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  },
  report: {
    kicker: "Risk report",
    title: "Find the clauses that matter.",
    description:
      "Kova highlights what is risky, explains why it matters, and gives the exact next move in plain English.",
    points: [
      "Red, amber, green risk structure.",
      "Legal basis shown beside each issue.",
      "Pushback language is one tap away.",
    ],
    html: () => `
      <div class="phone-screen">
        <div class="phone-header">
          <div class="phone-logo">
            <svg viewBox="0 0 44 44" aria-hidden="true">
              <g transform="translate(7,6)">
                <rect x="0" y="0" width="7" height="32" rx="2.5" fill="currentColor"></rect>
                <path d="M7 16 L24 1" stroke="currentColor" stroke-width="7" stroke-linecap="round"></path>
                <path d="M7 16 L24 31" style="stroke: var(--brand-soft);" stroke-width="7" stroke-linecap="round"></path>
              </g>
            </svg>
            <span>kova.</span>
          </div>
          <span class="path-tag">Share</span>
        </div>
        <div class="phone-card">
          <span class="path-tag">Lease agreement</span>
          <h3 class="phone-title">2426 N Central Ave - Unit 4B</h3>
          <p class="phone-subtitle">12-month residential lease · Phoenix, AZ</p>
          <div class="phone-stat-grid">
            <div class="phone-stat">
              <span>High risk</span>
              <strong style="color: var(--danger);">3</strong>
            </div>
            <div class="phone-stat">
              <span>Review</span>
              <strong style="color: var(--warning);">2</strong>
            </div>
            <div class="phone-stat">
              <span>Standard</span>
              <strong style="color: var(--success);">7</strong>
            </div>
            <div class="phone-stat">
              <span>Report time</span>
              <strong>60s</strong>
            </div>
          </div>
        </div>
        <div class="phone-card" style="border-color: rgba(var(--danger-rgb), .2); background: rgba(var(--danger-rgb), .06);">
          <span class="path-tag">High risk</span>
          <div class="phone-path-title">10-day notice for rent raise</div>
          <div class="phone-path-copy">Landlord can increase rent with only 10 days notice. Kova flags this immediately.</div>
        </div>
        <div class="phone-card" style="border-color: rgba(var(--danger-rgb), .2); background: rgba(var(--danger-rgb), .06);">
          <span class="path-tag">High risk</span>
          <div class="phone-path-title">Auto-renewal trap</div>
          <div class="phone-path-copy">Renewal terms can lock you in unless you act in time.</div>
        </div>
        <div class="phone-card" style="border-color: rgba(var(--warning-rgb), .2); background: rgba(var(--warning-rgb), .06);">
          <span class="path-tag">Review</span>
          <div class="phone-path-title">Entry notice wording</div>
          <div class="phone-path-copy">Kova checks whether it is a right, a courtesy, or a vague promise.</div>
        </div>
      </div>
    `,
  },
  approval: {
    kicker: "Approval",
    title: "You stay in control.",
    description:
      "Kova prepares the action, shows the tactics, and waits for your approval before anything is sent or executed.",
    points: [
      "See exactly what Kova will do.",
      "Know the potential savings first.",
      "Approve or stop with one tap.",
    ],
    html: () => `
      <div class="phone-screen">
        <div class="phone-header">
          <div class="phone-logo">
            <svg viewBox="0 0 44 44" aria-hidden="true">
              <g transform="translate(7,6)">
                <rect x="0" y="0" width="7" height="32" rx="2.5" fill="currentColor"></rect>
                <path d="M7 16 L24 1" stroke="currentColor" stroke-width="7" stroke-linecap="round"></path>
                <path d="M7 16 L24 31" style="stroke: var(--brand-soft);" stroke-width="7" stroke-linecap="round"></path>
              </g>
            </svg>
            <span>kova.</span>
          </div>
          <span class="path-tag">Action needed</span>
        </div>
        <div class="phone-card">
          <span class="path-tag">Comcast chat negotiation</span>
          <h3 class="phone-title">Ready to negotiate now</h3>
          <p class="phone-subtitle">Kova found a cheaper competitor quote and is ready to use your loyalty history.</p>
          <div class="phone-card" style="margin-top: 12px; border-color: rgba(var(--brand-rgb), .22); background: rgba(var(--brand-rgb), .05);">
            <span class="path-tag">Tactics</span>
            <div class="phone-path-copy">Competitor quote · loyalty mention · supervisor escalation · rate match request</div>
          </div>
          <div class="phone-stat-grid" style="margin-top: 12px;">
            <div class="phone-stat">
              <span>Estimated savings</span>
              <strong style="color: var(--success);">$47-78</strong>
            </div>
            <div class="phone-stat">
              <span>Kova fee</span>
              <strong>$7-12</strong>
            </div>
          </div>
        </div>
        <div class="phone-card" style="border-color: rgba(var(--brand-rgb), .2); background: rgba(var(--brand-rgb), .05);">
          <div class="phone-header" style="padding: 0; margin-bottom: 10px;">
            <span class="path-tag">Window closes soon</span>
            <strong style="font-size: 12px; color: var(--subtle);">14:32</strong>
          </div>
          <div style="height: 4px; border-radius: 999px; background: rgba(255,255,255,.07); overflow: hidden;">
            <div style="height: 100%; width: 78%; border-radius: inherit; background: var(--brand);"></div>
          </div>
        </div>
        <div class="module-cta-row" style="margin-top: 0;">
          <a class="btn btn-primary" href="#pricing">Approve</a>
          <a class="btn btn-ghost" href="#mobile">Skip for now</a>
        </div>
      </div>
    `,
  },
};

const billing = {
  annual: false,
  prices: {
    legal: { monthly: "$39", annual: "$31" },
    build: { monthly: "$299", annual: "$239" },
    legalSub: {
      monthly: "per month · cancel anytime",
      annual: "per month · billed $374/yr",
    },
    buildSub: {
      monthly: "per firm · team seats $79/mo",
      annual: "per month · billed $2,868/yr",
    },
    compareLegal: {
      monthly: "$39/mo",
      annual: "$31/mo",
    },
    compareBuild: {
      monthly: "$299/mo",
      annual: "$239/mo",
    },
  },
};

const els = {
  livePill: document.getElementById("livePill"),
  heroKicker: document.getElementById("heroKicker"),
  heroTitle: document.getElementById("heroTitle"),
  heroCopy: document.getElementById("heroCopy"),
  heroMetrics: document.getElementById("heroMetrics"),
  heroList: document.getElementById("heroList"),
  moduleKicker: document.getElementById("moduleKicker"),
  moduleName: document.getElementById("moduleName"),
  modulePrice: document.getElementById("modulePrice"),
  moduleCopy: document.getElementById("moduleCopy"),
  moduleCTA: document.getElementById("moduleCTA"),
  moduleFeatures: document.getElementById("moduleFeatures"),
  metricLabel: document.getElementById("metricLabel"),
  metricValue: document.getElementById("metricValue"),
  metricSub: document.getElementById("metricSub"),
  metricLabel2: document.getElementById("metricLabel2"),
  metricValue2: document.getElementById("metricValue2"),
  metricSub2: document.getElementById("metricSub2"),
  metricLabel3: document.getElementById("metricLabel3"),
  metricValue3: document.getElementById("metricValue3"),
  metricSub3: document.getElementById("metricSub3"),
  moduleTabs: [...document.querySelectorAll("[data-module]")],
  mobileTabs: [...document.querySelectorAll("[data-mobile]")],
  mobileKicker: document.getElementById("mobileKicker"),
  mobileTitle: document.getElementById("mobileTitle"),
  mobileDescription: document.getElementById("mobileDescription"),
  mobilePoints: document.getElementById("mobilePoints"),
  mobileScreen: document.getElementById("mobileScreen"),
  billingToggle: document.getElementById("billingToggle"),
  saverPrice: document.getElementById("saverPrice"),
  saverSub: document.getElementById("saverSub"),
  legalPrice: document.getElementById("legalPrice"),
  legalSub: document.getElementById("legalSub"),
  buildPrice: document.getElementById("buildPrice"),
  buildSub: document.getElementById("buildSub"),
  legalComparePrice: document.getElementById("legalComparePrice"),
  buildComparePrice: document.getElementById("buildComparePrice"),
};

const moduleState = {
  active: "legal",
};

function setTheme(theme) {
  root.style.setProperty("--brand", theme.brand);
  root.style.setProperty("--brand-soft", theme.brandSoft);
  root.style.setProperty("--brand-rgb", theme.rgb);
}

function renderModule(key) {
  const mod = modules[key];
  if (!mod) return;

  moduleState.active = key;
  setTheme(mod.theme);

  els.livePill.textContent = mod.livePill;
  els.heroKicker.textContent = mod.kicker;
  els.heroTitle.textContent = mod.title;
  els.heroCopy.textContent = mod.copy;

  els.heroMetrics.innerHTML = mod.metrics
    .map(
      (metric) => `
        <article class="metric-card" style="border-color: rgba(${mod.theme.rgb}, .2);">
          <span>${metric.label}</span>
          <strong style="color: ${mod.theme.brand};">${metric.value}</strong>
          <small>${metric.sub}</small>
        </article>
      `
    )
    .join("");

  els.heroList.innerHTML = mod.list
    .map(
      (item) => `
        <div class="panel-row">
          <div class="panel-dot ${item.tone}"></div>
          <div>
            <strong>${item.title}</strong>
            <p>${item.copy}</p>
          </div>
        </div>
      `
    )
    .join("");

  els.moduleKicker.textContent = mod.name;
  els.moduleName.textContent = mod.detail.title;
  els.moduleCopy.textContent = mod.detail.copy;
  els.modulePrice.innerHTML = mod.detail.priceSuffix
    ? `${mod.detail.price}<span>${mod.detail.priceSuffix}</span>`
    : mod.detail.price;
  els.moduleCTA.textContent = mod.detail.cta;
  els.moduleCTA.href = key === "saver" ? "#mobile" : "#pricing";

  els.moduleFeatures.innerHTML = mod.detail.features
    .map((feature) => `<div class="feature-chip">${feature}</div>`)
    .join("");

  els.metricLabel.textContent = mod.detail.metricLabel;
  els.metricValue.textContent = mod.detail.metricValue;
  els.metricSub.textContent = mod.detail.metricSub;
  els.metricLabel2.textContent = mod.detail.metricLabel2;
  els.metricValue2.textContent = mod.detail.metricValue2;
  els.metricSub2.textContent = mod.detail.metricSub2;
  els.metricLabel3.textContent = mod.detail.metricLabel3;
  els.metricValue3.textContent = mod.detail.metricValue3;
  els.metricSub3.textContent = mod.detail.metricSub3;

  els.moduleTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.module === key);
    button.setAttribute("aria-selected", String(button.dataset.module === key));
  });
}

function renderMobile(key) {
  const screen = mobileScreens[key];
  if (!screen) return;

  els.mobileKicker.textContent = screen.kicker;
  els.mobileTitle.textContent = screen.title;
  els.mobileDescription.textContent = screen.description;
  els.mobilePoints.innerHTML = screen.points
    .map(
      (point) => `
        <div class="point">
          <span></span>
          <p>${point}</p>
        </div>
      `
    )
    .join("");

  els.mobileScreen.innerHTML = screen.html();

  els.mobileTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mobile === key);
    button.setAttribute("aria-selected", String(button.dataset.mobile === key));
  });
}

function setBilling(annual) {
  billing.annual = annual;

  els.billingToggle.classList.toggle("is-annual", annual);
  els.billingToggle.setAttribute("aria-checked", String(annual));

  els.legalPrice.textContent = billing.prices.legal[annual ? "annual" : "monthly"];
  els.legalSub.textContent = billing.prices.legalSub[annual ? "annual" : "monthly"];
  els.buildPrice.textContent = billing.prices.build[annual ? "annual" : "monthly"];
  els.buildSub.textContent = billing.prices.buildSub[annual ? "annual" : "monthly"];
  els.legalComparePrice.textContent = billing.prices.compareLegal[annual ? "annual" : "monthly"];
  els.buildComparePrice.textContent = billing.prices.compareBuild[annual ? "annual" : "monthly"];
}

function bindTabs() {
  els.moduleTabs.forEach((button) => {
    button.addEventListener("click", () => renderModule(button.dataset.module));
  });

  els.mobileTabs.forEach((button) => {
    button.addEventListener("click", () => renderMobile(button.dataset.mobile));
  });
}

function bindBillingToggle() {
  const toggle = () => setBilling(!billing.annual);

  els.billingToggle.addEventListener("click", toggle);
  els.billingToggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  });
}

function bindReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((item) => observer.observe(item));
}

bindTabs();
bindBillingToggle();
bindReveal();
renderModule(moduleState.active);
renderMobile("onboarding");
setBilling(false);
