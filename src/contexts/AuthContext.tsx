import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Initial session load
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Session error:', error);
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        await upsertUser(data.session.user);
      }

      setLoading(false);
    };

    loadSession();

    // 🔹 Auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await upsertUser(session.user);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 🔹 Insert / Update user in DB
  const upsertUser = async (user: User) => {
    try {
      const { error } = await supabase.from('users').upsert(
        {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

      if (error) {
        console.error('User upsert error:', error.message);
      }
    } catch (err) {
      console.error('Unexpected upsert error:', err);
    }
  };

  // 🔹 Logout
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error.message);
    } else {
      setSession(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Hook
export const useAuth = () => useContext(AuthContext);
