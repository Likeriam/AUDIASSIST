import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useAuth } from '../../Contexts/AuthContext';
import { cleanRut } from '../../Lib/helpers/authHelpers';
import { supabase } from '../../Lib/supabaseClient';

export default function ScrLogPaciente({ navigation }: any) {
  const { signInWithRut, loading } = useAuth();

  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Validar campos vacíos
      if (!rut || !password) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }

      // Limpiar RUT (quitar puntos y guiones)
      const cleanedRut = cleanRut(rut);
      console.log('Intentando login con RUT:', cleanedRut);

      // 1) Login usando RUT (busca correo en paciente / tecnólogo)
      await signInWithRut(cleanedRut, password);

      // 2) Obtener usuario actual de Supabase Auth
      const {
        data: userDataResult,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !userDataResult.user) {
        console.error(
          'No se pudo obtener el usuario tras el login:',
          userError
        );
        Alert.alert(
          'Error',
          'No se pudo obtener la información de tu cuenta.'
        );
        return;
      }

      const authUser = userDataResult.user;

      // 3) Consultar el rol desde la tabla "usuario"
      const { data: perfil, error: perfilError } = await supabase
        .from('usuario')
        .select('rol')
        .eq('id', authUser.id)
        .single();

      if (perfilError || !perfil) {
        console.error('No se pudo obtener el rol del usuario:', perfilError);
        Alert.alert(
          'Error',
          'No se pudo determinar el rol de tu cuenta. Intenta nuevamente.'
        );
        return;
      }

      console.log('Rol detectado para login:', perfil.rol);

      Alert.alert('Éxito', 'Bienvenido a AUDIASSIST');

      // 4) Navegar según el rol
      if (perfil.rol === 'tecnologo') {
        navigation.navigate('Lista_Pacientes');
      } else {
        navigation.navigate('Home_Paciente');
      }
    } catch (error: any) {
      console.error('Error en login:', error);

      const message = error?.message || '';

      if (message.includes('RUT no encontrado')) {
        Alert.alert(
          'Error',
          'RUT no registrado. Por favor regístrate primero.'
        );
      } else if (message.includes('Invalid login credentials')) {
        Alert.alert('Error', 'Contraseña incorrecta');
      } else {
        Alert.alert(
          'Error',
          'No se pudo iniciar sesión. Intenta nuevamente.'
        );
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

      {/* ENLACE OLVIDÉ MI CONTRASEÑA */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Recuperar_Contrasena')}
        style={styles.linkForgot}
        activeOpacity={0.8}
      >
        <Text style={styles.linkForgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      {/* BOTÓN DE REGISTRO PACIENTE */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Registro')}
        style={styles.btnSecondary}
        activeOpacity={0.85}
      >
        <Text style={styles.btnSecondaryText}>
          ¿Eres paciente? Regístrate aquí
        </Text>
      </TouchableOpacity>

      {/* BOTÓN PARA REGISTRO DE TECNÓLOGO */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Registro_Tecnologo')}
        style={styles.btnSecondary}
        activeOpacity={0.85}
      >
        <Text style={styles.btnSecondaryText}>
          ¿Eres tecnólogo? Regístrate aquí
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

  linkForgot: {
    marginTop: 4,
    marginBottom: 4,
  },
  linkForgotText: {
    color: '#48718d',
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
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

