# routes/problems_debug.py

from fastapi import APIRouter, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from typing import List, Optional
from db.mongo import db
from schemas.problem import ProblemCreate, ProblemInDB, ProblemUpdate
from bson import ObjectId
from datetime import datetime
from collections import Counter
from fastapi.responses import JSONResponse

router = APIRouter()

collection = db["problems"]

# Debug endpoint without authentication - completely separate
@router.get("/debug")
async def get_problems_debug(
    user_id: str = "test_user",
    difficulty: Optional[str] = None,
    sort_by: Optional[str] = "date_solved",
    order: Optional[str] = "desc",
):
    # Debug: use test user ID
    query = {"user_id": user_id}

    if difficulty:
        query["difficulty"] = difficulty

    sort_order = -1 if order == "desc" else 1
    cursor = collection.find(query).sort(sort_by, sort_order)

    problems = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        problems.append(doc)  # Return raw dict instead of ProblemInDB

    return {"count": len(problems), "problems": problems, "query": query}