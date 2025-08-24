import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 text-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-xl text-center">
        <div className="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/60 p-4 mb-5">
          <SearchX className="size-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">The page you’re looking for doesn’t exist or may have moved.</p>
        <div className="mt-6 flex items-center justify-center">
          <Button asChild>
            <Link to="/" className="cursor-pointer">
              <Home className="mr-1.5" /> Go to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


