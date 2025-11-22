import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { usePacienteData } from '../../Hooks/usePacienteData';
import { supabase } from '../../Lib/supabaseClient';

export default function ScrProximaCita({ navigation }: any) {
  const { pacienteData, loading: loadingPaciente } = usePacienteData();
  const [proximaCita, setProximaCita] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pacienteData) {
      cargarProximaCita();
    }
  }, [pacienteData]);

  const cargarProximaCita = async () => {
    try {
      setLoading(true);

      // Buscar la próxima cita del paciente (fecha >= hoy)
      const hoy = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('Citas')
        .select('*')
        .eq('paciente_rut', pacienteData?.rut)
        .gte('fecha', hoy)
        .order('fecha', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProximaCita(data);
    } catch (err: any) {
      console.error('Error cargando próxima cita:', err);
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
        <Text style={styles.title}>Mi Próxima Cita</Text>

        {proximaCita ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>📅 Cita Programada</Text>
            </View>
            
            <View style={styles.cardBody}>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha:</Text>
                <Text style={styles.value}>
                  {new Date(proximaCita.fecha).toLocaleDateString('es-CL', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Hora:</Text>
                <Text style={styles.value}>{proximaCita.hora || 'Por confirmar'}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Motivo:</Text>
                <Text style={styles.value}>{proximaCita.motivo || 'Consulta general'}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Estado:</Text>
                <View style={[
                  styles.badge,
                  proximaCita.estado === 'Confirmada' && styles.badgeConfirmada,
                  proximaCita.estado === 'Pendiente' && styles.badgePendiente,
                  proximaCita.estado === 'Cancelada' && styles.badgeCancelada,
                ]}>
                  <Text style={styles.badgeText}>
                    {proximaCita.estado || 'Confirmada'}
                  </Text>
                </View>
              </View>

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