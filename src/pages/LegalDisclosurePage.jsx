import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { agreementDocs, agreementPlanDisclosures, agreementPlanRequirements, privacyNotice, supportContacts } from "../data/kovaData";

const planLabels = {
  saver: "Money saver",
  legal: "Legal shield",
  build: "Build smarter",
};

export function LegalDisclosurePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const plan = params.get("plan") || "legal";
  const requiredDocs = (agreementPlanRequirements[plan] || []).map((slug) => agreementDocs.find((doc) => doc.slug === slug)).filter(Boolean);
  const disclosure = agreementPlanDisclosures[plan] || agreementPlanDisclosures.legal;

  const continueToConsent = () => {
    navigate(`/legal/consent?plan=${plan}`);
  };

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <span className="eyebrow">Plan disclosure</span>
          <h2>Review the plan-specific terms before you sign up.</h2>
        </div>
        <p className="section-copy">
          This screen surfaces the terms that matter for the selected plan, along with privacy, support, and dispute contacts.
        </p>
      </div>

      <div className="panel disclosure-panel">
        <div className="legal-gate-header">
          <div>
            <p className="panel-kicker">Selected plan</p>
            <h3>{planLabels[plan] || "Legal shield"}</h3>
          </div>
          <Link className="status-chip" to={`/pricing`}>
            Change plan
          </Link>
        </div>

        <div className="disclosure-grid">
          <article className="disclosure-card">
            <span className="panel-kicker">Required docs</span>
            <ul className="audit-checklist">
              {requiredDocs.map((doc) => (
                <li key={doc.slug}>
                  <strong>{doc.name}</strong> · {doc.version || "version n/a"}
                </li>
              ))}
            </ul>
          </article>

          <article className="disclosure-card">
            <span className="panel-kicker">Plan-specific notice</span>
            <ul className="audit-checklist">
              {disclosure.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className="disclosure-support-grid">
          <article className="agreement-note">
            <strong>Privacy controls</strong>
            <p>{privacyNotice.join(" ")}</p>
          </article>
          <article className="agreement-note">
            <strong>Support and disputes</strong>
            <p>
              Support: {supportContacts.supportEmail} · Billing: {supportContacts.billingEmail} · Disputes:{" "}
              {supportContacts.disputesEmail} · Privacy: {supportContacts.privacyEmail}
            </p>
            <p>Response target: {supportContacts.responseTime}</p>
          </article>
        </div>

        <div className="module-cta-row">
          <button className="btn btn-primary" type="button" onClick={continueToConsent}>
            Continue to consent review
          </button>
          <Link className="btn btn-ghost" to="/agreements">
            Open agreement library
          </Link>
        </div>
      </div>
    </section>
  );
}
