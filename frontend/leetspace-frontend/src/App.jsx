import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Problems from './pages/Problems';
import AddProblem from './pages/AddProblem';
import ProblemDetail from './pages/problemDetail';
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/useAuth";
import "./index.css" 
function AppWrapper() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors">
          <Router>
            <App />
          </Router>
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
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/add-problem" element={<AddProblem />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
