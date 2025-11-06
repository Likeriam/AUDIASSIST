import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';

export default function PantallaRegistro({ navigation }: any) {
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            
            source={require('../../assets/logoAudiassist2.png')}
            style={styles.logo}
            resizeMode="contain"/>
        
        </View>
      </View>

      
      <View style={styles.main}>
        <Text style={styles.title}>Crear usuario</Text>

        <Text style= {styles.label}>Nombre de usuario</Text>
          <TextInput
             style={styles.input}
          />
        
         <Text style={[styles.label, { marginTop: 16 }]}>Ingrese su Rut</Text>
          <TextInput
             style={styles.input}
              secureTextEntry
          />

         <Text style={[styles.label, { marginTop: 16 }]}>Contraseña</Text>
          <TextInput
             style={styles.input}
              secureTextEntry
          />


        <TouchableOpacity
          onPress={() => {}}
          style={styles.btn}
          activeOpacity={0.85}>
          <Text style={styles.btnText}>Crear usuario</Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => navigation.navigate('Registro')}
          style={styles.btn}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Ir a Registro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Inicio_de_sesión')}
          style={[styles.btn, styles.btnSecundario]}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, styles.btnTextSecundario]}>
            Ir a Inicio
          </Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  
  header: {
    backgroundColor: '#1a2942', // azul oscuro
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginRight: 8,
  },
  brand: {
    color: '#FFD84D',
    fontSize: 22,
    fontWeight: '700',
  },

    main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 40,
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
    fontWeight: '700',
  },
  btnSecundario: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FFD84D',
  },
  btnTextSecundario: {
    color: '#48718d',
  },
  input: {
    width: '80%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});