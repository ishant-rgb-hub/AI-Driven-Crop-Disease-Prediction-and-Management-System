import React from "react";
import ConfidenceBadge from "./ConfidenceBadge";

export default function PredictionCard({ prediction, onDownload }) {
  const disease = prediction?.disease;
  const healthy = Boolean(disease?.isHealthy);
  return (
    <div className={`person1-result-card ${healthy ? "person1-healthy" : "person1-diseased"}`}>
      <div className="person1-result-heading">
        <div>
          <span className="crop-tag">{disease?.cropName || "Crop"}</span>
          <h2>{disease?.displayName || disease?.name || "Prediction result"}</h2>
        </div>
        <span className={`status-pill ${healthy ? "healthy" : "attention"}`}>
          {healthy ? "Healthy" : "Needs attention"}
        </span>
      </div>
      <p className="person1-result-description">{disease?.description || "No description was returned."}</p>
      {disease?.symptoms && (
        <div className="person1-symptoms">
          <strong>Symptoms</strong>
          <span>{disease.symptoms}</span>
        </div>
      )}
      <ConfidenceBadge confidence={prediction.confidence} />
      {onDownload && (
        <button type="button" className="button outline small" onClick={onDownload}>
          Download report
        </button>
      )}
    </div>
  );
}
