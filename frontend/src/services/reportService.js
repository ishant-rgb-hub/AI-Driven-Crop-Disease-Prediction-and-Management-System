import { jsPDF } from "jspdf";
import { BACKEND_URL } from "./api";

function imageUrl(prediction) {
  return prediction?.image?.url ? `${BACKEND_URL}${prediction.image.url}` : "";
}

async function imageAsDataUrl(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("The prediction image could not be loaded for the report.");
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("The prediction image could not be prepared for the report."));
    reader.readAsDataURL(blob);
  });
}

export async function downloadDiagnosisReport(prediction) {
  const disease = prediction?.disease || {};
  const pdf = new jsPDF();
  pdf.setTextColor(23, 50, 38);
  pdf.setFontSize(22);
  pdf.text("Leafwise", 20, 22);
  pdf.setFontSize(10);
  pdf.setTextColor(90, 110, 99);
  pdf.text("Crop health diagnosis report", 20, 30);
  pdf.setTextColor(23, 50, 38);
  pdf.setFontSize(11);
  pdf.text(`Prediction ID: ${prediction.id}`, 20, 45);
  pdf.text(`Date: ${new Date(prediction.createdAt).toLocaleString()}`, 20, 53);
  pdf.text(`Crop: ${disease.cropName || "Unknown"}`, 20, 61);
  pdf.text(`Result: ${disease.displayName || disease.name || "Unknown"}`, 20, 69);
  pdf.text(`Confidence: ${Math.round(prediction.confidence * 100)}%`, 20, 77);

  const url = imageUrl(prediction);
  if (url) {
    const dataUrl = await imageAsDataUrl(url);
    pdf.addImage(dataUrl, "JPEG", 20, 88, 80, 60);
  }

  let y = 163;
  pdf.setFontSize(12);
  pdf.text("Description", 20, y);
  pdf.setFontSize(10);
  const description = pdf.splitTextToSize(disease.description || "No description available.", 170);
  pdf.text(description, 20, y + 8);
  y += 8 + description.length * 5 + 8;
  pdf.setFontSize(12);
  pdf.text("Symptoms", 20, y);
  pdf.setFontSize(10);
  pdf.text(pdf.splitTextToSize(disease.symptoms || "No symptoms recorded.", 170), 20, y + 8);
  pdf.save(`leafwise-diagnosis-${prediction.id}.pdf`);
}
