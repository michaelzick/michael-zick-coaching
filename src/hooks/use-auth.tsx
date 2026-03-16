import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: string | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: { firstName?: string; lastName?: string; avatarUrl?: string }) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DEV_AUTH_ORIGIN = 'http://127.0.0.1:8080';

function getAuthRedirectUrl(path: string) {
  const baseUrl = import.meta.env.DEV ? DEV_AUTH_ORIGIN : window.location.origin;
  return new URL(path, baseUrl).toString();
}

function normalizeRole(role: unknown) {
  return typeof role === 'string' ? role.trim().toLowerCase() : '';
}

function getMetadataRole(user: User | null) {
  if (!user) return '';

  const roleCandidates = [
    user.app_metadata?.role,
    user.app_metadata?.user_role,
    user.user_metadata?.role,
    user.user_metadata?.user_role,
  ];

  return roleCandidates
    .map(normalizeRole)
    .find(Boolean) ?? '';
}

function requiresProfileRoleResolution(user: User | null) {
  return !!user && getMetadataRole(user) !== 'admin';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        avatarUrl: data.avatar_url,
        role: data.role,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as Profile;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    }
  };

  const syncSessionState = (nextSession: Session | null) => {
    setSession(nextSession);
    const nextUser = nextSession?.user ?? null;
    setUser(nextUser);

    if (!nextUser) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setProfile((currentProfile) => currentProfile?.id === nextUser.id ? currentProfile : null);
    setIsProfileLoading(requiresProfileRoleResolution(nextUser));
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        syncSessionState(session);
      } catch (error) {
        console.error('Error restoring auth session:', error);
        if (!isMounted) return;
        syncSessionState(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!isMounted) return;
        syncSessionState(nextSession);
        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    if (!user) {
      setProfile(null);
      setIsProfileLoading(false);
      return () => {
        isCurrent = false;
      };
    }

    setIsProfileLoading(requiresProfileRoleResolution(user));

    void fetchProfile(user.id)
      .then((nextProfile) => {
        if (!isCurrent) return;
        setProfile((currentProfile) => {
          if (nextProfile) return nextProfile;
          if (currentProfile?.id === user.id) return currentProfile;
          return null;
        });
      })
      .finally(() => {
        if (isCurrent) {
          setIsProfileLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    if (error) return { error: error.message };

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
        }, {
          onConflict: 'id',
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    return { error: null };
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getAuthRedirectUrl('/login'),
      },
    });
    return { error: error?.message ?? null };
  };

  const requestPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthRedirectUrl('/reset-password'),
    });
    return { error: error?.message ?? null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error?.message ?? null };
  };

  const updateProfile = async (updates: { firstName?: string; lastName?: string; avatarUrl?: string }) => {
    if (!user) return { error: 'Not authenticated' };

    const dbUpdates: Record<string, string> = {};
    if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
    if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;

    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', user.id);

    if (error) return { error: error.message };

    setIsProfileLoading(true);
    const refreshed = await fetchProfile(user.id);
    setProfile(refreshed);
    setIsProfileLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsLoading(false);
    }
  };

  const normalizedProfileRole = normalizeRole(profile?.role);
  const normalizedMetadataRole = getMetadataRole(user);
  const isAdmin = normalizedProfileRole === 'admin' || normalizedMetadataRole === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isProfileLoading,
        isAdmin,
        signIn,
        signUp,
        signInWithMagicLink,
        requestPasswordReset,
        signOut,
        updatePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
