import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { usePacienteData } from '../../Hooks/usePacienteData';
import { supabase } from '../../Lib/supabaseClient';

// ====================== HELPERS DE FECHA ======================

// Parsea un valor que viene de Supabase (date/string) a Date local (sin desfase)
function parseLocalDateFromSupabaseDate(input: string | Date): Date {
  if (input instanceof Date) {
    return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  }

  const str = String(input);
  const ymd = str.slice(0, 10); // 'YYYY-MM-DD'
  const [yStr, mStr, dStr] = ymd.split('-');
  const y = Number(yStr);
  const m = Number(mStr);
  const d = Number(dStr);
  return new Date(y, m - 1, d);
}

// Formatea la fecha bonita en español
function formatFechaBonita(fecha: string | Date): string {
  const d = parseLocalDateFromSupabaseDate(fecha);
  return d.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// =============================================================

export default function ScrProximaCita({ navigation }: any) {
  const { pacienteData, loading: loadingPaciente } = usePacienteData();
  const [proximaCita, setProximaCita] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pacienteData?.id) {
      cargarProximaCita(pacienteData.id);
    }
  }, [pacienteData?.id]);

  const cargarProximaCita = async (pacienteId: string) => {
    try {
      setLoading(true);

      // MISMA LÓGICA DE ScrBandejaSolicitudes, PERO FILTRANDO POR paciente_id
      const { data, error } = await supabase
        .from('cita')
        .select('id, fecha, hora, motivo, estado, notas, paciente_id')
        .eq('paciente_id', pacienteId)
        .in('estado', ['pendiente', 'aceptada'])
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });

      console.log('[ScrProximaCita] pacienteId:', pacienteId);
      console.log('[ScrProximaCita] data recibida:', data);
      console.log('[ScrProximaCita] error:', error);

      if (error) {
        console.error('Error cargando citas del paciente:', error);
        setProximaCita(null);
        return;
      }

      // Primera cita de la lista ordenada = “próxima”
      const row = data && data.length > 0 ? data[0] : null;
      setProximaCita(row);
    } catch (err: any) {
      console.error('Error cargando próxima cita (catch):', err);
      setProximaCita(null);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPaciente || loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#FFD84D" />
        <Text style={{ marginTop: 10, color: '#48718d' }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi Próxima Cita</Text>

        {proximaCita ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>📅 Cita Programada</Text>
            </View>

            <View style={styles.cardBody}>
              {/* FECHA */}
              <View style={styles.row}>
                <Text style={styles.label}>Fecha:</Text>
                <Text style={styles.value}>
                  {proximaCita.fecha
                    ? formatFechaBonita(proximaCita.fecha)
                    : 'Sin fecha'}
                </Text>
              </View>

              <View style={styles.divider} />

              {/* HORA */}
              <View style={styles.row}>
                <Text style={styles.label}>Hora:</Text>
                <Text style={styles.value}>
                  {proximaCita.hora
                    ? String(proximaCita.hora).slice(0, 5)
                    : 'Por confirmar'}
                </Text>
              </View>

              <View style={styles.divider} />

              {/* MOTIVO */}
              <View style={styles.row}>
                <Text style={styles.label}>Motivo:</Text>
                <Text style={styles.value}>
                  {proximaCita.motivo || 'Consulta general'}
                </Text>
              </View>

              <View style={styles.divider} />

              {/* ESTADO */}
              <View style={styles.row}>
                <Text style={styles.label}>Estado:</Text>
                {(() => {
                  const raw = proximaCita.estado || 'pendiente';
                  const estado = String(raw).toLowerCase();
                  const label =
                    raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();

                  return (
                    <View
                      style={[
                        styles.badge,
                        estado === 'confirmada' && styles.badgeConfirmada,
                        estado === 'aceptada' && styles.badgeConfirmada,
                        estado === 'pendiente' && styles.badgePendiente,
                        estado === 'cancelada' && styles.badgeCancelada,
                      ]}
                    >
                      <Text style={styles.badgeText}>{label}</Text>
                    </View>
                  );
                })()}
              </View>

              {/* NOTAS */}
              {proximaCita.notas && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.notasContainer}>
                    <Text style={styles.label}>Notas:</Text>
                    <Text style={styles.notas}>{proximaCita.notas}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No tienes citas programadas</Text>
            <Text style={styles.emptySubtext}>
              Puedes solicitar una hora desde el calendario.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    padding: 24,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#48718d',
    marginBottom: 30,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  cardHeader: {
    backgroundColor: '#48718d',
    padding: 16,
  },

  cardHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },

  cardBody: {
    padding: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },

  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    textTransform: 'capitalize',
  },

  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeConfirmada: {
    backgroundColor: '#4CAF50',
  },

  badgePendiente: {
    backgroundColor: '#FF9800',
  },

  badgeCancelada: {
    backgroundColor: '#F44336',
  },

  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  notasContainer: {
    paddingTop: 8,
  },

  notas: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },

  emptyCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 40,
    marginBottom: 30,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },

  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  btn: {
    backgroundColor: '#FFD84D',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },

  btnText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});






