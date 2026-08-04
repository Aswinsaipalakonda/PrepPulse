import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@clerk/clerk-expo';

export default function SplashScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/sign-in');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Sparkles size={42} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>PrepPulse</Text>
        <Text style={styles.subtitle}>90-Day Placement Preparation Planner</Text>

        <Text style={styles.description}>
          Actionable daily agenda covering Striver A2Z Java DSA, PERN & Spring Full-Stack, Aptitude, CS Fundamentals, and Final-Year Project.
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.85} style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
        <ArrowRight size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EBF0',
    padding: 24,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  content: {
    alignItems: 'center',
    marginTop: 80,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: '#12131A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#12131A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '85%',
  },
  button: {
    backgroundColor: '#12131A',
    height: 58,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
