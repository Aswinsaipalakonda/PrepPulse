import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { initOneSignal } from '../lib/notifications';

export default function RootLayout() {
  useEffect(() => {
    initOneSignal();
  }, []);

  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Slot />
    </AppProvider>
  );
}

