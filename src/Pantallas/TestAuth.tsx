import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { supabase } from '../Lib/supabaseClient';

export default function TestAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');

  const handleSignUp = async () => {
    try {
      console.log('Iniciando registro...');
      
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;
      console.log('Usuario creado en Auth:', authData.user?.id);

      // 2. Crear registro en tabla usuarios
      if (authData.user) {
        const { error: usuarioError } = await supabase
          .from('usuarios')
          .insert({
            id: authData.user.id,
            email: email,
            rol: 'paciente',
          });

        if (usuarioError) throw usuarioError;
        console.log('Usuario creado en tabla usuarios');

        // 3. Crear registro en tabla Paciente
        const { error: pacienteError } = await supabase
          .from('Paciente')
          .insert({
            rut: rut,
            user_id: authData.user.id,
            nombre: nombre,
            apellido: apellido,
            activo: true,
          });

        if (pacienteError) throw pacienteError;
        console.log('Paciente creado');
      }

      Alert.alert('✅ Éxito', 'Usuario registrado correctamente');
      
      // Limpiar campos
      setEmail('');
      setPassword('');
      setNombre('');
      setApellido('');
      setRut('');
      
    } catch (error: any) {
      console.error('Error completo:', error);
      Alert.alert('❌ Error', error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      Alert.alert('✅ Éxito', `Bienvenido ${data.user?.email}`);
      console.log('Usuario logueado:', data.user?.id);
      
    } catch (error: any) {
      Alert.alert('❌ Error', error.message);
      console.error(error);
    }
  };

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      Alert.alert('📱 Sesión Activa', `Usuario: ${data.session.user.email}`);
      console.log('Sesión:', data.session);
    } else {
      Alert.alert('📱 Sin Sesión', 'No hay usuario logueado');
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('❌ Error', error.message);
    } else {
      Alert.alert('✅ Éxito', 'Sesión cerrada');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧪 Prueba de Autenticación</Text>
      <Text style={styles.subtitle}>AUDIASSIST</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos del Paciente:</Text>
        
        <TextInput
          style={styles.input}
          placeholder="RUT (ej: 12345678-9)"
          value={rut}
          onChangeText={setRut}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="📝 Registrarse" onPress={handleSignUp} color="#4CAF50" />
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ya tienes cuenta:</Text>
        <View style={styles.buttonContainer}>
          <Button title="🔐 Iniciar Sesión" onPress={handleSignIn} color="#2196F3" />
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utilidades:</Text>
        <View style={styles.buttonContainer}>
          <Button title="👤 Ver Sesión Actual" onPress={checkSession} color="#FF9800" />
        </View>
        <View style={styles.spacer} />
        <View style={styles.buttonContainer}>
          <Button title="🚪 Cerrar Sesión" onPress={handleSignOut} color="#F44336" />
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>💡 Tip: Revisa la consola para ver los logs</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  buttonContainer: {
    marginVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  spacer: {
    height: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
  },
  footerText: {
    textAlign: 'center',
    color: '#856404',
    fontSize: 14,
  },
});