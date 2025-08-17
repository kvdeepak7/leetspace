# main.py

from fastapi import FastAPI, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from db.mongo import db
from routes import problems, analytics, problems_debug
from routes import analytics_debug
from auth.dependencies import get_current_active_user

app = FastAPI()

# CORS setup for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(problems.router, prefix="/api/problems", tags=["Problems"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(analytics_debug.router, prefix="/api/analytics", tags=["Analytics Debug"])
app.include_router(problems_debug.router, prefix="/api/problems", tags=["Problems Debug"])

@app.get("/")
def root():
    return {"message": "Welcome to LeetSpace API with Firebase Auth 🚀🔐"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "auth": "firebase"}

@app.get("/test-auth")
async def test_auth(current_user: dict = Depends(get_current_active_user)):
    return {
        "message": "Authentication successful!",
        "user": {
            "uid": current_user["uid"],
            "email": current_user["email"],
            "email_verified": current_user["email_verified"]
        }
    }

@app.get("/debug-auth")
async def debug_auth(authorization: str = Header(None)):
    return {
        "authorization_header": authorization,
        "message": "Debug endpoint to check headers"
    }

@app.get("/simple-test")
async def simple_test():
    return {"message": "This endpoint has no authentication", "status": "working"}

# @app.get("/")
# def root():
#     return {"message": "Welcome to LeetSpace API 🚀"}

# @app.get("/test-db")
# async def test_db():
#     collections = await db.list_collection_names()
#     return {"collections": collections}

# from urllib.parse import quote_plus

# password = quote_plus("leetspace_user")
# print(password)