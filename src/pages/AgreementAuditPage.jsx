import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

function formatDate(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function fetchBlobDownload(path, filename) {
  const token = localStorage.getItem("kova_token");
  const response = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error("Download failed");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function openPrintView(path) {
  const token = localStorage.getItem("kova_token");
  const response = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error("Print view failed");
  }
  const html = await response.text();
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) {
    throw new Error("Popup blocked");
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

export function AgreementAuditPage() {
  const { user, loading, signOut } = useAuth();
  const [audit, setAudit] = useState(null);
  const [records, setRecords] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    if (!user) return;
    api.legalAudit()
      .then(setAudit)
      .catch((err) => setError(err.message));
  }, [user]);

  if (!loading && !user) {
    return <Navigate to="/sign-in" replace />;
  }

  const handleDownloadCsv = async () => {
    setBusy("csv");
    setError("");
    try {
      await fetchBlobDownload("/api/legal/audit/export.csv", "kova-legal-audit.csv");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const handleDownloadRecords = async () => {
    setBusy("records");
    setError("");
    try {
      const data = await api.legalRecords();
      setRecords(data);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "kova-records.json";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const handlePrint = async () => {
    setBusy("print");
    setError("");
    try {
      await openPrintView("/api/legal/audit/print");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const handleRevoke = async () => {
    const confirmed = window.confirm("Revoke consent for this account? This will sign you out and disable consent-based flows.");
    if (!confirmed) return;
    setBusy("revoke");
    setError("");
    try {
      await api.revokeConsent({ reason: "user-request" });
      await signOut();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this account and request removal of personal data?");
    if (!confirmed) return;
    setBusy("delete");
    setError("");
    try {
      await api.deleteData({ requestedBy: "user" });
      await signOut();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <span className="eyebrow">Compliance</span>
          <h2>Acceptance audit log.</h2>
        </div>
        <div className="module-cta-row">
          <Link className="btn btn-ghost btn-sm" to="/app">
            Back to dashboard
          </Link>
          <button className="btn btn-ghost btn-sm" type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>

      <div className="dashboard-grid audit-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Consent snapshot</p>
              <h3>{audit?.summary?.plan ? `${audit.summary.plan} plan` : "No consent record"}</h3>
            </div>
            <span className={`status-chip ${audit?.summary?.acceptedAt ? "status-chip-success" : ""}`}>
              {audit?.summary?.acceptedAt ? "Recorded" : "Pending"}
            </span>
          </div>

          {audit ? (
            <>
              <div className="audit-summary-grid">
                <div className="audit-summary-card">
                  <span>Accepted at</span>
                  <strong>{formatDate(audit.summary.acceptedAt)}</strong>
                </div>
                <div className="audit-summary-card">
                  <span>Reviewed at</span>
                  <strong>{formatDate(audit.summary.reviewedAt)}</strong>
                </div>
                <div className="audit-summary-card">
                  <span>Documents</span>
                  <strong>{audit.summary.acceptedCount}</strong>
                </div>
                <div className="audit-summary-card">
                  <span>Scroll review</span>
                  <strong>{audit.summary.scrollComplete ? "Complete" : "Incomplete"}</strong>
                </div>
              </div>

              <div className="agreement-note">
                <strong>Captured metadata</strong>
                <p>
                  {audit.consent?.ip || "IP unavailable"} · {audit.consent?.userAgent || "User agent unavailable"}
                </p>
              </div>
            </>
          ) : (
            <p className="panel-copy">{error || "Loading audit log..."}</p>
          )}

          <div className="module-cta-row">
            <button className="btn btn-primary" type="button" onClick={handleDownloadCsv} disabled={busy === "csv"}>
              {busy === "csv" ? "Preparing..." : "Download CSV"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={handlePrint} disabled={busy === "print"}>
              {busy === "print" ? "Preparing..." : "Print / save PDF"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={handleDownloadRecords} disabled={busy === "records"}>
              {busy === "records" ? "Preparing..." : "Request copy"}
            </button>
          </div>
        </article>

        <article className="panel">
          <span className="panel-kicker">Timeline</span>
          <h3>Every accepted agreement is visible here.</h3>
          <div className="audit-list">
            {audit?.timeline?.length ? (
              audit.timeline.map((item) => (
                <article className="audit-item" key={item.id}>
                  <div className="audit-item-head">
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.fileName}</p>
                    </div>
                    <span className={`status-chip ${item.reviewedByCounsel ? "status-chip-success" : ""}`}>
                      {item.reviewedByCounsel ? "Counsel reviewed" : "Accepted"}
                    </span>
                  </div>
                  <p className="panel-copy">{item.summary}</p>
                  <div className="doc-meta-row">
                    <span>Version {item.version || "n/a"}</span>
                    <span>Checksum {item.checksum ? item.checksum.slice(0, 16) : "pending"}</span>
                    <span>{formatDate(item.acceptedAt)}</span>
                  </div>
                  <div className="audit-meta-row">
                    <span>{(item.requiredFor || []).join(", ") || "General use"}</span>
                    <span>{item.source}</span>
                  </div>
                  <div className="module-cta-row">
                    <Link className="btn btn-ghost btn-sm" to={`/agreements/${item.slug}`}>
                      Open viewer
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <p className="panel-copy">No accepted agreements are available for this account yet.</p>
            )}
          </div>
        </article>

        <article className="panel">
          <span className="panel-kicker">Records and privacy</span>
          <h3>Consent, revocation, and deletion controls.</h3>
          <ul className="audit-checklist">
            <li>Revoke consent to disable consent-based flows and sign out of active sessions.</li>
            <li>Request a copy to download your records bundle as JSON for counsel or disputes.</li>
            <li>Delete data to remove the active account and request personal-data deletion.</li>
            <li>Analytics consent is optional and off by default in the signup flow.</li>
          </ul>
          <div className="module-cta-row">
            <button className="btn btn-ghost" type="button" onClick={handleRevoke} disabled={busy === "revoke"}>
              {busy === "revoke" ? "Working..." : "Revoke consent"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={handleDelete} disabled={busy === "delete"}>
              {busy === "delete" ? "Working..." : "Delete data"}
            </button>
            <Link className="btn btn-primary" to="/app/admin/review">
              Admin review flags
            </Link>
          </div>
        </article>

        <article className="panel audit-checklist-panel">
          <span className="panel-kicker">Attorney review checklist</span>
          <h3>Have counsel review the actual wording before launch.</h3>
          <ul className="audit-checklist">
            <li>Arbitration, forum selection, and class-action waiver language.</li>
            <li>Liability caps, exclusions, and any consequential-damages carve-outs.</li>
            <li>Indemnity scope, trigger language, defense control, and notice timing.</li>
            <li>Warranty disclaimers, service availability language, and beta-use disclaimers.</li>
            <li>Privacy disclosures, retention rules, sharing disclosures, and data processor terms.</li>
            <li>Beta NDA confidentiality scope, exclusions, term, and injunctive-relief wording.</li>
          </ul>
          <p className="panel-copy">
            This checklist is a product-side reminder, not a legal opinion and not a substitute for counsel.
          </p>
        </article>
      </div>

      {records ? (
        <div className="screen-reader-only" aria-live="polite">
          Records request captured.
        </div>
      ) : null}
    </section>
  );
}
