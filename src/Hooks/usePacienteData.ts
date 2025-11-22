import { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { supabase } from '../Lib/supabaseClient';

export interface PacienteData {
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  user_id: string;
  created_at: string;
}

export const usePacienteData = () => {
  const { user } = useAuth();
  const [pacienteData, setPacienteData] = useState<PacienteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      cargarDatosPaciente();
    }
  }, [user?.id]);

  const cargarDatosPaciente = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('Paciente')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (supabaseError) throw supabaseError;

      setPacienteData(data);
    } catch (err: any) {
      console.error('Error cargando datos del paciente:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refrescarDatos = () => {
    cargarDatosPaciente();
  };

  return {
    pacienteData,
    loading,
    error,
    refrescarDatos,
  };
};