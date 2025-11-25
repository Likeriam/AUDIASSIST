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
  ScrollView,
} from 'react-native';
import { useAuth } from '../../Contexts/AuthContext';
import { cleanRut } from '../../Lib/helpers/authHelpers';

export default function ScrRegistroTecnologo({ navigation }: any) {
  const { signUp, loading } = useAuth();

  // Campos del formulario (adaptados para tecnólogo médico)
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [codigoAutorizacion, setCodigoAutorizacion] = useState(''); // código que se requiere para autorizar registro
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegistro = async () => {
    try {
      // validaciones básicas
      if (
        !rut ||
        !nombre ||
        !apellido ||
        !email ||
        !password ||
        !confirmPassword ||
        !codigoAutorizacion
      ) {
        Alert.alert(
          'Error',
          'Por favor completa todos los campos obligatorios (incluye el código de autorización).'
        );
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }

      if (password.length < 6) {
        Alert.alert(
          'Error',
          'La contraseña debe tener al menos 6 caracteres'
        );
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Ingresa un email válido');
        return;
      }

      // limpiar RUT
      const cleanedRut = cleanRut(rut);

      // normalizar email igual que en signUp (baja y sin espacios)
      const normalizedEmail = email.trim().toLowerCase();

      console.log('Iniciando registro de tecnólogo...', {
        normalizedEmail,
        cleanedRut,
        institucion,
      });

      await signUp(normalizedEmail, password, 'tecnologo', {
        rut: cleanedRut,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim() || null,
        institucion: institucion.trim() || null, // hoy no se guarda en BD, pero no afecta
        codigo_autorizacion: codigoAutorizacion.trim(),
      });

      Alert.alert(
        'Registro exitoso',
        'Tu cuenta de tecnólogo ha sido creada. Ahora puedes iniciar sesión.',
        [
          {
            text: 'Ir a Inicio de Sesión',
            onPress: () => navigation.navigate('Inicio_de_sesión'),
          },
        ]
      );

      // limpiar campos
      setRut('');
      setNombre('');
      setApellido('');
      setEmail('');
      setTelefono('');
      setInstitucion('');
      setCodigoAutorizacion('');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error en registro tecnólogo:', error);

      // si signUp lanzó un mensaje claro, lo mostramos directamente
      if (error?.message) {
        Alert.alert('Error', error.message);
        return;
      }

      // fallback por si vienen errores de Postgres
      if (String(error).includes('duplicate key')) {
        Alert.alert('Error', 'Este RUT o email ya está registrado');
      } else if (String(error).includes('User already registered')) {
        Alert.alert('Error', 'Este email ya está registrado');
      } else {
        Alert.alert(
          'Error',
          'No se pudo completar el registro. Intenta nuevamente.'
        );
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* LOGO */}
        <Image
          source={require('../../../assets/logoAudiassist.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Registro - Tecnólogo Médico</Text>

        {/* RUT */}
        <Text style={styles.label}>RUT *</Text>
        <TextInput
          style={styles.input}
          placeholder="12345678-9"
          value={rut}
          onChangeText={setRut}
          autoCapitalize="none"
        />

        {/* NOMBRE */}
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />

        {/* APELLIDO */}
        <Text style={styles.label}>Apellido *</Text>
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
        />

        {/* EMAIL */}
        <Text style={styles.label}>Email institucional *</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@institucion.cl"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* TELÉFONO */}
        <Text style={styles.label}>Teléfono (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="+56912345678"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        {/* INSTITUCIÓN */}
        <Text style={styles.label}>Institución / Centro *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la institución"
          value={institucion}
          onChangeText={setInstitucion}
        />

        {/* CÓDIGO DE AUTORIZACIÓN */}
        <Text style={styles.label}>Código de autorización *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa el código que te fue provisto"
          value={codigoAutorizacion}
          onChangeText={setCodigoAutorizacion}
          autoCapitalize="none"
        />

        {/* CONTRASEÑA */}
        <Text style={styles.label}>Contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* CONFIRMAR CONTRASEÑA */}
        <Text style={styles.label}>Confirmar Contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* BOTÓN DE REGISTRARSE COMO TECNÓLOGO */}
        <TouchableOpacity
          onPress={handleRegistro}
          style={styles.btn}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Registrando...' : 'Registrarse como Tecnólogo'}
          </Text>
        </TouchableOpacity>

        {/* Enlace a otros registros / login */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Inicio_de_sesión')}
          style={styles.btnSecondary}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSecondaryText}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Registro')}
          style={[styles.btnSecondary, { marginTop: 6 }]}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSecondaryText}>
            Volver al registro de paciente
          </Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingBottom: 30,
  },

  logo: {
    width: 220,
    height: 220,
    marginBottom: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#48718d',
    marginBottom: 22,
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
    marginBottom: 16,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },

  btnSecondaryText: {
    color: '#48718d',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
