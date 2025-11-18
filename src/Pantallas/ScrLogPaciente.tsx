import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';

export default function PantallaInicio({ navigation }: any) {
  return (
    <View style={styles.TopContainer}>
      <Image source={require('../../assets/logoAudiassist.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Inicio de sesión</Text>

      <Text style= {styles.label}>Ingrese su Rut </Text>
      
      <TextInput style={styles.input}/>

      <TouchableOpacity
        onPress={() => navigation.navigate('Registro')}
        style={styles.btn}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Ir a Registro</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Crear_Calendario')}
        style={styles.btn}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Ir a creacion de calendario</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Lista_Pacientes')}
        style={styles.btn}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Ir a Lista Pacientes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    TopContainer:{ flex:1, 
    backgroundColor:'#fff', 
    alignItems:'center', 
    justifyContent:'flex-start',
    paddingTop:100 },
  
    logo:{ width:300, 
    height:300, 
    marginBottom:20 },
  
    title:{ fontSize:24, 
    fontWeight:'700', 
    color:'#48718d', 
    marginBottom:30 },
 
    btn:{ backgroundColor:'#FFD84D', 
    paddingVertical:14, 
    paddingHorizontal:20, 
    borderRadius:30,
    marginVertical:10 },
  
    btnText:{ color:'#333', 
    fontSize:16, 
    fontWeight:'600' },

    label:{ fontSize:16, 
    color:'#333',
    marginBottom:5 },

    input:{ 
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20
    },
});