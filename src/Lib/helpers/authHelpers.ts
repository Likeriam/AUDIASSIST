import { supabase } from '../supabaseClient';

/**
 * Busca el email asociado a un RUT
 * Busca en las tablas: Paciente y Medico
 */
export async function getEmailByRut(rut: string): Promise<string | null> {
  try {
    console.log('Buscando email para RUT:', rut);

    // Buscar en tabla Paciente (usa maybeSingle para evitar error si no hay filas)
    const { data: pacienteData, error: pacienteError } = await supabase
      .from('Paciente')
      .select('user_id')
      .eq('rut', rut)
      .maybeSingle();

    if (pacienteError) {
      console.warn('Error consultando Paciente:', pacienteError.message ?? pacienteError);
    }

    if (pacienteData && pacienteData.user_id) {
      console.log('RUT encontrado en Paciente, user_id:', pacienteData.user_id);

      // Buscar el email en la tabla usuarios (también maybeSingle)
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('email')
        .eq('id', pacienteData.user_id)
        .maybeSingle();

      if (usuarioError) {
        console.warn('Error consultando usuario por user_id (Paciente):', usuarioError.message ?? usuarioError);
      }

      if (usuarioData && usuarioData.email) {
        console.log('Email encontrado (Paciente):', usuarioData.email);
        return usuarioData.email;
      } else {
        console.log('No se encontró email para user_id (Paciente).');
      }
    } else {
      console.log('RUT no encontrado en Paciente, o no tiene user_id.');
    }

    // Si no está en Paciente, buscar en Medico (también maybeSingle)
    const { data: medicoData, error: medicoError } = await supabase
      .from('Medico')
      .select('user_id')
      .eq('rut', rut)
      .maybeSingle();

    if (medicoError) {
      console.warn('Error consultando Medico:', medicoError.message ?? medicoError);
    }

    if (medicoData && medicoData.user_id) {
      console.log('RUT encontrado en Medico, user_id:', medicoData.user_id);

      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('email')
        .eq('id', medicoData.user_id)
        .maybeSingle();

      if (usuarioError) {
        console.warn('Error consultando usuario por user_id (Medico):', usuarioError.message ?? usuarioError);
      }

      if (usuarioData && usuarioData.email) {
        console.log('Email encontrado (Medico):', usuarioData.email);
        return usuarioData.email;
      } else {
        console.log('No se encontró email para user_id (Medico).');
      }
    } else {
      console.log('RUT no encontrado en Medico, o no tiene user_id.');
    }

    console.log('RUT no encontrado en ninguna tabla o no está enlazado a usuario.');
    return null;
  } catch (error) {
    console.error('Error buscando email por RUT (catch):', error);
    return null;
  }
}

/**
 * Limpia el formato del RUT (quita puntos y guiones)
 * Ejemplo: "12.345.678-9" → "123456789"
 */
export function cleanRut(rut: string): string {
  return rut.replace(/\./g, '').replace(/-/g, '').trim();
}