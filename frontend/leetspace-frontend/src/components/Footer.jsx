import { Link } from "react-router-dom";
import { Mail, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} myLeetSpace</div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-700 dark:text-gray-300">
          <a href="mailto:contact@myleetspace.com" className="inline-flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400">
            <Mail className="size-4" /> contact@myleetspace.com
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn" className="inline-flex items-center justify-center size-8 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800">
            <Linkedin className="size-4" />
          </a>
          <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Privacy</Link>
          <Link to="/cookies" className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Cookie Policy</Link>
          <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}


