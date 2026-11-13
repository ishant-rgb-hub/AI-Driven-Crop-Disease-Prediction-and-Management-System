# Member B API Contract: AI Disease Prediction

## Authentication and User APIs

Authentication endpoints use JSON request bodies. Successful responses never include
`password` or `passwordHash`.

- `POST /api/auth/register` creates a user and returns a safe profile with HTTP 201.
- `POST /api/auth/login` verifies credentials and returns a one-hour JWT.
- `GET /api/auth/me` returns the authenticated user's safe profile.
- `GET /api/users/profile` returns the authenticated user's safe profile.
- `PUT /api/users/profile` updates only `name` and `phone`.

Protected endpoints require:

```text
Authorization: Bearer <JWT>
```

The JWT secret is configured with `JWT_SECRET`; it must not be committed.

## Farm APIs

All farm endpoints require authentication and scope records to the authenticated user:

- `POST /api/farms`
- `GET /api/farms`
- `GET /api/farms/:id`
- `PUT /api/farms/:id`
- `DELETE /api/farms/:id`

Farm creation requires `farmName`, `location`, `totalArea`, `soilType`, and
`irrigationType`. The server derives `userId` from the JWT rather than accepting it
from the request body.

Base URL: /api. All endpoints except diseases require a JWT: `Authorization: Bearer <token>`.

## Diseases
### GET /api/diseases
Response 200: `[{ id, name, cropName, description }]`

### GET /api/diseases/:id
Response 200: `{ id, name, cropName, description, symptoms }`
Response 404: `{ error: "Disease not found" }`

## Predictions
### POST /api/predictions
Authentication: `Authorization: Bearer <JWT>`
Content-Type: `multipart/form-data`
Fields: `image` (required, jpg/png, max 5 MB), `cropId` (optional positive integer)
Response 201:
```json
{
  "id": 1,
  "confidence": 0.741,
  "createdAt": "2026-11-13T07:41:10.542Z",
  "cropId": null,
  "image": {
    "id": 1,
    "url": "/uploads/<generated-filename>.png",
    "filename": "leaf.png",
    "uploadedAt": "2026-11-13T07:41:10.542Z"
  },
  "disease": {
    "id": 1,
    "name": "Tomato___Early_blight",
    "cropName": "Tomato",
    "displayName": "Early Blight",
    "description": "...",
    "symptoms": "...",
    "isHealthy": false,
    "createdAt": "2026-11-13T07:41:10.542Z"
  }
}
```
Errors: 400 (invalid or missing image/cropId), 401 (no token), 404 (crop not found), 502 (AI service down or unknown label).

### GET /api/predictions
Authentication: `Authorization: Bearer <JWT>`
Response 200: array of the current user's predictions, newest first, using the POST response shape.

### GET /api/predictions/:id
Authentication: `Authorization: Bearer <JWT>`
Response 200: single prediction using the POST response shape.
Response 400 for a non-integer id. Response 404 `{ "error": "Prediction not found" }` if it does not exist or belongs to another user.

## AI service (internal)
The current predictor is a deterministic mock; it is not a trained ML model.
It returns `{ "label": "Tomato___Late_blight", "confidence": 0.93 }` from the saved image bytes.
`label` must match `Disease.name` in the database seed.

## Models owned by Member B
Disease, CropImage, Prediction (schema changes go through Member A).