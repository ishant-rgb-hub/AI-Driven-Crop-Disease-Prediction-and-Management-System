import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, CalendarDays, Check, CircleUserRound, Mail, Phone, Save, UserRound, X } from "lucide-react";
import { apiRequest } from "../api/client.js";
import { ErrorState, PageTitle, Spinner } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(date);
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  const loadProfile = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest("/users/profile", { signal });
      setProfile(result.user);
      setForm({ name: result.user.name || "", phone: result.user.phone || "" });
      setUser(result.user);
    } catch (requestError) {
      if (requestError.name !== "AbortError") setError(requestError.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    const controller = new AbortController();
    loadProfile(controller.signal);
    return () => controller.abort();
  }, [loadProfile]);

  function resetForm() {
    setForm({ name: profile?.name || "", phone: profile?.phone || "" });
    setEditing(false);
    setError("");
    setMessage("");
  }

  async function saveProfile(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (form.name.trim().length < 2 || form.name.trim().length > 100) {
      setError("Your name must be between 2 and 100 characters.");
      return;
    }
    if (form.phone && !/^[0-9+()\-\s]{7,20}$/.test(form.phone.trim())) {
      setError("Enter a valid phone number or leave the field blank.");
      return;
    }

    setSaving(true);
    try {
      const result = await apiRequest("/users/profile", {
        method: "PUT",
        body: { name: form.name.trim(), phone: form.phone.trim() || null },
      });
      setProfile(result.user);
      setForm({ name: result.user.name || "", phone: result.user.phone || "" });
      setUser(result.user);
      setEditing(false);
      setMessage("Your profile changes have been saved.");
    } catch (requestError) {
      setError(requestError.message || "Your profile could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-page">
      <PageTitle eyebrow="YOUR ACCOUNT" title="Your profile" description="Keep your account details up to date." />
      {loading ? <div className="profile-loading"><Spinner label="Loading your profile" /><span>Loading your profile…</span></div>
        : error && !profile ? <ErrorState title="We couldn’t load your profile." message={error} onRetry={() => loadProfile()} />
          : profile && (
            <>
              {error && <div className="form-error profile-feedback" role="alert">{error}</div>}
              {message && <div className="form-success profile-feedback" role="status"><Check size={16} />{message}</div>}
              <div className="profile-grid">
                <section className="panel profile-card">
                  <div className="profile-card-top"><div className="profile-avatar"><CircleUserRound size={37} strokeWidth={1.5} /></div><span className="verified-badge"><BadgeCheck size={15} /> Leafwise member</span></div>
                  <h2>{profile.name}</h2><p className="profile-email">{profile.email}</p>
                  <div className="profile-card-rule" />
                  <div className="profile-meta"><CalendarDays size={17} /><span><small>Member since</small><strong>{formatDate(profile.createdAt)}</strong></span></div>
                  <div className="profile-meta"><Mail size={17} /><span><small>Email address</small><strong>{profile.email}</strong></span></div>
                </section>
                <section className="panel profile-details">
                  <div className="profile-details-heading"><div><span className="eyebrow">Personal information</span><h2>Account details</h2></div>{!editing && <button className="button button-secondary button-small" type="button" onClick={() => { setEditing(true); setError(""); setMessage(""); }}>Edit details</button>}</div>
                  <form onSubmit={saveProfile}>
                    <label className="form-field"><span>Full name</span><span className={`input-wrap${editing ? "" : " input-readonly"}`}><UserRound size={17} aria-hidden="true" /><input autoComplete="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} readOnly={!editing} maxLength={100} required /></span></label>
                    <label className="form-field"><span>Email address <small>Cannot be changed</small></span><span className="input-wrap input-readonly"><Mail size={17} aria-hidden="true" /><input type="email" value={profile.email} readOnly aria-readonly="true" /></span></label>
                    <label className="form-field"><span>Phone number <small>Optional</small></span><span className={`input-wrap${editing ? "" : " input-readonly"}`}><Phone size={17} aria-hidden="true" /><input autoComplete="tel" type="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} readOnly={!editing} placeholder="Add a phone number" /></span></label>
                    {editing && <div className="profile-form-actions"><button className="button button-secondary" type="button" onClick={resetForm} disabled={saving}><X size={16} /> Cancel</button><button className="button button-primary" type="submit" disabled={saving}>{saving ? <><Spinner label="Saving profile" /> Saving…</> : <><Save size={16} /> Save changes</>}</button></div>}
                  </form>
                </section>
              </div>
              <div className="profile-privacy-note"><BadgeCheck size={17} /><span>Your profile information is managed securely. Your email address is the sign-in identity for this account.</span></div>
            </>
          )}
      {!loading && !profile && !error && <ErrorState title="Your profile is unavailable." message={`We couldn't find account information for ${user?.email || "this account"}.`} />}
    </div>
  );
}
