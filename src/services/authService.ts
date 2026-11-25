import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';

export const authService = {
  /**
   * Register a new user with email, password, and full name.
   */
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Log in an existing user with email and password.
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Log out the current user and clear local session.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  /**
   * Get the current active session.
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data.session;
  },

  /**
   * Get current authenticated user profile.
   */
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return null;
    }
    return data.user;
  },

  /**
   * Listen to auth state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED).
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  },

  /**
   * Request password reset email.
   */
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Helper to format a Supabase User object into a UserProfile.
   */
  formatUserProfile(user: any): UserProfile {
    const name =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split('@')[0] ||
      'User';

    const createdAt = user?.created_at
      ? new Date(user.created_at).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      : 'Nov 2026';

    return {
      name,
      email: user?.email || '',
      memberSince: `Member since ${createdAt}`,
      avatarUrl:
        user?.user_metadata?.avatar_url ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    };
  },
};
