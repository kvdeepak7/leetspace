export const demoProblems = [
	{
		id: "demo1",
		user_id: "abc123",
		title: "Two Sum",
		url: "https://leetcode.com/problems/two-sum/",
		difficulty: "Easy",
		tags: ["Array", "Hashmap"],
		date_solved: "2025-02-10",
		notes: "Used hashmap for O(n). Note: handle duplicates carefully.",
		solutions: [
			{ language: "python", code: "def twoSum(nums, target):\n    mp = {}\n    for i, v in enumerate(nums):\n        d = target - v\n        if d in mp: return [mp[d], i]\n        mp[v] = i" },
			{ language: "javascript", code: "function twoSum(a, t){const m=new Map();for(let i=0;i<a.length;i++){const d=t-a[i];if(m.has(d))return[m.get(d),i];m.set(a[i],i)}}" }
		],
		retry_later: "No",
	},
	{
		id: "demo2",
		user_id: "abc123",
		title: "Longest Substring Without Repeating Characters",
		url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
		difficulty: "Medium",
		tags: ["String", "Sliding Window"],
		date_solved: "2025-02-08",
		notes: "Sliding window; track left boundary on duplicate.",
		solutions: [
			{ language: "javascript", code: "function lengthOfLongestSubstring(s){const m=new Map();let l=0,res=0;for(let r=0;r<s.length;r++){if(m.has(s[r])&&m.get(s[r])>=l){l=m.get(s[r])+1}m.set(s[r],r);res=Math.max(res,r-l+1)}return res}" }
		],
		retry_later: "Yes",
	},
	{
		id: "demo3",
		user_id: "abc123",
		title: "Course Schedule",
		url: "https://leetcode.com/problems/course-schedule/",
		difficulty: "Medium",
		tags: ["Graph", "BFS"],
		date_solved: "2025-02-05",
		notes: "Kahn's algorithm with indegree; detect cycle.",
		solutions: [
			{ language: "python", code: "from collections import deque\n\ndef canFinish(n, prereq):\n    indeg=[0]*n; g=[[] for _ in range(n)]\n    for a,b in prereq: g[b].append(a); indeg[a]+=1\n    q=deque([i for i in range(n) if indeg[i]==0])\n    seen=0\n    while q:\n        u=q.popleft(); seen+=1\n        for v in g[u]:\n            indeg[v]-=1\n            if indeg[v]==0: q.append(v)\n    return seen==n" }
		],
		retry_later: "Yes",
	},
	{
		id: "demo4",
		user_id: "abc123",
		title: "Best Time to Buy and Sell Stock",
		url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
		difficulty: "Easy",
		tags: ["Array", "DP"],
		date_solved: "2025-02-03",
		notes: "Track min so far and max profit.",
		solutions: [
			{ language: "javascript", code: "function maxProfit(p){let min=Infinity,ans=0;for(const x of p){min=Math.min(min,x);ans=Math.max(ans,x-min)}return ans}" }
		],
		retry_later: "No",
	},
	{
		id: "demo5",
		user_id: "abc123",
		title: "Binary Tree Inorder Traversal",
		url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
		difficulty: "Easy",
		tags: ["Tree", "DFS"],
		date_solved: "2025-02-01",
		notes: "Iterative stack solution.",
		solutions: [
			{ language: "python", code: "def inorderTraversal(root):\n    res, st = [], []\n    cur = root\n    while cur or st:\n        while cur: st.append(cur); cur = cur.left\n        cur = st.pop(); res.append(cur.val); cur = cur.right\n    return res" }
		],
		retry_later: "No",
	},
	{
		id: "demo6",
		user_id: "abc123",
		title: "Merge Intervals",
		url: "https://leetcode.com/problems/merge-intervals/",
		difficulty: "Medium",
		tags: ["Sorting", "Array"],
		date_solved: "2025-01-28",
		notes: "Sort by start; merge overlapping.",
		solutions: [
			{ language: "javascript", code: "function merge(a){a.sort((x,y)=>x[0]-y[0]);const res=[];for(const it of a){if(!res.length||res[res.length-1][1]<it[0])res.push(it);else res[res.length-1][1]=Math.max(res[res.length-1][1],it[1])}return res}" }
		],
		retry_later: "No",
	},
	{
		id: "demo7",
		user_id: "abc123",
		title: "Word Ladder",
		url: "https://leetcode.com/problems/word-ladder/",
		difficulty: "Hard",
		tags: ["BFS", "Graph"],
		date_solved: "2025-01-25",
		notes: "BFS over word transformations; precompute buckets.",
		solutions: [
			{ language: "python", code: "# BFS solution sketch" }
		],
		retry_later: "Yes",
	},
	{
		id: "demo8",
		user_id: "abc123",
		title: "Sliding Window Maximum",
		url: "https://leetcode.com/problems/sliding-window-maximum/",
		difficulty: "Hard",
		tags: ["Deque", "Sliding Window"],
		date_solved: "2025-01-20",
		notes: "Deque to maintain decreasing window.",
		solutions: [
			{ language: "python", code: "# Deque-based O(n) solution" }
		],
		retry_later: "Yes",
	},
];