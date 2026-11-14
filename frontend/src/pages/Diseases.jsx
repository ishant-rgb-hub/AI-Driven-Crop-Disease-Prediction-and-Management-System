import React from "react";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import { api } from "../services/api";
import "../styles/person1.css";

export default function Diseases() {
  const [diseases, setDiseases] = useState([]); const [crop, setCrop] = useState(""); const [query, setQuery] = useState(""); const [selected, setSelected] = useState(null); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api.diseases(crop).then(setDiseases).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [crop]);
  const filtered = diseases.filter((d) => `${d.displayName} ${d.name} ${d.cropName}`.toLowerCase().includes(query.toLowerCase()));
  async function showDetails(id) {
    setError("");
    try { setSelected(await api.disease(id)); } catch (requestError) { setError(requestError.message); }
  }
  return <div className="page"><div className="page-header"><div><p className="eyebrow">Knowledge base</p><h1>Disease library</h1><p className="muted">Learn to recognize the conditions we currently support.</p></div></div>{error && <Alert>{error}</Alert>}<div className="library-tools"><input placeholder="Search diseases..." value={query} onChange={(e) => setQuery(e.target.value)} /><select value={crop} onChange={(e) => setCrop(e.target.value)}><option value="">All crops</option><option>Tomato</option><option>Potato</option></select></div>{loading ? <div className="empty-state person1-loading">Loading disease library...</div> : <div className="disease-grid">{filtered.map((d) => <article className="disease-card" key={d.id}><div className={`disease-symbol ${d.isHealthy ? "healthy" : ""}`}>{d.isHealthy ? "✓" : "!"}</div><span className="crop-tag">{d.cropName}</span><h2>{d.displayName}</h2><p>{d.description}</p><button className="button outline small" type="button" onClick={() => showDetails(d.id)}>View details</button></article>)}</div>}{selected && <section className="panel person1-disease-detail"><div className="panel-heading"><div><p className="eyebrow">{selected.cropName} reference</p><h2>{selected.displayName}</h2></div><button className="button outline small" type="button" onClick={() => setSelected(null)}>Close</button></div><p className="muted">{selected.description}</p><div className="symptoms"><strong>Symptoms</strong><span>{selected.symptoms || "No symptoms recorded."}</span></div></section>}</div>;
}
