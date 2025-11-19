import React from 'react';
import {StyleSheet,Text,View,Image,TouchableOpacity,} from 'react-native';
import { WebView } from 'react-native-webview';

// URL del video normal (watch)
const VIDEO_URL = 'https://www.youtube.com/watch?v=dYKQEguaTp8';

// URL para EMBED (importante para mostrar dentro del WebView)
const EMBED_URL = 'https://www.youtube.com/embed/dYKQEguaTp8';

export default function SrcVideoDemostrativo({ navigation }: any) {
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
        <Text style={styles.title}>Video demostrativo</Text>

        {/* RECUADRO DEL VIDEO */}
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Video en YouTube</Text>

          {/* WebView con el video embebido */}
          <View style={styles.videoContainer}>
            <WebView
              source={{ uri: EMBED_URL }}
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo
            />
          </View>

          {/* Texto opcional con el link por si acaso */}
          <Text style={styles.linkHint}>
            Si el video no se reproduce correctamente, use este enlace:
          </Text>
          <Text style={styles.linkText} numberOfLines={1}>
            {VIDEO_URL}
          </Text>
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
    paddingTop: 32,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#48718d',
    marginBottom: 32,
  },

  // recuadro central
  box: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f9f9f9',
  },

  boxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },

  // contenedor del video
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9, // mantiene proporción estándar de video
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },

  webview: {
    flex: 1,
  },

  linkText: {
    fontSize: 12,
    color: '#1a73e8',
    textDecorationLine: 'underline',
  },

  linkHint: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
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
