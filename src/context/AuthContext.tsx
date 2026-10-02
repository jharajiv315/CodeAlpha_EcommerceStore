import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { User } from '../types';
import { useToast } from './ToastContext';

const WISHLIST_KEY = 'nexora_wishlist_v1';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  wishlist: string[];
  toggleWishlist: (productId: string, productName?: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { addToast } = useToast();

  const loadUserProfile = useCallback(async () => {
    try {
      const activeUser = await authService.getCurrentUser();
      setUser(activeUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial profile load
    loadUserProfile();

    // Subscribe to Supabase session state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const profile = await authService.getCurrentUser();
          setUser(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Load wishlist
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch {
      // Storage unavailable
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const loggedIn = await authService.login({ email, password });
      setUser(loggedIn);
      addToast(`Welcome back, ${loggedIn.name}`, 'success');
    } catch (err: any) {
      addToast('Sign-in failed', 'error', err.message || 'Please check your email and password');
      throw err;
    }
  }, [addToast]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const { user: registered, requiresEmailConfirmation } = await authService.register({
        name,
        email,
        password,
      });

      if (requiresEmailConfirmation) {
        addToast(
          'Verification email sent',
          'info',
          'Please verify your email address to complete your account setup.'
        );
      } else {
        setUser(registered);
        addToast(`Account created`, 'success', `Welcome to Nexora, ${registered.name}`);
      }
    } catch (err: any) {
      addToast('Registration failed', 'error', err.message || 'Please try again');
      throw err;
    }
  }, [addToast]);

  const loginWithGoogle = useCallback(async () => {
    try {
      await authService.signInWithGoogle();
    } catch (err: any) {
      addToast('Google sign-in failed', 'error', err.message);
      throw err;
    }
  }, [addToast]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    addToast('Signed out', 'info', 'You have been signed out of your Nexora session');
  }, [addToast]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      const updated = await authService.updateProfile(data);
      setUser(updated);
      addToast('Profile updated', 'success');
    } catch (err: any) {
      addToast('Update failed', 'error', err.message);
      throw err;
    }
  }, [addToast]);

  const toggleWishlist = useCallback((productId: string, productName?: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable
      }

      if (exists) {
        addToast('Removed from Wishlist', 'info', productName);
      } else {
        addToast('Saved to Wishlist', 'success', productName);
      }

      return next;
    });
  }, [addToast]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        wishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
