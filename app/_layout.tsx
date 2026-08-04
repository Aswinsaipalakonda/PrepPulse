import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { initOneSignal } from '../lib/notifications';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_bW9kZXJuLXJlbmRlZXItNzQuY2xlcmsuYWNjb3VudHMuZGV2JA';

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  useEffect(() => {
    initOneSignal();
  }, []);

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <AppProvider>
        <StatusBar style="dark" />
        <Slot />
      </AppProvider>
    </ClerkProvider>
  );
}
