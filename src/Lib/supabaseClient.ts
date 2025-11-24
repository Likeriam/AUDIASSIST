import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Intentamos leer desde expo Constants (extra) y luego desde process.env
const extra = (Constants.manifest && (Constants.manifest as any).extra) || {};
const supabaseUrl =
  (extra?.supabaseUrl as string) ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  '';
const supabaseAnonKey =
  (extra?.supabaseAnonKey as string) ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  '';

// Mensajes de diagnóstico (no imprimen claves)
console.log('DEBUG - supabaseClient cargado');
console.log('DEBUG - supabaseUrl presente?', !!supabaseUrl);
console.log('DEBUG - supabaseAnonKey presente?', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'WARNING - Falta supabaseUrl o supabaseAnonKey. Revisa .env y app.config.js'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});