import React from "react";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Profile() {
  const { user } = useAuth(); const [form, setForm] = useState({ name: "", phone: "" }); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  useEffect(() => { api.profile().then(({ user: current }) => setForm({ name: current.name || "", phone: current.phone || "" })).catch((e) => setError(e.message)); }, []);
  async function submit(e) { e.preventDefault(); setMessage(""); setError(""); try { await api.updateProfile(form); setMessage("Profile updated successfully."); } catch (err) { setError(err.message); } }
  return <div className="page"><div className="page-header"><div><p className="eyebrow">Account</p><h1>Your profile</h1><p className="muted">Keep your grower details up to date.</p></div></div><div className="profile-layout"><section className="panel profile-card"><div className="profile-avatar">{user?.name?.slice(0, 1).toUpperCase()}</div><h2>{user?.name}</h2><p>{user?.email}</p><span className="member-tag">Leafwise member</span></section><section className="panel"><p className="eyebrow">Personal details</p><h2>Edit profile</h2>{error && <Alert>{error}</Alert>}{message && <Alert tone="success">{message}</Alert>}<form onSubmit={submit} className="profile-form"><label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional" /></label><label>Email<input value={user?.email || ""} disabled /></label><button className="button primary">Save changes</button></form></section></div></div>;
}
