import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import MDEditor from "@uiw/react-md-editor";
import CodeViewer from "@/components/CodeViewer";

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`/api/problems/${id}`, {
          baseURL: "http://localhost:8000",
        });
        setProblem(res.data);
      } catch (err) {
        console.error("Failed to fetch problem", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  if (loading) {
    return <Skeleton className="w-full h-64 rounded-xl" />;
  }

  if (!problem) {
    return <div className="text-center text-muted-foreground dark:text-gray-400">Problem not found.</div>;
  }

  const difficultyColor = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }[problem.difficulty] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 text-black dark:text-white bg-white dark:bg-zinc-900">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">{problem.title}</h1>
        {problem.retry_later === "Yes" && (
          <div className="text-sm text-orange-600 dark:text-orange-300 italic">
            You marked this problem to revisit later.
          </div>
        )}
        <div className="flex items-center gap-3 text-sm">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor}`}>{problem.difficulty}</span>
          <span className="text-muted-foreground dark:text-gray-400">•</span>
          <span className="text-muted-foreground dark:text-gray-400">{new Date(problem.date_solved).toLocaleDateString()}</span>
        </div>
      </div>

      {problem.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-md text-xs bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {problem.notes && (
        <div
          data-color-mode={theme}
          className="prose dark:prose-invert max-w-none !bg-white dark:!bg-zinc-900"
        >
          <MDEditor.Markdown
            source={problem.notes}
            className="!bg-white dark:!bg-zinc-900 p-4 rounded-md"
            style={{
              backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff', // match Tailwind's zinc-900
              padding: '1rem',
              borderRadius: '0.5rem',
            }}
          />
        </div>
      )}

<div className="space-y-6">
  {Array.isArray(problem.solutions) &&
    problem.solutions.map((sol, idx) => (
      <div key={idx} className="rounded-xl border border-border bg-muted/40 dark:bg-zinc-900 shadow-sm p-4">
        <div className="text-sm font-semibold text-muted-foreground mb-2">
          Solution {idx + 1} ({sol.language})
        </div>
        <div className="overflow-x-auto rounded-md bg-background dark:bg-zinc-800">
          <CodeViewer language={sol.language} code={sol.code} theme={theme} />
        </div>
      </div>
    ))}
</div>
    </div>
  );
}
