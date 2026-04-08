import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [integrationStatus, setIntegrationStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    api.dashboard()
      .then(setDashboard)
      .catch((err) => setError(err.message));
    api.integrationStatus()
      .then((data) => setIntegrationStatus(data.status))
      .catch(() => {});
  }, [user]);

  if (!loading && !user) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h2>Your advocate is active.</h2>
        </div>
        <button className="btn btn-ghost btn-sm" type="button" onClick={signOut}>
          Sign out
        </button>
      </div>

      <div className="dashboard-grid">
        <article className="panel dashboard-hero">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Welcome back</p>
              <h3>{user?.name || "Kova user"}</h3>
            </div>
            <span className="status-chip">Live</span>
          </div>

          {dashboard ? (
            <>
              <div className="metric-grid">
                {dashboard.metrics.map((metric) => (
                  <article className="metric-card" key={metric.label}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    <small>{metric.sub}</small>
                  </article>
                ))}
              </div>
              <div className="panel-list">
                {dashboard.activity.map((item) => (
                  <div className="panel-row" key={item.title}>
                    <div className={`panel-dot ${item.tone}`} />
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="agreement-note">
                <strong>Live integrations</strong>
                <p>
                  Brain: {integrationStatus?.brain ? "connected" : "missing"} · Supabase:{" "}
                  {integrationStatus?.supabase ? "connected" : "missing"} · Auth tables:{" "}
                  {integrationStatus?.authUsers ? "active" : "inactive"}
                </p>
              </div>
            </>
          ) : (
            <p className="panel-copy">{error || "Loading dashboard data..."}</p>
          )}
        </article>

        <div className="dashboard-side-stack">
          <article className="panel">
            <span className="panel-kicker">Current path</span>
            <h3>{dashboard?.path?.name || "Document brain"}</h3>
            <p className="panel-copy">{dashboard?.path?.summary || "Your product path is loaded from the backend."}</p>
            <div className="module-cta-row">
              <Link className="btn btn-primary" to={`/products/${dashboard?.path?.slug || "saver"}`}>
                Open path
              </Link>
              <Link className="btn btn-ghost" to="/pricing">
                Pricing
              </Link>
            </div>
          </article>

          <article className="panel dashboard-audit-preview">
            <span className="panel-kicker">Compliance hub</span>
            <h3>Audit, records, and review flags.</h3>
            <p className="panel-copy">
              Every signed agreement has a versioned record, and the dashboard links straight to exports, revocation, and admin review.
            </p>
            <div className="module-cta-row">
              <Link className="btn btn-primary" to="/app/audit">
                Open audit log
              </Link>
              <Link className="btn btn-ghost" to="/app/admin/review">
                Admin review
              </Link>
              <Link className="btn btn-ghost" to="/app/brain">
                Open brain
              </Link>
              <Link className="btn btn-ghost" to="/app/status">
                Integration status
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
