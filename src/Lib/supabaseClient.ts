import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

console.log('DEBUG - Constants.expoConfig.extra:', Constants.expoConfig?.extra);

const supabaseUrl = (Constants.expoConfig?.extra?.supabaseUrl as string) ?? '';
const supabaseAnonKey = (Constants.expoConfig?.extra?.supabaseAnonKey as string) ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase en Constants.expoConfig.extra');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
