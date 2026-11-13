import React from "react";

export default function ConfidenceBadge({ confidence }) {
  const percentage = Math.round(confidence * 100);
  return (
    <div className="person1-confidence">
      <div className="person1-confidence-label">
        <span>Model confidence</span>
        <strong>{percentage}%</strong>
      </div>
      <div className="progress" aria-label={`${percentage}% confidence`}>
        <i style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
