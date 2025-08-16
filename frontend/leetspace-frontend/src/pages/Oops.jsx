import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Oops() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 flex items-center">
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/70 text-xs">
          Demo link
        </div>
        <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
          Oops — don't worry, your actual URL works.
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          This is a playful demo link for the sample page. In your real journal, your links go wherever you want them to.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="shadow-sm border border-indigo-300">
            <Link to="/sample/problem" className="cursor-pointer">Back to sample problem</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="border border-indigo-300 bg-white/90 text-indigo-700 shadow-sm hover:bg-indigo-50/80 dark:bg-zinc-900/70 dark:text-indigo-200 dark:hover:bg-zinc-800/70">
            <Link to="/" className="cursor-pointer">Home</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="border border-indigo-300 bg-white/90 text-indigo-700 shadow-sm hover:bg-indigo-50/80 dark:bg-zinc-900/70 dark:text-indigo-200 dark:hover:bg-zinc-800/70">
            <Link to="/auth" className="cursor-pointer">Start your journal</Link>
          </Button>
        </div>

        <div className="mt-12 mx-auto max-w-md rounded-2xl border border-gray-200 dark:border-zinc-700 p-6 bg-white/70 dark:bg-zinc-900/70">
          <div className="text-left">
            <div className="text-sm font-semibold">What would be here in your log</div>
            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 list-disc pl-5 space-y-1">
              <li>Your real problem link (opens the actual site)</li>
              <li>Your notes and mistakes (in your words)</li>
              <li>Optional retry-later tag for future review</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}