import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeViewer from "@/components/CodeViewer";
import MDEditor from "@uiw/react-md-editor";

export default function SampleProblem() {
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const problem = {
    title: "WarpGate Batch Windows",
    url: "https://leetspace.dev/sample/warpgate",
    difficulty: "Medium",
    date_solved: "2025-02-14",
    retry_later: "Yes",
    tags: ["Greedy", "Scheduling", "Two Pointers", "Arrays", "Simulation"],
    notes: `# WarpGate Batch Windows

You operate a WarpGate that lets ships jump in small batches. Each ship arrives at a known timestamp (in seconds). A batch may include any number of ships as long as the **time between the first and last ship in that batch is at most W seconds**.

Your goal is to group arrivals into the **minimum number of batches** and optionally return the batch segments.

## Problem
- Input:
  - \`arrivals\` — array of non-decreasing integers (timestamps)
  - \`W\` — non-negative integer (maximum window per batch)
- Output:
  - Minimum number of batches
  - Optional: list of \`[startTime, endTime]\` segments or per-ship batch assignments

## Example
arrivals = [0, 3, 4, 10, 12, 17], W = 5  
Batches:
- Batch 1: [0, 3, 4] → segment [0, 4]
- Batch 2: [10, 12] → segment [10, 12]
- Batch 3: [17] → segment [17, 17]

Minimum batches = **3**

## Approach (Greedy + Two Pointers)
Expand a window from the first ship. Keep adding ships while \`arrivals[j] - arrivals[i] <= W\`. When about to exceed \`W\`, **close the batch** at \`arrivals[j-1]\` and start a new batch at \`j\`.

Why greedy works: closing a batch as late as possible never hurts the optimal solution—splitting earlier only increases the batch count.

## Complexity
- Time: \(O(n)\) after sort (arrivals are given non-decreasing)
- Space: \(O(1)\) besides output

## Pitfalls
- Unsorted input → sort first (not needed here if guaranteed)
- \`W = 0\` → only identical timestamps can batch
- Duplicates are fine; window check uses first and current timestamps
- Empty input → 0 batches

## Variations
- Return per-ship batch IDs
- Limit batch capacity (then it becomes capacity + window constrained)
- Streaming arrivals (maintain rolling window)

> Tip: Mark this for **retry later** if two-pointer window boundaries feel fuzzy.

## Self-check Cases
1) arrivals=[1,1,1], W=0 → 1 batch  
2) arrivals=[1,2,3,9], W=2 → batches [[1,3],[9,9]] → 2  
3) arrivals=[], W=5 → 0
`,
    solutions: [
      {
        language: "Python",
        code: `def batch_count(arrivals, W):
    if not arrivals:
        return 0, []
    count = 0
    segments = []
    i = 0
    n = len(arrivals)
    while i < n:
        start = arrivals[i]
        j = i
        while j < n and arrivals[j] - start <= W:
            j += 1
        # close batch at j-1
        end = arrivals[j-1]
        segments.append([start, end])
        count += 1
        i = j
    return count, segments
`
      },
      {
        language: "JavaScript",
        code: `function batchCount(arrivals, W) {
  if (!arrivals || arrivals.length === 0) return [0, []]
  let count = 0
  const segments = []
  let i = 0
  const n = arrivals.length
  while (i < n) {
    const start = arrivals[i]
    let j = i
    while (j < n && arrivals[j] - start <= W) j++
    const end = arrivals[j - 1]
    segments.push([start, end])
    count++
    i = j
  }
  return [count, segments]
}`
      },
      {
        language: "Java",
        code: `import java.util.*;
class WarpGate {
  static Pair<Integer, List<int[]>> batchCount(int[] arrivals, int W) {
    if (arrivals == null || arrivals.length == 0) {
      return new Pair<>(0, new ArrayList<>());
    }
    int i = 0, n = arrivals.length, count = 0;
    List<int[]> segments = new ArrayList<>();
    while (i < n) {
      int start = arrivals[i];
      int j = i;
      while (j < n && arrivals[j] - start <= W) j++;
      int end = arrivals[j - 1];
      segments.add(new int[]{start, end});
      count++;
      i = j;
    }
    return new Pair<>(count, segments);
  }
  static class Pair<A,B> {
    final A first; final B second;
    Pair(A a, B b){ first=a; second=b; }
  }
}`
      }
    ]
  };

  const difficultyColor = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }[problem.difficulty] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 text-black dark:text-white bg-white dark:bg-zinc-900 min-h-screen">
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{problem.title}</h1>
            <a href={problem.url} target="_blank" rel="noopener noreferrer" title="Open Reference" className="text-muted-foreground hover:text-blue-600">
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/sample" className="cursor-pointer">Back</Link>
            </Button>
            <Button asChild>
              <Link to="/auth" className="cursor-pointer">Start your journal</Link>
            </Button>
          </div>
        </div>
        {problem.retry_later === "Yes" && (
          <div className="text-sm text-orange-600 dark:text-orange-300 italic">
            You marked this problem to revisit later.
          </div>
        )}
        <div className="flex items-center gap-3 text-sm">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor}`}>{problem.difficulty}</span>
          <span className="text-muted-foreground dark:text-gray-400">•</span>
          <span className="text-muted-foreground dark:text-gray-400">Feb 14, 2025</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {problem.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 rounded-md text-xs bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200">{tag}</span>
        ))}
        <span className="px-2 py-1 rounded-md text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Retry later</span>
      </div>

      <div data-color-mode={theme} className="prose dark:prose-invert max-w-none !bg-white dark:!bg-zinc-900">
        <MDEditor.Markdown
          source={problem.notes}
          className="!bg-white dark:!bg-zinc-900 p-4 rounded-md"
          style={{ backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff', padding: '1rem', borderRadius: '0.5rem' }}
        />
      </div>

      <div className="space-y-6">
        {problem.solutions.map((sol, idx) => (
          <div key={idx} className="rounded-xl border border-border bg-muted/40 dark:bg-zinc-900 shadow-sm p-4">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Solution {idx + 1} ({sol.language})</div>
            <div className="overflow-x-auto rounded-md bg-background dark:bg-zinc-800">
              <CodeViewer language={sol.language} code={sol.code} theme={theme} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}