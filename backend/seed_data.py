from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from datetime import date, timedelta
import random

MONGO_URI = "mongodb+srv://leetspace_user:Computer%40123@cluster0.i76g047.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = AsyncIOMotorClient(MONGO_URI)
db = client["leetspace"]
collection = db["problems"]

tags_pool = [
    "Array", "Hashmap", "Two Pointers", "Sliding Window", "Binary Search", "DFS",
    "BFS", "Stack", "Queue", "Linked List", "Graph", "Greedy", "Sorting", "DP"
]

titles = [
    "Two Sum", "Longest Substring Without Repeating Characters", "Merge Intervals",
    "Best Time to Buy and Sell Stock", "Valid Parentheses", "Group Anagrams",
    "Climbing Stairs", "Longest Palindromic Substring", "Container With Most Water",
    "Binary Tree Inorder Traversal", "Course Schedule", "Word Ladder",
    "Median of Two Sorted Arrays", "Subsets", "Kth Largest Element",
    "LRU Cache", "Find Minimum in Rotated Sorted Array", "Trapping Rain Water",
    "Reverse Linked List", "Maximum Subarray"
]

def generate_problem(i):
    return {
        "user_id": "abc123" if i % 2 == 0 else "xyz456",
        "title": titles[i],
        "url": f"https://leetcode.com/problems/{titles[i].lower().replace(' ', '-')}/",
        "difficulty": random.choice(["Easy", "Medium", "Hard"]),
        "tags": random.sample(tags_pool, k=random.randint(2, 4)),
        "time_taken_min": random.randint(10, 60),
        "date_solved": str(date(2025, 6, 24) - timedelta(days=random.randint(0, 30))),
        "notes": f"Solved using {random.choice(tags_pool)} approach.",
        "solution": f"class Solution:\n    def {titles[i].split()[0].lower()}(...):\n        pass",
        "mistakes": "Missed edge case handling.",
        "retry_later": random.choice([True, False])
    }

dummy_problems = [generate_problem(i) for i in range(20)]

async def seed():
    await collection.delete_many({})
    result = await collection.insert_many(dummy_problems)
    print(f"Inserted {len(result.inserted_ids)} dummy problems.")

if __name__ == "__main__":
    asyncio.run(seed())
