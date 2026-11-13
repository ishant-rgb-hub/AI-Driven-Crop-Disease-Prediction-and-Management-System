# 🌱 AI-Driven Crop Disease Prediction and Management System

An intelligent agricultural platform that uses Artificial Intelligence and Machine Learning to identify crop diseases, predict potential infections, and provide farmers with suitable treatment, prevention, and management recommendations.

---

## 📌 About the Project

The AI-Driven Crop Disease Prediction and Management System aims to help farmers detect crop diseases at an early stage using AI-powered image analysis.

Farmers can upload images of crop leaves, receive disease predictions, explore treatment options, access preventive measures, and make better agricultural decisions.

The platform combines modern web technologies, database management, and AI-based disease prediction to support smarter and more sustainable farming.

## 🎯 Project Objectives

- Detect crop diseases using AI and image processing.
- Provide early disease identification.
- Recommend suitable disease management practices.
- Provide treatment and prevention information.
- Maintain prediction history.
- Collect feedback to improve prediction quality.
- Support farmers with accessible agricultural information.

---

## ✨ Key Features

### 1. AI Crop Disease Detection
- Upload crop leaf images.
- Analyze images using an AI/ML model.
- Identify possible crop diseases.
- Display prediction results and confidence scores when supported by the model.

### 2. Treatment Management
- Display disease-specific treatment information.
- Provide treatment instructions.
- Search and filter treatments.
- Manage treatment records.

### 3. Recommendation System
- Provide crop-specific recommendations.
- Display disease management suggestions.
- Help farmers choose appropriate actions.

### 4. Prevention Management
- Provide preventive agricultural practices.
- Display crop disease prevention information.
- Support better crop health management.

### 5. Prediction Feedback
- Allow users to submit feedback on predictions.
- Record incorrect or unsatisfactory predictions.
- Maintain feedback records for future improvements.

### 6. Farmer Dashboard
- View prediction statistics.
- Access recent prediction history.
- Explore treatments and recommendations.
- Monitor crop disease information.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML, CSS, JavaScript | Frontend fundamentals |
| Frontend framework | To be confirmed from existing frontend |
| Node.js | Backend runtime |
| Express.js | REST API development |
| PostgreSQL | Relational database |
| Prisma ORM | Database operations and modeling |
| Python / ML framework | AI model integration, depending on implementation |
| Postman | API testing |
| Git & GitHub | Version control and collaboration |

---

## 🏗️ Project Architecture

The application follows a frontend-backend-database architecture.

```text
             FARMER / USER
                   |
                   |
             FRONTEND
                   |
                   |
             EXPRESS API
                   |
          -------------------
          |        |        |
       Routes  Controllers Middleware
          |        |        |
          -------------------
                   |
                PRISMA
                   |
              POSTGRESQL
                   |
              DATABASE

          AI / ML PREDICTION
                   |
             Disease Results
```

---

## 📁 Project Folder Structure

```text
AI-Driven-Crop-Disease-Prediction-and-Management-System/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│
├── docs/
│
├── .gitignore
└── README.md
```

Additional files and folders may be added as development progresses.

---

## 👨‍💻 Team Responsibilities

The project is developed collaboratively, with different members handling different modules.

### Member C – Backend Development

Member C is responsible for:

**1. Treatment Module**
- Treatment CRUD APIs.
- Disease-specific treatment information.
- Database integration.

**2. Recommendation Module**
- Recommendation APIs.
- Crop and disease-based filtering.
- Recommendation management.

**3. Prevention Module**
- Prevention APIs.
- Preventive agricultural practices.
- Prevention record management.

**4. PredictionFeedback Module**
- Feedback submission APIs.
- Feedback retrieval.
- Prediction feedback database integration.

**5. Backend Integration**
- Express routes and controllers.
- Prisma ORM integration.
- PostgreSQL database operations.
- Postman API testing.
- GitHub branch management.

---

## ⚙️ Installation and Setup

### Prerequisites

Install the following:

- Node.js
- npm
- PostgreSQL
- Git
- Visual Studio Code
- Postman

### Step 1: Clone the repository

```bash
git clone https://github.com/ishant-rgb-hub/AI-Driven-Crop-Disease-Prediction-and-Management-System.git
```

### Step 2: Open the project

```bash
cd AI-Driven-Crop-Disease-Prediction-and-Management-System
```

### Step 3: Enter the backend folder

```bash
cd backend
```

### Step 4: Install dependencies

```bash
npm install
```

### Step 5: Configure environment variables

Create a `.env` file inside the backend folder if your backend configuration requires it.

Example placeholders:

```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
```

Replace placeholders with your local configuration.

**Important:** Never upload your actual `.env` file, passwords, database credentials, or API keys to GitHub.

### Step 6: Configure Prisma

If Prisma is configured in the project:

```bash
npx prisma generate
```

After reviewing the existing schema and approved migrations:

```bash
npx prisma migrate dev
```

Do not run migrations blindly against a shared or production database.

### Step 7: Start the backend

From the backend folder:

```bash
node src/server.js
```

Expected output:

```text
Server running at http://localhost:3000
```

---

## 🔗 API Documentation

The following are the planned REST API endpoints. Actual endpoint availability depends on implementation.

### Treatment APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/treatments` | Get all treatments |
| GET | `/api/treatments/:id` | Get treatment by ID |
| POST | `/api/treatments` | Create treatment |
| PUT | `/api/treatments/:id` | Update treatment |
| DELETE | `/api/treatments/:id` | Delete treatment |

### Recommendation APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/recommendations` | Get recommendations |
| GET | `/api/recommendations/:id` | Get recommendation |
| POST | `/api/recommendations` | Create recommendation |
| PUT | `/api/recommendations/:id` | Update recommendation |
| DELETE | `/api/recommendations/:id` | Delete recommendation |

### Prevention APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/prevention` | Get prevention records |
| GET | `/api/prevention/:id` | Get prevention by ID |
| POST | `/api/prevention` | Create prevention record |
| PUT | `/api/prevention/:id` | Update prevention record |
| DELETE | `/api/prevention/:id` | Delete prevention record |

### Prediction Feedback APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/feedback` | Submit feedback |
| GET | `/api/feedback` | Get feedback records |
| GET | `/api/feedback/:id` | Get feedback by ID |

---

## 🗄️ Database

PostgreSQL is used as the relational database, and Prisma ORM manages database operations.

The planned database entities include:

- User
- Prediction
- Treatment
- Recommendation
- Prevention
- PredictionFeedback

Relationships and field definitions should follow the actual shared Prisma schema.

---

## 🧪 Testing

Postman is used to test backend APIs.

Testing includes:

- GET requests.
- POST requests.
- PUT requests.
- DELETE requests.
- Request validation.
- Error handling.
- Database operations.
- API response verification.

---

## 🔀 GitHub Collaboration

The project uses Git and GitHub for collaborative development.

General workflow:

```bash
# Check current branch
git branch

# Get latest remote information
git fetch origin

# Switch to your feature branch
git checkout feature/disease-management

# Merge latest main changes
git merge origin/main

# Stage changes
git add .

# Commit changes
git commit -m "Implement Member C backend modules"

# Push your feature branch
git push origin feature/disease-management
```

Create a Pull Request from your feature branch into `main` for review and integration.

Resolve merge conflicts carefully and preserve other team members' changes.

---

## 🚀 Future Scope

- Support additional crops and diseases.
- Improve prediction accuracy with better training datasets.
- Add multilingual support for farmers.
- Introduce weather-based disease risk analysis.
- Add real-time agricultural alerts.
- Integrate additional agricultural knowledge sources.
- Improve mobile accessibility.

---

## 🌾 Expected Impact

The project aims to:

- Help farmers identify crop diseases earlier.
- Reduce preventable crop losses.
- Improve access to agricultural management information.
- Encourage informed farming decisions.
- Support sustainable agricultural practices.

---

## 👥 Contributors

**Project:** AI-Driven Crop Disease Prediction and Management System

**Repository:** [GitHub Repository](https://github.com/ishant-rgb-hub/AI-Driven-Crop-Disease-Prediction-and-Management-System)

**Development:** Collaborative Team Project

---

## 📄 License

This project is developed for educational and academic purposes.

A formal open-source license can be added when selected by the project team.

---

**Built with 🌱 for smarter and more sustainable agriculture.**

## Member B: AI prediction module

Member B owns the disease catalogue, protected image upload, prediction
workflow, prediction history, and the Node-to-Python ML service boundary.

### Backend prediction setup

```bash
cd backend
npm install
npx prisma generate
npm test
```

Configure these values in `backend/.env`:

```env
ML_SERVICE_URL="http://127.0.0.1:8000"
ML_MOCK_FALLBACK="true"
```

The Node API sends saved images to the Python service at
`POST /predict`. Development fallback is deterministic and is not a real
trained model. It is disabled in production. The Python service requires a
verified, licensed model and label map; see
[`ml-service/README.md`](ml-service/README.md).

### Member B API verification

Import [`docs/postman/member-b-api.postman_collection.json`](docs/postman/member-b-api.postman_collection.json)
into Postman. Run Login first so the collection stores the JWT in its
`token` variable, then run Create prediction with a JPG or PNG image no larger
than 5 MB. The collection covers authentication, disease details, image upload,
predictions, and profile requests.

The current automated backend baseline is:

```text
14 tests passed
```

Real-model verification remains pending until
`ml-service/models/crop_disease_model.keras` and
`ml-service/labels/class_indices.json` are supplied and validated.