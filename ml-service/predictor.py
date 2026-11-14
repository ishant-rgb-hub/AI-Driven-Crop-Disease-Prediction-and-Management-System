import io
import json
import os
from pathlib import Path

import numpy as np
from PIL import Image

MODEL_PATH = Path(os.getenv("MODEL_PATH", "models/crop_disease_model.keras"))
LABELS_PATH = Path(os.getenv("LABELS_PATH", "labels/class_indices.json"))
IMAGE_SIZE = (224, 224)

_model = None
_labels = None


def _load_model():
    global _model, _labels

    if _model is not None:
        return _model, _labels

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


def model_ready():
    return MODEL_PATH.is_file() and LABELS_PATH.is_file()


def predict_image(contents):
    model, labels = _load_model()

    with Image.open(io.BytesIO(contents)) as image:
        prepared = image.convert("RGB").resize(IMAGE_SIZE)

    probabilities = model.predict(
        np.expand_dims(np.asarray(prepared) / 255.0, axis=0),
        verbose=0,
    )[0]
    index = int(np.argmax(probabilities))
    label = labels[str(index)] if isinstance(labels, dict) else labels[index]
    return {"label": label, "confidence": float(probabilities[index])}
