import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { homeSections, kovaProducts } from "../data/kovaData";

export function HomePage() {
  const [products, setProducts] = useState(kovaProducts);
  const [active, setActive] = useState("saver");

  useEffect(() => {
    let mounted = true;
    api.products()
      .then((data) => {
        if (mounted && data.products?.length) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const current = useMemo(
    () => products.find((product) => product.slug === active) || products[0],
    [active, products]
  );

  return (
    <>
      <section className="hero container reveal is-visible">
        <div className="hero-copy">
          <span className="eyebrow">Kova Brain, built to help you move</span>
          <h1>
            Your money. Your work. <span>Clear.</span>
          </h1>
          <p className="lede">
            Kova helps you move faster with money, documents, and permits so the hard parts do not slow you down.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/legal/disclosure?plan=legal">
              Start for free
            </Link>
            <Link className="btn btn-ghost" to="/mobile">
              See the app
            </Link>
          </div>

          <div className="trust-row">
            <div className="trust-item">
              <span />
              No credit card
            </div>
            <div className="trust-item">
              <span />
              Results in 60 seconds
            </div>
            <div className="trust-item">
              <span />
              Cancel anytime
            </div>
          </div>
        </div>

        <aside className="hero-panel panel">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">{current.name}</p>
              <h2>{current.heroTitle}</h2>
            </div>
            <span className="status-chip">Live</span>
          </div>

          <p className="panel-copy">{current.heroCopy}</p>

          <div className="segment-row">
            {products.map((product) => (
              <button
                type="button"
                key={product.slug}
                className={`segment ${active === product.slug ? "is-active" : ""}`}
                onClick={() => setActive(product.slug)}
              >
                {product.name}
              </button>
            ))}
          </div>

          <div className="metric-grid">
            {current.metrics.map((metric) => (
              <article className="metric-card" key={metric.label}>
                <span>{metric.label}</span>
                <strong style={{ color: current.colorValue }}>{metric.value}</strong>
                <small>{metric.sub}</small>
              </article>
            ))}
          </div>

          <div className="panel-list">
            {current.details.map((detail, index) => (
              <div className="panel-row" key={detail}>
                <div className={`panel-dot ${index === 0 ? "green" : index === 1 ? "purple" : "amber"}`} />
                <div>
                  <strong>{detail}</strong>
                  <p>{current.summary}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="module-cta-row">
            <Link className="btn btn-primary" to={`/products/${current.slug}`}>
              Open {current.name}
            </Link>
            <Link className="btn btn-ghost" to="/system">
              View system tree
            </Link>
          </div>
        </aside>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
          <span className="eyebrow">Simple process</span>
          <h2>Works in three steps.</h2>
        </div>
        <p className="section-copy">
            No busywork, no chasing providers, and no guesswork. Kova keeps the user in control.
          </p>
        </div>

        <div className="steps-grid">
          {homeSections.steps.map((step) => (
            <article className="step-card" key={step.label}>
              <span className="step-num">{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Start now</span>
            <h2>One platform. Three paths.</h2>
          </div>
          <p className="section-copy">Start with the path that helps most today. Expand when ready, under one account.</p>
        </div>

        <div className="pricing-grid">
          {products.map((product) => (
            <article className={`price-card price-${product.color} ${product.slug === "saver" ? "featured" : ""}`} key={product.slug}>
              {product.slug === "saver" ? <span className="featured-badge">{product.badge}</span> : <span className="price-tag">{product.badge}</span>}
              <div className="price" style={{ color: product.colorValue }}>
                {product.price}
              </div>
              <p>{product.summary}</p>
              <h3>{product.heroTitle}</h3>
              <ul>
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            <Link className="btn btn-primary" to={`/products/${product.slug}`}>
              Open {product.name}
            </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Questions</span>
            <h2>Everything you want to know.</h2>
          </div>
        </div>

        <div className="faq-grid">
          {homeSections.faqs.map((faq) => (
            <article className="faq-card" key={faq.q}>
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
