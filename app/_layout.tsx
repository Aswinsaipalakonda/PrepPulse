import React from 'react';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';
import { tokenCache } from '../lib/cache';
import { AppProvider } from '../context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_bW9kZXJuLXJlbmRlZXItNzQuY2xlcmsuYWNjb3VudHMuZGV2JA';

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <AppProvider>
        <StatusBar style="dark" />
        <ClerkLoading>
          <View style={styles.fallbackContainer}>
            <ActivityIndicator size="large" color="#12131A" />
          </View>
        </ClerkLoading>
        <ClerkLoaded>
          <Slot />
        </ClerkLoaded>
      </AppProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#F5EBF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
