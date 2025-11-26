import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';

// Por ahora datos de prueba: nombre + modelo de audífono
const datosMock = [
  { id: '1', nombre: 'Juan Pérez', audifono: 'Unitron Moxi V-R' },
  { id: '2', nombre: 'María Soto', audifono: 'Unitron Blu 5' },
  { id: '3', nombre: 'Paciente Audífono', audifono: 'Phonak Audéo P30-R' },
];

export default function ScrListaPacientes({ navigation }: any) {
  const [search, setSearch] = useState('');

  const datosFiltrados = datosMock.filter(item => {
    const term = search.toLowerCase();
    if (!term) return true;
    return (
      item.nombre.toLowerCase().includes(term) ||
      item.audifono.toLowerCase().includes(term)
    );
  });

  return (
    <View style={styles.container}>
      {/* BARRA SUPERIOR (IGUAL A ScrHomeTecnologo) */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* LOGO */}
          <Image
            source={require('../../../assets/logoAudiassist2.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={{ flex: 1 }} />

          {/* BOTÓN RETROCESO */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TÍTULO SECCIÓN */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pacientes</Text>
      </View>

      {/* BUSCADOR */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o modelo de audífono"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* LISTA DE PACIENTES */}
      <FlatList
        data={datosFiltrados}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.85}
            onPress={() => {
              // aquí luego podrás navegar al detalle del paciente
              // navigation.navigate('DetallePaciente', { pacienteId: item.id });
            }}
          >
            <Text style={styles.itemTitle}>{item.nombre}</Text>
            <Text style={styles.itemSub}>
              Audífono: {item.audifono}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No se encontraron pacientes con ese criterio.
            </Text>
          </View>
        }
      />

      {/* PIE DE PÁGINA */}
      <View style={styles.footer}>
        <Text style={styles.version}>Versión 0.1.0</Text>
      </View>

      <StatusBar style="light" />
    </View>
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
    paddingHorizontal: 10,
    borderRadius: 30,
  },
  backText: {
    color: '#FFD84D',
    fontSize: 14,
    fontWeight: '600',
  },

  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#48718d',
  },

  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    height: 42,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    paddingHorizontal: 16,
    backgroundColor: '#fafafa',
    fontSize: 14,
    color: '#333',
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  item: {
    backgroundColor: '#fdfdfd',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#48718d',
    marginBottom: 4,
  },
  itemSub: {
    fontSize: 14,
    color: '#555',
  },

  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },

  footer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  version: {
    fontSize: 12,
    color: '#888',
  },
});

