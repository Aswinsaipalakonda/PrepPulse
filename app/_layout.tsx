import React from 'react';
import { Slot } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Slot />
    </AppProvider>
  );
}
