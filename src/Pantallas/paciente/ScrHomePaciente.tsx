import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { usePacienteData } from '../../Hooks/usePacienteData';

export default function ScrHomePaciente({ navigation }: any) {
  const { pacienteData, loading } = usePacienteData();

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD84D" />
        <Text style={{ marginTop: 10, color: '#48718d' }}>Cargando...</Text>
      </View>
    );
  }

  const nombreCompleto = pacienteData 
    ? `${pacienteData.nombre} ${pacienteData.apellido}`
    : 'Usuario';

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
            onPress={() => navigation.navigate('Configuracion_Paciente')}
            activeOpacity={0.8}
            style={styles.configBtn}
          >
            <Text style={styles.configText}>Mi configuración</Text>
          </TouchableOpacity>
        </View>
      </View>

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