import React from 'react';
import { Slot } from 'expo-router';
import { tokenCache } from '../lib/cache';
import { AppProvider } from '../context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_bW9kZXJuLXJlbmRlZXItNzQuY2xlcmsuYWNjb3VudHMuZGV2JA';

// Safely wrap ClerkProvider to avoid blocking execution if key or native storage is pending in web preview
let ClerkProvider: any = null;
try {
  ClerkProvider = require('@clerk/clerk-expo').ClerkProvider;
} catch (e) {
  // Fallback if native module not ready
}

export default function RootLayout() {
  if (ClerkProvider) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
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
