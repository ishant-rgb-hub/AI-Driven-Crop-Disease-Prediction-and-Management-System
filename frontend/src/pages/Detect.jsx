import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import ImageUploader from "../components/ImageUploader";
import PredictionCard from "../components/PredictionCard";
import { api } from "../services/api";
import { downloadDiagnosisReport } from "../services/reportService";
import "../styles/person1.css";

export default function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  function choose(candidate, validationError) {
    setError(validationError || "");
    setResult(null);
    if (!candidate || validationError) return;
    setFile(candidate);
    setPreview(URL.createObjectURL(candidate));
  }

  function remove() {
    setFile(null);
    setPreview("");
    setResult(null);
  }

  async function analyze() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      setResult(await api.createPrediction(file));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function downloadReport() {
    try {
      await downloadDiagnosisReport(result);
    } catch (reportError) {
      setError(reportError.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div><p className="eyebrow">AI diagnosis</p><h1>What’s happening on the leaf?</h1><p className="muted">Upload a clear, well-lit photo for the best result.</p></div>
      </div>
      <div className="detection-layout">
        <section className="panel upload-panel">
          {error && <Alert>{error}</Alert>}
          <ImageUploader file={file} preview={preview} onSelect={choose} onRemove={remove} />
          <button className="button primary full" disabled={!file || busy} onClick={analyze}>
            {busy ? <><span className="spinner light" /> Scanning leaf...</> : <>Analyze image <span>↗</span></>}
          </button>
        </section>
        <section className="panel result-panel">
          {result ? (
            <>
              <p className="eyebrow">Prediction result</p>
              <PredictionCard prediction={result} onDownload={downloadReport} />
              <Link className="text-link" to="/app/history">View in history →</Link>
            </>
          ) : (
            <div className="result-placeholder"><span>✦</span><h2>Your result will appear here</h2><p>Upload a leaf image and run an analysis to see the crop health insight.</p></div>
          )}
        </section>
      </div>
    </div>
  );
}
