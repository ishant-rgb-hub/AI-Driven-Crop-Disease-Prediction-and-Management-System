# Member B API Contract: AI Disease Prediction

Base URL: /api. All endpoints except diseases require a JWT: `Authorization: Bearer <token>`.

## Authentication
### POST /api/auth/register
Required JSON fields: `name`, `email`, `password`; `phone` is optional.
Response 201: `{ user }` with no password fields.

### POST /api/auth/login
Required JSON fields: `email`, `password`.
Response 200: `{ token, user }`.
Invalid credentials return `401` without revealing whether the email exists.

### GET /api/auth/me
Requires a JWT and returns the authenticated user's safe profile.

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