import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { initOneSignal } from '../lib/notifications';
import * as SplashScreen from 'expo-splash-screen';

try {
  SplashScreen.preventAutoHideAsync().catch(() => {});
} catch (e) {}

export default function RootLayout() {
  useEffect(() => {
    try {
      initOneSignal();
    } catch (e) {
      console.log('OneSignal init error guarded:', e);
    }
    try {
      SplashScreen.hideAsync().catch(() => {});
    } catch (e) {
      console.log('Splash hide error guarded:', e);
    }
  }, []);

  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Slot />
    </AppProvider>
  );
}
