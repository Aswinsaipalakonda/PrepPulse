import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { initOneSignal } from '../lib/notifications';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const isValidClerkKey =
  publishableKey.length > 40 &&
  (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'));

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  useEffect(() => {
    initOneSignal();
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  // Use ClerkProvider only when valid key is provided
  if (isValidClerkKey) {
    return (
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <AppProvider>
          <StatusBar style="dark" />
          <Slot />
        </AppProvider>
      </ClerkProvider>
    );
  }

  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Slot />
    </AppProvider>
  );
}
