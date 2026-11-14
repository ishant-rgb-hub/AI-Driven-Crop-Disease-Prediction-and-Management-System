import React, { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Alert from "../components/Alert";
import StatCard from "../components/StatCard";
import { api } from "../services/api";
import "../styles/person1.css";

export default function CropAnalytics() {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { api.predictions().then(setPredictions).catch((e) => setError(e.message)); }, []);
  const healthy = predictions.filter((p) => p.disease?.isHealthy).length;
  const diseased = predictions.length - healthy;
  const distribution = useMemo(() => {
    const counts = new Map();
    predictions.forEach((p) => {
      const name = p.disease?.displayName || "Unknown";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return [...counts].map(([name, count]) => ({ name, count }));
  }, [predictions]);
  const cropComparison = useMemo(() => ["Tomato", "Potato"].map((crop) => ({ name: crop, count: predictions.filter((p) => p.disease?.cropName === crop).length })), [predictions]);
  const mostDetected = distribution.sort((a, b) => b.count - a.count)[0]?.name || "None yet";
  return <div className="page"><div className="page-header"><div><p className="eyebrow">Crop intelligence</p><h1>Crop health analytics</h1><p className="muted">Statistics calculated from your prediction history.</p></div></div>{error && <Alert>{error}</Alert>}<div className="person1-analytics-grid"><StatCard label="Total scans" value={predictions.length} note="All time" /><StatCard label="Healthy crops" value={healthy} note="Based on predictions" tone="green" /><StatCard label="Diseased crops" value={diseased} note="Review recommended" tone="orange" /></div><div className="content-grid"><section className="panel person1-chart"><h2>Disease distribution</h2><ResponsiveContainer width="100%" height={230}><BarChart data={distribution}><CartesianGrid strokeDasharray="3 3" stroke="#e4e9e2" /><XAxis dataKey="name" hide /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#2d7654" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></section><section className="panel person1-chart"><h2>Crop comparison</h2><ResponsiveContainer width="100%" height={230}><BarChart data={cropComparison}><CartesianGrid strokeDasharray="3 3" stroke="#e4e9e2" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#d77740" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></section></div><section className="panel" style={{ marginTop: "1.5rem" }}><p className="eyebrow">Most detected disease</p><h2>{mostDetected}</h2><p className="muted">This summary uses only the authenticated user’s records returned by <code>GET /api/predictions</code>.</p></section></div>;
}
