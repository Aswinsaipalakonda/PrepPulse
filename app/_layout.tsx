import React from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';
import { tokenCache } from '../lib/cache';
import { AppProvider } from '../context/AppContext';
import { StatusBar } from 'expo-status-bar';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_bW9kZXJuLXJlbmRlZXItNzQuY2xlcmsuYWNjb3VudHMuZGV2JA';

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <AppProvider>
        <StatusBar style="dark" />
        <Slot />
      </AppProvider>
    </ClerkProvider>
  );
}
