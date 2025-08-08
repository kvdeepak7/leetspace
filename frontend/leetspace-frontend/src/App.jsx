import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Problems from './pages/Problems';
import AddProblem from './pages/AddProblem';
import ProblemDetail from './pages/problemDetail';
import EditProblem from "./pages/EditProblem";
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

import { ThemeProvider } from "@/components/ThemeProvider";
// import { AuthProvider } from "@/lib/useAuth";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import "./index.css" 
function AppWrapper() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors">
          <Router>
            <App />
          </Router>
          <Toaster 
            position="top-right"
            theme="system"
            richColors
            closeButton={false}
            duration={2200}
            offset={60}
            toastOptions={{
              className: "pointer-events-none",
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              },
            }}
          />
        </div>
      </AuthProvider>
    </ThemeProvider>

  );
}
function App() {

  const location = useLocation();

  const shouldShowNavbar = location.pathname !== "/auth";

  
  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute requireEmailVerification={false}>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route path="/auth" element={<Auth />} />
        {/* Protected Routes - require authentication and email verification */}
        <Route 
          path="/problems" 
          element={
            <ProtectedRoute requireEmailVerification={false}>
              <Problems />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-problem" 
          element={
            <ProtectedRoute>
              <AddProblem />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/problems/:id" 
          element={
            <ProtectedRoute requireEmailVerification={false}>
              <ProblemDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-problem/:id" 
          element={
            <ProtectedRoute>
              <EditProblem />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requireEmailVerification={false}>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requireEmailVerification={false}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default AppWrapper;
