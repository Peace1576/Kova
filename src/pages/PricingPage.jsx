import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { pricingPlans } from "../data/kovaData";

export function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [plans, setPlans] = useState(pricingPlans);

  useEffect(() => {
    let mounted = true;
    api.pricing()
      .then((data) => {
        if (mounted && data.plans?.length) setPlans(data.plans);
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
          <span className="eyebrow">Pricing</span>
          <h2>Pay for results, not promises.</h2>
        </div>
        <p className="section-copy">
          The saver path is free until it works. The other two paths use simple monthly pricing with an annual discount.
        </p>
      </div>

      <button type="button" className={`billing-toggle ${annual ? "is-annual" : ""}`} onClick={() => setAnnual((value) => !value)}>
        <span>Monthly</span>
        <span className="toggle-track">
          <span className="toggle-thumb" />
        </span>
        <span>Annual</span>
        <strong>Save 20%</strong>
      </button>

      <div className="pricing-grid">
        {plans.map((plan) => {
          const price = annual ? plan.annual : plan.monthly;
          const sub = annual ? plan.subAnnual : plan.subMonthly;
          return (
            <article key={plan.slug} className={`price-card price-${plan.slug} ${plan.featured ? "featured" : ""}`}>
              {plan.featured ? <span className="featured-badge">Most popular</span> : <span className="price-tag">{plan.name}</span>}
              <div className="price" style={{ color: plan.slug === "saver" ? "var(--success)" : plan.slug === "legal" ? "var(--brand)" : "var(--warning)" }}>
                {price}
              </div>
              <p>{sub}</p>
              <h3>{plan.name}</h3>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link className="btn btn-primary" to={`/legal/disclosure?plan=${plan.slug}`}>
                Start {plan.name}
              </Link>
            </article>
          );
        })}
      </div>

      <div className="compare panel">
        <div className="compare-head">
          <h3>Compare everything</h3>
          <p>Every feature, side by side.</p>
        </div>
        <div className="compare-grid">
          <div className="compare-row compare-header">
            <span>Feature</span>
            <span>Saver</span>
            <span>Legal</span>
            <span>Build</span>
          </div>
          <div className="compare-row">
            <span>Monthly price</span>
            <span>Free</span>
            <span>{annual ? "$31/mo" : "$39/mo"}</span>
            <span>{annual ? "$239/mo" : "$299/mo"}</span>
          </div>
          <div className="compare-row">
            <span>Performance fee</span>
            <span>15% of savings</span>
            <span>None</span>
            <span>None</span>
          </div>
          <div className="compare-row">
            <span>Core win</span>
            <span>Lower bills</span>
            <span>Safer contracts</span>
            <span>Faster permits</span>
          </div>
          <div className="compare-row">
            <span>Vault included</span>
            <span>Yes</span>
            <span>Yes</span>
            <span>Yes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
