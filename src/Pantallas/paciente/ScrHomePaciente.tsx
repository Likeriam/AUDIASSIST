// src/Pantallas/paciente/ScrHomePaciente.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../Lib/supabaseClient'; // ajusta la ruta si tu supabaseClient está en otra carpeta
import { usePacienteData } from '../../Hooks/usePacienteData';

export default function ScrHomePaciente({ navigation }: any) {
  const { pacienteData, loading } = usePacienteData();
  const [menuOpen, setMenuOpen] = useState(false);
  const nombreCompleto = pacienteData ? `${pacienteData.nombre} ${pacienteData.apellido}` : 'Usuario';

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD84D" />
        <Text style={{ marginTop: 10, color: '#48718d' }}>Cargando...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    Alert.alert('Cerrar sesión', '¿Desea cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            // Intentar cerrar sesión en Supabase (si existe)
            if (supabase?.auth?.signOut) {
              await supabase.auth.signOut();
            }
          } catch (e) {
            console.warn('supabase signOut error', e);
          }

          try {
            await AsyncStorage.clear();
          } catch (e) {
            console.warn('AsyncStorage clear error', e);
          }

          setMenuOpen(false);
          // Reinicia la navegación para evitar volver atrás
          navigation.reset({
            index: 0,
            routes: [{ name: 'Inicio_de_sesión' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* BARRA SUPERIOR */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* LOGO */}
          <Image
            source={require('../../../assets/logoAudiassist2.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* ESPACIO CENTRAL */}
          <View style={{ flex: 1 }} />

          {/* BOTÓN MI CONFIGURACIÓN */}
          <TouchableOpacity
            onPress={() => setMenuOpen(prev => !prev)}
            activeOpacity={0.8}
            style={styles.configBtn}
          >
            <Text style={styles.configText}>Mi configuración</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overlay para cerrar el menu si se toca afuera */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Menu desplegable */}
      {menuOpen && (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.menuItemText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CONTENIDO */}
      <View style={styles.content}>
        <Text style={styles.welcome}>Bienvenido</Text>
        <Text style={styles.name}>({nombreCompleto})</Text>

        <Text style={styles.question}>¿Qué desea revisar?</Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Detalle_Audifono')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Ver sobre mi audífono</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Pedir_Consumible')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Solicitar consumibles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Proxima_Cita')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Ver mi próxima cita</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Calendario_Paciente')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Ver mi calendario</Text>
        </TouchableOpacity>
      </View>

      {/* PIE */}
      <View style={styles.footer}>
        <Text style={styles.version}>Versión 0.1.0</Text>
      </View>
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

  configBtn: {
    borderWidth: 1,
    borderColor: '#FFD84D',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 30,
  },

  configText: {
    color: '#FFD84D',
    fontSize: 14,
    fontWeight: '600',
  },

  /* MENU DESPLEGABLE */
  overlay: {
    position: 'absolute',
    top: 80, // justo debajo de la cabecera
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    top: 80, // debajo del header
    right: 20,
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 9999,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 24,
  },

  welcome: {
    fontSize: 28,
    fontWeight: '700',
    color: '#48718d',
  },

  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },

  question: {
    fontSize: 18,
    color: '#333',
    width: '80%',
    marginBottom: 24,
    textAlign: 'center',
  },

  btn: {
    backgroundColor: '#FFD84D',
    paddingVertical: 14,
    borderRadius: 30,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },

  btnText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },

  footer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  version: {
    fontSize: 12,
    color: '#888',
  },
});
