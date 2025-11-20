import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../Lib/supabaseClient';
import { getEmailByRut } from '../Lib/helpers/authHelpers';
import { Session, User } from '@supabase/supabase-js';

type UserRole = 'admin' | 'medico' | 'paciente' | null;

interface UserData {
  id: string;
  email: string;
  rol: UserRole;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithRut: (rut: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, rol: UserRole, extraData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión al iniciar
  useEffect(() => {
    loadSession();

    // Escuchar cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setUserData(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, email, rol')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUserData(data);
      console.log('User data loaded:', data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Sign in successful');
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signInWithRut = async (rut: string, password: string) => {
    try {
      console.log('Intentando login con RUT:', rut);
      
      // Buscar el email asociado al RUT
      const email = await getEmailByRut(rut);

      if (!email) {
        throw new Error('RUT no encontrado. Verifica que esté registrado.');
      }

      console.log('Email encontrado, intentando login...');

      // Hacer login con el email encontrado
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Login con RUT exitoso');
    } catch (error: any) {
      console.error('Error en login con RUT:', error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    rol: UserRole,
    extraData: any
  ) => {
    try {
      // 1. Crear usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      // 2. Crear registro en tabla usuarios
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .insert({
          id: authData.user.id,
          email,
          rol,
        });

      if (usuarioError) throw usuarioError;

      // 3. Crear registro en tabla específica según rol
      if (rol === 'paciente') {
        const { error: pacienteError } = await supabase
          .from('Paciente')
          .insert({
            rut: extraData.rut,
            user_id: authData.user.id,
            nombre: extraData.nombre,
            apellido: extraData.apellido,
            telefono: extraData.telefono || null,
            activo: true,
          });

        if (pacienteError) throw pacienteError;
      } else if (rol === 'medico') {
        const { error: medicoError } = await supabase
          .from('Medico')
          .insert({
            rut: extraData.rut,
            user_id: authData.user.id,
            nombre: extraData.nombre,
            apellido: extraData.apellido,
            especialidad: extraData.especialidad || null,
            telefono: extraData.telefono || null,
            activo: true,
          });

        if (medicoError) throw medicoError;
      }

      console.log('Sign up successful');
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setUser(null);
      setUserData(null);

      console.log('Sign out successful');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userData,
        loading,
        signIn,
        signInWithRut,
        signUp,
        signOut,
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