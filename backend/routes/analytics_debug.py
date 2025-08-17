from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from db.mongo import db
from .analytics import (
	calculate_basic_stats,
	detect_weaknesses,
	suggest_todays_revision,
	generate_activity_heatmap,
	get_recent_activity,
)

router = APIRouter()
collection = db["problems"]

@router.get("/dashboard-debug")
async def get_dashboard_stats_debug(
	user_id: Optional[str] = Query("abc123"),
):
	try:
		# Fetch problems for the specified (demo) user without auth
		cursor = collection.find({"user_id": user_id})
		problems = []
		async for doc in cursor:
			doc["id"] = str(doc["_id"])  # normalize id for frontend
			del doc["_id"]
			problems.append(doc)

		if not problems:
			return {
				"basic_stats": {
					"total_problems": 0,
					"retry_count": 0,
					"total_active_days": 0,
					"difficulty_breakdown": {"easy": 0, "medium": 0, "hard": 0},
					"most_used_tags": []
				},
				"weaknesses": [],
				"todays_revision": None,
				"activity_heatmap": [],
				"recent_activity": []
			}

		return {
			"basic_stats": calculate_basic_stats(problems),
			"weaknesses": detect_weaknesses(problems),
			"todays_revision": suggest_todays_revision(problems),
			"activity_heatmap": generate_activity_heatmap(problems),
			"recent_activity": get_recent_activity(problems),
		}
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))