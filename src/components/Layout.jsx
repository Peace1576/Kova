import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/products/legal", label: "Products" },
  { to: "/pricing", label: "Pricing" },
  { to: "/mobile", label: "Mobile" },
  { to: "/system", label: "System" },
  { to: "/agreements", label: "Agreements" },
  { to: "/app/ai", label: "AI" },
  { to: "/app", label: "Dashboard" },
];

export function Layout({ children }) {
  return (
    <div className="app-shell">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="noise" />

      <header className="topbar container">
        <Link className="brand" to="/" aria-label="Kova home">
          <svg className="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
            <g transform="translate(7,6)">
              <rect x="0" y="0" width="7" height="32" rx="2.5" fill="currentColor" />
              <path d="M7 16 L24 1" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
              <path d="M7 16 L24 31" className="brand-soft-stroke" strokeWidth="7" strokeLinecap="round" />
            </g>
          </svg>
          <span>kova</span>
          <em>.</em>
        </Link>

        <nav className="topnav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="topbar-actions">
          <Link className="topbar-pill" to="/legal/disclosure?plan=legal">
            Legal shield active
          </Link>
          <Link className="btn btn-ghost btn-sm" to="/sign-in">
            Sign in
          </Link>
          <Link className="btn btn-primary btn-sm" to="/legal/disclosure?plan=legal">
            Start free
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <footer className="footer container">
        <Link className="brand brand-footer" to="/">
          <svg className="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
            <g transform="translate(7,6)">
              <rect x="0" y="0" width="7" height="32" rx="2.5" fill="currentColor" />
              <path d="M7 16 L24 1" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
              <path d="M7 16 L24 31" className="brand-soft-stroke" strokeWidth="7" strokeLinecap="round" />
            </g>
          </svg>
          <span>kova</span>
          <em>.</em>
        </Link>
        <p>AI advocate for money, rights, and permits.</p>
        <Link className="footer-link" to="/pricing">
          See pricing
        </Link>
      </footer>
    </div>
  );
}
