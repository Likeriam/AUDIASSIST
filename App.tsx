import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import TestAuth from './src/Pantallas/TestAuth';

export default function App() {
  return (
    <AuthProvider>
      <TestAuth />
    </AuthProvider>
  );
}