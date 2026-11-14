# AI-Driven Crop Disease Prediction and Management System

A collaborative agricultural platform intended to help farmers identify crop
disease concerns, review disease-management information, and organize farm,
crop, and field records. This repository contains the Express/Prisma backend
and team-developed disease and treatment modules. The APIs documented below
reflect the implementation currently mounted by `backend/src/app.js`; planned
or unmounted endpoints are not presented as working features.

## Project objectives

- Support early crop-disease identification through the project's AI module.
- Make disease, treatment, and prevention information easier to access.
- Let authenticated farmers maintain their profile, farms, crops, and fields.
- Keep each farm record and its related records scoped to its owner.
- Provide a foundation for prediction history and future crop-health tools.

## Technology stack

| Technology | Use |
|---|---|
| Node.js and CommonJS JavaScript | Backend runtime and modules |
| Express 5 | HTTP server, routing, middleware |
| PostgreSQL | Relational database |
| Prisma 7 | Schema, generated client, and database access |
| `pg` / `@prisma/adapter-pg` | PostgreSQL driver adapter |
| `bcrypt` | Password hashing and verification |
| `jsonwebtoken` | Signed bearer-token authentication |
| `node:test` | Backend API tests |

Disease prediction/AI is a separate team module; this README does not claim that
the Member A user, farm, crop, or field APIs perform model inference.

## Backend architecture

```text
HTTP request
  -> backend/src/app.js (Express setup and route mounts)
  -> route (URL and authentication middleware)
  -> controller (validation, ownership checks, business logic)
  -> Prisma client (backend/src/config/database.js)
  -> PostgreSQL
```

| Path | Responsibility |
|---|---|
| `backend/src/server.js` | Starts the HTTP server using `PORT` or 3000 |
| `backend/src/app.js` | JSON parser, route mounts, health response, error handler |
| `backend/src/routes/` | Maps endpoint methods and paths to controllers |
| `backend/src/controllers/` | Authentication, profile, farm, crop, and field operations |
| `backend/src/middleware/auth.middleware.js` | Validates bearer JWT and sets `req.user.id` |
| `backend/src/middleware/error.middleware.js` | Formats unhandled and server errors |
| `backend/src/utils/validation.js` | Request validation and safe user serialization |
| `backend/prisma/schema.prisma` | Database models, fields, and relations |
| `backend/prisma.config.ts` | Prisma schema, migrations path, and datasource URL |
| `backend/test/api.test.js` | Node test-runner API and validation tests |

Mounted route prefixes include `/api/auth`, `/api/users`, `/api/farms`,
`/api/crops`, `/api/fields`, `/api/diseases`, and `/api/treatments`.

## Data models and relationships

- **User** stores a farmer's name, unique email, password hash, optional phone,
  and timestamps. One user can own many farms, crop images, and predictions.
- **Farm** stores its name, location, total area, soil and irrigation types,
  and an owning `userId`. A farm has many crops and fields.
- **Crop** belongs to a farm and stores a name, optional variety, planting and
  expected harvest dates, and growth stage. Its Prisma property `cropName` maps
  to the database column `name`.
- **Field** belongs to a farm and stores its name, area, and optional soil and
  irrigation information.
- **Disease**, **CropImage**, **Prediction**, **Treatment**, **Prevention**,
  **Recommendation**, and **PredictionFeedback** are also represented in the
  shared Prisma schema. Their presence in the schema does not imply that every
  related API is mounted or implemented by this backend branch.

Farm deletion cascades to its crops and fields; user deletion cascades to farms.
Crop and field queries verify ownership through their parent farm.

## Authentication and authorization

Registration and login are public. After a successful login, send the returned
JWT on protected requests:

```http
Authorization: Bearer <token>
```

The backend signs HS256 tokens containing `userId`; tokens expire after one
hour. A `JWT_SECRET` of at least 32 characters is required. Passwords are
hashed with bcrypt (12 rounds); plaintext passwords are never returned.
Registration requires a password of at least 8 characters and no more than 72
UTF-8 bytes.

Protected profile, farm, crop, and field routes require a valid token. Farm,
crop, and field operations are restricted to the authenticated owner. Requests
for another user's records return `404` rather than disclosing whether the
record exists. Profile email, ID, timestamps, and password fields cannot be
updated through the profile endpoint.

## API reference

All request bodies are JSON. IDs in paths are positive integers. Unless noted
otherwise, successful JSON responses use `{"success": true, ...}`. Error
response shapes are described under [Errors and status codes](#errors-and-status-codes).

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---:|---|
| `POST` | `/api/auth/register` | No | Create an account |
| `POST` | `/api/auth/login` | No | Verify credentials and return a JWT |
| `GET` | `/api/auth/me` | Yes | Return the authenticated user's safe profile |

Registration request:

```json
{
  "name": "Alex Farmer",
  "email": "alex@example.com",
  "password": "a-strong-password",
  "phone": "+1 555 123 4567"
}
```

`phone` is optional and may be omitted. On success (`201 Created`):

```json
{
  "success": true,
  "user": {
    "id": 12,
    "name": "Alex Farmer",
    "email": "alex@example.com",
    "phone": "+1 555 123 4567",
    "createdAt": "2026-01-15T12:00:00.000Z",
    "updatedAt": "2026-01-15T12:00:00.000Z"
  }
}
```

Login request is `{"email":"alex@example.com","password":"a-strong-password"}`.
Successful login (`200 OK`) returns `success`, `token`, and `user` with the safe
fields shown above. The password hash is not included.

### User profile

Both profile routes require a bearer token. `PUT` accepts one or both editable
properties; no empty update is accepted.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/profile` | Return the authenticated user's profile |
| `PUT` | `/api/users/profile` | Update `name` and/or `phone` |

Example update:

```json
{ "name": "Alex Green", "phone": null }
```

The `200 OK` response is `{"success":true,"user":{...}}` with the safe user
fields. Phone must be a valid phone string when non-null.

### Farm management

All farm routes require a bearer token. Creation requires all five listed
properties. Farm names and soil/irrigation types must be 2–100 characters;
location must be 2–200 characters; total area must be a positive number.
`PUT` accepts a partial set of those properties.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/farms` | Create a farm owned by the current user |
| `GET` | `/api/farms` | List the current user's farms, newest first |
| `GET` | `/api/farms/:id` | Get one owned farm |
| `PUT` | `/api/farms/:id` | Update an owned farm |
| `DELETE` | `/api/farms/:id` | Delete an owned farm (and its crops/fields) |

Example create request:

```json
{
  "farmName": "North Field",
  "location": "Green Valley",
  "totalArea": 12.5,
  "soilType": "Loam",
  "irrigationType": "Drip"
}
```

Creation returns `201 Created` and `{"success":true,"farm":{...}}`. Farm
objects include `id`, the request properties, `userId`, `createdAt`, and
`updatedAt`. A list response uses `{"success":true,"farms":[...]}`. Delete
returns `204 No Content`.

### Crop management

All crop routes require a bearer token. A crop is always associated with a
farm; create and list routes take `farmId` from the URL, not from the body.
`cropName` is required on creation (2–100 characters). Optional properties are
`cropVariety` (up to 100 characters), `growthStage` (up to 50 characters),
`plantingDate`, and `expectedHarvestDate`. Dates use the valid `YYYY-MM-DD`
format. Optional values can be cleared to `null` on updates.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/farms/:farmId/crops` | Create a crop under an owned farm |
| `GET` | `/api/farms/:farmId/crops` | List crops under an owned farm |
| `GET` | `/api/crops/:id` | Get a crop owned through its farm |
| `PUT` | `/api/crops/:id` | Update an owned crop |
| `DELETE` | `/api/crops/:id` | Delete an owned crop |

Example create request:

```json
{
  "cropName": "Tomato",
  "cropVariety": "Roma",
  "plantingDate": "2026-03-01",
  "expectedHarvestDate": "2026-06-15",
  "growthStage": "flowering"
}
```

Create returns `201 Created` and `{"success":true,"crop":{...}}`; list returns
`{"success":true,"crops":[...]}`. Crop objects include `id`, the crop
properties, `farmId`, `createdAt`, and `updatedAt`. Delete returns
`204 No Content`.

### Field management

All field routes require a bearer token. Create requires a 2–100 character
`fieldName` and positive `area`. `soilType` and `irrigationType` are optional
and, when supplied as strings, must be 2–100 characters. `PUT` accepts a
partial set of these fields.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/farms/:farmId/fields` | Create a field under an owned farm |
| `GET` | `/api/farms/:farmId/fields` | List fields under an owned farm |
| `GET` | `/api/fields/:id` | Get a field owned through its farm |
| `PUT` | `/api/fields/:id` | Update an owned field |
| `DELETE` | `/api/fields/:id` | Delete an owned field |

Example create request:

```json
{
  "fieldName": "East Plot",
  "area": 2.5,
  "soilType": "Loam",
  "irrigationType": "Sprinkler"
}
```

Create returns `201 Created` and `{"success":true,"field":{...}}`; list returns
`{"success":true,"fields":[...]}`. Field objects include `id`, the request
properties, `farmId`, `createdAt`, and `updatedAt`. Delete returns
`204 No Content`.

### Example authenticated request

```bash
curl http://localhost:3000/api/farms \
  -H "Authorization: Bearer <token>"
```

## Errors and status codes

Validation and authorization middleware errors use
`{"success":false,"error":"..."}`. Unhandled errors formatted by the global
error middleware use `{"error":"..."}`; internal server errors are logged on
the server and returned as the generic message `"Internal server error"`.

| Status | Meaning in this implementation |
|---:|---|
| `200` | Successful read, login, or update |
| `201` | Successful registration or resource creation |
| `204` | Successful deletion; response has no body |
| `400` | Invalid request fields, unsupported properties, or invalid path ID |
| `401` | Invalid login, missing/invalid/expired bearer token |
| `404` | User/resource not found, including resources not owned by caller |
| `409` | Email already registered |
| `500` | Unexpected server/database error or missing required server configuration |

## Environment and local setup

Requirements: Node.js, npm, and a PostgreSQL development database.

1. Clone the repository and enter `backend`:

   ```bash
   git clone https://github.com/ishant-rgb-hub/AI-Driven-Crop-Disease-Prediction-and-Management-System.git
   cd AI-Driven-Crop-Disease-Prediction-and-Management-System/backend
   npm install
   ```

2. Create a local environment file and set values for your own machine:

   ```bash
   cp .env.example .env
   ```

   Configure:

   ```dotenv
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/crop_disease?schema=public"
   JWT_SECRET="replace-with-a-random-secret-at-least-32-characters"
   PORT=3000
   ```

   `DATABASE_URL` must point to a PostgreSQL database. `JWT_SECRET` must be at
   least 32 characters. `PORT` is optional and defaults to `3000`. Never commit
   `.env` or real credentials.

3. Generate the Prisma client and apply the schema to a local development
   database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

   The repository currently has no checked-in Prisma migration files.
   `db push` synchronizes the schema without migration history; use it only
   against a development database, not a shared or production database.

4. Start the server from `backend`:

   ```bash
   node src/server.js
   ```

   The server reports `http://localhost:3000`. `GET /` returns a simple backend
   health response.

5. Run the existing tests from `backend`:

   ```bash
   npm test
   ```

The API tests use the Node test runner and stub Prisma model operations; they
exercise HTTP behavior without requiring a live PostgreSQL server.

## Git and contribution workflow

The Member A implementation is on `feature/vanshika-day1`. Check the current
branch and working tree before staging:

```bash
git status --short --branch
```

Keep commits focused and push only to your feature branch after review. Do not
push directly to `main`.
