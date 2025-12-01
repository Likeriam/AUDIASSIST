import React, { useEffect, useState } from 'react';
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

import { supabase } from '../../Lib/supabaseClient';
import { useAuth } from '../../Contexts/AuthContext';

export default function ScrHomeAdmin({ navigation }: any) {
  const { userData } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nombreMostrar, setNombreMostrar] = useState<string>('admin');

  // Cargar datos del usuario (admin) desde la tabla usuario
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        if (!userData?.id) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('usuario')
          .select('nombre_mostrar, email, rol')
          .eq('id', userData.id)
          .single();

        if (error) {
          console.log('Error obteniendo datos de usuario/admin:', error);
          setNombreMostrar(userData.email || 'admin');
        } else if (data) {
          const displayName =
            data.nombre_mostrar?.trim() || userData.email || 'admin';
          setNombreMostrar(displayName);
        }
      } catch (e) {
        console.log('Error inesperado obteniendo admin:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [userData?.id]);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Desea cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
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
          navigation.reset({
            index: 0,
            routes: [{ name: 'Inicio_de_sesión' }],
          });
        },
      },
    ]);
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

          <View style={{ flex: 1 }} />

          {/* BOTÓN CONFIGURACIÓN */}
          <TouchableOpacity
            onPress={() => setMenuOpen(prev => !prev)}
            activeOpacity={0.8}
            style={styles.configBtn}
          >
            <Text style={styles.configText}>Configuración</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overlay para cerrar el menú al tocar fuera */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Menú desplegable */}
      {menuOpen && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.menuItemText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <View style={styles.content}>
        <Text style={styles.welcome}>Bienvenido</Text>
        <Text style={styles.role}>Administrador</Text>
        <Text style={styles.name}>({nombreMostrar})</Text>

        {/* Botones de navegación del admin */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Admin_Lista_Pacientes')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Ver Lista pacientes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Admin_Lista_Tecnologos')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Ver Lista Tecnologos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Admin_Lista_Citas')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Ver Lista citas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Admin_Lista_Audifonos')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Ver lista Audifonos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Admin_Lista_Consumibles')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Ver lista Consumibles</Text>
        </TouchableOpacity>
      </View>

      {/* PIE DE PÁGINA */}
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
    top: 80,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    top: 80,
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
    paddingTop: 80,
    paddingHorizontal: 24,
  },

  welcome: {
    fontSize: 26,
    fontWeight: '700',
    color: '#48718d',
  },

  role: {
    fontSize: 22,
    fontWeight: '600',
    color: '#48718d',
  },

  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 32,
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
    textAlign: 'center',
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
