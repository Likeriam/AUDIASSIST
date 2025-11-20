import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScrLogPaciente from '../Pantallas/paciente/ScrLogPaciente';
import ScrRegistro from '../Pantallas/paciente/ScrRegistro';
import ScrCrearCalend from '../Pantallas/Medico/ScrCrearCalend';
import ListaPacientes from '../Pantallas/Medico/ScrListaPacientes';
import ScrHomePaciente from '../Pantallas/paciente/ScrHomePaciente';
import { StackScreen } from 'react-native-screens';
import ScrAudiPaciente from '../Pantallas/paciente/ScrAudiPaciente';
import ScrCuidadoAudifonoR from '../Pantallas/paciente/ScrCuidadoAudifonoR';
import ScrVideoDemostrativo from '../Pantallas/paciente/ScrVIdeoDemostrativo';
import ScrManualMoxiV from '../Pantallas/paciente/ScrManualMoxiV';
import ScrPedirConsumibles from '../Pantallas/paciente/ScrPedirConsumibles';
import ScrCompletarCompra from '../Pantallas/paciente/ScrCompletarCompra';

const Stack = createNativeStackNavigator();

export default function AppNavegacion() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio_de_sesión" component={ScrLogPaciente} />
        <Stack.Screen name="Registro" component={ScrRegistro} />
        <Stack.Screen name="Crear_Calendario" component={ScrCrearCalend} />
        <Stack.Screen name="Lista_Pacientes" component={ListaPacientes} />
        <Stack.Screen name="Home_Paciente" component={ScrHomePaciente}/>
        <Stack.Screen name="Detalle_Audifono" component={ScrAudiPaciente}/>
        <Stack.Screen name="Consejos_Cuidado" component={ScrCuidadoAudifonoR}/>
        <Stack.Screen name="Video_Demostrativo" component={ScrVideoDemostrativo}/>
        <Stack.Screen name="Manual_MoxiV" component={ScrManualMoxiV}/>
        <Stack.Screen name="Pedir_Consumible" component={ScrPedirConsumibles}/>
        <Stack.Screen name="Completar_Compra" component={ScrCompletarCompra}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}