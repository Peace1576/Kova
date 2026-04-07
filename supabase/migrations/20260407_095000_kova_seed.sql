create table if not exists public.kova_products (
  slug text primary key,
  name text not null,
  badge text not null,
  color text not null,
  price text not null,
  price_suffix text,
  summary text not null,
  hero_title text not null,
  hero_copy text not null,
  features jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '[]'::jsonb,
  details jsonb not null default '[]'::jsonb,
  color_value text not null,
  accent text not null
);

create table if not exists public.kova_pricing_plans (
  slug text primary key,
  name text not null,
  monthly text not null,
  annual text not null,
  sub_monthly text not null,
  sub_annual text not null,
  featured boolean not null default false,
  features jsonb not null default '[]'::jsonb
);

create table if not exists public.kova_agreements (
  slug text primary key,
  name text not null,
  file_name text not null,
  path text not null,
  version text not null,
  summary text not null,
  use text not null,
  excerpt text not null,
  highlights jsonb not null default '[]'::jsonb,
  required_for jsonb not null default '[]'::jsonb,
  reviewed_by_counsel boolean not null default false
);

create table if not exists public.kova_app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

insert into public.kova_products (
  slug, name, badge, color, price, price_suffix, summary, hero_title, hero_copy, features, metrics, details, color_value, accent
) values
  (
    'saver',
    'Money saver',
    'Free to start',
    'green',
    'Free',
    '15% of savings only',
    'Kova compares live rates, negotiates bills, and only charges when the savings are real.',
    'Lower the bills that keep creeping up.',
    'Connect accounts, scan statements, and queue the first negotiation without paying upfront.',
    '["Connect accounts","Scan bills","Negotiate automatically","Win card and fee only on success"]'::jsonb,
    '[{"label":"Savings this month","value":"$247","sub":"Comcast won"},{"label":"Win rate","value":"68%","sub":"First attempt"},{"label":"Fee","value":"15%","sub":"Of savings only"}]'::jsonb,
    '["Compare live provider rates.","Use loyalty, competitor quotes, and escalation tactics.","Pay only when Kova actually saves money."]'::jsonb,
    '#1A9E76',
    '#1A9E76'
  ),
  (
    'legal',
    'Legal shield',
    'Most popular',
    'purple',
    '$39/mo',
    null,
    'Upload leases, NDAs, or vendor agreements and get a risk report in under a minute.',
    'Protect every agreement.',
    'Kova reads every clause, flags what is risky, and drafts pushback language.',
    '["Instant risk scan","Pushback language","Document vault","Renewal alerts"]'::jsonb,
    '[{"label":"Clauses reviewed","value":"12","sub":"3 need attention"},{"label":"Speed","value":"60 sec","sub":"To first report"},{"label":"Action","value":"Pushback","sub":"Ready to send"}]'::jsonb,
    '["Plain-English explanations for every clause.","State-aware citations and legal basis.","Encrypted vault with revocation controls."]'::jsonb,
    '#7B72E9',
    '#7B72E9'
  ),
  (
    'build',
    'Build smarter',
    'For builders',
    'amber',
    '$299/mo',
    null,
    'Keep cities, trades, and rule changes in sync so teams know exactly what to file and when.',
    'Move permits without losing weeks.',
    'Kova keeps permit rules, forms, and project deadlines aligned for contractors and developers.',
    '["Live permit database","Auto-filled applications","Rule change alerts","Multi-project tracker"]'::jsonb,
    '[{"label":"Projects tracked","value":"9","sub":"2 municipalities"},{"label":"Permit readiness","value":"Ready","sub":"Phoenix ADU"},{"label":"Team seats","value":"$79","sub":"Per seat / mo"}]'::jsonb,
    '["Municipal APIs and zoning data stay synchronized.","Permit checklists and applications are pre-filled.","Rule change alerts reduce delays and rejections."]'::jsonb,
    '#C98B12',
    '#C98B12'
  )
on conflict (slug) do nothing;

insert into public.kova_pricing_plans (
  slug, name, monthly, annual, sub_monthly, sub_annual, featured, features
) values
  (
    'saver',
    'Money saver',
    'Free',
    'Free',
    '15% of savings only',
    '15% of savings only',
    false,
    '["Bill negotiation","Live competitor rates","Win card","No win, no charge"]'::jsonb
  ),
  (
    'legal',
    'Legal shield',
    '$39',
    '$31',
    'per month · cancel anytime',
    'per month · billed $374/yr',
    true,
    '["Unlimited document analysis","Risk scoring","Pushback language","Encrypted vault"]'::jsonb
  ),
  (
    'build',
    'Build smarter',
    '$299',
    '$239',
    'per firm · team seats $79/mo',
    'per month · billed $2,868/yr',
    false,
    '["Municipal permit database","Auto-filled applications","Rule alerts","Project tracker"]'::jsonb
  )
on conflict (slug) do nothing;

insert into public.kova_agreements (
  slug, name, file_name, path, version, summary, use, excerpt, highlights, required_for, reviewed_by_counsel
) values
  (
    'kova-lpoa-v2-1-0',
    'Limited Power of Attorney',
    'kova_lpoa_v2.1.0.docx',
    '/agreements/kova_lpoa_v2.1.0.docx',
    'v2.1.0',
    'Authorization flow for the saver module and other approved actions.',
    'Required before Kova can negotiate on your behalf.',
    'Limited authority for bill negotiation only. The user can revoke the authorization at any time, and the document is not required for other Kova services.',
    '["Limited authority","Revocable at any time","Negotiation only"]'::jsonb,
    '["saver"]'::jsonb,
    false
  ),
  (
    'kova-terms-of-service-v1-0-0',
    'Terms of Service',
    'kova_terms_of_service_v1.0.0.docx',
    '/agreements/kova_terms_of_service_v1.0.0.docx',
    'v1.0.0',
    'Core platform terms covering account use, limitations, and permissions.',
    'Standard app terms every user accepts at signup.',
    'By creating an account or using Kova, the user agrees to the Terms. The service covers legal shield, money saver, and build modules, and users must be at least 18 years old.',
    '["Account acceptance","18+ requirement","Covers all modules"]'::jsonb,
    '["saver","legal","build"]'::jsonb,
    false
  ),
  (
    'kova-privacy-policy-v1-0-0',
    'Privacy Policy',
    'kova_privacy_policy_v1.0.0.docx',
    '/agreements/kova_privacy_policy_v1.0.0.docx',
    'v1.0.0',
    'How Kova stores, processes, and protects personal and legal data.',
    'Explains storage, sharing, retention, and user rights.',
    'Kova collects account details, uploaded documents, and payment metadata. Payment information is processed by Stripe, and complete card numbers are not stored by Kova.',
    '["Stripe processing","Document storage","User data rights"]'::jsonb,
    '["saver","legal","build"]'::jsonb,
    false
  ),
  (
    'kova-beta-nda-v1-0-0',
    'Beta NDA',
    'kova_beta_nda_v1.0.0.docx',
    '/agreements/kova_beta_nda_v1.0.0.docx',
    'v1.0.0',
    'Confidentiality terms for early access and beta product testing.',
    'For private pilots, demos, and invite-only testing.',
    'This mutual confidentiality agreement is for beta testers evaluating Kova''s pre-release platform. Confidential and proprietary information must stay private during the evaluation period.',
    '["Beta access only","Mutual confidentiality","Pre-release testing"]'::jsonb,
    '["build"]'::jsonb,
    false
  )
on conflict (slug) do nothing;

insert into public.kova_app_settings (key, value) values
  (
    'support_contacts',
    '{"supportEmail":"support@kova.app","billingEmail":"billing@kova.app","disputesEmail":"disputes@kova.app","privacyEmail":"privacy@kova.app","responseTime":"within 2 business days"}'::jsonb
  ),
  (
    'privacy_notice',
    '{"items":["Kova stores account details, accepted agreements, consent logs, and activity necessary to run your account.","This build does not include third-party analytics; optional analytics consent is off by default.","You can request a copy of your records, revoke consent, or delete your account from the compliance tools in the dashboard."]}'::jsonb
  )
on conflict (key) do update set value = excluded.value;
