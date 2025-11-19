import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

// URL directa del PDF en Google Drive
const PDF_URL =
  'https://drive.google.com/uc?export=download&id=1KgZwJCHb8u9vbaqnRhpyy-QDm9up7x57';

// URL para visualizar el PDF con Google Docs Viewer
const VIEWER_URL =
  `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(PDF_URL)}`;

export default function SrcManualUsuario({ navigation }: any) {
  return (
    <View style={styles.container}>
      
      {/* BARRA SUPERIOR */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={require('../../../assets/logoAudiassist2.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        <Text style={styles.title}>Manual de Usuario</Text>

        <View style={styles.pdfBox}>
          <WebView
            source={{ uri: VIEWER_URL }}
            style={styles.webview}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Versión 0.1.0</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, 
    backgroundColor: '#fff' 
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

  logo: { width: 150, height: 150 },

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

  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#48718d',
    marginBottom: 12,
  },

  pdfBox: {
    width: '110%',
    height: '95%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },

  webview: {
    flex: 1,
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


