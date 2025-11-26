import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { supabase } from '../../Lib/supabaseClient';
import { usePacienteData } from '../../Hooks/usePacienteData';

const HOURS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

const ROW_HEIGHT = 52;

// Helpers de fecha
function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 domingo, 1 lunes...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Fecha local a 'YYYY-MM-DD'
function dateToKey(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 7 días: Lu–Do
function getWeekDays(start: Date) {
  const labels = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i);
    days.push({
      key: dateToKey(d),  // clave estable local
      label: labels[i],
      number: d.getDate(),
      date: d,
    });
  }
  return days;
}

function formatMonthYear(date: Date) {
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

// key tipo 'YYYY-MM-DD_HH:MM'
const slotKey = (dateStr: string, time: string) => `${dateStr}_${time}`;

export default function ScrCalendarioPaciente({ navigation }: any) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getMonday(new Date())
  );
  const weekDays = useMemo(
    () => getWeekDays(currentWeekStart),
    [currentWeekStart]
  );
  const monthLabel = useMemo(
    () => formatMonthYear(currentWeekStart),
    [currentWeekStart]
  );

  const { pacienteData } = usePacienteData();
  const pacienteId = pacienteData?.id;

  const [bookedSlots, setBookedSlots] = useState<Record<string, boolean>>({});
  const [selectedDayLabel, setSelectedDayLabel] = useState<string | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Horas disponibles (09:00 a 17:30 cada 30 min)
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    let hour = 9;
    let minute = 0;
    while (hour < 17 || (hour === 17 && minute <= 30)) {
      const hh = hour.toString().padStart(2, '0');
      const mm = minute.toString().padStart(2, '0');
      slots.push(`${hh}:${mm}`);
      minute += 30;
      if (minute >= 60) {
        minute = 0;
        hour += 1;
      }
    }
    return slots;
  }, []);

  // Cargar citas ocupadas de la semana (Lu–Do)
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const monday = currentWeekStart;
        const sunday = addDays(currentWeekStart, 6);

        const mondayStr = dateToKey(monday);
        const sundayStr = dateToKey(sunday);

        const { data, error } = await supabase
          .from('cita')
          .select('fecha, hora, estado')
          .gte('fecha', mondayStr)
          .lte('fecha', sundayStr)
          .neq('estado', 'cancelado');

        if (error) {
          console.log('Error cargando citas:', error);
          return;
        }

        const map: Record<string, boolean> = {};
        (data || []).forEach((cita: any) => {
          const fecha: string = cita.fecha;   // 'YYYY-MM-DD'
          const horaRaw: string = cita.hora;  // 'HH:MM:SS'
          const hora = horaRaw.slice(0, 5);   // 'HH:MM'
          map[slotKey(fecha, hora)] = true;
        });

        setBookedSlots(map);
      } catch (e) {
        console.log('Error inesperado cargando citas:', e);
      }
    };

    fetchBookedSlots();
  }, [currentWeekStart]);

  const openModalForCell = (dayIndex: number, _hourIndex: number) => {
    const day = weekDays[dayIndex];
    if (!day) return;

    setSelectedDayLabel(`${day.label} ${day.number}`);
    setSelectedDateStr(day.key); // 'YYYY-MM-DD'
    setSelectedTime(null);
    setModalOpen(true);
  };

  const handleSolicitarHora = async () => {
    if (!pacienteId) {
      Alert.alert(
        'Error',
        'No se pudo identificar al paciente. Intenta iniciar sesión nuevamente.'
      );
      return;
    }
    if (!selectedDateStr || !selectedTime) return;

    const fecha = selectedDateStr;
    const hora = `${selectedTime}:00`;

    try {
      const { error } = await supabase.from('cita').insert({
        paciente_id: pacienteId,
        fecha,
        hora,
        estado: 'pendiente',
      });

      if (error) {
        if (
          error.message &&
          error.message.toLowerCase().includes('duplicate key')
        ) {
          Alert.alert(
            'Horario no disponible',
            'La hora seleccionada ya fue tomada por otro paciente.'
          );
        } else {
          console.log('Error insertando cita:', error);
          Alert.alert(
            'Error',
            'No se pudo solicitar la hora. Intenta nuevamente.'
          );
        }
        return;
      }

      const key = slotKey(fecha, selectedTime);
      setBookedSlots(prev => ({ ...prev, [key]: true }));

      setModalOpen(false);
      setInfoMessage('Espera a que el tecnólogo acepte su hora');
    } catch (e) {
      console.log('Error inesperado al solicitar hora:', e);
      Alert.alert(
        'Error',
        'No se pudo solicitar la hora. Intenta nuevamente.'
      );
    }
  };

  const handleToday = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  return (
    <View style={styles.container}>
      {/* HEADER con logo + VOLVER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={require('../../../assets/logoAudiassist2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.headerBackBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Home_Paciente')}
          >
            <Text style={styles.headerBackText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SCROLL GENERAL */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CONTENIDO SUPERIOR */}
        <View style={styles.topContent}>
          <Text style={styles.title}>Calendario de citas</Text>
          <Text style={styles.subtitle}>
            Selecciona un día hábil y luego la hora para solicitar tu cita.
          </Text>

          <TouchableOpacity
            style={styles.reviewBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Proxima_Cita')}
          >
            <Text style={styles.reviewBtnText}>
              Revisar citas programadas
            </Text>
          </TouchableOpacity>

          {infoMessage && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{infoMessage}</Text>
            </View>
          )}
        </View>

        {/* CALENDARIO */}
        <View style={styles.calendarWrapper}>
          {/* Barra navegación calendario */}
          <View style={styles.calendarHeader}>
            <Text style={styles.monthLabel}>{monthLabel}</Text>

            <View style={styles.calendarHeaderRight}>
              <TouchableOpacity
                style={styles.todayBtn}
                activeOpacity={0.85}
                onPress={handleToday}
              >
                <Text style={styles.todayText}>Hoy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.arrowBtn}
                activeOpacity={0.85}
                onPress={handlePrevWeek}
              >
                <Text style={styles.arrowText}>{'<'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.arrowBtn}
                activeOpacity={0.85}
                onPress={handleNextWeek}
              >
                <Text style={styles.arrowText}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Marco del calendario (BORDE AZUL + TODO ADENTRO) */}
          <View style={styles.calendarFrame}>
            {/* Encabezado semana */}
            <View style={styles.weekHeaderRow}>
              <View style={styles.timeHeaderCell}>
                <Text style={styles.timeHeaderText}>Hora</Text>
              </View>
              {weekDays.map(day => {
                const dow = day.date.getDay(); // 0 domingo, 6 sábado
                const isWeekend = dow === 0 || dow === 6;
                return (
                  <View
                    key={day.key}
                    style={[
                      styles.dayHeaderCell,
                      isWeekend && styles.dayHeaderCellWeekend,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayLabel,
                        isWeekend && styles.dayLabelWeekend,
                      ]}
                    >
                      {day.label}
                    </Text>
                    <Text
                      style={[
                        styles.dayNumber,
                        isWeekend && styles.dayNumberWeekend,
                      ]}
                    >
                      {day.number}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Grilla */}
            <View style={styles.gridWrapper}>
              {/* Columna horas */}
              <View style={styles.timeColumn}>
                {HOURS.map(hour => (
                  <View key={hour} style={styles.timeCell}>
                    <Text style={styles.timeText}>{hour}</Text>
                  </View>
                ))}
              </View>

              {/* Celdas */}
              <View style={styles.daysGrid}>
                {HOURS.map((hour, rowIndex) => (
                  <View key={hour} style={styles.gridRow}>
                    {weekDays.map((day, colIndex) => {
                      const dateStr = day.key;
                      const dow = day.date.getDay();
                      const isWeekend = dow === 0 || dow === 6;

                      const cellKeyStr = slotKey(dateStr, hour);
                      const isBooked = bookedSlots[cellKeyStr];

                      return (
                        <TouchableOpacity
                          key={day.key + hour}
                          style={[
                            styles.gridCell,
                            isWeekend && styles.gridCellWeekend,
                            isBooked && styles.gridCellBooked,
                          ]}
                          activeOpacity={isBooked || isWeekend ? 1 : 0.6}
                          onPress={() =>
                            !isBooked &&
                            !isWeekend &&
                            openModalForCell(colIndex, rowIndex)
                          }
                        >
                          {isBooked && (
                            <View style={styles.gridEvent}>
                              <Text style={styles.gridEventText}>
                                Ocupado
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* MODAL HORA */}
      {modalOpen && (
        <TouchableWithoutFeedback onPress={() => setModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Selecciona la hora para {selectedDayLabel}
                </Text>

                <FlatList
                  data={timeSlots}
                  keyExtractor={item => item}
                  numColumns={3}
                  contentContainerStyle={styles.timeList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.timeSlot,
                        selectedTime === item && styles.timeSlotSelected,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setSelectedTime(item)}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          selectedTime === item &&
                            styles.timeSlotTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />

                <TouchableOpacity
                  style={[
                    styles.requestBtn,
                    !selectedTime && styles.requestBtnDisabled,
                  ]}
                  activeOpacity={selectedTime ? 0.85 : 1}
                  onPress={() => selectedTime && handleSolicitarHora()}
                >
                  <Text style={styles.requestBtnText}>Solicitar hora</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    backgroundColor: '#1a2942',
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  headerBackBtn: {
    borderWidth: 1,
    borderColor: '#FFD84D',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  headerBackText: {
    color: '#FFD84D',
    fontSize: 14,
    fontWeight: '600',
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  topContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#48718d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
  },

  reviewBtn: {
    marginTop: 16,
    backgroundColor: '#FFD84D',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
  },
  reviewBtnText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  infoBox: {
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD84D',
    padding: 10,
    backgroundColor: '#FFF9DF',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },

  calendarWrapper: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
  },

  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  calendarHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  todayBtn: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  todayText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  arrowBtn: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 4,
    backgroundColor: '#fff',
  },
  arrowText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },

  // Marco azul
  calendarFrame: {
    borderWidth: 3,
    borderColor: '#1a2942',
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },

  weekHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
  },
  timeHeaderCell: {
    width: 70,
    paddingVertical: 8,
    paddingLeft: 8,
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderLeftWidth: 1,
    borderColor: '#e0e0e0',
  },
  dayHeaderCellWeekend: {
    backgroundColor: '#f5f5f5',
  },
  dayLabel: {
    fontSize: 13,
    color: '#777',
  },
  dayLabelWeekend: {
    color: '#aaa',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dayNumberWeekend: {
    color: '#aaa',
  },

  gridWrapper: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },

  timeColumn: {
    width: 70,
    backgroundColor: '#fff',
  },
  timeCell: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingLeft: 8,
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeText: {
    fontSize: 12,
    color: '#777',
  },

  daysGrid: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  gridCell: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  gridCellWeekend: {
    backgroundColor: '#f7f7f7',
  },
  gridCellBooked: {
    backgroundColor: '#E6E0FF',
  },
  gridEvent: {
    flex: 1,
    margin: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#7C6CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridEventText: {
    fontSize: 11,
    color: '#7C6CFF',
    fontWeight: '600',
  },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '88%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#48718d',
    marginBottom: 12,
  },
  timeList: {
    paddingVertical: 8,
  },
  timeSlot: {
    flex: 1 / 3,
    margin: 4,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  timeSlotSelected: {
    borderColor: '#FFD84D',
    backgroundColor: '#FFF3BF',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
  },
  timeSlotTextSelected: {
    fontWeight: '600',
    color: '#1a2942',
  },

  requestBtn: {
    marginTop: 12,
    backgroundColor: '#FFD84D',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  requestBtnDisabled: {
    opacity: 0.5,
  },
  requestBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
