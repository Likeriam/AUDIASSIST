import { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { supabase } from '../Lib/supabaseClient';

export interface PacienteData {
  id: string;
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  usuario_id: string;
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
        .from('paciente')
        .select('*')
        .eq('usuario_id', user?.id)
        .maybeSingle();

      if (supabaseError) throw supabaseError;

      setPacienteData(data as PacienteData);
    } catch (err: any) {
      console.error('Error cargando datos del paciente:', err);
      setError(err.message ?? 'Error desconocido');
      setPacienteData(null);
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