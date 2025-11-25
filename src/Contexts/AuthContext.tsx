import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../Lib/supabaseClient';
import { getEmailByRut } from '../Lib/helpers/authHelpers';
import { Session, User } from '@supabase/supabase-js';

type UserRole = 'admin' | 'tecnologo' | 'paciente' | null;

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
  signUp: (
    email: string,
    password: string,
    rol: UserRole,
    extraData: any
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión al iniciar y suscribirse a cambios de auth
  useEffect(() => {
    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth event:', _event);
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
      const {
        data: { session },
      } = await supabase.auth.getSession();

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

  // Lee desde la tabla usuario (singular)
  const loadUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('id, email, rol')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUserData(data as UserData);
      console.log('User data loaded:', data);
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserData(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
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

  // Login usando RUT (helper getEmailByRut)
  const signInWithRut = async (rut: string, password: string) => {
    try {
      console.log('Intentando login con RUT:', rut);

      const email = await getEmailByRut(rut);

      if (!email) {
        throw new Error('RUT no encontrado. Verifica que esté registrado.');
      }

      console.log('Email encontrado, intentando login...');

      const { error } = await supabase.auth.signInWithPassword({
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

  // REGISTRO usando el esquema: auth.users + usuario + paciente/tecnologo + correo_autorizado
  const signUp = async (
    email: string,
    password: string,
    rol: UserRole,
    extraData: any
  ) => {
    try {
      // Normalizar email
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        throw new Error('El email es obligatorio.');
      }

      // === REGISTRO DE PACIENTE ===
      if (rol === 'paciente') {
        // 1. Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('No se pudo crear el usuario');

        const user = authData.user;

        // 2. Insertar fila en la tabla usuario (perfil general)
        const { error: usuarioError } = await supabase.from('usuario').insert({
          id: user.id, // mismo id de auth.users
          email: normalizedEmail,
          rol: 'paciente',
          nombre_mostrar:
            extraData?.nombre && extraData?.apellido
              ? `${extraData.nombre} ${extraData.apellido}`.trim()
              : extraData?.nombre ?? null,
          estado: 'activo',
        });

        if (usuarioError) {
          console.error('Error insertando en usuario (paciente):', usuarioError);
          throw usuarioError;
        }

        // 3. Insertar fila en tabla paciente (perfil específico)
        const { error: pacienteError } = await supabase.from('paciente').insert({
          usuario_id: user.id,
          rut: extraData?.rut ?? '',
          nombre: extraData?.nombre ?? '',
          apellido: extraData?.apellido ?? '',
          telefono: extraData?.telefono ?? null,
          correo: normalizedEmail,
        });

        if (pacienteError) {
          console.error('Error insertando en paciente:', pacienteError);
          throw pacienteError;
        }

        console.log('Sign up successful (paciente)');
        return;
      }

      // === REGISTRO DE TECNÓLOGO CON correo_autorizado ===
      if (rol === 'tecnologo') {
        const rut = extraData?.rut ?? '';
        const nombre = extraData?.nombre ?? '';
        const apellido = extraData?.apellido ?? '';
        const telefono = extraData?.telefono ?? null;
        const codigoAutorizacion: string =
          extraData?.codigo_autorizacion?.trim() ?? '';

        if (!rut || !nombre || !apellido) {
          throw new Error(
            'RUT, nombre y apellido son obligatorios para registrar un tecnólogo.'
          );
        }

        if (!codigoAutorizacion) {
          throw new Error('Debes ingresar el código de autorización.');
        }

        // 1. Validar que el correo esté autorizado en correo_autorizado
        const {
          data: autorizacion,
          error: autorizacionError,
        } = await supabase
          .from('correo_autorizado')
          .select('*')
          .eq('email', normalizedEmail)
          .eq('rol', 'tecnologo')
          .single();

        if (autorizacionError || !autorizacion) {
          console.error(
            'Error consultando correo_autorizado:',
            autorizacionError
          );
          throw new Error(
            'Este correo no está autorizado para registrarse como tecnólogo.'
          );
        }

        if (!autorizacion.permitido) {
          throw new Error(
            'Este correo fue deshabilitado para registro como tecnólogo.'
          );
        }

        if (autorizacion.usado) {
          throw new Error(
            'El código de autorización ya fue utilizado. Solicita uno nuevo.'
          );
        }

        if (autorizacion.code_expires_at) {
          const expira = new Date(autorizacion.code_expires_at);
          if (expira.getTime() < Date.now()) {
            throw new Error('El código de autorización ha expirado.');
          }
        }

        // Comparar código ingresado con code_hash
        if (autorizacion.code_hash) {
          if (autorizacion.code_hash !== codigoAutorizacion) {
            throw new Error('El código de autorización es incorrecto.');
          }
        }

        // 2. Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('No se pudo crear el usuario');

        const user = authData.user;

        // 3. Insertar fila en la tabla usuario (perfil general)
        const { error: usuarioError } = await supabase.from('usuario').insert({
          id: user.id,
          email: normalizedEmail,
          rol: 'tecnologo',
          nombre_mostrar: `${nombre} ${apellido}`.trim(),
          estado: 'activo',
        });

        if (usuarioError) {
          console.error('Error insertando en usuario (tecnologo):', usuarioError);
          throw usuarioError;
        }

        // 4. Insertar fila en tabla tecnologo (perfil específico)
        const { error: tecnologoError } = await supabase
          .from('tecnologo')
          .insert({
            usuario_id: user.id,
            rut,
            nombre,
            apellido,
            telefono,
            correo: normalizedEmail,
          });

        if (tecnologoError) {
          console.error('Error insertando en tecnologo:', tecnologoError);
          throw tecnologoError;
        }

        // 5. Marcar el correo_autorizado como usado
        const { error: updateAutError } = await supabase
          .from('correo_autorizado')
          .update({ usado: true })
          .eq('id', autorizacion.id);

        if (updateAutError) {
          console.error(
            'No se pudo marcar el código de autorización como usado:',
            updateAutError
          );
        }

        console.log('Sign up successful (tecnologo)');
        return;
      }

      // Otros roles no soportados por el registro automático
      throw new Error(
        'Por ahora el registro automático solo está soportado para pacientes y tecnólogos.'
      );
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
