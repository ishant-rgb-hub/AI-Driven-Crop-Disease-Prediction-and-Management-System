import React from "react";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import { api } from "../services/api";

export default function Diseases() {
  const [diseases, setDiseases] = useState([]); const [crop, setCrop] = useState(""); const [query, setQuery] = useState(""); const [error, setError] = useState("");
  useEffect(() => { api.diseases(crop).then(setDiseases).catch((e) => setError(e.message)); }, [crop]);
  const filtered = diseases.filter((d) => `${d.displayName} ${d.name} ${d.cropName}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="page"><div className="page-header"><div><p className="eyebrow">Knowledge base</p><h1>Disease library</h1><p className="muted">Learn to recognize the conditions we currently support.</p></div></div>{error && <Alert>{error}</Alert>}<div className="library-tools"><input placeholder="Search diseases..." value={query} onChange={(e) => setQuery(e.target.value)} /><select value={crop} onChange={(e) => setCrop(e.target.value)}><option value="">All crops</option><option>Tomato</option><option>Potato</option></select></div><div className="disease-grid">{filtered.map((d) => <article className="disease-card" key={d.id}><div className={`disease-symbol ${d.isHealthy ? "healthy" : ""}`}>{d.isHealthy ? "✓" : "!"}</div><span className="crop-tag">{d.cropName}</span><h2>{d.displayName}</h2><p>{d.description}</p><div className="symptoms"><strong>Symptoms</strong><span>{d.symptoms}</span></div></article>)}</div></div>;
}
