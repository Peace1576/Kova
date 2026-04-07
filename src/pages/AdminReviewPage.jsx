import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

function formatDate(value) {
  if (!value) return "Not reviewed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not reviewed";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function AdminReviewPage() {
  const { user, loading } = useAuth();
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState("");
  const [busySlug, setBusySlug] = useState("");

  useEffect(() => {
    if (!user) return;
    api.adminAgreementStatus()
      .then((data) => setDocs(data.docs || []))
      .catch((err) => setError(err.message));
  }, [user]);

  if (!loading && !user) {
    return <Navigate to="/sign-in" replace />;
  }

  const toggleReview = async (doc) => {
    setBusySlug(doc.slug);
    setError("");
    try {
      const reviewedByCounsel = !doc.reviewedByCounsel;
      const data = await api.reviewAgreement(doc.slug, {
        reviewedByCounsel,
        reviewerName: user?.name || "admin",
        reviewNotes: reviewedByCounsel ? "Marked counsel reviewed from admin screen." : "Review flag removed.",
      });
      setDocs((current) => current.map((item) => (item.slug === doc.slug ? data.doc : item)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusySlug("");
    }
  };

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <span className="eyebrow">Admin review</span>
          <h2>Mark agreements as counsel-reviewed.</h2>
        </div>
        <Link className="btn btn-ghost btn-sm" to="/app/audit">
          Back to audit
        </Link>
      </div>

      <div className="panel">
        <p className="panel-copy">
          Use this screen to flag agreements as reviewed before launch. It is a workflow control, not a legal opinion.
        </p>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="audit-list">
          {docs.map((doc) => (
            <article className="audit-item" key={doc.slug}>
              <div className="audit-item-head">
                <div>
                  <h4>
                    {doc.name} <span className="doc-version">v{doc.version || "n/a"}</span>
                  </h4>
                  <p>{doc.fileName}</p>
                </div>
                <span className={`status-chip ${doc.reviewedByCounsel ? "status-chip-success" : ""}`}>
                  {doc.reviewedByCounsel ? "Reviewed" : "Needs review"}
                </span>
              </div>
              <p className="panel-copy">{doc.summary}</p>
              <div className="doc-meta-row">
                <span>Checksum {doc.checksum ? doc.checksum.slice(0, 16) : "pending"}</span>
                <span>Reviewed {formatDate(doc.reviewedAt)}</span>
                <span>{doc.reviewerName || "No reviewer"}</span>
              </div>
              <div className="module-cta-row">
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  onClick={() => toggleReview(doc)}
                  disabled={busySlug === doc.slug}
                >
                  {busySlug === doc.slug ? "Working..." : doc.reviewedByCounsel ? "Unmark review" : "Mark reviewed"}
                </button>
                <Link className="btn btn-ghost btn-sm" to={`/agreements/${doc.slug}`}>
                  Open viewer
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
