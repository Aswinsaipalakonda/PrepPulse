import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, Sparkles } from 'lucide-react-native';

export default function SignInScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(onboarding)');
    }, 600);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/study-bg.png')} style={styles.bgImage} resizeMode="cover">
        <View style={styles.overlay} />

        <View style={styles.content}>
          {/* Logo Card */}
          <View style={styles.logoBadge}>
            <Image source={require('../../assets/logo-without-bg.png')} style={styles.logoImg} />
          </View>

          <Text style={styles.welcomeTitle}>Sign In to PrepPulse</Text>
          <Text style={styles.subtitle}>
            One click to synchronize your 90-day placement roadmap, streaks, and project workspace.
          </Text>

          {/* Clean Google Only Auth Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.googleBtn}
            onPress={handleGoogleAuth}
            disabled={isLoading}
          >
            <View style={styles.googleIconContainer}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.googleText}>
              {isLoading ? 'Connecting Google Account...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>

          <View style={styles.securityRow}>
            <ShieldCheck size={16} color="#9CA3AF" />
            <Text style={styles.securityText}>Secured by Google OAuth & InsForge Auth</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12131A',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 19, 26, 0.88)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  logoImg: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 44,
    maxWidth: '90%',
  },
  googleBtn: {
    width: '100%',
    height: 58,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  googleIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4285F4',
  },
  googleText: {
    color: '#12131A',
    fontSize: 16,
    fontWeight: '700',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
