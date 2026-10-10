# TNPlasticHub — Backend API

FastAPI + PostgreSQL backend for the Tamil Nadu Plastics Industry Digital Ecosystem.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI 0.111 |
| ORM | SQLAlchemy 2.0 |
| Database | PostgreSQL 14+ (hosted on Render) |
| Migrations | Alembic / `init_db.py` |
| Auth | JWT via `python-jose` + `passlib[bcrypt]` |
| Config | `pydantic-settings` (`.env` file) |
| Server | Uvicorn |

---

## Quick Start

```bash
cd backend

# 1. Create virtual environment
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env: set DATABASE_URL and SECRET_KEY at minimum

# 4. Create tables
python init_db.py

# 5. Start the server
uvicorn app.main:app --reload
```

API is live at **http://127.0.0.1:8000**

| URL | Description |
|---|---|
| http://127.0.0.1:8000/docs | Swagger UI |
| http://127.0.0.1:8000/redoc | ReDoc |
| http://127.0.0.1:8000/health | Liveness check |
| http://127.0.0.1:8000/health/db | DB connectivity |

---

## Environment Variables

Copy `.env.example` → `.env` and fill in:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `SECRET_KEY` | ✅ | JWT signing secret (min 32 chars) |
| `ALGORITHM` | | JWT algorithm (default `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | | Token TTL (default `60`) |
| `GEMINI_API_KEY` | | Set by Member 3 for AI integration |
| `DEBUG` | | SQL logging (default `true`) |
| `ALLOWED_ORIGINS` | | CORS origins, comma-separated |

Generate a secure secret key:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## Route Prefixes

The API exposes two parallel prefix sets:

| Prefix | Purpose |
|---|---|
| `/api/v1/` | Versioned canonical (recommended for frontend) |
| `/api/` | Spec-aligned aliases (matches team API contract) |

Both are active simultaneously. Use `/api/v1/` in production — `/api/` is a convenience alias.

---

## Full API Reference

### Authentication — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register (student / industry / entrepreneur) |
| POST | `/api/auth/login` | — | Get JWT access token |
| POST | `/api/auth/refresh` | — | Refresh token |
| GET | `/api/auth/me` | JWT | Current user profile |

### Users — `/api/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/users/me` | JWT | Get own profile |
| PUT / PATCH | `/api/users/me` | JWT | Update own profile |
| POST | `/api/users/me/change-password` | JWT | Change password |
| GET | `/api/users/` | Admin | List all users |
| GET | `/api/users/{id}` | JWT | Get user by ID |
| PATCH | `/api/users/{id}/status` | Admin | Activate / suspend user |

### Companies — `/api/companies`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/companies` | — | List companies (filterable by type, status, city) |
| GET | `/api/companies/{id}` | — | Get company detail |
| POST | `/api/companies` | Industry | Register a company |
| PUT / PATCH | `/api/companies/{id}` | Owner / Admin | Update company |
| POST | `/api/companies/{id}/verify` | Admin | Approve or reject |

### Internships — `/api/internships`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/internships` | — | List internships (search, filter, paginate) |
| GET | `/api/internships/{id}` | — | Internship detail |
| POST | `/api/internships` | Industry | Post internship |
| PUT / PATCH | `/api/internships/{id}` | Owner / Admin | Update internship |
| DELETE | `/api/internships/{id}` | Owner / Admin | Delete internship |
| POST | `/api/internships/{id}/apply` | JWT | **Apply to internship** |
| GET | `/api/internships/{id}/applications` | JWT | Applications for internship |
| PUT | `/api/internships/applications/{id}/status` | JWT | Update application status |

### Applications — `/api/applications`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/applications` | JWT | Submit application |
| GET | `/api/applications/my` | JWT | My applications (spec alias) |
| GET | `/api/applications/me` | JWT | My applications (canonical alias) |
| GET | `/api/applications/{id}` | JWT | Application detail |
| PATCH | `/api/applications/{id}/status` | JWT | Update status |
| POST | `/api/applications/{id}/withdraw` | JWT | Withdraw application |

### Industrial Visits — `/api/industrial-visits`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/industrial-visits` | — | List visits (filter by company, status) |
| POST | `/api/industrial-visits` | Industry | Create visit |
| GET | `/api/industrial-visits/{id}` | — | Visit detail |
| PATCH | `/api/industrial-visits/{id}` | Owner / Admin | Update visit |
| POST | `/api/industrial-visits/{id}/book` | JWT | **Book a visit slot** |
| GET | `/api/industrial-visits/my-bookings` | JWT | My bookings (spec alias) |
| GET | `/api/industrial-visits/bookings/me` | JWT | My bookings (canonical alias) |
| PATCH | `/api/industrial-visits/bookings/{id}/status` | JWT | Update booking status |

### Industry Resources

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/schemes` | — | Government / industry schemes |
| GET | `/api/schemes/{id}` | — | Scheme detail |
| POST | `/api/schemes` | Admin | Create scheme |
| PATCH | `/api/schemes/{id}` | Admin | Update scheme |
| DELETE | `/api/schemes/{id}` | Admin | Delete scheme |
| GET | `/api/loans` | — | Financial assistance listings |
| GET | `/api/loans/{id}` | — | Loan detail |
| POST | `/api/loans` | Admin | Create loan entry |
| PATCH | `/api/loans/{id}` | Admin | Update loan entry |
| GET | `/api/contacts` | — | Industry contact directory |
| POST | `/api/contacts` | — | Submit contact inquiry |
| GET | `/api/associations` | — | Industry associations |
| POST | `/api/associations` | Admin | Add association |

### News — `/api/news`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/news` | — | List news (filter by category, status) |
| GET | `/api/news/{id}` | — | News article detail |
| POST | `/api/news` | Admin | Publish news article |
| PATCH | `/api/news/{id}` | Admin | Update article |
| DELETE | `/api/news/{id}` | Admin | Delete article |

### Technologies — `/api/technologies`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/technologies` | — | Plastics technology knowledge base |
| GET | `/api/technologies/{id}` | — | Technology detail |
| POST | `/api/technologies` | Admin | Add technology entry |
| PATCH | `/api/technologies/{id}` | Admin | Update entry |

### Admin — `/api/admin`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Admin | Platform-wide statistics |
| GET | `/api/admin/pending-verifications` | Admin | Companies awaiting verification |
| PUT | `/api/admin/verify/{company_id}` | Admin | Approve / reject company |

### AI Assistant — `/api/ai`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/chat` | Optional | Send message, get AI response |
| GET | `/api/ai/conversations` | JWT | List my conversations |
| GET | `/api/ai/conversations/{uuid}` | JWT | Conversation with full history |
| DELETE | `/api/ai/conversations/{uuid}` | JWT | Archive conversation |

---

## AI Integration (Member 3 Guide)

The AI endpoint is a **clean placeholder**. The full contract is implemented — conversation persistence, history loading, source attribution, error handling. Only the Gemini call itself is a stub.

### What to implement

Open `app/services/ai_service.py` and replace the body of `_call_gemini()`:

```python
def _call_gemini(
    user_message: str,
    history: List[dict],
    gemini_api_key: str,
) -> AIResponse:
    # Replace this stub with:
    # 1. Build a google.generativeai.GenerativeModel with system prompt
    # 2. Reconstruct history for multi-turn context
    # 3. Call model.generate_content(prompt)
    # 4. Parse response + extract source citations
    # 5. Return AIResponse(answer=..., sources=[...], confidence=...)
    ...
```

### RAG extension point

Before calling Gemini, query the DB for relevant platform records and inject them as grounding context:

```python
# Example: retrieve matching schemes / loans for context
schemes = db.query(Scheme).filter(Scheme.status == "active").limit(5).all()
context = "\n".join(s.description for s in schemes if s.description)
prompt = f"Context:\n{context}\n\nUser question: {user_message}"
```

### Environment variable

```env
GEMINI_API_KEY=your-google-ai-studio-key
```

### What NOT to change

- `app/routes/ai.py` — route, request/response schema, error handling
- `app/models/chat.py` — DB models for conversation storage
- `app/schemas/chat.py` — Pydantic models

### Response contract

`POST /api/ai/chat` always returns:

```json
{
  "answer": "...",
  "sources": [{"title": "...", "url": "...", "type": "reference"}],
  "confidence": "high | medium | low",
  "conversation_id": "uuid-string"
}
```

---

## Database Models

```
users                 – students, company reps, entrepreneurs, admins
companies             – registered plastics companies
internships           – posted by companies
applications          – student → internship applications
industrial_visits     – company-hosted factory visits
industrial_visit_bookings – student → visit bookings
schemes               – government / industry schemes
loans                 – financial assistance listings
contacts              – contact inquiry inbox
associations          – industry associations
news                  – articles and announcements
technologies          – plastics technology knowledge base
documents             – uploaded files (metadata only)
notifications         – in-app alerts
chat_conversations    – AI chat sessions
chat_messages         – individual messages (user + assistant)
```

All models include `created_at`, `updated_at`, and `status` where applicable.
No model weights, embeddings, or large files are stored in PostgreSQL.

### Relationships

```
User (1) ──── (1) Company
Company (1) ── (*) Internship
Company (1) ── (*) IndustrialVisit
Internship (1) ── (*) Application ── (1) User
IndustrialVisit (1) ── (*) IndustrialVisitBooking ── (1) User
User (1) ── (*) Document
User (1) ── (*) Notification
User (1) ── (*) ChatConversation ── (*) ChatMessage
```

---

## Pagination & Filtering

All list endpoints support:

| Query param | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `page_size` | `20` | Items per page (max 100) |
| `status` | — | Filter by status enum |
| `search` | — | Text search (internships, news) |

Response envelope:

```json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "page_size": 20,
  "pages": 8
}
```

---

## Roles & Authorization

| Role | Capabilities |
|---|---|
| `student` | Apply to internships, book visits, manage own profile & documents |
| `industry` | Register company, post internships & visits, review applications |
| `entrepreneur` | Access schemes, loans, industry resources |
| `admin` | Full access — verify companies, manage content, view all data |

---

## Running Migrations (Alembic)

```bash
# Generate migration after model changes
alembic revision --autogenerate -m "describe change"

# Apply migrations
alembic upgrade head

# Roll back one step
alembic downgrade -1
```

---

## Testing

```bash
# Start the server (separate terminal)
uvicorn app.main:app --reload --port 8001

# Run smoke tests
python test_api.py
# Expected: 27 passed, 0 failed
```

---

## Deployment (Render Free Tier)

The backend is designed to run within Render's 512 MB RAM free tier:

- No local ML libraries (`torch`, `transformers`, etc.)
- No background workers or task queues
- No in-memory caches
- DB connection pool capped at 10 connections
- `pool_pre_ping=True` handles Render's idle connection drops

**Render Web Service settings:**

| Setting | Value |
|---|---|
| Build command | `pip install -r requirements.txt` |
| Start command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Environment | Set `DATABASE_URL`, `SECRET_KEY`, `GEMINI_API_KEY` as env vars |

Use the **Internal Database URL** from your Render PostgreSQL dashboard when deploying the API on Render (same private network). Use the **External URL** for local development.

---

## Frontend Integration

Set in your Next.js `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

CORS is pre-configured for `http://localhost:3000`.
