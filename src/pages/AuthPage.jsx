import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { agreementDocs, agreementPlanRequirements, kovaProducts } from "../data/kovaData";

export function AuthPage({ mode }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { signIn, signUp } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    plan: params.get("plan") || "legal",
  });
  const [acknowledgements, setAcknowledgements] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [gate, setGate] = useState(null);

  const isSignIn = mode === "sign-in";
  const requiredDocs = useMemo(
    () => (agreementPlanRequirements[form.plan] || []).map((slug) => agreementDocs.find((doc) => doc.slug === slug)).filter(Boolean),
    [form.plan]
  );
  const selectedProduct = useMemo(
    () => kovaProducts.find((product) => product.slug === form.plan),
    [form.plan]
  );

  useEffect(() => {
    if (isSignIn) return;
      const stored = sessionStorage.getItem("kova_legal_gate");
      if (!stored) {
        navigate(`/legal/disclosure?plan=${form.plan}`, { replace: true });
        return;
      }

    try {
      const parsed = JSON.parse(stored);
      if (parsed.plan !== form.plan) {
        navigate(`/legal/disclosure?plan=${form.plan}`, { replace: true });
        return;
      }
      setGate(parsed);
      setAcknowledgements(parsed.acknowledgements || {});
    } catch {
      navigate(`/legal/disclosure?plan=${form.plan}`, { replace: true });
    }
  }, [form.plan, isSignIn, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (isSignIn) {
        await signIn(form.email, form.password);
      } else {
        if (!gate) {
          throw new Error("Please complete the legal consent step first.");
        }
        await signUp({ ...form, acknowledgements, legalGate: gate });
      }
      navigate("/app");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section container auth-grid">
      <div className="auth-copy panel">
        <span className="eyebrow">Account</span>
        <h2>{isSignIn ? "Sign in to Kova." : "Create your Kova account."}</h2>
        <p className="lede">
          Use one account for money, work, and permits. The backend stores the session token and the app uses it on every API request.
        </p>
        <div className="auth-note">
          <strong>Included flows</strong>
          <p>Auth, pricing, product starts, and dashboard data all come from the API layer.</p>
        </div>
        {!isSignIn ? (
          <div className="agreement-note">
            <strong>Consent status</strong>
            <p>
              {gate
                ? `You completed the scroll review and accepted ${gate.requiredDocs.length} required document(s) for ${selectedProduct?.name || form.plan}.`
              : "Complete the consent page before signup."}
            </p>
            <div className="agreement-highlight-row">
              {requiredDocs.map((doc) => (
                <Link key={doc.slug} to={`/agreements/${doc.slug}`}>
                  <span>{doc.name}</span>
                </Link>
              ))}
            </div>
            <div className="module-cta-row">
              <Link className="btn btn-ghost" to={`/legal/disclosure?plan=${form.plan}`}>
                Review disclosure
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <form className="auth-form panel" onSubmit={submit}>
        <span className="panel-kicker">{isSignIn ? "Sign in" : "Sign up"}</span>
        <h3>{isSignIn ? "Welcome back." : "Start free today."}</h3>

        {!isSignIn ? (
          <label>
            <span>Name</span>
            <input
              value={form.name}
              onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
              autoComplete="name"
              required
            />
          </label>
        ) : null}

        <label>
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))}
            autoComplete="email"
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((state) => ({ ...state, password: event.target.value }))}
            autoComplete={isSignIn ? "current-password" : "new-password"}
            minLength={8}
            required
          />
        </label>

        {!isSignIn ? (
          <label>
            <span>Starter plan</span>
            <select
              value={form.plan}
              onChange={(event) => setForm((state) => ({ ...state, plan: event.target.value }))}
            >
              {kovaProducts.map((product) => (
                <option value={product.slug} key={product.slug}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {error ? <p className="form-error">{error}</p> : null}

        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Working..." : isSignIn ? "Sign in" : "Create account"}
        </button>

        <p className="form-switch">
          {isSignIn ? "Need an account?" : "Already have an account?"}{" "}
          <Link to={isSignIn ? "/sign-up" : "/sign-in"}>{isSignIn ? "Sign up" : "Sign in"}</Link>
        </p>
      </form>
    </section>
  );
}
