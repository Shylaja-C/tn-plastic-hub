"""
TNPlasticHub – FastAPI application entry point.

Route prefixes:
  /api/v1/...   – versioned canonical routes (used by frontend)
  /api/...      – spec-alias routes (matches team API spec exactly)

Both sets are active simultaneously so neither the frontend nor the spec doc breaks.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import check_db_connection

# ── Versioned routers (/api/v1) ───────────────────────────────────────────────
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.companies import router as companies_router
from app.routes.internships import router as internships_router
from app.routes.industrial_visits import router as visits_router
from app.routes.applications import router as applications_router
from app.routes.schemes import router as schemes_router
from app.routes.loans import router as loans_router
from app.routes.news import router as news_router
from app.routes.technologies import router as technologies_router
from app.routes.associations import router as associations_router
from app.routes.contacts import router as contacts_router
from app.routes.documents import router as documents_router
from app.routes.notifications import router as notifications_router

# ── New routers ───────────────────────────────────────────────────────────────
from app.routes.ai import router as ai_router
from app.routes.admin import router as admin_router

# ── Spec-alias routers (/api – no version) ────────────────────────────────────
from app.routes.internships_apply import router as internships_apply_router
from app.routes.applications_my import router as applications_my_router
from app.routes.visits_my import router as visits_my_router

settings = get_settings()
logger = logging.getLogger("tnplastichub")
logging.basicConfig(level=logging.INFO if settings.DEBUG else logging.WARNING)


# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    ok = check_db_connection()
    if ok:
        logger.info("Database connection verified")
    else:
        logger.error("Database connection FAILED – check DATABASE_URL in .env")
    yield
    logger.info("TNPlasticHub API shutting down")


# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="TNPlasticHub API",
    description=(
        "Backend API for the Tamil Nadu Plastics Industry Digital Ecosystem.\n\n"
        "Connects students, companies, professionals, entrepreneurs, and government resources.\n\n"
        "**Route prefixes**\n"
        "- `/api/v1/` – versioned canonical (recommended)\n"
        "- `/api/` – spec-aligned aliases\n\n"
        "**AI endpoint** (`POST /api/ai/chat`) is a clean placeholder. "
        "Member 3 connects Gemini by editing only `app/services/ai_service.py`."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Versioned routes: /api/v1 ─────────────────────────────────────────────────

V1 = "/api/v1"

app.include_router(auth_router,         prefix=V1)
app.include_router(users_router,        prefix=V1)
app.include_router(companies_router,    prefix=V1)
app.include_router(internships_apply_router, prefix=V1)
app.include_router(internships_router,  prefix=V1)
app.include_router(visits_my_router,    prefix=V1)
app.include_router(visits_router,       prefix=V1)
app.include_router(applications_my_router, prefix=V1)
app.include_router(applications_router, prefix=V1)
app.include_router(schemes_router,      prefix=V1)
app.include_router(loans_router,        prefix=V1)
app.include_router(news_router,         prefix=V1)
app.include_router(technologies_router, prefix=V1)
app.include_router(associations_router, prefix=V1)
app.include_router(contacts_router,     prefix=V1)
app.include_router(documents_router,    prefix=V1)
app.include_router(notifications_router,prefix=V1)
app.include_router(ai_router,           prefix=V1)
app.include_router(admin_router,        prefix=V1)

# ── Spec-alias routes: /api (no version) ─────────────────────────────────────
# These expose exactly the paths listed in the team API spec.

API = "/api"

app.include_router(auth_router,              prefix=API, include_in_schema=False)
app.include_router(users_router,             prefix=API, include_in_schema=False)
app.include_router(companies_router,         prefix=API, include_in_schema=False)
app.include_router(internships_router,       prefix=API, include_in_schema=False)
app.include_router(internships_apply_router, prefix=API)   # POST /api/internships/{id}/apply
app.include_router(visits_my_router,         prefix=API)   # GET  /api/industrial-visits/my-bookings  ← must be before {visit_id} router
app.include_router(visits_router,            prefix=API, include_in_schema=False)
app.include_router(applications_router,      prefix=API, include_in_schema=False)
app.include_router(applications_my_router,   prefix=API)   # GET  /api/applications/my
app.include_router(schemes_router,           prefix=API, include_in_schema=False)
app.include_router(loans_router,             prefix=API, include_in_schema=False)
app.include_router(contacts_router,          prefix=API, include_in_schema=False)
app.include_router(associations_router,      prefix=API, include_in_schema=False)
app.include_router(news_router,              prefix=API, include_in_schema=False)
app.include_router(technologies_router,      prefix=API, include_in_schema=False)
app.include_router(admin_router,             prefix=API)   # GET  /api/admin/...
app.include_router(ai_router,                prefix=API)   # POST /api/ai/chat


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
def health():
    """Basic liveness probe."""
    return {"status": "ok", "app": settings.APP_NAME, "version": "1.0.0"}


@app.get("/health/db", tags=["Health"])
def health_db():
    """Database connectivity probe."""
    ok = check_db_connection()
    if not ok:
        return JSONResponse(
            status_code=503,
            content={"status": "error", "detail": "Database unreachable"},
        )
    return {"status": "ok", "database": "connected"}


@app.get("/", include_in_schema=False)
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "docs": "/docs",
        "health": "/health",
    }
