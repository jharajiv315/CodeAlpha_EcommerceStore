import { supabase } from '../lib/supabase';
import { apiRequest } from './apiClient';
import { ShippingAddress, User } from '../types';

export interface RegisterResult {
  user: User;
  requiresEmailConfirmation: boolean;
}

class AuthService {
  /**
   * Translates Supabase error codes and messages into polished, user-friendly copy
   */
  private formatAuthError(err: any): Error {
    const rawMsg = err?.message || '';

    if (rawMsg.includes('Invalid login credentials')) {
      return new Error('Your email or password is incorrect.');
    }
    if (rawMsg.includes('User already registered') || rawMsg.includes('already registered')) {
      return new Error('An account with this email already exists. Please sign in.');
    }
    if (rawMsg.includes('Email not confirmed')) {
      return new Error('Please verify your email address before signing in.');
    }
    if (rawMsg.includes('Password should be at least')) {
      return new Error('Password must be at least 6 characters long.');
    }
    if (rawMsg.includes('rate limit')) {
      return new Error('Too many requests. Please wait a moment before trying again.');
    }

    return new Error(rawMsg || 'Authentication failed. Please check your credentials.');
  }

  /**
   * Retrieves active authenticated user session and synced profile
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        return null;
      }

      // Fetch authoritative application profile from backend PostgreSQL
      const profile = await apiRequest<User>('/auth/profile', { requiresAuth: true });
      return profile;
    } catch (err: any) {
      // If profile fetch failed or unauthenticated, return null
      return null;
    }
  }

  /**
   * Authenticates user credentials via Supabase Auth
   */
  async login(credentials: { email: string; password: string }): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim(),
      password: credentials.password,
    });

    if (error) {
      throw this.formatAuthError(error);
    }

    if (!data.user) {
      throw new Error('Authentication succeeded but user identity was missing.');
    }

    // Retrieve synced PostgreSQL profile
    const profile = await apiRequest<User>('/auth/profile', { requiresAuth: true });
    return profile;
  }

  /**
   * Registers a new user account with Supabase Auth
   */
  async register(data: { name: string; email: string; password: string }): Promise<RegisterResult> {
    const trimmedName = data.name.trim();
    const trimmedEmail = data.email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      throw new Error('Please enter your full name (minimum 2 characters).');
    }

    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: data.password,
      options: {
        data: {
          name: trimmedName,
        },
      },
    });

    if (error) {
      throw this.formatAuthError(error);
    }

    const authUser = authData.user;
    if (!authUser) {
      throw new Error('Registration failed to create an account.');
    }

    const requiresEmailConfirmation = !authData.session;

    let profile: User;
    if (authData.session) {
      // If session exists immediately, fetch profile
      profile = await apiRequest<User>('/auth/profile', { requiresAuth: true });
    } else {
      // Pending email verification
      profile = {
        id: authUser.id,
        name: trimmedName,
        email: trimmedEmail,
        joinedDate: new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date()),
        savedAddresses: [],
      };
    }

    return { user: profile, requiresEmailConfirmation };
  }

  /**
   * Initiates Google OAuth Sign-In via Supabase Auth
   */
  async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      throw this.formatAuthError(error);
    }
  }

  /**
   * Destroys active Supabase user session
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (err) {
      // Ignore network errors on logout
    }
  }

  /**
   * Updates profile fields in PostgreSQL
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const updated = await apiRequest<User>('/auth/profile', {
      method: 'PUT',
      requiresAuth: true,
      body: JSON.stringify(updates),
    });
    return updated;
  }

  /**
   * Retrieves saved addresses for current user
   */
  async getSavedAddresses(): Promise<ShippingAddress[]> {
    const user = await this.getCurrentUser();
    return user?.savedAddresses || [];
  }

  /**
   * Saves a new address to user profile in PostgreSQL
   */
  async addSavedAddress(address: ShippingAddress): Promise<ShippingAddress[]> {
    const addresses = await apiRequest<ShippingAddress[]>('/auth/addresses', {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify(address),
    });
    return addresses;
  }
}

export const authService = new AuthService();
