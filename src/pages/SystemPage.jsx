import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { systemTree } from "../data/kovaData";

export function SystemPage() {
  const [tree, setTree] = useState(systemTree);

  useEffect(() => {
    let mounted = true;
    api.system()
      .then((data) => {
        if (mounted && data.tree?.length) setTree(data.tree);
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
          <span className="eyebrow">System tree</span>
          <h2>Shared platform, focused modules.</h2>
        </div>
        <p className="section-copy">
          The docs describe a shared core with separate stacks for saver, legal, and build. This is the architecture view.
        </p>
      </div>

      <div className="tree-grid">
        {tree.map((branch) => (
          <article key={branch.title} className={`tree-card ${branch.accent ? `tree-${branch.accent}` : ""}`}>
            <h3>{branch.title}</h3>
            <div className="chip-list">
              {branch.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
