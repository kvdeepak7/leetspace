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
    title: "Two Sum",
    url: "https://leetcode.com/problems/two-sum/",
    difficulty: "Easy",
    date_solved: "2025-02-12",
    tags: ["Array", "Hashmap"],
    notes: `## Approach
Use a hashmap to store seen values and their indices. For each number x, check if (target - x) exists.

### Complexity
- Time: O(n)
- Space: O(n)

### Pitfalls
- Forgetting duplicate handling (same index twice).
- Not returning as soon as a pair is found.`,
    solutions: [
      {
        language: "Python",
        code: `def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i`
      },
      {
        language: "JavaScript",
        code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const x = nums[i];
    if (map.has(target - x)) return [map.get(target - x), i];
    map.set(x, i);
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
            <a href={problem.url} target="_blank" rel="noopener noreferrer" title="Open Problem" className="text-muted-foreground hover:text-blue-600">
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
        <div className="flex items-center gap-3 text-sm">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor}`}>{problem.difficulty}</span>
          <span className="text-muted-foreground dark:text-gray-400">•</span>
          <span className="text-muted-foreground dark:text-gray-400">Feb 12, 2025</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {problem.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 rounded-md text-xs bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200">{tag}</span>
        ))}
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