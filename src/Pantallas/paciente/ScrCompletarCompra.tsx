import React, { useState } from 'react';
import {StyleSheet,View,Text,Image,TouchableOpacity,FlatList,} from 'react-native';

type Consumible = {
  id: string;
  nombre: string;
  descripcion: string;
  image: any;
};

const CONSUMIBLES: Consumible[] = [
  {
    id: '1',
    nombre: 'Pilas',
    descripcion: 'Pack de pilas para audífonos.',
    image: require('../../../assets/Imagen-consumibles/Pila-312.png'),
  },
  {
    id: '2',
    nombre: 'Filtros cerumen',
    descripcion: 'Filtros para protección contra cerumen.',
    image: require('../../../assets/Imagen-consumibles/Filtros-receptor-Palito.png'),
  },
  {
    id: '3',
    nombre: 'Domos silicona',
    descripcion: 'Domos de repuesto en distintos tamaños.',
    image: require('../../../assets/Imagen-consumibles/Domo-Potente.png'),
  },
  {
    id: '4',
    nombre: 'Kit de limpieza',
    descripcion: 'Cepillo, paño y herramienta de limpieza.',
    image: require('../../../assets/Imagen-consumibles/Kit-Limpieza.png'),
  },
];

export default function SrcSolicitarConsumibles({ navigation }: any) {
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  const handleIncrease = (id: string) => {
    setCantidades(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrease = (id: string) => {
    setCantidades(prev => {
      const actual = prev[id] || 0;
      if (actual <= 0) return prev;
      return { ...prev, [id]: actual - 1 };
    });
  };

  const totalItems = CONSUMIBLES.reduce(
    (acc, item) => acc + (cantidades[item.id] || 0),
    0
  );

  const renderItem = ({ item }: { item: Consumible }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemImageContainer}>
        <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text style={styles.itemDescription}>{item.descripcion}</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={[styles.qtyButton, styles.qtyButtonMinus]}
            onPress={() => handleDecrease(item.id)}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyValue}>{cantidades[item.id] || 0}</Text>

          <TouchableOpacity
            style={[styles.qtyButton, styles.qtyButtonPlus]}
            onPress={() => handleIncrease(item.id)}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // << FUNCIÓN PARA IR A LA NUEVA PANTALLA >>
  const handleComprar = () => {
    const resumen = CONSUMIBLES
      .map(item => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: cantidades[item.id] || 0,
      }))
      .filter(item => item.cantidad > 0);

    navigation.navigate('Completar_Compra', { items: resumen });
  };

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

          <View style={styles.cartContainer}>
            <Image
              source={require('../../../assets/Imagen-consumibles/Logo-carrito.png')}
              style={styles.cartIcon}
              resizeMode="contain"
            />
            <Text style={styles.cartCount}>{totalItems}</Text>
          </View>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        <Text style={styles.title}>Solicitar consumibles</Text>
        <Text style={styles.subtitle}>
          Seleccione los consumibles que desea solicitar.
        </Text>

        <FlatList
          data={CONSUMIBLES}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* BOTÓN COMPRAR */}
      {/* << AQUI SE AGREGA EL BOTÓN >> */}
      <TouchableOpacity
        style={[
          styles.buyButton,
          totalItems === 0 && { opacity: 0.4 },
        ]}
        onPress={handleComprar}
        disabled={totalItems === 0}
      >
        <Text style={styles.buyButtonText}>
          Comprar ({totalItems})
        </Text>
      </TouchableOpacity>

      {/* PIE */}
      <View style={styles.footer}>
        <Text style={styles.version}>Versión 0.1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // contenedor general
  container: { flex: 1, backgroundColor: '#fff' },

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

  logo: { width: 120, height: 120 },

  cartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 8,
  },

  cartIcon: { width: 45, height: 45 },
  cartCount: { color: '#FFD84D', fontWeight: '700', fontSize: 16 },

  backBtn: {
    borderWidth: 2,
    borderColor: '#FFD84D',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },

  backText: { color: '#FFD84D', fontSize: 12, fontWeight: '600' },

  // contenido
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  title: { fontSize: 24, fontWeight: '700', color: '#48718d' },

  subtitle: { fontSize: 14, color: '#555', marginBottom: 16 },

  listContent: { paddingBottom: 16 },

  // tarjetas
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  itemImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  itemImage: { width: '100%', height: '100%' },

  itemInfo: { flex: 1 },

  itemName: { fontSize: 16, fontWeight: '700' },

  itemDescription: { fontSize: 13, color: '#555' },

  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },

  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  qtyButtonMinus: { backgroundColor: '#eee' },
  qtyButtonPlus: { backgroundColor: '#FFD84D', marginLeft: 8 },

  qtyButtonText: { fontSize: 18, fontWeight: '700' },

  qtyValue: { marginLeft: 8, fontSize: 16, fontWeight: '600' },

  // botón comprar
  buyButton: {
    backgroundColor: '#FFD84D',
    paddingVertical: 16,
    marginHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },

  buyButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '700',
  },

  // pie
  footer: { paddingHorizontal: 16, paddingVertical: 10 },

  version: { fontSize: 12, color: '#888' },
});
