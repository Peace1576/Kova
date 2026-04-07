import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { mobileScreens } from "../data/kovaData";

const screenOrder = ["onboarding", "dashboard", "report", "approval"];

export function MobilePage() {
  const [active, setActive] = useState("onboarding");
  const [screens, setScreens] = useState(mobileScreens);

  useEffect(() => {
    let mounted = true;
    api.mobile()
      .then((data) => {
        if (mounted && data.screens) setScreens(data.screens);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const current = screens[active];

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <span className="eyebrow">Mobile app</span>
          <h2>Four core screens, one product rhythm.</h2>
        </div>
        <p className="section-copy">Onboarding, dashboard, risk report, and approval. Each screen is built to move the user forward.</p>
      </div>

      <div className="mobile-layout">
        <div className="mobile-tabs">
          {screenOrder.map((key) => (
            <button key={key} type="button" className={`segment mobile-tab ${active === key ? "is-active" : ""}`} onClick={() => setActive(key)}>
              {key}
            </button>
          ))}
        </div>

        <div className="phone-wrap panel">
          <div className="phone-chrome">
            <div className="phone-notch" />
            <div className="phone-status">
              <span>9:41</span>
              <span>100%</span>
            </div>
          </div>
          <div className="phone-body">
            <div className="phone-screen">
              <div className="phone-header">
                <div className="phone-logo">
                  <svg viewBox="0 0 44 44" aria-hidden="true">
                    <g transform="translate(7,6)">
                      <rect x="0" y="0" width="7" height="32" rx="2.5" fill="currentColor" />
                      <path d="M7 16 L24 1" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <path d="M7 16 L24 31" className="brand-soft-stroke" strokeWidth="7" strokeLinecap="round" />
                    </g>
                  </svg>
                  <span>kova.</span>
                </div>
                <span className="path-tag">Step 1 of 2</span>
              </div>

              <div className="phone-card">
                <span className="path-tag">{active}</span>
                <h3 className="phone-title">{current.title}</h3>
                <p className="phone-subtitle">{current.summary}</p>

                <div className="phone-list">
                  {current.points.map((point) => (
                    <div className="phone-item" key={point}>
                      <div className="phone-item-dot" />
                      <div>
                        <strong>{point}</strong>
                        <p>Designed to make the next decision obvious.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="mobile-copy panel">
          <span className="panel-kicker">{active}</span>
          <h3>{current.title}</h3>
          <p>{current.summary}</p>
          <div className="mobile-points">
            {current.points.map((point) => (
              <div className="point" key={point}>
                <span />
                <p>{point}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
