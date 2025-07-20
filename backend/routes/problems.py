# routes/problems.py

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.encoders import jsonable_encoder
from typing import List, Optional
from db.mongo import db
from schemas.problem import ProblemCreate, ProblemInDB, ProblemUpdate
from bson import ObjectId
from datetime import datetime
from collections import Counter


router = APIRouter()

collection = db["problems"]

# POST a problem for a user

@router.post("/", response_model=ProblemInDB)
async def add_problem(problem: ProblemCreate):
    problem_dict = jsonable_encoder(problem)
    # problem_dict["date_solved"] = problem_dict["date_solved"].isoformat()
    result = await collection.insert_one(problem_dict)
    return ProblemInDB(id=str(result.inserted_id), **problem_dict)

# GET Problems of a user

@router.get("/", response_model=List[ProblemInDB])
async def get_problems(
    user_id: str,
    difficulty: Optional[str] = None,
    tags: Optional[List[str]] = Query(None),
    retry_later: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "date_solved",
    order: Optional[str] = "desc",
):
    query = {"user_id": user_id}

    if difficulty:
        query["difficulty"] = difficulty
    if retry_later is not None:
        query["retry_later"] = retry_later
    if tags:
        query["tags"] = {"$all": tags}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"notes": {"$regex": search, "$options": "i"}},
        ]

    sort_order = -1 if order == "desc" else 1
    cursor = collection.find(query).sort(sort_by, sort_order)

    problems = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        problems.append(ProblemInDB(**doc))

    return problems

# GET stats
@router.get("/stats")
async def get_stats(user_id: str):
    try:
        # 1. Get all problems for the user
        cursor = collection.find({"user_id": user_id})
        problems = []
        async for doc in cursor:
            problems.append(doc)

        if not problems:
            return {
                "total_solved": 0,
                "by_difficulty": {},
                "most_common_tags": [],
                "total_time_minutes": 0,
                "retry_later_count": 0
            }

        # 2. Count by difficulty
        difficulty_count = Counter(p["difficulty"] for p in problems)

        # 3. Most common tags
        tags = []
        for p in problems:
            tags.extend(p.get("tags", []))
        tag_count = Counter(tags).most_common(5)  # top 5
        most_common_tags = [tag for tag, _ in tag_count]

        # 4. Total time spent
        total_time = sum(p.get("time_taken_min", 0) for p in problems)

        # 5. Retry later count
        retry_count = sum(1 for p in problems if p.get("retry_later") is True)

        return {
            "total_solved": len(problems),
            "by_difficulty": difficulty_count,
            "most_common_tags": most_common_tags,
            "total_time_minutes": total_time,
            "retry_later_count": retry_count
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET a problem

@router.get("/{id}", response_model=ProblemInDB)
async def get_problem(id: str):
    doc = await collection.find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Problem not found")
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return ProblemInDB(**doc)

# PUT update a problem

@router.put("/{id}", response_model=ProblemInDB)
async def update_problem(id: str, update: ProblemUpdate):
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if "url" in update_data:
        update_data["url"] = str(update_data["url"])
    if "date_solved" in update_data:
        update_data["date_solved"] = update_data["date_solved"].isoformat()

    result = await collection.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=True  # Return the updated document
    )
    if not result:
        raise HTTPException(status_code=404, detail="Problem not found")
    result["id"] = str(result["_id"])
    del result["_id"]
    return ProblemInDB(**result)

# Delete a problem
@router.delete("/{id}")
async def delete_problem(id: str):
    result = await collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Problem not found")
    return {"detail": "Problem deleted successfully"}



