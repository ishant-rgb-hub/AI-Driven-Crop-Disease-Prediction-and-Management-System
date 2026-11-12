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
Content-Type: multipart/form-data
Fields: `image` (jpg/png, max 5 MB), `cropId` (optional)
Response 201:
{ id, imageUrl, confidence, disease: { id, name, cropName }, createdAt }
Errors: 400 (invalid or missing image), 401 (no token), 502 (AI service down)

### GET /api/predictions
Response 200: list of the current user's predictions, newest first.

### GET /api/predictions/:id
Response 200: single prediction with disease details.
Response 403/404 if it is not the user's or does not exist.

## AI service (internal)
POST http://localhost:8000/predict (multipart: `image`)
Response: `{ "label": "Tomato___Late_blight", "confidence": 0.93 }`
`label` must match `Disease.name` in the database seed.

## Models owned by Member B
Disease, CropImage, Prediction (schema changes go through Member A).