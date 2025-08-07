import React from 'react';
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../screens/LoadingScreen';
import AuthNavigator from '../navigation/AuthNavigator';
import './globals.css';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // User is authenticated, show the main app
  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }}/>
      <Stack.Screen name="meals/[id]" options={{ headerShown: false }}/>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
