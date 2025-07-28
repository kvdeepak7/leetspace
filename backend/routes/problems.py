# routes/problems.py

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.encoders import jsonable_encoder
from typing import List, Optional
from db.mongo import db
from schemas.problem import ProblemCreate, ProblemInDB, ProblemUpdate
from auth.verify_token import get_current_user, get_current_user_optional
from bson import ObjectId
from datetime import datetime
from collections import Counter
import os


router = APIRouter()

collection = db["problems"]

# Problem recommendation database (you can expand this)
PROBLEM_PATTERNS = {
    "Array": ["Two Pointers", "Sliding Window", "Binary Search"],
    "String": ["Two Pointers", "Sliding Window", "DP"],
    "Linked List": ["Two Pointers", "Stack"],
    "Tree": ["DFS", "BFS", "Binary Search"],
    "Graph": ["DFS", "BFS", "Union Find"],
    "DP": ["Array", "String", "Tree"],
    "Binary Search": ["Array", "Tree"],
    "Two Pointers": ["Array", "String", "Linked List"],
    "Sliding Window": ["Array", "String"],
    "Stack": ["Array", "String", "Tree"],
    "Queue": ["Tree", "Graph"],
    "Heap": ["Array", "Tree"],
    "Greedy": ["Array", "String", "DP"],
    "Sorting": ["Array"]
}

# POST a problem for a user

@router.post("/", response_model=ProblemInDB)
async def add_problem(
    problem: ProblemCreate, 
    current_user = Depends(get_current_user_optional if os.getenv("DEVELOPMENT") else get_current_user)
):
    problem_dict = jsonable_encoder(problem)
    # Override user_id with authenticated user's ID for security
    problem_dict["user_id"] = current_user["uid"]
    result = await collection.insert_one(problem_dict)
    return ProblemInDB(id=str(result.inserted_id), **problem_dict)

# GET Problems of a user

@router.get("/", response_model=List[ProblemInDB])
async def get_problems(
    current_user = Depends(get_current_user_optional if os.getenv("DEVELOPMENT") else get_current_user),
    difficulty: Optional[str] = None,
    tags: Optional[List[str]] = Query(None),
    retry_later: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "date_solved",
    order: Optional[str] = "desc",
):
    # Use authenticated user's ID instead of query parameter
    query = {"user_id": current_user["uid"]}

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

# GET stats with intelligent insights
@router.get("/stats")
async def get_stats(current_user = Depends(get_current_user_optional if os.getenv("DEVELOPMENT") else get_current_user)):
    try:
        # 1. Get all problems for the user
        cursor = collection.find({"user_id": current_user["uid"]})
        problems = []
        async for doc in cursor:
            problems.append(doc)

        if not problems:
            return {
                "total_solved": 0,
                "by_difficulty": {},
                "most_common_tags": [],
                "total_time_minutes": 0,
                "retry_later_count": 0,
                "insights": {
                    "learning_velocity": "No data yet",
                    "weakness_areas": [],
                    "strength_areas": [],
                    "next_recommended_difficulty": "Easy",
                    "consistency_score": 0
                }
            }

        # 2. Basic stats (existing)
        difficulty_count = Counter(p["difficulty"] for p in problems)
        tags = []
        for p in problems:
            tags.extend(p.get("tags", []))
        tag_count = Counter(tags).most_common(10)
        most_common_tags = [tag for tag, _ in tag_count]
        total_time = sum(p.get("time_taken_min", 0) for p in problems)
        retry_count = sum(1 for p in problems if p.get("retry_later") == "Yes")

        # 3. NEW: Intelligent Insights
        insights = await _generate_insights(problems, tag_count, difficulty_count)

        return {
            "total_solved": len(problems),
            "by_difficulty": difficulty_count,
            "most_common_tags": most_common_tags,
            "total_time_minutes": total_time,
            "retry_later_count": retry_count,
            "insights": insights
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def _generate_insights(problems, tag_count, difficulty_count):
    """Generate intelligent insights from user's problem-solving data"""
    from datetime import datetime, timedelta
    
    # Learning velocity (problems per week)
    if len(problems) >= 2:
        dates = [datetime.fromisoformat(p["date_solved"]) for p in problems if p.get("date_solved")]
        if dates:
            dates.sort()
            weeks = max(1, (dates[-1] - dates[0]).days / 7)
            velocity = round(len(problems) / weeks, 1)
            learning_velocity = f"{velocity} problems/week"
        else:
            learning_velocity = "Unable to calculate"
    else:
        learning_velocity = "Need more data"

    # Weakness detection (tags with high retry rate)
    tag_retry_rates = {}
    for tag, count in tag_count:
        tag_problems = [p for p in problems if tag in p.get("tags", [])]
        retry_problems = [p for p in tag_problems if p.get("retry_later") == "Yes"]
        if tag_problems:
            retry_rate = len(retry_problems) / len(tag_problems)
            tag_retry_rates[tag] = retry_rate

    weakness_areas = [tag for tag, rate in tag_retry_rates.items() if rate > 0.3][:3]
    strength_areas = [tag for tag, rate in tag_retry_rates.items() if rate < 0.1][:3]

    # Difficulty recommendation
    easy_count = difficulty_count.get("Easy", 0)
    medium_count = difficulty_count.get("Medium", 0)
    hard_count = difficulty_count.get("Hard", 0)
    
    if hard_count >= 5:
        next_difficulty = "Keep challenging yourself with Hard problems"
    elif medium_count >= 10 and easy_count >= 15:
        next_difficulty = "Ready for Hard problems"
    elif easy_count >= 10:
        next_difficulty = "Try more Medium problems"
    else:
        next_difficulty = "Build foundation with Easy problems"

    # Consistency score (based on recent activity)
    recent_problems = [p for p in problems if p.get("date_solved")]
    if recent_problems:
        recent_dates = [datetime.fromisoformat(p["date_solved"]) for p in recent_problems]
        recent_dates.sort()
        
        # Check activity in last 30 days
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_activity = [d for d in recent_dates if d >= thirty_days_ago]
        consistency_score = min(100, len(recent_activity) * 5)  # 5 points per problem, max 100
    else:
        consistency_score = 0

    return {
        "learning_velocity": learning_velocity,
        "weakness_areas": weakness_areas,
        "strength_areas": strength_areas,
        "next_recommended_difficulty": next_difficulty,
        "consistency_score": consistency_score,
        "total_practice_days": len(set(p["date_solved"] for p in problems if p.get("date_solved")))
    }

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

# NEW: Get problem recommendations
@router.get("/recommendations/next")
async def get_recommendations(
    current_user = Depends(get_current_user_optional if os.getenv("DEVELOPMENT") else get_current_user)
):
    """
    Intelligent problem recommendations based on user's solving history
    """
    try:
        # Get user's solved problems
        cursor = collection.find({"user_id": current_user["uid"]})
        problems = []
        async for doc in cursor:
            problems.append(doc)

        if not problems:
            return {
                "recommendations": [
                    {
                        "reason": "Starting with fundamentals",
                        "difficulty": "Easy",
                        "tags": ["Array", "Two Pointers"],
                        "description": "Build your foundation with array manipulation"
                    },
                    {
                        "reason": "Core data structure",
                        "difficulty": "Easy", 
                        "tags": ["String", "Hashmap"],
                        "description": "Learn string processing and hash table usage"
                    }
                ],
                "focus_areas": ["Array", "String", "Hashmap"]
            }

        # Analyze user's current state
        user_tags = []
        difficulty_counts = {"Easy": 0, "Medium": 0, "Hard": 0}
        weak_areas = []
        
        for problem in problems:
            user_tags.extend(problem.get("tags", []))
            difficulty_counts[problem.get("difficulty", "Easy")] += 1
            
            # Identify weak areas (problems marked for retry)
            if problem.get("retry_later") == "Yes":
                weak_areas.extend(problem.get("tags", []))

        tag_frequency = Counter(user_tags)
        weak_tag_frequency = Counter(weak_areas)
        
        # Generate recommendations
        recommendations = []
        
        # 1. Address weak areas first
        for weak_tag, count in weak_tag_frequency.most_common(2):
            if count >= 2:  # Only if user struggled with multiple problems
                recommendations.append({
                    "reason": f"Reinforce weak area: {weak_tag}",
                    "difficulty": "Easy" if difficulty_counts["Medium"] < 5 else "Medium",
                    "tags": [weak_tag] + PROBLEM_PATTERNS.get(weak_tag, [])[:1],
                    "description": f"Practice more {weak_tag} problems to build confidence"
                })

        # 2. Expand to related patterns
        for practiced_tag, count in tag_frequency.most_common(3):
            if practiced_tag in PROBLEM_PATTERNS:
                related_patterns = PROBLEM_PATTERNS[practiced_tag]
                for pattern in related_patterns:
                    if pattern not in [tag for tag, _ in tag_frequency.items()]:
                        recommendations.append({
                            "reason": f"Expand from {practiced_tag} to {pattern}",
                            "difficulty": _suggest_difficulty(difficulty_counts),
                            "tags": [pattern, practiced_tag],
                            "description": f"Apply {practiced_tag} knowledge to {pattern} problems"
                        })
                        break

        # 3. Fill with progression recommendations
        if len(recommendations) < 3:
            next_difficulty = _suggest_difficulty(difficulty_counts)
            unexplored_patterns = [tag for tag in PROBLEM_PATTERNS.keys() 
                                 if tag not in [t for t, _ in tag_frequency.items()]]
            
            for pattern in unexplored_patterns[:3-len(recommendations)]:
                recommendations.append({
                    "reason": f"Learn new pattern: {pattern}",
                    "difficulty": next_difficulty,
                    "tags": [pattern],
                    "description": f"Expand your skillset with {pattern} problems"
                })

        # Determine focus areas
        focus_areas = []
        if weak_areas:
            focus_areas.extend(list(set(weak_areas))[:2])
        
        # Add growth areas
        practiced_tags = [tag for tag, count in tag_frequency.most_common(3)]
        for tag in practiced_tags:
            if tag in PROBLEM_PATTERNS:
                focus_areas.extend(PROBLEM_PATTERNS[tag][:1])
        
        focus_areas = list(set(focus_areas))[:4]

        return {
            "recommendations": recommendations[:4],  # Limit to 4 recommendations
            "focus_areas": focus_areas,
            "user_level": _determine_user_level(difficulty_counts, len(problems))
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def _suggest_difficulty(difficulty_counts):
    """Suggest next difficulty based on user's progress"""
    easy, medium, hard = difficulty_counts["Easy"], difficulty_counts["Medium"], difficulty_counts["Hard"]
    
    if hard >= 3:
        return "Hard"
    elif medium >= 8 and easy >= 12:
        return "Hard"
    elif easy >= 8:
        return "Medium"
    else:
        return "Easy"

def _determine_user_level(difficulty_counts, total_problems):
    """Determine user's skill level"""
    easy, medium, hard = difficulty_counts["Easy"], difficulty_counts["Medium"], difficulty_counts["Hard"]
    
    if hard >= 10 and total_problems >= 50:
        return "Advanced"
    elif medium >= 15 and total_problems >= 30:
        return "Intermediate"
    elif total_problems >= 10:
        return "Beginner+"
    else:
        return "Beginner"



