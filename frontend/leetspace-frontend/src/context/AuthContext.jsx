import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase"; // make sure this path is correct
import AuthService from "@/lib/authService";
// import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (!initialized) {
        setInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [initialized]);

  // Enhanced sign up with email verification
  const signUp = useCallback(async (email, password, displayName = '') => {
    setLoading(true);
    try {
      const result = await AuthService.signUpWithEmail(email, password, displayName);
      if (result.success) {
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error, code: result.code };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An unexpected error occurred', code: error?.code };
    } finally {
      setLoading(false);
    }
  }, []);

  // Enhanced sign in with email verification check
  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const result = await AuthService.signInWithEmail(email, password);
      if (result.success) {
        return { success: true, user: result.user };
      } else {
        if (result.needsVerification) {
          return { 
            success: false, 
            error: result.error, 
            needsVerification: true,
            user: result.user,
            code: result.code,
          };
        }
        return { success: false, error: result.error, code: result.code };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred', code: error?.code };
    } finally {
      setLoading(false);
    }
  }, []);

  // Enhanced Google sign in
  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const result = await AuthService.signInWithGoogle();
      if (result.success) {
        return { 
          success: true, 
          user: result.user, 
          isNewUser: result.isNewUser 
        };
      } else {
        return { success: false, error: result.error, code: result.code };
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: 'An unexpected error occurred', code: error?.code };
    } finally {
      setLoading(false);
    }
  }, []);

  // Send email verification
  const sendEmailVerification = useCallback(async () => {
    try {
      const result = await AuthService.sendEmailVerification();
      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: 'Failed to send verification email' };
    }
  }, []);

  // Send password reset email
  const sendPasswordReset = useCallback(async (email) => {
    try {
      const result = await AuthService.sendPasswordReset(email);
      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Failed to send password reset email' };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const result = await AuthService.signOut();
      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: 'Failed to sign out' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (updates) => {
    try {
      const result = await AuthService.updateUserProfile(updates);
      if (result.success) {
        // Reload user to get updated data
        await AuthService.reloadUser();
        // Ensure React context consumers re-render with updated user
        setUser(auth.currentUser);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const result = await AuthService.updatePassword(currentPassword, newPassword);
      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error: 'Failed to update password' };
    }
  }, []);

  // Delete account
  const deleteAccount = useCallback(async (password) => {
    try {
      const result = await AuthService.deleteAccount(password);
      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      return { success: false, error: 'Failed to delete account' };
    }
  }, []);

  // Reload user data
  const reloadUser = useCallback(async () => {
    try {
      await AuthService.reloadUser();
      // Refresh state with latest user instance
      setUser(auth.currentUser);
      return { success: true };
    } catch (error) {
      console.error('Reload user error:', error);
      return { success: false, error: 'Failed to reload user data' };
    }
  }, []);

    // Helper functions
    const isEmailVerified = AuthService.isEmailVerified(user);
    const hasPasswordProvider = AuthService.hasPasswordProvider(user);
    const hasGoogleProvider = AuthService.hasGoogleProvider(user);
    const userProviders = AuthService.getUserProviders(user);
  
    // Auth context value
    const value = {
      // User state
      user,
      loading,
      initialized,
      
      // User info helpers
      isEmailVerified,
      hasPasswordProvider,
      hasGoogleProvider,
      userProviders,
      
      // Authentication methods
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      
      // Email & password management
      sendEmailVerification,
      sendPasswordReset,
      updatePassword,
      
      // Profile management
      updateProfile,
      deleteAccount,
      reloadUser,
    };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
