# Member A Evaluation Guide

This guide explains the backend work in beginner-friendly language and gives a
short demonstration flow. Examples reflect the routes currently mounted by
`backend/src/app.js`.

## 1. My contribution as Member A

My backend contribution covers farmer identity and farm records:

- Added the Prisma `User`, `Farm`, and `Crop` data structures and their core
  relationships; the shared schema also includes `Field`.
- Implemented registration, login, current-user lookup, and profile read/update.
- Implemented farm creation, listing, lookup, update, and deletion, scoped to
  the signed-in user.
- Implemented crop and field create/list/detail/update/delete operations under
  farms, with ownership checks and input validation.
- Added API tests for authentication, profile, farm, crop, and field behavior.
- Documented the implemented backend API and local setup in the project README.

The shared schema also contains disease, image, prediction, treatment,
prevention, recommendation, and feedback records. Do not describe those models
as Member A's newly implemented APIs: route availability depends on the
mounted routes and the other team modules.

## 2. Authentication flow

1. A farmer registers with a name, email, password, and optional phone.
2. The backend trims the name and phone and lowercases the email.
3. It validates the fields, rejects a duplicate email, and hashes the password
   with bcrypt before storing the user.
4. On login, the backend compares the submitted password with the stored hash.
   The password itself is never returned.
5. A successful login returns a signed HS256 JWT with the user's ID (`userId`).
   It expires after one hour.
6. The client sends that token in `Authorization: Bearer <token>` on protected
   requests.
7. `requireAuth` checks the token signature, expiry, algorithm, and user ID,
   then places the identity at `req.user.id`.

The same middleware protects profile, farm, crop, and field routes. Controllers
also check that the requested farm belongs to the authenticated user. For crop
and field detail or update, ownership is checked through the parent farm.

## 3. User, farm, crop, and field behavior

- **User profile:** a user may view their safe profile and change their name or
  phone. Email, ID, timestamps, and password are protected.
- **Farm:** belongs to one user. List and detail operations return only farms
  belonging to the caller. A farm contains descriptive details like its
  location, area, soil type, and irrigation type.
- **Crop:** belongs to one farm. Creation/listing uses nested farm routes so a
  crop cannot be attached to a farm owned by someone else.
- **Field:** also belongs to one farm and follows the same nested ownership
  rule. Its area is separate from the farm's total area.
- **Deletion:** deleting a farm cascades to its crops and fields as defined in
  Prisma. Deleting a user cascades to their farms.

Ownership failures return `404` to avoid telling one user whether another
user's resource exists.

## 4. Prisma schema and relationships

The Prisma schema is the database blueprint. Each `model` becomes a table,
scalar fields become columns, and `@relation` describes foreign-key links.

```text
User 1 ─── many Farm
Farm 1 ─── many Crop
Farm 1 ─── many Field
```

In the schema, `Farm.userId` references `User.id`; `Crop.farmId` and
`Field.farmId` reference `Farm.id`. The `onDelete: Cascade` rules remove
dependent farm records when a user is deleted and crops/fields when a farm is
deleted. Prisma uses integer auto-increment IDs. `Crop.cropName` maps to the
physical database column named `name`.

The shared schema also declares relations for AI and disease-management records.
Those are separate responsibilities; a Prisma model by itself does not make an
HTTP API available.

There are no checked-in Prisma migration files on this branch. For a local
development database, `npx prisma db push` can sync the schema, but it does not
create migration history and should not be used against shared/production data.

## 5. Important backend files

| File | In simple terms |
|---|---|
| `backend/src/server.js` | Starts listening for requests |
| `backend/src/app.js` | Builds the Express app and mounts the API routes |
| `backend/src/routes/auth.routes.js` | Declares register, login, and `/me` URLs |
| `backend/src/routes/profile.routes.js` | Protects profile routes with JWT middleware |
| `backend/src/routes/farm.routes.js` | Farm routes plus nested crop and field create/list routes |
| `backend/src/routes/crop.routes.js` | Crop detail, update, and delete routes |
| `backend/src/routes/field.routes.js` | Field detail, update, and delete routes |
| `backend/src/controllers/auth.controller.js` | Validates users, hashes passwords, issues/verifies login |
| `backend/src/controllers/profile.controller.js` | Reads and safely updates the current user |
| `backend/src/controllers/farm.controller.js` | Performs owner-scoped farm operations |
| `backend/src/controllers/crop.controller.js` | Performs farm-owned crop operations |
| `backend/src/controllers/field.controller.js` | Performs farm-owned field operations |
| `backend/src/middleware/auth.middleware.js` | Validates the bearer token for protected routes |
| `backend/src/middleware/error.middleware.js` | Turns unexpected errors into HTTP error responses |
| `backend/src/utils/validation.js` | Validates request fields and removes private user fields |
| `backend/src/config/database.js` | Creates Prisma's PostgreSQL client |
| `backend/prisma/schema.prisma` | Defines tables and their relationships |
| `backend/prisma.config.ts` | Tells Prisma where the schema and database URL are |
| `backend/test/api.test.js` | Exercises API behavior through HTTP requests |

## 6. API endpoints

`Yes` in the auth column means the request needs
`Authorization: Bearer <token>`.

### Auth and profile

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| `POST` | `/api/auth/register` | No | Register a user |
| `POST` | `/api/auth/login` | No | Login and receive a JWT |
| `GET` | `/api/auth/me` | Yes | Check the current identity |
| `GET` | `/api/users/profile` | Yes | Get the current user's safe profile |
| `PUT` | `/api/users/profile` | Yes | Update name and/or phone |

### Farms

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| `POST` | `/api/farms` | Yes | Create an owned farm |
| `GET` | `/api/farms` | Yes | List farms owned by the caller |
| `GET` | `/api/farms/:id` | Yes | Get an owned farm |
| `PUT` | `/api/farms/:id` | Yes | Partially update an owned farm |
| `DELETE` | `/api/farms/:id` | Yes | Delete an owned farm |

### Crops

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| `POST` | `/api/farms/:farmId/crops` | Yes | Create a crop under an owned farm |
| `GET` | `/api/farms/:farmId/crops` | Yes | List crops under an owned farm |
| `GET` | `/api/crops/:id` | Yes | Get an owned crop |
| `PUT` | `/api/crops/:id` | Yes | Partially update an owned crop |
| `DELETE` | `/api/crops/:id` | Yes | Delete an owned crop |

### Fields

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| `POST` | `/api/farms/:farmId/fields` | Yes | Create a field under an owned farm |
| `GET` | `/api/farms/:farmId/fields` | Yes | List fields under an owned farm |
| `GET` | `/api/fields/:id` | Yes | Get an owned field |
| `PUT` | `/api/fields/:id` | Yes | Partially update an owned field |
| `DELETE` | `/api/fields/:id` | Yes | Delete an owned field |

## 7. Request and response examples

Register:

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Alex Farmer",
  "email": "alex@example.com",
  "password": "a-strong-password",
  "phone": "+1 555 123 4567"
}
```

Login returns `200 OK`, a JWT, and a safe `user` object:

```json
{
  "success": true,
  "token": "<signed-jwt>",
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

Create a farm (authenticated):

```http
POST /api/farms
Authorization: Bearer <signed-jwt>
Content-Type: application/json
```

```json
{
  "farmName": "North Field",
  "location": "Green Valley",
  "totalArea": 12.5,
  "soilType": "Loam",
  "irrigationType": "Drip"
}
```

Create a crop under farm `3`:

```http
POST /api/farms/3/crops
Authorization: Bearer <signed-jwt>
Content-Type: application/json
```

```json
{
  "cropName": "Tomato",
  "cropVariety": "Roma",
  "plantingDate": "2026-03-01",
  "expectedHarvestDate": "2026-06-15",
  "growthStage": "flowering"
}
```

Create a field under farm `3`:

```json
{
  "fieldName": "East Plot",
  "area": 2.5,
  "soilType": "Loam",
  "irrigationType": "Sprinkler"
}
```

Successful create responses use HTTP `201` and wrap the created `farm`, `crop`,
or `field` in a `success: true` object. Successful lists return
`farms`, `crops`, or `fields` arrays. Delete operations return HTTP `204` with
no response body. The full request fields and constraints are in the project
[README API reference](../readme.md#api-reference).

## 8. Environment, setup, and running

1. Go to the backend and install packages:

   ```bash
   cd backend
   npm install
   ```

2. Copy `backend/.env.example` to `.env` and set a local PostgreSQL connection,
   a `JWT_SECRET` of at least 32 characters, and optionally `PORT` (defaults to
   3000). Do not commit `.env`.

3. Generate the Prisma client and sync a development database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

   There are no migration files checked in on this branch. `db push` syncs the
   current schema without migration history; don't point it at production.

4. Start the server:

   ```bash
   node src/server.js
   ```

5. In another backend terminal, run the tests:

   ```bash
   npm test
   ```

## 9. Existing tests

`backend/package.json` defines `npm test` as `node --test test/api.test.js`.
The 14 top-level tests cover:

- Registration success, safe output, duplicate email, invalid fields, and weak
  password rejection.
- Login success/failure, current-user authentication, and expired/invalid JWTs.
- Profile protection, safe reads, valid updates, and invalid/protected fields.
- Farm create/list/update/delete, cross-user access denial, database errors, and
  deletion/update not-found handling.
- Crop and field creation/listing under owned farms and detail/update/delete
  ownership checks.

The tests stub Prisma calls, so they check HTTP/controller behavior but do not
replace testing against a real PostgreSQL database.

## 10. Git workflow and PR preparation

The assigned feature branch is `feature/vanshika-day1`. Check branch and
worktree before staging:

```bash
git status --short --branch
```

Keep commits focused and push only to the feature branch. The documentation
work for this contribution can be committed as:

```bash
git add readme.md docs/member-a-evaluation-guide.md
git commit -m "docs: document Member A APIs and evaluation guide"
```

Do not push or create/merge a pull request until the owner has reviewed and
approved it.

## 11. Short demonstration script

1. Explain the three layers: Express routes receive requests, controllers check
   input and ownership, and Prisma reads/writes PostgreSQL records.
2. Register a new user at `POST /api/auth/register`.
3. Log in at `POST /api/auth/login`; copy the returned token.
4. Call `GET /api/auth/me` without a token to show a `401`, then repeat with
   `Authorization: Bearer <token>` to show the authenticated user.
5. Create a farm, list it, then create a crop and a field under that farm.
6. Fetch the nested crop and field lists to show their relationships.
7. Try an invalid ID or a request without a token to show validation and
   authorization behavior.
8. Explain that prediction / analytics endpoints are owned by separate modules
   and should not be represented with fabricated results.

Example request sequence in curl (replace values and use the token from login):

```bash
curl -X POST http://localhost:3000/api/farms \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"farmName":"North Field","location":"Green Valley","totalArea":12.5,"soilType":"Loam","irrigationType":"Drip"}'

curl http://localhost:3000/api/farms \
  -H "Authorization: Bearer <token>"
```

## 12. Questions an evaluator may ask

**Why hash passwords?**

If the database is exposed, a bcrypt hash is much safer than storing readable
passwords. The app compares a submitted password to its hash at login.

**What does the JWT do?**

It is a signed, time-limited proof of identity. Protected requests send it as a
bearer token; the backend verifies it before using the user's ID.

**How do you stop a user from reading someone else's farm?**

Farm queries include the authenticated `userId`. Crop and field queries verify
the parent farm belongs to that same user. A non-owned record is reported as
not found.

**Why do crops and fields use nested create routes?**

The parent farm ID gives the server a clear relationship. The server verifies
ownership before creating the child record and does not trust a caller-supplied
owner ID.

**Why is the password not in the response?**

Controllers use `safeUser`, which only returns `id`, `name`, `email`, `phone`,
`createdAt`, and `updatedAt`.

**What does Prisma do here?**

Prisma provides typed model operations over the PostgreSQL tables and defines
the relations and deletion rules in one schema.

**Do tests use the real database?**

No. The API tests replace Prisma model methods with stubs. This makes request
and authorization behavior repeatable but does not validate a live database
connection or deployment.

**Are all Prisma models backed by API endpoints in this branch?**

No. A model defines database structure; Express routes determine the HTTP API.
Only routes mounted in `backend/src/app.js` are served, and features such as
prediction history depend on their owning modules.

**How do I keep my work separate from teammates?**

Work on `feature/vanshika-day1`, inspect `git status`, stage only my intended
files, use a focused commit, and push only that branch after approval.
