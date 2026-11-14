import React from "react";

export default function StatCard({ label, value, note, tone = "" }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{tone === "green" ? "✓" : tone === "orange" ? "!" : "◷"}</div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>;
}
