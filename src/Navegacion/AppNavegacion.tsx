import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScrLogGlobal from '../Pantallas/Global/ScrLogGlobal';
import ScrRecuperarContrasena from '../Pantallas/Global/ScrRecuperarContrasena';

import ScrRegistro from '../Pantallas/paciente/ScrRegistroPaciente';
import ScrHomePaciente from '../Pantallas/paciente/ScrHomePaciente';
import ScrAudiPaciente from '../Pantallas/paciente/ScrAudiPaciente';
import ScrCuidadoAudifonoR from '../Pantallas/paciente/ScrCuidadoAudifonoR';
import ScrVideoDemostrativo from '../Pantallas/paciente/ScrVIdeoDemostrativo';
import ScrManualMoxiV from '../Pantallas/paciente/ScrManualMoxiV';
import ScrPedirConsumibles from '../Pantallas/paciente/ScrPedirConsumibles';
import ScrCompletarCompra from '../Pantallas/paciente/ScrCompletarCompra';
import ScrProximaCita from '../Pantallas/paciente/ScrProximaCita';
import ScrCalendarioPaciente from '../Pantallas/paciente/ScrCalendarioPaciente';

import ScrHomeTecnologo from '../Pantallas/tecnologo/ScrHomeTecnologo';
import ScrCrearCalend from '../Pantallas/tecnologo/ScrCalendarioTecnologo';
import ListaPacientes from '../Pantallas/tecnologo/ScrListaPacientes';
import ScrRegistroTecnologo from '../Pantallas/tecnologo/ScrRegistroTecnologo';
import ScrBandejaSolicitures from '../Pantallas/tecnologo/ScrBandejaSolicitudes';

import ScrHomeAdmin from '../Pantallas/Admin/ScrHomeAdmin';

import { useAuth } from '../Contexts/AuthContext';

const AuthStack = createNativeStackNavigator();
const PacienteStack = createNativeStackNavigator();
const TecnologoStack = createNativeStackNavigator();
const AdminStack = createNativeStackNavigator();

/** Pantallas antes de iniciar sesión */
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen
        name="Inicio_de_sesión"
        component={ScrLogGlobal}
      />
      <AuthStack.Screen
        name="Registro"
        component={ScrRegistro}
      />
      <AuthStack.Screen
        name="Registro_Tecnologo"
        component={ScrRegistroTecnologo}
      />
      <AuthStack.Screen
        name="Recuperar_Contrasena"
        component={ScrRecuperarContrasena}
      />
    </AuthStack.Navigator>
  );
}

/** Pantallas exclusivas de PACIENTE */
function PacienteStackNavigator() {
  return (
    <PacienteStack.Navigator screenOptions={{ headerShown: false }}>
      <PacienteStack.Screen
        name="Home_Paciente"
        component={ScrHomePaciente}
      />
      <PacienteStack.Screen
        name="Detalle_Audifono"
        component={ScrAudiPaciente}
      />
      <PacienteStack.Screen
        name="Consejos_Cuidado"
        component={ScrCuidadoAudifonoR}
      />
      <PacienteStack.Screen
        name="Video_Demostrativo"
        component={ScrVideoDemostrativo}
      />
      <PacienteStack.Screen
        name="Manual_MoxiV"
        component={ScrManualMoxiV}
      />
      <PacienteStack.Screen
        name="Pedir_Consumible"
        component={ScrPedirConsumibles}
      />
      <PacienteStack.Screen
        name="Completar_Compra"
        component={ScrCompletarCompra}
      />
      <PacienteStack.Screen
        name="Proxima_Cita"
        component={ScrProximaCita}
      />
      <PacienteStack.Screen
        name="Calendario_Paciente"
        component={ScrCalendarioPaciente}
      />
    </PacienteStack.Navigator>
  );
}

/** Pantallas exclusivas de TECNÓLOGO */
function TecnologoStackNavigator() {
  return (
    <TecnologoStack.Navigator screenOptions={{ headerShown: false }}>
      <TecnologoStack.Screen
        name="Home_Tecnologo"
        component={ScrHomeTecnologo}
      />
      <TecnologoStack.Screen
        name="Lista_Pacientes"
        component={ListaPacientes}
      />
      <TecnologoStack.Screen
        name="Crear_Calendario"
        component={ScrCrearCalend}
      />
      <TecnologoStack.Screen
        name="Bandeja_Solicitudes"
        component={ScrBandejaSolicitures}
      />
    </TecnologoStack.Navigator>
  );
}

/** Pantallas exclusivas de ADMIN */
function AdminStackNavigator() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen
        name="Home_Admin"
        component={ScrHomeAdmin}
      />
      {/*
        Cuando tengas las pantallas de listas creadas, agrégalas aquí, por ejemplo:

        <AdminStack.Screen
          name="Admin_Lista_Pacientes"
          component={ScrAdminListaPacientes}
        />
        <AdminStack.Screen
          name="Admin_Lista_Tecnologos"
          component={ScrAdminListaTecnologos}
        />
        <AdminStack.Screen
          name="Admin_Lista_Citas"
          component={ScrAdminListaCitas}
        />
        <AdminStack.Screen
          name="Admin_Lista_Audifonos"
          component={ScrAdminListaAudifonos}
        />
        <AdminStack.Screen
          name="Admin_Lista_Consumibles"
          component={ScrAdminListaConsumibles}
        />
      */}
    </AdminStack.Navigator>
  );
}

export default function AppNavegacion() {
  const { session, userData, loading } = useAuth();

  if (loading) {
    // Puedes mostrar un Splash aquí si quieres
    return null;
  }

  return (
    <NavigationContainer>
      {!session || !userData ? (
        // Sin sesión → login / registros
        <AuthStackNavigator />
      ) : userData.rol === 'paciente' ? (
        // Paciente autenticado
        <PacienteStackNavigator />
      ) : userData.rol === 'tecnologo' ? (
        // Tecnólogo autenticado
        <TecnologoStackNavigator />
      ) : userData.rol === 'admin' ? (
        // Admin autenticado
        <AdminStackNavigator />
      ) : (
        // Fallback por si aparece un rol inesperado
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
}
