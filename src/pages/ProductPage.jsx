import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { kovaProducts } from "../data/kovaData";

export function ProductPage() {
  const { slug = "legal" } = useParams();
  const [product, setProduct] = useState(kovaProducts.find((item) => item.slug === slug) || kovaProducts[1]);
  const [flow, setFlow] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let mounted = true;
    api.product(slug)
      .then((data) => {
        if (mounted) setProduct(data.product);
      })
      .catch(() => {});
    api.flow(slug)
      .then((data) => {
        if (mounted) setFlow(data.flow);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleStart = async () => {
    try {
      const data = await api.startFlow(slug);
      setFlow(data.flow);
      setStatus(data.message || "Flow started.");
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <section className="section container">
      <div className="product-hero panel">
        <div className="section-head">
          <div>
            <span className="eyebrow">{product.name}</span>
            <h2>{product.heroTitle}</h2>
          </div>
          <Link className="btn btn-ghost btn-sm" to="/pricing">
            Pricing
          </Link>
        </div>

        <div className="product-grid">
          <article className={`price-card price-${product.color}`}>
            <span className="price-tag">{product.badge}</span>
            <div className="price" style={{ color: product.colorValue }}>
              {product.price}
            </div>
            <p>{product.summary}</p>
            <ul>
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button className="btn btn-primary" type="button" onClick={handleStart}>
              Start {product.name}
            </button>
            <Link className="btn btn-ghost" to={`/legal/disclosure?plan=${product.slug}`}>
              Review agreement first
            </Link>
            {status ? <p className="api-status">{status}</p> : null}
          </article>

          <article className="panel">
            <span className="panel-kicker">Flow</span>
            <h3>What the backend returns</h3>
            <div className="flow-list">
              {(flow?.steps || []).map((step, index) => (
                <div className="flow-step" key={step.title}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
