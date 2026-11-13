# Crop disease ML service

This service is the real-model boundary used by the Node backend. The repository
does not include a model binary or label map. Install a verified, licensed model
whose labels exactly match `backend/prisma/data/diseases.js`, then place the files
at:

```text
ml-service/models/crop_disease_model.keras
ml-service/labels/class_indices.json
```

`class_indices.json` must map model output indexes to database labels, for example:

```json
{"0": "Tomato___Early_blight"}
```

Run it with:

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000
```

Set `ML_SERVICE_URL=http://127.0.0.1:8000` in `backend/.env`. In development,
the Node service falls back to its deterministic mock only when the ML service
cannot be reached. Set `ML_MOCK_FALLBACK=false` to disable that fallback; it is
always disabled in production. Invalid model responses and inference failures are
returned as errors rather than converted into fake predictions.
