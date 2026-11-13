import json
import io
import os
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image

app = FastAPI(title="Crop Disease ML Service")
MODEL_PATH = Path(os.getenv("MODEL_PATH", "models/crop_disease_model.keras"))
LABELS_PATH = Path(os.getenv("LABELS_PATH", "labels/class_indices.json"))

_model = None
_labels = None


def load_model():
    global _model, _labels
    if _model is None:
        if not MODEL_PATH.is_file() or not LABELS_PATH.is_file():
            raise RuntimeError(
                "ML model is not installed. Provide MODEL_PATH and LABELS_PATH."
            )
        try:
            import tensorflow as tf
        except ImportError as error:
            raise RuntimeError("TensorFlow is required to load the ML model.") from error
        _model = tf.keras.models.load_model(MODEL_PATH)
        _labels = json.loads(LABELS_PATH.read_text())
    return _model, _labels


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_ready": MODEL_PATH.is_file() and LABELS_PATH.is_file(),
    }


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    if image.content_type not in {"image/jpeg", "image/png"}:
        raise HTTPException(status_code=400, detail="Only JPG and PNG images are allowed")

    try:
        contents = await image.read()
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image must be 5 MB or smaller")
        with Image.open(io.BytesIO(contents)) as decoded:
            decoded.verify()
        model, labels = load_model()
        with Image.open(io.BytesIO(contents)) as decoded:
            prepared = decoded.convert("RGB").resize((224, 224))
        import numpy as np
        probabilities = model.predict(np.expand_dims(np.asarray(prepared) / 255.0, axis=0), verbose=0)[0]
        index = int(np.argmax(probabilities))
        label = labels[str(index)] if isinstance(labels, dict) else labels[index]
        return {"label": label, "confidence": float(probabilities[index])}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=503, detail="Model inference is unavailable") from error
