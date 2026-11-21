# Carekin

Carekin is a Vite/React PWA with a FastAPI and MongoDB backend.

## Local development

Install Node and Python dependencies:

```powershell
npm install
uv sync --dev
```

For local development, copy `.env.example` to `.env` and replace the placeholder values:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/
MONGODB_DB=CarekinDb
```

Alternatively, set `MONGODB_URI` and `MONGODB_DB` in your terminal or development environment. Do not add them to Vite variables such as `VITE_*`.

Start the React app and FastAPI API together:

```powershell
npm run dev
```

The app is available at `http://localhost:5173`. The API is available at `http://127.0.0.1:8000`.

Run checks separately:

```powershell
npm run build
uv run pytest tests/test_api.py -q
```

## App modes

The app has one deployment with two routes:

- `/owner` displays the Share option.
- `/carer` hides the Share option.

The owner Share view opens and copies the `/carer` URL. MongoDB credentials stay in server-side environment variables and are never added to Vite variables.

## MongoDB

The API uses MongoDB collections named `carer_logs` and `project_ideas` in the `CarekinDb` database. Configure `MONGODB_URI` and `MONGODB_DB` on Vercel or your local machine.
