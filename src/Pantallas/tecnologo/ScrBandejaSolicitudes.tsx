import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../../Lib/supabaseClient';

// ==== HELPERS DE FECHA LOCAL ======================================

// Parsea 'YYYY-MM-DD' como fecha local (NO UTC)
function parseLocalDateFromYMD(ymd: string): Date {
  const [yearStr, monthStr, dayStr] = ymd.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr); // 1–12
  const day = Number(dayStr);     // 1–31
  return new Date(year, month - 1, day); // fecha en horario local
}

// Formatea 'YYYY-MM-DD' a texto en español usando fecha local
function formatFechaBonitaLocal(ymd: string): string {
  const fechaObj = parseLocalDateFromYMD(ymd.slice(0, 10)); // por seguridad
  return fechaObj.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// =================================================================

export default function ScrCalendarioTecnologo({ navigation }: any) {
  const [citasPendientes, setCitasPendientes] = useState<any[]>([]);
  const [citasAceptadas, setCitasAceptadas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCitasPendientes();
  }, []);

  const cargarCitasPendientes = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('cita')
        .select(
          'id, fecha, hora, motivo, estado, paciente:paciente_id (nombre, apellido, rut)'
        )
        .in('estado', ['pendiente', 'aceptada']) // trae pendientes y aceptadas
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });

      if (error) {
        console.error('Error cargando citas:', error);
        Alert.alert(
          'Error',
          'No se pudieron cargar las citas. Intenta nuevamente.'
        );
        return;
      }

      const todas = data || [];
      const pendientes = todas.filter((c: any) => c.estado === 'pendiente');
      const aceptadas = todas.filter((c: any) => c.estado === 'aceptada');

      setCitasPendientes(pendientes);
      setCitasAceptadas(aceptadas);
    } catch (e) {
      console.error('Error inesperado cargando citas:', e);
      Alert.alert(
        'Error',
        'No se pudieron cargar las citas. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const aceptarCita = async (citaId: string) => {
    try {
      const { error } = await supabase
        .from('cita')
        .update({ estado: 'aceptada' })
        .eq('id', citaId);

      if (error) {
        console.error('Error al aceptar cita:', error);
        Alert.alert(
          'Error',
          'No se pudo aceptar la cita. Intenta nuevamente.'
        );
        return;
      }

      // mover de pendientes a aceptadas
      setCitasPendientes(prevPendientes => {
        const restantes = prevPendientes.filter(c => c.id !== citaId);
        const encontrada = prevPendientes.find(c => c.id === citaId);
        if (encontrada) {
          setCitasAceptadas(prevAceptadas => [
            ...prevAceptadas,
            { ...encontrada, estado: 'aceptada' },
          ]);
        }
        return restantes;
      });

      Alert.alert('Cita aceptada', 'La cita ha sido marcada como aceptada.');
    } catch (e) {
      console.error('Error inesperado al aceptar cita:', e);
      Alert.alert(
        'Error',
        'No se pudo aceptar la cita. Intenta nuevamente.'
      );
    }
  };

  const cancelarCita = async (citaId: string) => {
    try {
      const { error } = await supabase
        .from('cita')
        .delete()
        .eq('id', citaId);

      if (error) {
        console.error('Error al cancelar cita:', error);
        Alert.alert(
          'Error',
          'No se pudo cancelar la cita. Intenta nuevamente.'
        );
        return;
      }

      setCitasPendientes(prev => prev.filter(c => c.id !== citaId));
      setCitasAceptadas(prev => prev.filter(c => c.id !== citaId));

      Alert.alert(
        'Cita cancelada',
        'La cita ha sido cancelada y el horario está disponible nuevamente.'
      );
    } catch (e) {
      console.error('Error inesperado al cancelar cita:', e);
      Alert.alert(
        'Error',
        'No se pudo cancelar la cita. Intenta nuevamente.'
      );
    }
  };

  if (loading) {
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

  const renderCard = (cita: any, mostrarAcciones: boolean) => {
    const paciente = cita.paciente || {};
    const nombrePaciente =
      `${paciente.nombre ?? ''} ${paciente.apellido ?? ''}`.trim() ||
      'Paciente sin nombre';
    const rut = paciente.rut || 'Sin RUT registrado';

    // AQUÍ estaba el desfase: new Date('YYYY-MM-DD') → UTC → día anterior
    const fechaBonita = formatFechaBonitaLocal(String(cita.fecha));
    const horaBonita = cita.hora ? String(cita.hora).slice(0, 5) : 'Sin hora';

    return (
      <View key={cita.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>{nombrePaciente}</Text>
          <Text style={styles.cardHeaderRut}>{rut}</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{fechaBonita}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Hora:</Text>
            <Text style={styles.value}>{horaBonita}</Text>
          </View>

          <View style={styles.divider} />

          <View>
            <Text style={styles.label}>Motivo:</Text>
            <Text style={styles.motivoText}>
              {cita.motivo || 'Sin motivo especificado'}
            </Text>
          </View>

          {mostrarAcciones ? (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.acceptBtn}
                activeOpacity={0.85}
                onPress={() =>
                  Alert.alert(
                    'Aceptar cita',
                    '¿Desea marcar esta cita como aceptada?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      {
                        text: 'Aceptar',
                        style: 'destructive',
                        onPress: () => aceptarCita(cita.id),
                      },
                    ]
                  )
                }
              >
                <Text style={styles.acceptBtnText}>Aceptar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                activeOpacity={0.85}
                onPress={() =>
                  Alert.alert(
                    'Cancelar cita',
                    '¿Desea cancelar esta cita? El horario quedará disponible para otros pacientes.',
                    [
                      { text: 'No', style: 'cancel' },
                      {
                        text: 'Sí, cancelar',
                        style: 'destructive',
                        onPress: () => cancelarCita(cita.id),
                      },
                    ]
                  )
                }
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionsRow}>
              <Text style={styles.estadoAceptada}>Estado: aceptada</Text>

              <TouchableOpacity
                style={styles.cancelBtn}
                activeOpacity={0.85}
                onPress={() =>
                  Alert.alert(
                    'Cancelar cita',
                    '¿Desea cancelar esta cita? El horario quedará disponible para otros pacientes.',
                    [
                      { text: 'No', style: 'cancel' },
                      {
                        text: 'Sí, cancelar',
                        style: 'destructive',
                        onPress: () => cancelarCita(cita.id),
                      },
                    ]
                  )
                }
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER con logo + Volver */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Image
            source={require('../../../assets/logoAudiassist2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.main}>
        <Text style={styles.title}>Citas de pacientes</Text>
        <Text style={styles.subtitle}>
          Revisa las citas solicitadas por los pacientes y márcalas como
          aceptadas o canceladas.
        </Text>

        <TouchableOpacity
          style={styles.refreshBtn}
          activeOpacity={0.85}
          onPress={cargarCitasPendientes}
        >
          <Text style={styles.refreshText}>Actualizar lista</Text>
        </TouchableOpacity>

        {/* Sección: pendientes */}
        <Text style={styles.sectionTitle}>Solicitudes pendientes</Text>
        {citasPendientes.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No hay citas pendientes</Text>
            <Text style={styles.emptySubtext}>
              Cuando los pacientes soliciten horas, aparecerán aquí.
            </Text>
          </View>
        ) : (
          citasPendientes.map(cita => renderCard(cita, true))
        )}

        {/* Sección: aceptadas */}
        <Text style={styles.sectionTitle}>Citas aceptadas</Text>
        {citasAceptadas.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No hay citas aceptadas</Text>
            <Text style={styles.emptySubtext}>
              Cuando aceptes una solicitud, la verás en esta sección.
            </Text>
          </View>
        ) : (
          citasAceptadas.map(cita => renderCard(cita, false))
        )}
      </ScrollView>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    backgroundColor: '#1a2942',
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  backBtn: {
    borderWidth: 1,
    borderColor: '#FFD84D',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  backText: {
    color: '#FFD84D',
    fontSize: 14,
    fontWeight: '600',
  },

  main: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },

  refreshBtn: {
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#FFD84D',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  refreshText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#48718d',
    marginBottom: 10,
    marginTop: 10,
  },

  emptyBox: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  cardHeader: {
    backgroundColor: '#48718d',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  cardHeaderRut: {
    fontSize: 13,
    color: '#e6e6e6',
  },

  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    marginLeft: 10,
    textAlign: 'right',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  motivoText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    alignItems: 'center',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#FFD84D',
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 6,
  },
  acceptBtnText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  cancelBtnText: {
    color: '#F44336',
    fontSize: 15,
    fontWeight: '600',
  },

  estadoAceptada: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginRight: 8,
  },
});
