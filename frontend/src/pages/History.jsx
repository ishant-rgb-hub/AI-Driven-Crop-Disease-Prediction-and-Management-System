import React from "react";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import { api, BACKEND_URL } from "../services/api";
import { downloadDiagnosisReport } from "../services/reportService";
import { EmptyState, PredictionRow } from "./Dashboard";
import "../styles/person1.css";

export default function History() {
  const [predictions, setPredictions] = useState([]); const [crop, setCrop] = useState(""); const [disease, setDisease] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => { api.predictions().then(setPredictions).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
  const filtered = predictions.filter((p) => (!crop || p.disease?.cropName === crop) && (!disease || p.disease?.displayName === disease));
  const diseases = [...new Set(predictions.map((p) => p.disease?.displayName).filter(Boolean))];
  async function download(p) { try { await downloadDiagnosisReport(p); } catch (reportError) { setError(reportError.message); } }
  return <div className="page"><div className="page-header"><div><p className="eyebrow">Your records</p><h1>Prediction history</h1><p className="muted">A timeline of the crop health checks you’ve run.</p></div><a className="button primary" href="/app/detect">+ New diagnosis</a></div>{error && <Alert>{error}</Alert>}<div className="person1-filter-row"><label htmlFor="history-crop">Filter crop</label><select id="history-crop" value={crop} onChange={(e) => setCrop(e.target.value)}><option value="">All crops</option><option>Tomato</option><option>Potato</option></select><label htmlFor="history-disease">Filter disease</label><select id="history-disease" value={disease} onChange={(e) => setDisease(e.target.value)}><option value="">All diseases</option>{diseases.map((name) => <option key={name}>{name}</option>)}</select></div><section className="panel history-panel">{loading ? <div className="empty-state person1-loading">Loading prediction history...</div> : filtered.length ? filtered.map((p) => <div id={`prediction-${p.id}`} key={p.id} className="history-item"><PredictionRow prediction={p} /><div className="history-detail"><span>Label</span><strong>{p.rawLabel || p.disease?.name}</strong><span>Confidence</span><strong>{Math.round(p.confidence * 100)}%</strong><span>Image</span><a href={`${BACKEND_URL}${p.image?.url}`} target="_blank" rel="noreferrer">Open image ↗</a></div><div className="person1-history-actions"><button className="button outline small" type="button" onClick={() => download(p)}>Download report</button></div></div>) : <EmptyState text="No predictions match these filters." link="/app/detect" />}</section></div>;
}
