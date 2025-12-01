import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../../Lib/supabaseClient';

export default function ScrRecuperarContrasena({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendResetEmail = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico.');
      return;
    }

    try {
      setSending(true);

      const { error } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {redirectTo: 'https://likeriam.github.io/Audiassist-rest/',}
      );

      if (error) {
        console.log('Error resetPasswordForEmail:', error);
        Alert.alert(
          'Error',
          'No se pudo enviar el correo de recuperación. Verifica el correo e inténtalo nuevamente.'
        );
        return;
      }

      Alert.alert(
        'Correo enviado',
        'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.'
      );
      navigation.goBack();
    } catch (e) {
      console.log('Error inesperado en recuperación de contraseña:', e);
      Alert.alert(
        'Error',
        'Ocurrió un problema al solicitar la recuperación. Intenta nuevamente.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* HEADER */}
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
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENIDO */}
      <View style={styles.main}>
        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa el correo que usaste al registrarte. Te enviaremos un enlace
          para restablecer tu contraseña.
        </Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.cl"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={handleSendResetEmail}
          disabled={sending}
        >
          <Text style={styles.btnText}>
            {sending ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </KeyboardAvoidingView>
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
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#48718d',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },

  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
    alignSelf: 'flex-start',
    marginLeft: '10%',
    width: '80%',
  },
  input: {
    width: '80%',
    height: 44,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },

  btn: {
    backgroundColor: '#FFD84D',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  btnText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
