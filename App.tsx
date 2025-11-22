import React from 'react';
import { AuthProvider } from './src/Contexts/AuthContext';
import AppNavegacion from './src/Navegacion/AppNavegacion';

export default function App() {
  return (
    <AuthProvider>
      <AppNavegacion />
    </AuthProvider>
  );
}
