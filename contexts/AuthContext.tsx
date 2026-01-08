import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase, supabaseError } from '../lib/supabaseClient';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { DatabaseErrorDisplay } from '../components/DatabaseErrorDisplay';

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'unlimited';
  image_credits: number;
}

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password_hash: string) => Promise<any>;
  signup: (username: string, email: string, password_hash: string) => Promise<any>;
  logout: () => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  decrementCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const PROFILES_TABLE_SETUP_SQL = `-- 1. Create the profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  username TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free'::text NOT NULL,
  image_credits INTEGER DEFAULT 5 NOT NULL,
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for common access patterns
-- Users can view their own profile
CREATE POLICY "Users can view their own profile." ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile." ON public.profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 4. Create a function to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert a new row into public.profiles, using default values for credits/tier
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name', -- From Google/SAML
    NEW.raw_user_meta_data->>'avatar_url' -- From Google/SAML
  );
  RETURN NEW;
END;
$$;

-- 5. Create a trigger to call the function after a new user signs up in Supabase Auth
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);


  const fetchProfile = useCallback(async (user: User) => {
    setDbError(null);
    try {
        const { data, error } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code === '42P01') { // "undefined_table"
            console.error("Database setup error: 'profiles' table not found.", error);
            setDbError("The required 'profiles' table is missing from your database.");
            setProfile(null);
            return;
        }

        if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
            throw error;
        }
        
        if (data) {
            setProfile(data);
        } else {
            console.log("Profile not found for user, creating one as a fallback.");
            const newProfile: UserProfile = {
                id: user.id,
                username: user.user_metadata.full_name || user.email?.split('@')[0] || 'New User',
                avatar_url: user.user_metadata.avatar_url,
                subscription_tier: 'free',
                image_credits: 5
            };
            const { data: insertedData, error: insertError } = await supabase!
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();

            if (insertError) throw insertError;
            
            setProfile(insertedData);
        }
    } catch (error: any) {
        console.error('Error fetching/creating profile:', error.message || error);
        if (error.code === '42P01') {
            setDbError("The required 'profiles' table is missing from your database.");
        } else {
            console.error("An unexpected database error occurred:", error);
        }
        setProfile(null);
    }
  }, []);
  
  const getSessionAndProfile = useCallback(async () => {
    const { data: { session }, error } = await supabase!.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      setLoading(false);
      return;
    }
    const user = session?.user ?? null;
    setCurrentUser(user);
    if (user) {
        await fetchProfile(user);
    }
    setLoading(false);
  }, [fetchProfile]);
  
  useEffect(() => {
    getSessionAndProfile();

    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        const user = session?.user ?? null;
        setCurrentUser(user);
        if (user) {
            await fetchProfile(user);
        } else {
            setProfile(null);
        }
        if (_event === 'SIGNED_IN' || _event === 'USER_UPDATED') {
          setLoading(false);
        }
      }
    );

    const profileSubscription = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${currentUser?.id}` },
        (payload) => {
          console.log('Realtime profile update received!', payload);
          setProfile(payload.new as UserProfile);
        }
      )
      .subscribe();

    return () => {
      subscription?.unsubscribe();
      supabase.removeChannel(profileSubscription);
    };
  }, [fetchProfile, getSessionAndProfile, currentUser?.id]);
  
  const login = async (email: string, password_hash: string) => {
    const { error } = await supabase!.auth.signInWithPassword({
        email,
        password: password_hash,
    });
    if (error) throw error;
  };
  
  const signup = async (username: string, email: string, password_hash: string) => {
    const { data, error } = await supabase!.auth.signUp({
        email,
        password: password_hash,
        options: {
          data: {
            username,
          },
        }
    });
    if (error) throw error;
    return data;
  };
  
  const logout = async () => {
    const { error } = await supabase!.auth.signOut();
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase!.auth.signInWithOAuth({
        provider: 'google',
    });
    if (error) throw error;
  };

  const decrementCredits = async () => {
    if (!currentUser || !profile || profile.subscription_tier !== 'free' || profile.image_credits <= 0) return;

    const newCredits = profile.image_credits - 1;
    // The realtime subscription will handle updating the local state.
    // We just need to update the database.
    const { error } = await supabase!
      .from('profiles')
      .update({ image_credits: newCredits })
      .eq('id', currentUser.id);

    if (error) {
      console.error('Error decrementing credits:', error);
    }
  };

  const handleRetry = () => {
    setDbError(null);
    setLoading(true);
    getSessionAndProfile();
  };

  const value = {
    currentUser,
    profile,
    loading,
    login,
    signup,
    logout,
    loginWithGoogle,
    decrementCredits,
  };

  if (dbError) {
    return <DatabaseErrorDisplay sqlScript={PROFILES_TABLE_SETUP_SQL} onRetry={handleRetry} />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};