from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
from app.core.database import Base, engine
from app.core.tenant import models as tenant_models
from app.auth import models as auth_models, routes as auth_routes
from app.inventory import models as inventory_models
from app.inventory import routes as inv_routes
from app.finance import models as finance_models
from app.finance import routes as fin_routes
from app.crm import models as crm_models, routes as crm_routes
from app.scm import models as scm_models, routes as scm_routes
from app.hrm.routes import router as hrm_router
from app.projects import models as prj_models, routes as prj_routes
from app.mfg import models as mfg_models
from app.bi import routes as bi_routes
from app.mfg.routes import router as mfg_router
from app.core.audit import models as audit_models
from app.notifications import models as notification_models, routes as notification_routes
from app.documents import models as document_models, routes as document_routes
from app.reports import models as report_models, routes as report_routes
from app.core.ratelimit import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI(
    title="Perfected ERP Backend",
    version="1.0.0",
    description="SaaS ERP Enterprise Core - API v1 Baseline"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 🌐 CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development to ensure CORS headers on error
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables automatically (DEV only)
Base.metadata.create_all(bind=engine)

from app.auth import models as auth_models, routes as auth_routes, admin_routes
# ... existing imports ...

# Include Routers
app.include_router(auth_routes.router)
app.include_router(admin_routes.router)
app.include_router(inv_routes.router)
app.include_router(fin_routes.router)
app.include_router(crm_routes.router)
app.include_router(scm_routes.router)
app.include_router(hrm_router)
app.include_router(prj_routes.router)
app.include_router(mfg_router)
app.include_router(bi_routes.router)
app.include_router(notification_routes.router)
app.include_router(document_routes.router)
app.include_router(report_routes.router)
from app.core.audit import routes as audit_routes
app.include_router(audit_routes.router)
from app.core.health import router as health_router
app.include_router(health_router)

# System integrity now handled by /health and /version

# Middleware for high-fidelity frontend support
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    # Support for simulated delay if header is present
    delay = request.headers.get("X-Simulated-Delay")
    if delay:
        try:
            time.sleep(float(delay) / 1000) # milliseconds to seconds
        except ValueError:
            pass
            
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    from fastapi.responses import Response
    return Response(status_code=204)

@app.get("/")
def root():
    from app.core.cache.redis import is_redis_available
    return {
        "status": "ERP Backend Running",
        "cache": "CONNECTED" if is_redis_available() else "DISCONNECTED"
    }
