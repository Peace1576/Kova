import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { agreementDocs } from "../data/kovaData";

export function AgreementsPage() {
  const [docs, setDocs] = useState(agreementDocs);

  useEffect(() => {
    let mounted = true;
    api.agreements()
      .then((data) => {
        if (mounted && data.docs?.length) setDocs(data.docs);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <span className="eyebrow">Agreements</span>
          <h2>Core legal docs shipped with Kova.</h2>
        </div>
        <p className="section-copy">
          These are the documents the app uses for authorization, privacy, and early-access testing.
        </p>
      </div>

      <div className="agreements-grid">
        {docs.map((doc) => (
          <article key={doc.slug} className="panel agreement-card">
            <div className="panel-head">
              <div>
                <p className="panel-kicker">{doc.fileName}</p>
                <h3>
                  {doc.name} <span className="doc-version">v{doc.version || "n/a"}</span>
                </h3>
              </div>
              <span className={`status-chip ${doc.reviewedByCounsel ? "status-chip-success" : ""}`}>
                {doc.reviewedByCounsel ? "Counsel reviewed" : "Needs review"}
              </span>
            </div>
            <p className="panel-copy">{doc.summary}</p>
            <div className="doc-meta-row">
              <span>Checksum {doc.checksum ? doc.checksum.slice(0, 12) : "pending"}</span>
              <span>Word count {doc.wordCount || 0}</span>
            </div>
            <div className="agreement-preview">
              <div className="agreement-preview-label">Preview excerpt</div>
              <p>{doc.excerpt}</p>
              <div className="agreement-highlight-row">
                {doc.highlights.map((highlight) => (
                  <span key={highlight}>{highlight}</span>
                ))}
              </div>
            </div>
            <div className="agreement-note">
              <strong>Used for</strong>
              <p>{doc.use}</p>
            </div>
            <div className="module-cta-row">
              <Link className="btn btn-primary" to={`/agreements/${doc.slug}`}>
                Open viewer
              </Link>
              <a className="btn btn-ghost" href={doc.path} download>
                Download DOCX
              </a>
              <Link className="btn btn-ghost" to={`/legal/disclosure?plan=${doc.requiredFor?.[0] || "legal"}`}>
                Start consent flow
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
