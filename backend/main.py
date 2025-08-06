# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.mongo import db
from routes import problems, analytics

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

@app.get("/")
def root():
    return {"message": "Welcome to LeetSpace API with Firebase Auth 🚀🔐"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "auth": "firebase"}

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