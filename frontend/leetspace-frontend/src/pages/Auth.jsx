import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDemo } from "@/context/DemoContext";
import { LoginForm } from "@/components/login-form";

function BrandBadge({ className = "" }) {
  return (
    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-extrabold text-[14px] leading-none tracking-tight ${className}`}>
      LS
    </span>
  );
}

export default function Auth() {
  const { isDemo } = useDemo();

  useEffect(() => {
    if (isDemo) {
      window.location.replace("/dashboard");
    }
  }, [isDemo]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");

    return () => {
      root.classList.remove("light");
      const stored = typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'light') : 'light';
      root.classList.add(stored === 'dark' ? 'dark' : 'light');
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2 font-medium text-gray-900 dark:text-white cursor-pointer">
            <BrandBadge />
            myLeetSpace
          </Link>
          <Link to="/" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer">Back to landing</Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
  