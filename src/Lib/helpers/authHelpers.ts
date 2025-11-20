import { supabase } from '../supabaseClient';

/**
 * Busca el email asociado a un RUT
 * Busca en las tablas: Paciente y Medico
 */
export async function getEmailByRut(rut: string): Promise<string | null> {
  try {
    console.log('Buscando email para RUT:', rut);

    // Buscar en tabla Paciente
    const { data: pacienteData, error: pacienteError } = await supabase
      .from('Paciente')
      .select('user_id')
      .eq('rut', rut)
      .single();

    if (pacienteData && !pacienteError) {
      console.log('RUT encontrado en Paciente');
      
      // Buscar el email en la tabla usuarios
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('email')
        .eq('id', pacienteData.user_id)
        .single();

      if (usuarioData && !usuarioError) {
        console.log('Email encontrado:', usuarioData.email);
        return usuarioData.email;
      }
    }

    // Si no está en Paciente, buscar en Medico
    const { data: medicoData, error: medicoError } = await supabase
      .from('Medico')
      .select('user_id')
      .eq('rut', rut)
      .single();

    if (medicoData && !medicoError) {
      console.log('RUT encontrado en Medico');
      
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('email')
        .eq('id', medicoData.user_id)
        .single();

      if (usuarioData && !usuarioError) {
        console.log('Email encontrado:', usuarioData.email);
        return usuarioData.email;
      }
    }

    console.log('RUT no encontrado en ninguna tabla');
    return null;
    
  } catch (error) {
    console.error('Error buscando email por RUT:', error);
    return null;
  }
}

/**
 * Limpia el formato del RUT (quita puntos y guiones)
 * Ejemplo: "12.345.678-9" → "123456789"
 */
export function cleanRut(rut: string): string {
  return rut.replace(/\./g, '').replace(/-/g, '');
}