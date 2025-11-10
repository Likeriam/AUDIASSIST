import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PantallaInicio from '../Pantallas/PantallaInicio';
import PantallaRegistro from '../Pantallas/PantallaRegistro';
import CrearCalendario from '../Pantallas/Medico/CrearCalendario';
import ListaPacientes from '../Pantallas/paciente/ListaPacientes';


const Stack = createNativeStackNavigator();

export default function AppNavegacion() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio_de_sesión" component={PantallaInicio} />
        <Stack.Screen name="Registro" component={PantallaRegistro} />
        <Stack.Screen name="Crear_Calendario" component={CrearCalendario} />
        <Stack.Screen name="Lista_Pacientes" component={ListaPacientes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}