import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Sample() {
  return (
    <div className="bg-white text-gray-900 dark:bg-zinc-900 dark:text-gray-100 min-h-screen">
      <section className="max-w-5xl mx-auto px-6 py-10 md:py-14">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Sample log</h1>
          <Button asChild>
            <Link to="/auth" className="cursor-pointer">Start your journal</Link>
          </Button>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">A quick look at how entries feel inside LeetSpace.</p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card
            title="Two Sum"
            meta="Easy • Array, Hashmap • 15m"
            notes="Consider space–time tradeoff"
            mistakes="Forgot duplicate handling initially"
            pyBars={["w-9/12", "w-7/12"]}
            jsBars={["w-10/12", "w-6/12"]}
            retry="No"
          />
          <Card
            title="Longest Substring Without Repeating"
            meta="Medium • String, Sliding Window • 28m"
            notes="Track window boundaries carefully"
            mistakes="Off‑by‑one on shrink step"
            pyBars={["w-8/12", "w-6/12"]}
            jsBars={["w-9/12", "w-5/12"]}
            retry="Yes"
          />
          <Card
            title="Course Schedule"
            meta="Medium • Graph, BFS • 34m"
            notes="Kahn’s algorithm for cycle detection"
            mistakes="Missed indegree init edge case"
            pyBars={["w-7/12", "w-5/12"]}
            jsBars={["w-8/12", "w-6/12"]}
            retry="Yes"
          />
        </div>

        <div className="mt-10 flex items-center gap-3">
          <Button asChild size="lg">
            <Link to="/auth" className="cursor-pointer">Start your journal</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link to="/sample/problem" className="cursor-pointer">View full sample problem</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link to="/" className="cursor-pointer">Back to landing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function Card({ title, meta, notes, mistakes, pyBars = ["w-9/12", "w-7/12"], jsBars = ["w-10/12", "w-6/12"], retry = "No" }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 p-6 bg-white/80 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${retry === 'Yes' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>{retry === 'Yes' ? 'Retry' : 'Good'}</span>
      </div>
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{meta}</div>
      <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
        <li className="flex gap-2"><span className="min-w-16 text-gray-500 dark:text-gray-400">Notes</span><span className="flex-1">{notes}</span></li>
        <li className="flex gap-2"><span className="min-w-16 text-gray-500 dark:text-gray-400">Mistakes</span><span className="flex-1">{mistakes}</span></li>
      </ul>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <LangBars lang="Py" bars={pyBars} />
        <LangBars lang="JS" bars={jsBars} />
      </div>
    </div>
  );
}

function LangBars({ lang, bars }) {
  return (
    <div className="rounded-md bg-gray-50 dark:bg-zinc-800 p-2">
      <div className="text-[10px] uppercase tracking-wide text-gray-500">{lang}</div>
      <div className="mt-1 space-y-1">
        <div className={`h-2 ${bars[0]} rounded bg-gray-300 dark:bg-zinc-700`} />
        <div className={`h-2 ${bars[1]} rounded bg-gray-300 dark:bg-zinc-700`} />
      </div>
    </div>
  );
}