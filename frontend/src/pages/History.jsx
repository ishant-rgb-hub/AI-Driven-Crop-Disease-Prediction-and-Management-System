import React from "react";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import { api, BACKEND_URL } from "../services/api";
import { EmptyState, PredictionRow } from "./Dashboard";

export default function History() {
  const [predictions, setPredictions] = useState([]); const [error, setError] = useState("");
  useEffect(() => { api.predictions().then(setPredictions).catch((e) => setError(e.message)); }, []);
  return <div className="page"><div className="page-header"><div><p className="eyebrow">Your records</p><h1>Prediction history</h1><p className="muted">A timeline of the crop health checks you’ve run.</p></div><a className="button primary" href="/app/detect">+ New diagnosis</a></div>{error && <Alert>{error}</Alert>}<section className="panel history-panel">{predictions.length ? predictions.map((p) => <div id={`prediction-${p.id}`} key={p.id} className="history-item"><PredictionRow prediction={p} /><div className="history-detail"><span>Label</span><strong>{p.rawLabel || p.disease?.name}</strong><span>Confidence</span><strong>{Math.round(p.confidence * 100)}%</strong><span>Image</span><a href={`${BACKEND_URL}${p.image?.url}`} target="_blank" rel="noreferrer">Open image ↗</a></div></div>) : <EmptyState text="No predictions yet. Your history will appear after your first diagnosis." link="/app/detect" />}</section></div>;
}
