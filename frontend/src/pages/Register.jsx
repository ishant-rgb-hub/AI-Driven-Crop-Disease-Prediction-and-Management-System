import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth(); const navigate = useNavigate(); const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" }); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); setError(""); setBusy(true); try { await register(form); navigate("/login", { state: { registered: true } }); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  return <div className="auth-page"><Link to="/" className="brand auth-brand"><span className="brand-mark">✦</span> leafwise</Link><div className="auth-card"><p className="eyebrow">Join leafwise</p><h1>Grow with more confidence.</h1><p className="muted">Create your free crop health workspace.</p>{error && <Alert>{error}</Alert>}<form onSubmit={submit}><label>Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label><label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label>Phone <span className="optional">optional</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 00000 00000" /></label><label>Password<input type="password" required minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /></label><button className="button primary full" disabled={busy}>{busy ? "Creating account..." : "Create account"} <span>↗</span></button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></div></div>;
}
