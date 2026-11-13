import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth(); const [predictions, setPredictions] = useState([]); const [error, setError] = useState("");
  useEffect(() => { api.predictions().then(setPredictions).catch((e) => setError(e.message)); }, []);
  const diseased = predictions.filter((p) => !p.disease?.isHealthy).length; const healthy = predictions.length - diseased;
  return <div className="page"><div className="page-header"><div><p className="eyebrow">Overview</p><h1>Good morning, {user?.name?.split(" ")[0]}.</h1><p className="muted">Here’s your crop health at a glance.</p></div><Link className="button primary" to="/app/detect">+ New diagnosis</Link></div>{error && <Alert>{error}</Alert>}<div className="stats-grid"><StatCard label="Total scans" value={predictions.length} note="All time" /><StatCard label="Healthy crops" value={healthy} note="Based on predictions" tone="green" /><StatCard label="Needs attention" value={diseased} note="Review recommended" tone="orange" /></div><div className="content-grid"><section className="panel"><div className="panel-heading"><div><p className="eyebrow">Recent activity</p><h2>Your latest scans</h2></div><Link to="/app/history" className="text-link">View all →</Link></div>{predictions.length ? predictions.slice(0, 4).map((p) => <PredictionRow key={p.id} prediction={p} />) : <EmptyState text="Your latest diagnoses will appear here." link="/app/detect" />}</section><section className="panel accent-panel"><p className="eyebrow">Ready when you are</p><h2>Check a leaf in under a minute.</h2><p>Upload a clear photo and receive a disease insight with a confidence score.</p><Link className="button dark" to="/app/detect">Upload image <span>↗</span></Link></section></div></div>;
}
export function PredictionRow({ prediction }) { return <Link className="prediction-row" to={`/app/history#prediction-${prediction.id}`}><div className="prediction-thumb">{prediction.image?.url ? <img src={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}${prediction.image.url}`} /> : "✦"}</div><div><strong>{prediction.disease?.displayName || prediction.disease?.name || "Unknown disease"}</strong><small>{new Date(prediction.createdAt).toLocaleDateString()} · {prediction.disease?.cropName || "Crop"}</small></div><span className={`status-pill ${prediction.disease?.isHealthy ? "healthy" : "attention"}`}>{Math.round(prediction.confidence * 100)}%</span></Link>; }
export function EmptyState({ text, link }) { return <div className="empty-state"><span>◌</span><p>{text}</p>{link && <Link to={link} className="text-link">Start a diagnosis →</Link>}</div>; }
