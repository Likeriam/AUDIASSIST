import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';

export default function ScrLogPaciente({ navigation }: any) {
  const [menuVisible, setMenuVisible] = useState(false);

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
      <Text style={styles.label}>Ingrese su Rut</Text>
      <TextInput
        style={styles.input}
        placeholder="12.345.678-9"
      />

      {/* CONTRASEÑA */}
      <Text style={styles.label}>Ingrese su contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
      />

      {/* BOTÓN QUE ABRE / CIERRA MENÚ */}
      <TouchableOpacity
        onPress={() => setMenuVisible((prev) => !prev)}
        style={styles.btn}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>
          {menuVisible ? 'Cerrar menú' : 'Abrir menú'}
        </Text>
      </TouchableOpacity>

          {/* MENÚ DESPLEGABLE */}
    {menuVisible && (
      <View style={styles.dropdown}>

        <TouchableOpacity
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate('Home_Paciente');  // ← NUEVA OPCIÓN
          }}
          style={styles.dropdownItem}
        >
          <Text style={styles.dropdownText}>Ir al Inicio Paciente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate('Registro');
          }}
          style={styles.dropdownItem}
        >
          <Text style={styles.dropdownText}>Ir a Registro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate('Crear_Calendario');
          }}
          style={styles.dropdownItem}
        >
          <Text style={styles.dropdownText}>Ir a creación de calendario</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate('Lista_Pacientes');
          }}
          style={styles.dropdownItem}
        >
          <Text style={styles.dropdownText}>Ir a Lista Pacientes</Text>
        </TouchableOpacity>

      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  TopContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
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

  btn: {
    backgroundColor: '#FFD84D',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 10,
  },

  btnText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
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

  dropdown: {
    marginTop: 10,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
});
