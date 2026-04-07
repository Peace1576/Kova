import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="section container">
      <div className="panel">
        <span className="eyebrow">404</span>
        <h2>That page is not here.</h2>
        <p className="panel-copy">Let’s get you back to something useful.</p>
        <div className="module-cta-row">
          <Link className="btn btn-primary" to="/">
            Go home
          </Link>
          <Link className="btn btn-ghost" to="/pricing">
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
