import { useState, useEffect, useContext, createContext } from "react";
import { auth } from "./firebase"; // your Firebase config
import { onAuthStateChanged } from "firebase/auth";

// 1. Create context
const AuthContext = createContext();

// 2. Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}
