import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function SrcAudiPaciente({ navigation }: any) {
  const modeloAudifono = 'Moxi V-3'; // luego lo podrás traer de la BD

  return (
    <View style={styles.container}>
      {/* BARRA SUPERIOR */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Logo */}
          <Image
            source={require('../../../assets/logoAudiassist2.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={{ flex: 1 }} />

          {/* Botón Volver */}
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Home_Paciente')}
          >
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENIDO PRINCIPAL */}
      <View style={styles.content}>
        <Text style={styles.title}>Mi audífono</Text>
        <Text style={styles.model}>Modelo: {modeloAudifono}</Text>

        {/* Contenedor para la imagen del audífono */}
        <View style={styles.imageBox}>
          {/* Si luego tienes una imagen específica, reemplaza este Text por un <Image /> */}
          <Image
          source={require('../../../assets/Unitron-Moxi-V-R.png')}
          style={styles.ImagenAudifono}
          resizeMode="contain"
          />
        </View>

        {/* Botones de acciones */}
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Consejos_Cuidado')}
        >
          <Text style={styles.btnText}>Consejos de cuidado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Video_Demostrativo')}
        >
          <Text style={styles.btnText}>Video demostrativo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Manual_MoxiV')}
          >
          <Text style={styles.btnText}>Manual de Usuario (PDF)</Text>
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
  // contenedor general
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // barra superior (igual estilo que HomePaciente / CrearCalend)
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

  backBtn: {
    borderWidth: 2,
    borderColor: '#FFD84D',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  backText: {
    color: '#FFD84D',
    fontSize: 12,
    fontWeight: '600',
  },

  // contenido principal
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#48718d',
    marginBottom: 8,
  },

  model: {
    fontSize: 20,
    color: '#333',
    marginBottom: 24,
    width: '80%',
    textAlign: 'center',
  },

  imageBox: {
    width: '60%',
    height: 180,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#fff',
  },

    ImagenAudifono: {
    width: '100%',
    height: '100%',
    },

  imageText: {
    fontSize: 16,
    color: '#666',
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
    fontSize: 20,
    fontWeight: '600',
    width: '80%',
    textAlign : 'center',
  },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  version: {
    fontSize: 12,
    color: '#888',
  },
});