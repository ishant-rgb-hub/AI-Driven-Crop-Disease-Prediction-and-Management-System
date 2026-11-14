import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Leaf, LockKeyhole, Mail } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { Spinner } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const registrationMessage = location.state?.registrationMessage;

  if (loading) return <div className="auth-loading"><Spinner label="Checking your session" /></div>;
  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      await login({ email: email.trim(), password });
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "We couldn't sign you in. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual auth-visual-login">
        <div className="auth-visual-top"><Brand light /><Link to="/" className="auth-home-link"><ArrowLeft size={15} /> Back to home</Link></div>
        <div className="auth-visual-copy">
          <span className="eyebrow eyebrow-light">A clearer view of your crops</span>
          <h1>Welcome back<br />to your <em>growing season.</em></h1>
          <p>Your farm is one sign-in away. Pick up where your crop care left off.</p>
        </div>
        <div className="auth-visual-caption"><span><Leaf size={17} /></span><p>Better information.<br /><strong>Healthier harvests.</strong></p><span className="auth-caption-rule" /></div>
      </section>
      <section className="auth-form-side">
        <div className="auth-mobile-brand"><Brand /></div>
        <div className="auth-form-wrap">
          <span className="eyebrow">Your Leafwise account</span>
          <h2>Good to see you.</h2>
          <p className="auth-subtitle">Sign in to continue to your farmer workspace.</p>
          {registrationMessage && <div className="form-success" role="status">{registrationMessage}</div>}
          {error && <div className="form-error" role="alert">{error}</div>}
          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Email address</span>
              <span className="input-wrap"><Mail size={17} aria-hidden="true" /><input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></span>
            </label>
            <label className="form-field">
              <span>Password</span>
              <span className="input-wrap"><LockKeyhole size={17} aria-hidden="true" /><input aria-label="Password" autoComplete="current-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /><button className="input-action" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((show) => !show)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
            </label>
            <button type="submit" className="button button-primary button-full" disabled={pending}>{pending ? <><Spinner label="Signing in" /> Signing in…</> : <>Sign in <ArrowRight size={17} /></>}</button>
          </form>
          <p className="auth-switch">New to Leafwise? <Link to="/register">Create your account</Link></p>
          <div className="auth-security"><LockKeyhole size={14} /><span>Your account information is kept private and secure.</span></div>
        </div>
        <div className="auth-bottom"><span>© {new Date().getFullYear()} Leafwise</span><Link to="/register">Join Leafwise <ArrowRight size={14} /></Link></div>
      </section>
    </main>
  );
}
