import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { agreementDocs, agreementPlanRequirements } from "../data/kovaData";

const planLabels = {
  saver: "Money saver",
  legal: "Legal shield",
  build: "Build smarter",
};

export function AgreementViewerPage() {
  const { slug } = useParams();
  const [doc, setDoc] = useState(() => agreementDocs.find((item) => item.slug === slug) || null);

  useEffect(() => {
    let mounted = true;
    api.agreement(slug)
      .then((data) => {
        if (mounted) setDoc(data.doc);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [slug]);

  const plans = useMemo(() => {
    if (!doc) return [];
    return Object.entries(agreementPlanRequirements)
      .filter(([, required]) => required.includes(doc.slug))
      .map(([plan]) => planLabels[plan]);
  }, [doc]);

  const primaryPlanSlug = useMemo(() => {
    const matches = Object.entries(agreementPlanRequirements).filter(([, required]) => required.includes(doc?.slug));
    return matches.length === 1 ? matches[0][0] : null;
  }, [doc]);

  if (!doc) {
    return (
      <section className="section container">
        <div className="panel">
          <span className="eyebrow">Agreement viewer</span>
          <h2>Agreement not found.</h2>
          <p className="panel-copy">We could not load that document.</p>
          <div className="module-cta-row">
            <Link className="btn btn-primary" to="/agreements">
              Back to agreements
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <span className="eyebrow">Agreement viewer</span>
          <h2>{doc.name}</h2>
        </div>
        <Link className="btn btn-ghost btn-sm" to="/agreements">
          Back to list
        </Link>
      </div>

      <div className="viewer-grid">
        <article className="panel agreement-viewer">
          <div className="viewer-meta">
            <div>
              <p className="panel-kicker">{doc.fileName}</p>
              <h3>
                {doc.summary} <span className="doc-version">v{doc.version || "n/a"}</span>
              </h3>
            </div>
            <span className={`status-chip ${doc.reviewedByCounsel ? "status-chip-success" : ""}`}>
              {doc.reviewedByCounsel ? "Counsel reviewed" : "Preview"}
            </span>
          </div>

          <div className="viewer-paper">
            <div className="viewer-paper-top">
              <strong>{doc.name}</strong>
              <span>{doc.fileName}</span>
            </div>
            <div className="doc-meta-row viewer-doc-meta">
              <span>Version {doc.version || "n/a"}</span>
              <span>Checksum {doc.checksum ? doc.checksum.slice(0, 16) : "pending"}</span>
              <span>{doc.wordCount || 0} words</span>
            </div>
            <pre className="viewer-accepted-text">{doc.acceptedText || doc.excerpt}</pre>
            <p>{doc.excerpt}</p>
            <div className="viewer-highlight-row">
              {doc.highlights.map((highlight) => (
                <span key={highlight}>{highlight}</span>
              ))}
            </div>
          </div>

          <div className="agreement-note">
            <strong>Used for</strong>
            <p>{doc.use}</p>
          </div>
        </article>

        <aside className="panel agreement-side">
          <span className="panel-kicker">What this unlocks</span>
          <h3>Required for these plans</h3>
          <div className="viewer-plan-list">
            {plans.map((plan) => (
              <div className="viewer-plan-pill" key={plan}>
                {plan}
              </div>
            ))}
          </div>

          <div className="agreement-note">
            <strong>Preview summary</strong>
            <p>{doc.excerpt}</p>
          </div>

          <div className="module-cta-row">
            <a className="btn btn-primary" href={doc.path} download>
              Download DOCX
            </a>
            <Link className="btn btn-ghost" to={primaryPlanSlug ? `/legal/disclosure?plan=${primaryPlanSlug}` : "/legal/disclosure?plan=legal"}>
              Open disclosure flow
            </Link>
            <Link className="btn btn-ghost" to={primaryPlanSlug ? `/legal/consent?plan=${primaryPlanSlug}` : "/legal/consent?plan=legal"}>
              Open consent flow
            </Link>
            <Link className="btn btn-ghost" to={`/app/ai?doc=${doc.slug}`}>
              Ask Gemini
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
