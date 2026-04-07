import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { agreementDocs, agreementPlanDisclosures, agreementPlanRequirements, privacyNotice, supportContacts } from "../data/kovaData";

const planLabels = {
  saver: "Money saver",
  legal: "Legal shield",
  build: "Build smarter",
};

export function LegalConsentPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const readerRef = useRef(null);
  const [plan, setPlan] = useState(params.get("plan") || "legal");
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [understands, setUnderstands] = useState(false);
  const [disclosureAccepted, setDisclosureAccepted] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [acknowledgements, setAcknowledgements] = useState({});
  const [error, setError] = useState("");

  const requiredDocs = useMemo(
    () => (agreementPlanRequirements[plan] || []).map((slug) => agreementDocs.find((doc) => doc.slug === slug)).filter(Boolean),
    [plan]
  );
  const planDisclosure = agreementPlanDisclosures[plan] || agreementPlanDisclosures.legal;

  useEffect(() => {
    setAcknowledgements(Object.fromEntries((agreementPlanRequirements[plan] || []).map((slug) => [slug, false])));
    setHasScrolledToEnd(false);
    setUnderstands(false);
    setDisclosureAccepted(false);
    setAnalyticsConsent(false);
    if (readerRef.current) {
      readerRef.current.scrollTop = 0;
    }
  }, [plan]);

  const allAccepted = requiredDocs.length > 0 && requiredDocs.every((doc) => acknowledgements[doc.slug]);

  const handleReaderScroll = (event) => {
    const el = event.currentTarget;
    const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
    setHasScrolledToEnd(atEnd);
  };

  const submit = (event) => {
    event.preventDefault();
    setError("");

    if (!allAccepted) {
      setError("Please review and acknowledge every required document before continuing.");
      return;
    }
    if (!hasScrolledToEnd) {
      setError("Please scroll to the end of the agreement bundle before continuing.");
      return;
    }
    if (!disclosureAccepted) {
      setError("Please confirm that you reviewed the plan-specific disclosure first.");
      return;
    }
    if (!understands) {
      setError("Please confirm that you have reviewed and understand the agreement bundle.");
      return;
    }

    const now = new Date().toISOString();
    sessionStorage.setItem(
      "kova_legal_gate",
      JSON.stringify({
        plan,
        acceptedAt: now,
        reviewedAt: now,
        reviewedBundle: true,
        understood: true,
        scrollComplete: hasScrolledToEnd,
        disclosureAccepted: true,
        privacyConsent: {
          analytics: analyticsConsent,
          essentialOnly: !analyticsConsent,
        },
        acknowledgements,
        requiredDocs: requiredDocs.map((doc) => doc.slug),
      })
    );

    navigate(`/sign-up?plan=${plan}`);
  };

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <span className="eyebrow">Legal consent</span>
          <h2>Review the agreement bundle before signup.</h2>
        </div>
        <p className="section-copy">
          This records user acknowledgment before account creation. It helps, but it does not make Kova immune from legal claims.
        </p>
      </div>

      <div className="panel legal-gate">
        <div className="legal-gate-header">
          <div>
            <p className="panel-kicker">Selected plan</p>
            <h3>{planLabels[plan] || "Legal shield"}</h3>
          </div>
          <label className="legal-plan-select">
            <span>Change plan</span>
            <select value={plan} onChange={(event) => setPlan(event.target.value)}>
              <option value="saver">Money saver</option>
              <option value="legal">Legal shield</option>
              <option value="build">Build smarter</option>
            </select>
          </label>
        </div>

        <div className="legal-warning">
          <strong>No app is sue-proof.</strong>
          <p>
            This gate improves informed consent and records acceptance. It does not replace an attorney-reviewed contract,
            insurance, or local compliance work.
          </p>
        </div>

        <div className="disclosure-card legal-disclosure-card">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Plan disclosure</p>
              <h3>{planLabels[plan] || "Legal shield"} disclosure</h3>
            </div>
            <Link className="status-chip" to="/agreements">
              View docs
            </Link>
          </div>
          <ul className="audit-checklist">
            {planDisclosure.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="legal-reader-shell">
          <div className="legal-reader-meta">
            <div>
              <p className="panel-kicker">Scroll-to-accept</p>
              <h3>{requiredDocs.length} document{requiredDocs.length === 1 ? "" : "s"} in this bundle</h3>
            </div>
            <span className={`status-chip ${hasScrolledToEnd ? "status-chip-success" : ""}`}>
              {hasScrolledToEnd ? "Read complete" : "Scroll to the end"}
            </span>
          </div>

          <div ref={readerRef} className="legal-reader" onScroll={handleReaderScroll} tabIndex={0} aria-label="Agreement bundle">
            {requiredDocs.map((doc) => (
              <article key={doc.slug} className="legal-doc-card">
                <div className="panel-head">
                  <div>
                    <p className="panel-kicker">{doc.fileName}</p>
                    <h3>
                      {doc.name} <span className="doc-version">v{doc.version || "n/a"}</span>
                    </h3>
                  </div>
                  <Link className="status-chip" to={`/agreements/${doc.slug}`}>
                    Open
                  </Link>
                </div>
                <p className="panel-copy">{doc.summary}</p>
                <div className="agreement-preview">
                  <div className="agreement-preview-label">Preview excerpt</div>
                  <p>{doc.excerpt}</p>
                  <div className="agreement-highlight-row">
                    {doc.highlights.map((highlight) => (
                      <span key={highlight}>{highlight}</span>
                    ))}
                  </div>
                </div>
                <label className="agree-item">
                  <input
                    type="checkbox"
                    checked={Boolean(acknowledgements[doc.slug])}
                    onChange={(event) =>
                      setAcknowledgements((state) => ({ ...state, [doc.slug]: event.target.checked }))
                    }
                  />
                  <span>I acknowledge this document and want it recorded for my account.</span>
                </label>
              </article>
            ))}

            <div className="legal-bundle-footer">
              <strong>I have reviewed and understand this bundle.</strong>
              <p>
                Scroll through the agreement bundle above, then use the final confirmation checkbox before continuing.
              </p>
            </div>
          </div>

          <div className="legal-readout">
            <span>{hasScrolledToEnd ? "Scroll requirement satisfied" : "You must reach the end of the bundle"}</span>
            <span>{understands ? "Understanding confirmed" : "Final confirmation still required"}</span>
          </div>
        </div>

        <label className="agree-item legal-understand">
          <input
            type="checkbox"
            checked={disclosureAccepted}
            onChange={(event) => setDisclosureAccepted(event.target.checked)}
          />
          <span>I confirm I reviewed the plan-specific disclosure for this plan.</span>
        </label>

        <label className="agree-item legal-understand">
          <input
            type="checkbox"
            checked={understands}
            onChange={(event) => setUnderstands(event.target.checked)}
          />
          <span>I have reviewed and understand the selected agreements for this plan.</span>
        </label>

        <label className="agree-item legal-understand">
          <input
            type="checkbox"
            checked={analyticsConsent}
            onChange={(event) => setAnalyticsConsent(event.target.checked)}
          />
          <span>Optional: allow product analytics and feature telemetry.</span>
        </label>

        <div className="agreement-note">
          <strong>Privacy and support</strong>
          <p>{privacyNotice.join(" ")}</p>
          <p>
            Support: {supportContacts.supportEmail} · Billing: {supportContacts.billingEmail} · Disputes:{" "}
            {supportContacts.disputesEmail}
          </p>
        </div>

        <div className="module-cta-row">
          <button
            className="btn btn-primary"
            type="button"
            onClick={submit}
            disabled={!allAccepted || !hasScrolledToEnd || !understands || !disclosureAccepted}
          >
            I have reviewed and understand
          </button>
          <Link className="btn btn-ghost" to="/agreements">
            Review all documents
          </Link>
        </div>

        {error ? <p className="form-error">{error}</p> : null}
      </div>
    </section>
  );
}
