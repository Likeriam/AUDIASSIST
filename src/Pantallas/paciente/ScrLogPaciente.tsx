import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAuth } from '../../Contexts/AuthContext';
import { cleanRut } from '../../Lib/helpers/authHelpers';

export default function ScrLogPaciente({ navigation }: any) {
  const { signInWithRut, loading } = useAuth();
  
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Validar campos vacíos
      if (!rut || !password) {
        Alert.alert(' Error', 'Por favor completa todos los campos');
        return;
      }

      // Limpiar RUT (quitar puntos y guiones)
      const cleanedRut = cleanRut(rut);

      console.log('Intentando login con RUT:', cleanedRut);

      // Hacer login con RUT
      await signInWithRut(cleanedRut, password);
      
      Alert.alert(' Éxito', 'Bienvenido a AUDIASSIST');
      
      // Navegar a la pantalla principal
      navigation.navigate('Home_Paciente');
      
    } catch (error: any) {
      console.error('Error en login:', error);
      
      if (error.message.includes('RUT no encontrado')) {
        Alert.alert(' Error', 'RUT no registrado. Por favor regístrate primero.');
      } else if (error.message.includes('Invalid login credentials')) {
        Alert.alert(' Error', 'Contraseña incorrecta');
      } else {
        Alert.alert(' Error', 'No se pudo iniciar sesión. Intenta nuevamente.');
      }
    }
  };

  return (
    <View style={styles.TopContainer}>
      {/* LOGO */}
      <Image
        source={require('../../../assets/logoAudiassist.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Inicio de sesión</Text>

      {/* RUT */}
      <Text style={styles.label}>Ingrese su RUT</Text>
      <TextInput
        style={styles.input}
        placeholder="12345678-9"
        value={rut}
        onChangeText={setRut}
        autoCapitalize="none"
      />

      {/* CONTRASEÑA */}
      <Text style={styles.label}>Ingrese su contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* BOTÓN DE INICIAR SESIÓN */}
      <TouchableOpacity
        onPress={handleLogin}
        style={styles.btn}
        activeOpacity={0.85}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>

      {/* BOTÓN DE REGISTRO */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Registro')}
        style={styles.btnSecondary}
        activeOpacity={0.85}
      >
        <Text style={styles.btnSecondaryText}>
          ¿No tienes cuenta?{'\n'}Regístrate
        </Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  TopContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },

  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#48718d',
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    alignSelf: 'flex-start',
    marginLeft: '10%',
    width: '80%',
  },

  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
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

  btnSecondary: {
    width: '90%',
  alignItems: 'center',
  marginTop: 20,
  paddingHorizontal: 10,
},

  btnSecondaryText: {
    color: '#48718d',
  fontSize: 14,
  textDecorationLine: 'underline',
  textAlign: 'center',
  flexWrap: 'wrap',
},
});