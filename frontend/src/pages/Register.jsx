import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { Spinner } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (loading) return <div className="auth-loading"><Spinner label="Checking your session" /></div>;
  if (user) return <Navigate to="/dashboard" replace />;

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (form.name.trim().length < 2 || form.name.trim().length > 100) {
      setError("Your name must be between 2 and 100 characters.");
      return;
    }
    if (form.password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }
    if (new TextEncoder().encode(form.password).length > 72) {
      setError("Your password must be no more than 72 bytes.");
      return;
    }
    if (form.phone && !/^[0-9+()\-\s]{7,20}$/.test(form.phone.trim())) {
      setError("Enter a valid phone number or leave the field blank.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setPending(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
        password: form.password,
      });
      navigate("/login", { replace: true, state: { registrationMessage: "Your account is ready. Sign in to open your workspace." } });
    } catch (requestError) {
      setError(requestError.message || "We couldn't create your account. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page auth-page-register">
      <section className="auth-visual auth-visual-register">
        <div className="auth-visual-top"><Brand light /><Link to="/" className="auth-home-link"><ArrowLeft size={15} /> Back to home</Link></div>
        <div className="auth-visual-copy">
          <span className="eyebrow eyebrow-light">Grow with Leafwise</span>
          <h1>Make room<br />for a <em>healthier harvest.</em></h1>
          <p>Create your account to keep your farm details close and explore thoughtful crop health tools.</p>
        </div>
        <div className="auth-visual-caption"><span><LockKeyhole size={17} /></span><p>A place for your farm.<br /><strong>Support for what’s next.</strong></p><span className="auth-caption-rule" /></div>
      </section>
      <section className="auth-form-side">
        <div className="auth-mobile-brand"><Brand /></div>
        <div className="auth-form-wrap auth-form-wrap-register">
          <span className="eyebrow">Start growing with us</span>
          <h2>Create your account.</h2>
          <p className="auth-subtitle">A few details and you’re ready to get started.</p>
          {error && <div className="form-error" role="alert">{error}</div>}
          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="form-field"><span>Full name</span><span className="input-wrap"><UserRound size={17} aria-hidden="true" /><input autoComplete="name" value={form.name} onChange={update("name")} placeholder="Your name" minLength={2} maxLength={100} required /></span></label>
            <label className="form-field"><span>Email address</span><span className="input-wrap"><Mail size={17} aria-hidden="true" /><input autoComplete="email" type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" maxLength={254} required /></span></label>
            <label className="form-field"><span>Phone number <small>Optional</small></span><span className="input-wrap"><Phone size={17} aria-hidden="true" /><input autoComplete="tel" type="tel" value={form.phone} onChange={update("phone")} placeholder="+1 (555) 000-0000" /></span></label>
            <label className="form-field"><span>Password</span><span className="input-wrap"><LockKeyhole size={17} aria-hidden="true" /><input aria-label="Password" autoComplete="new-password" type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} placeholder="At least 8 characters" minLength={8} required /><button className="input-action" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((show) => !show)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
            <label className="form-field"><span>Confirm password</span><span className="input-wrap"><LockKeyhole size={17} aria-hidden="true" /><input autoComplete="new-password" type={showPassword ? "text" : "password"} value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="Enter your password again" required /></span></label>
            <button type="submit" className="button button-primary button-full" disabled={pending}>{pending ? <><Spinner label="Creating account" /> Creating your account…</> : <>Create account <ArrowRight size={17} /></>}</button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
        <div className="auth-bottom"><span>© {new Date().getFullYear()} Leafwise</span><Link to="/login">Sign in <ArrowRight size={14} /></Link></div>
      </section>
    </main>
  );
}
