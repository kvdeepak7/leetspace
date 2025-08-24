import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { useDemo } from "@/context/DemoContext";
import { Moon, Sun, User, LogOut, Mail, Shield, Settings,Menu, X } from "lucide-react";

function ProfilePicture({ user, size = "w-6 h-6" }) {
  const [imageError, setImageError] = useState(false);
  
  if (user.photoURL && !imageError) {
    return (
      <img 
        src={user.photoURL} 
        alt="Profile" 
        className={`${size} rounded-full`}
        onError={() => setImageError(true)}
        onLoad={() => setImageError(false)}
      />
    );
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'U';
  const firstLetter = displayName.charAt(0).toUpperCase();
  
  // Generate a nice background color based on the first letter
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-red-500',
    'bg-cyan-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500'
  ];
  const colorIndex = firstLetter.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div className={`${size} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
      {firstLetter}
    </div>
  );
}

function LogoMark({ className = "" }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			focusable="false"
		>
			{/* Notebook/document with folded corner */}
			<path d="M8 3h7l4 4v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z" />
			<path d="M15 3v5h5" />
			{/* Fold fill for subtle accent */}
			<path d="M15 3l5 5h-5z" fill="currentColor" opacity=".18" />
			{/* Note lines */}
			<line x1="9" y1="12" x2="15" y2="12" />
			<line x1="9" y1="16" x2="17" y2="16" />
			<line x1="9" y1="8" x2="12.5" y2="8" />
		</svg>
	);
}

export default function Navbar() {
  const { user, signOut, isEmailVerified, hasGoogleProvider } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isDemo, setDemo } = useDemo();

  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);


  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      navigate("/auth");
    }
    setShowUserMenu(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setShowUserMenu(false);
  };

  const showNavLinks = isDemo || !!user;

  return (
    <nav className="relative flex justify-between items-center px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <Link to={showNavLinks ? "/dashboard" : "/"} className="group flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white cursor-pointer">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white font-extrabold text-[14px] leading-none tracking-tight shadow-sm transition-all duration-200 group-hover:shadow group-hover:-translate-y-px">
          LS
        </span>
        <span>myLeetSpace</span>
        {isDemo && (
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200 border border-indigo-200/70 dark:border-indigo-700/50">
            Demo
          </span>
        )}
      </Link>
      <div className="flex items-center gap-4 text-sm">
      {showNavLinks && (
        <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 sm:hidden rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
      )}
      {showNavLinks && (
        <div className="hidden sm:flex items-center gap-4">
        <Link to="/dashboard" className="dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
          Dashboard
        </Link>
        <Link to="/problems" className="dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
          Problems
        </Link>
        <Link 
          to="/add-problem" 
          onClick={() => sessionStorage.setItem("addProblemIntent", "fresh")}
          className="dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
        >
          Add Problem
        </Link>
      </div>
      )}
        {/* Theme toggle button */}
        <button 
          onClick={toggleTheme} 
          className="p-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5 text-white" />
          )}
        </button>

        {isDemo && !user && (
          <button
            onClick={() => { setDemo(false); navigate("/"); }}
            className="hidden sm:inline-flex px-3 py-1 text-xs rounded border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer"
          >
            Exit demo
          </button>
        )}

        {user ? (
                    <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <ProfilePicture user={user} size="w-6 h-6" />
                        <span className="dark:text-white hidden sm:inline">
                          {user.displayName || user.email?.split('@')[0]}
                        </span>
                      </div>
                    </button>
        
                    {/* User dropdown menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            <ProfilePicture user={user} size="w-10 h-10" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {user.displayName || "User"}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          
                          {/* User status indicators */}
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                              <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              <span className={`px-2 py-1 rounded-full ${
                                isEmailVerified 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
                              </span>
                            </div>
                            
                            {hasGoogleProvider && (
                              <div className="flex items-center gap-2 text-xs">
                                <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  Google Account
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-2 space-y-1">
                          <button
                            onClick={handleProfileClick}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
                          >
                            <Settings className="w-4 h-4" />
                            Account Settings
                          </button>
                          
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
        
        ) : (!isDemo && (
          <Link 
            to="/auth" 
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-indigo-500/20"
          >
            Sign In
          </Link>
        ))}
      </div>
      {/* Mobile menu panel */}
      {showMobileMenu && showNavLinks && (
        <div className="sm:hidden absolute left-0 right-0 top-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black z-50">
          <div className="px-6 py-3 flex flex-col gap-3">
            {showNavLinks && (
              <>
                <Link to="/dashboard" className="dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer" onClick={() => setShowMobileMenu(false)}>
                  Dashboard
                </Link>
                <Link to="/problems" className="dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer" onClick={() => setShowMobileMenu(false)}>
                  Problems
                </Link>
                <Link 
                  to="/add-problem" 
                  onClick={() => { sessionStorage.setItem("addProblemIntent", "fresh"); setShowMobileMenu(false); }}
                  className="dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                >
                  Add Problem
                </Link>
                {isDemo && !user && (
                  <button
                    onClick={() => { setDemo(false); setShowMobileMenu(false); navigate("/"); }}
                    className="mt-1 w-full text-left px-3 py-2 rounded border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer"
                  >
                    Exit demo
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
      {showMobileMenu && showNavLinks && (
        <div 
          className="fixed inset-0 z-40 sm:hidden" 
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </nav>
  );
}
