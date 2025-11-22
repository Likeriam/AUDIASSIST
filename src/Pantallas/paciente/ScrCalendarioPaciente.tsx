import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { usePacienteData } from '../../Hooks/usePacienteData';
import { supabase } from '../../Lib/supabaseClient';

export default function ScrCalendarioPaciente({ navigation }: any) {
  const { pacienteData, loading: loadingPaciente } = usePacienteData();
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pacienteData) {
      cargarCitas();
    }
  }, [pacienteData]);

  const cargarCitas = async () => {
    try {
      setLoading(true);

      // Buscar todas las citas del paciente
      const { data, error } = await supabase
        .from('Citas')
        .select('*')
        .eq('paciente_rut', pacienteData?.rut)
        .order('fecha', { ascending: true });

      if (error) throw error;

      setCitas(data || []);
    } catch (err: any) {
      console.error('Error cargando citas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPaciente || loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD84D" />
        <Text style={{ marginTop: 10, color: '#48718d' }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi Calendario</Text>

        {citas.length > 0 ? (
          <>
            <Text style={styles.subtitle}>
              {citas.length} {citas.length === 1 ? 'cita registrada' : 'citas registradas'}
            </Text>
            
            {citas.map((cita, index) => {
              const fechaCita = new Date(cita.fecha);
              const hoy = new Date();
              hoy.setHours(0, 0, 0, 0);
              const esPasada = fechaCita < hoy;

              return (
                <View key={cita.id || index} style={[
                  styles.card,
                  esPasada && styles.cardPasada
                ]}>
                  <View style={[
                    styles.cardHeader,
                    esPasada && styles.cardHeaderPasada
                  ]}>
                    <Text style={styles.cardDate}>
                      {fechaCita.toLocaleDateString('es-CL', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                    {esPasada && (
                      <Text style={styles.pasadaLabel}>Pasada</Text>
                    )}
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.row}>
                      <Text style={styles.label}>⏰ Hora:</Text>
                      <Text style={styles.value}>{cita.hora || 'Por confirmar'}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                      <Text style={styles.label}>📋 Motivo:</Text>
                      <Text style={styles.value}>{cita.motivo || 'Consulta general'}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                      <Text style={styles.label}>Estado:</Text>
                      <View style={[
                        styles.badge,
                        cita.estado === 'Confirmada' && styles.badgeConfirmada,
                        cita.estado === 'Pendiente' && styles.badgePendiente,
                        cita.estado === 'Cancelada' && styles.badgeCancelada,
                      ]}>
                        <Text style={styles.badgeText}>
                          {cita.estado || 'Confirmada'}
                        </Text>
                      </View>
                    </View>

                    {cita.notas && (
                      <>
                        <View style={styles.divider} />
                        <View style={styles.notasContainer}>
                          <Text style={styles.label}>📝 Notas:</Text>
                          <Text style={styles.notas}>{cita.notas}</Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              );
            })}
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No tienes citas registradas</Text>
            <Text style={styles.emptySubtext}>
              Contacta a tu médico para agendar una cita
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
    backgroundColor: '#f8f9fa',
  },

  content: {
    padding: 24,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#48718d',
    marginBottom: 10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  cardPasada: {
    opacity: 0.7,
  },

  cardHeader: {
    backgroundColor: '#48718d',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardHeaderPasada: {
    backgroundColor: '#999',
  },

  cardDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
    flex: 1,
  },

  pasadaLabel: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  cardBody: {
    padding: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },

  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
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
    fontSize: 12,
    fontWeight: '600',
  },

  notasContainer: {
    paddingTop: 4,
  },

  notas: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
    lineHeight: 18,
  },

  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    marginTop: 20,
  },

  btnText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});