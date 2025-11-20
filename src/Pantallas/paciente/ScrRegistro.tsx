import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../Contexts/AuthContext';
import { cleanRut } from '../../Lib/helpers/authHelpers';

export default function ScrRegistro({ navigation }: any) {
  const { signUp, loading } = useAuth();
  
  // Estados para cada campo del formulario
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegistro = async () => {
    try {
      // 1. Validar que todos los campos obligatorios estén completos
      if (!rut || !nombre || !apellido || !email || !password || !confirmPassword) {
        Alert.alert(' Error', 'Por favor completa todos los campos obligatorios');
        return;
      }

      // 2. Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        Alert.alert(' Error', 'Las contraseñas no coinciden');
        return;
      }

      // 3. Validar longitud mínima de contraseña
      if (password.length < 6) {
        Alert.alert(' Error', 'La contraseña debe tener al menos 6 caracteres');
        return;
      }

      // 4. Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert(' Error', 'Ingresa un email válido');
        return;
      }

      // 5. Limpiar RUT (quitar puntos y guiones)
      const cleanedRut = cleanRut(rut);

      console.log('Iniciando registro...');

      // 6. Registrar usuario
      await signUp(email, password, 'paciente', {
        rut: cleanedRut,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim() || null,
      });

      Alert.alert(
        ' Registro exitoso',
        'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        [
          {
            text: 'Ir a Inicio de Sesión',
            onPress: () => navigation.navigate('Inicio_de_sesión'),
          },
        ]
      );

      // Limpiar campos
      setRut('');
      setNombre('');
      setApellido('');
      setEmail('');
      setTelefono('');
      setPassword('');
      setConfirmPassword('');

    } catch (error: any) {
      console.error('Error en registro:', error);
      
      if (error.message.includes('duplicate key')) {
        Alert.alert(' Error', 'Este RUT o email ya está registrado');
      } else if (error.message.includes('User already registered')) {
        Alert.alert(' Error', 'Este email ya está registrado');
      } else {
        Alert.alert(' Error', 'No se pudo completar el registro. Intenta nuevamente.');
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

        <Text style={styles.title}>Registro de Paciente</Text>

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
          placeholder="Juan"
          value={nombre}
          onChangeText={setNombre}
        />

        {/* APELLIDO */}
        <Text style={styles.label}>Apellido *</Text>
        <TextInput 
          style={styles.input}
          placeholder="Pérez"
          value={apellido}
          onChangeText={setApellido}
        />

        {/* EMAIL */}
        <Text style={styles.label}>Email *</Text>
        <TextInput 
          style={styles.input}
          placeholder="ejemplo@correo.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* TELÉFONO (OPCIONAL) */}
        <Text style={styles.label}>Teléfono (opcional)</Text>
        <TextInput 
          style={styles.input}
          placeholder="+56912345678"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
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

        {/* BOTÓN DE REGISTRARSE */}
        <TouchableOpacity
          onPress={handleRegistro}
          style={styles.btn}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>

        {/* BOTÓN PARA IR A LOGIN */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Inicio_de_sesión')}
          style={styles.btnSecondary}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSecondaryText}>
            ¿Ya tienes cuenta? Inicia sesión
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
    width: 250, 
    height: 250, 
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