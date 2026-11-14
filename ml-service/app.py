import io

from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image

from predictor import model_ready, predict_image

app = FastAPI(title="Crop Disease ML Service")


@app.get("/health")
def health():
    return {"status": "ok", "model_ready": model_ready()}


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
        return predict_image(contents)
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=503, detail="Model inference is unavailable") from error
