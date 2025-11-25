import { supabase } from '../supabaseClient';

/**
 * Limpia el formato del RUT (quita puntos y guiones)
 * Ejemplo: "12.345.678-9" → "123456789"
 */
export function cleanRut(rut: string): string {
  return rut.replace(/\./g, '').replace(/-/g, '').trim();
}

/**
 * Busca el email asociado a un RUT.
 *
 * 1) Primero en la tabla "paciente"
 * 2) Si no lo encuentra, en la tabla "tecnologo"
 *
 * Soporta que el RUT esté guardado:
 * - limpio:  123456789
 * - con guión/puntos: 12.345.678-9
 */
export async function getEmailByRut(
  rut: string
): Promise<string | null> {
  try {
    const rutOriginal = rut.trim();
    const rutLimpio = cleanRut(rutOriginal);

    console.log(
      '[getEmailByRut] Buscando email para RUT:',
      rutOriginal,
      '->',
      rutLimpio
    );

    // ===========================
    // 1) BUSCAR EN TABLA PACIENTE
    // ===========================
    const {
      data: paciente,
      error: errorPaciente,
    } = await supabase
      .from('paciente')
      .select('correo, rut')
      .or(`rut.eq.${rutLimpio},rut.eq.${rutOriginal}`)
      .maybeSingle();

    if (errorPaciente) {
      console.log(
        '[getEmailByRut] Error buscando en paciente:',
        errorPaciente
      );
      // no retornamos aún: intentamos en tecnologo
    } else if (paciente) {
      console.log(
        '[getEmailByRut] RUT encontrado en tabla paciente. Registro:',
        paciente
      );

      if (!paciente.correo) {
        console.log(
          '[getEmailByRut] Paciente encontrado pero sin correo registrado'
        );
        return null;
      }

      return paciente.correo as string;
    } else {
      console.log(
        '[getEmailByRut] RUT no encontrado en tabla paciente, probando en tecnologo...'
      );
    }

    // ============================
    // 2) BUSCAR EN TABLA TECNOLOGO
    // ============================
    const {
      data: tecnologo,
      error: errorTecnologo,
    } = await supabase
      .from('tecnologo')
      .select('correo, rut')
      .or(`rut.eq.${rutLimpio},rut.eq.${rutOriginal}`)
      .maybeSingle();

    if (errorTecnologo) {
      console.log(
        '[getEmailByRut] Error buscando en tecnologo:',
        errorTecnologo
      );
      return null;
    }

    if (!tecnologo) {
      console.log(
        '[getEmailByRut] RUT no encontrado ni en paciente ni en tecnologo'
      );
      return null;
    }

    console.log(
      '[getEmailByRut] RUT encontrado en tabla tecnologo. Registro:',
      tecnologo
    );

    if (!tecnologo.correo) {
      console.log(
        '[getEmailByRut] Tecnólogo encontrado pero sin correo registrado'
      );
      return null;
    }

    return tecnologo.correo as string;
  } catch (error) {
    console.error('[getEmailByRut] Error buscando email por RUT:', error);
    return null;
  }
}
