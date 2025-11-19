// src/Pantallas/paciente/SrcCuidadoAudifonoR.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function SrcCuidadoAudifonoR({ navigation }: any) {
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

          {/* Volver */}
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()} // o navigation.navigate('Home_Paciente')
          >
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        <Text style={styles.title}>Consejos de cuidado</Text>

        {/* RECUADRO CENTRADO CON SCROLL */}
        <View style={styles.box}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.paragraphTitle}>Como Cuidar tu Audifono</Text>

              <Text style={styles.paragraph}>
                • Cargue los audífonos todas las noches.{'\n\n'}
                • Use solo el cargador original recomendado por su centro auditivo.{'\n\n'}
                • Mantenga el cargador limpio y seco en todo momento.{'\n\n'}
                • No cargue los audífonos si están húmedos; séquelos primero con un paño suave.{'\n\n'}
                • Limpie los audífonos diariamente con un paño seco.{'\n\n'}
                • Retire el cerumen visible con el cepillo indicado.{'\n\n'}
                • Evite usar alcohol, agua o productos químicos para limpiar.{'\n\n'}
                • Cambie el filtro si el sonido es débil, distorsionado o intermitente.{'\n\n'}
                • Use solo filtros originales correspondientes a su modelo.{'\n\n'}
                • No use los audífonos al ducharse, nadar o en ambientes de vapor.{'\n\n'}
                • Evite exponerlos a calor directo, autos cerrados o luz solar intensa.{'\n\n'}
                • Guarde los audífonos en su estuche o cargador cuando no los utilice.{'\n\n'}
                • Manténgalos fuera del alcance de niños y mascotas.{'\n\n'}
                • No use los audífonos durante radiografías, TAC o resonancias (RM).{'\n\n'}
                • Si no cargan correctamente o el sonido falla, contacte a su profesional.{'\n\n'}
            </Text>
          </ScrollView>

          {/* ÍCONO FLECHA ABAJO DENTRO DEL RECUADRO */}
          <View style={styles.arrowContainer}>
            <View style={styles.arrowCircle}>
              <Text style={styles.arrowText}>↓</Text>
            </View>
          </View>
        </View>
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

  // barra superior
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
    borderWidth: 1,
    borderColor: '#FFD84D',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  backText: {
    color: '#FFD84D',
    fontSize: 14,
    fontWeight: '600',
  },

  // contenido principal
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#48718d',
    marginBottom: 16,
  },

  // recuadro central
  box: {
    width: '90%',
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#f9f9f9',
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 16,
  },

  paragraphTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },

  paragraph: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },

  // flecha al fondo del recuadro
  arrowContainer: {
    alignItems: 'center',
    marginTop: 8,
  },

  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrowText: {
    fontSize: 18,
    color: '#333',
  },

  // pie
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  version: {
    fontSize: 12,
    color: '#888',
  },
});
