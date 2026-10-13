# Smart Resume Analyzer & Career Prediction System

JavaScript college project: React/Vite frontend, Express backend, official `@google/genai` SDK, PDF upload validation, transparent resume scoring, rule-based career baseline, skill-gap analysis. Optional MySQL is documented separately.

## Requirements
- Node.js 20+ recommended
- npm
- Gemini API key from Google AI Studio for live AI analysis (backend only)

## VS Code setup
1. Extract/open this folder in VS Code.
2. Create `backend/.env` by copying `backend/.env.example`; add your Gemini key.
3. In a terminal at project root run `npm install`, then `npm run install:all`.
4. Run both servers with `npm run dev`. Frontend defaults to http://localhost:5173 and backend to http://localhost:5000.
5. Test backend health at http://localhost:5000/api/health.
6. `npm run build` builds the frontend; `npm run test:backend` runs backend unit tests.

Without a Gemini key, health, rule-based career prediction, and skill-gap endpoints still work. Resume analysis returns a clear configuration error until the key is set. Never put the key in frontend env variables.

## API contracts
- `GET /api/health` -> `{ "success": true, "data": { "status": "ok" } }`
- `POST /api/resume/analyze` multipart field `resume` (PDF, max 5 MB by default), optional field `targetRole`. Returns `data.analysis`, `data.score`, `data.careerPredictions`, `data.skillGap`.
- `POST /api/career/predict` JSON `{ "analysis": { "technicalSkills": ["Java", "React"] } }` or `{ "skills": ["Java", "React"] }`.
- `POST /api/skills/analyze` JSON `{ "skills": ["Java", "SQL"], "targetRole": "Java Developer" }`.

Errors consistently return `{ "success": false, "error": { "code": "...", "message": "..." } }`.

## Postman examples
1. Health: GET `http://localhost:5000/api/health`
2. Resume: POST `http://localhost:5000/api/resume/analyze`; Body > form-data; key `resume` type File; choose a PDF. Optional text key `targetRole` e.g. `Java Developer`.
3. Career: POST `/api/career/predict`; Body raw JSON `{"skills":["Java","Spring Boot","MySQL"]}`.
4. Skills: POST `/api/skills/analyze`; Body raw JSON `{"skills":["Java","SQL"],"targetRole":"Java Developer"}`.

## Privacy and limitations
Uploads use Multer memory storage, not a persistent upload folder. The in-memory buffer is released in `finally`; resume content is not saved to a database. Gemini receives the PDF bytes for analysis, so only upload resumes you have permission to process and review Google's current data terms. Model output is untrusted and validated before returning. Resume score is a transparent estimate, not a hiring decision. Career scores are baseline keyword overlap, not trained ML.

## Optional MySQL extension
Not required for first run. If adding persistence, install `mysql2`, configure a separate server-side `MYSQL_*` set of environment variables, create explicit tables for consented profiles/results, parameterize all SQL, and add retention/deletion controls. Do not store raw PDFs by default. This starter intentionally avoids storing personal resume data.

## Future trained ML model
Use a labelled CSV with consented/de-identified examples and a target label such as role. Split data into train/test sets (and preferably validation/cross-validation), preprocess text and categorical values, train a baseline classifier, evaluate with macro-F1, precision/recall, confusion matrix and per-class support, check class imbalance and leakage, then expose a separate prediction service. Record dataset provenance and limitations. Do not report accuracy until measured on held-out data. Replace `backend/src/services/careerPredictor.js` behind its existing function interface.


## Sample responses

Health success:
```json
{"success":true,"data":{"status":"ok","geminiConfigured":true,"model":"gemini-3.8-flash","maxUploadMb":5}}
```

Career prediction success (scores vary with the supplied skills):
```json
{"success":true,"data":{"predictions":[{"role":"Java Developer","score":50,"matchedSkills":["Java","SQL","REST APIs","Git"],"missingSkills":["OOP","Collections","Exception Handling","Spring Boot"],"explanation":"Matched 4 of 8 listed role skills: Java, SQL, REST APIs, Git.","method":"baseline-rule-based","isTrainedModel":false}],"method":"baseline-rule-based","trainedModelUsed":false}}
```

Validation error:
```json
{"success":false,"error":{"code":"PDF_ONLY","message":"Upload a PDF file only."}}
```

## Full project layout
```text
resume-career-system/
├── package.json
├── .gitignore
├── README.md
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── test/predictor.test.js
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/env.js
│       ├── controllers/resumeController.js
│       ├── data/roles.json
│       ├── data/skillAliases.json
│       ├── middleware/errorHandler.js
│       ├── middleware/upload.js
│       ├── routes/careerRoutes.js
│       ├── routes/resumeRoutes.js
│       ├── services/careerPredictor.js
│       ├── services/geminiService.js
│       ├── services/resumeScorer.js
│       ├── services/skillGapService.js
│       └── utils/httpError.js, normalizeSkills.js
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx, main.jsx, styles.css
        ├── components/Header.jsx, LoadingState.jsx, ErrorMessage.jsx, ScoreCard.jsx, CareerCards.jsx
        ├── data/roles.js
        ├── pages/Dashboard.jsx, ResumeUpload.jsx, AnalysisResults.jsx, CareerRecommendations.jsx, SkillGapAnalysis.jsx
        └── services/api.js
```


## Manual profile form

The frontend upload page provides two input modes: (1) upload a PDF for Gemini-based resume analysis, or (2) fill in a manual profile form with name, education, experience level, technical skills, and target role. Manual mode calls the existing career-prediction and skill-gap APIs. It does not fabricate a resume score or claim that the manually entered data was extracted by AI.
