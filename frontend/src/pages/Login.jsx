import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate(); const [form, setForm] = useState({ email: "", password: "" }); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); setError(""); setBusy(true); try { await login(form); navigate("/app"); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  return <div className="auth-page"><Link to="/" className="brand auth-brand"><span className="brand-mark">✦</span> leafwise</Link><div className="auth-card"><p className="eyebrow">Welcome back</p><h1>Good to see you again.</h1><p className="muted">Sign in to continue caring for your crops.</p>{error && <Alert>{error}</Alert>}<form onSubmit={submit}><label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" /></label><button className="button primary full" disabled={busy}>{busy ? "Signing in..." : "Sign in"} <span>↗</span></button></form><p className="auth-switch">New to leafwise? <Link to="/register">Create an account</Link></p></div></div>;
}
