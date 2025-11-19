import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { FlatList } from 'react-native';

export default function ListaPaciente ({ navigation }: any) {
  const datos = [
    { id: '1', nombre: 'Juan Pérez', correo: 'juan@mail.com' },
    { id: '2', nombre: 'María Soto', correo: 'maria@mail.com' },
    { id: '3', nombre: 'Paciente Audífono', correo: 'paciente@mail.com' },
  ];

  return (
    <View style={styles.container}>      
      <View style={styles.header}>        
        <View style={styles.logoContainer}>         
          <Image
            source={require('../../../assets/logoAudiassist2.png')}
            style={styles.logo}
            resizeMode="contain"/>     
        </View>      
      </View>   
      <FlatList
        data={datos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.nombre}</Text>
            <Text style={styles.itemSub}>{item.correo}</Text>
          </View>
        )}
      />
    </View>
  );
}



const styles = StyleSheet.create({
    itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
    itemSub: {
    fontSize: 14,
    color: '#666',
  },
    container: {
    flex: 1,
    backgroundColor: '#fff',
  },
    item: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },

    header: {
    backgroundColor: '#1a2942', 
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
    logo: {
    width: 170,
    height: 170,
    marginRight: 8,
  },
  
    title:{ 
      fontSize:24, 
      fontWeight:'700', 
      color:'#48718d', 
      marginBottom:30 
    },
 
    btn:{ 
      backgroundColor:'#FFD84D', 
      paddingVertical:14, 
      paddingHorizontal:20, 
      borderRadius:30,
      marginVertical:10 
    },
  
    btnText:{ 
      color:'#333', 
      fontSize:16, 
      fontWeight:'600' 
    },
});