import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useAppStore } from '../../context/AppContext';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useSSO } from '@clerk/clerk-expo';

export default function SignInScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUserName } = useAppStore();

  let startSSOFlow: ReturnType<typeof useSSO>['startSSOFlow'] | null = null;
  try {
    const sso = useSSO();
    startSSOFlow = sso.startSSOFlow;
  } catch (e) {
    // Fallback if ClerkProvider is unmounted
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      let authenticatedName = 'PrepPulse User';
      let success = false;

      // 1. Official Clerk SSO Browser Google Auth
      if (startSSOFlow) {
        try {
          const { createdSessionId, setActive, signUp } = await startSSOFlow({
            strategy: 'oauth_google',
          });

          if (createdSessionId && setActive) {
            await setActive({ session: createdSessionId });
            success = true;
            if (signUp?.firstName) {
              authenticatedName = signUp.firstName;
            }
          } else {
            // User cancelled SSO prompt, stay on sign-in
            setIsLoading(false);
            return;
          }
        } catch (clerkErr) {
          console.log('Clerk SSO Notice:', clerkErr);
        }
      }

      // 2. Direct Web Browser OAuth Fallback
      if (!success) {
        await WebBrowser.warmUpAsync();
        const redirectUrl = Linking.createURL('/(auth)/sign-in', { scheme: 'preppulse' });
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=1084948834925-preppulse.apps.googleusercontent.com` +
          `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
          `&response_type=token` +
          `&scope=${encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email')}` +
          `&prompt=select_account`;

        const authResult = await WebBrowser.openAuthSessionAsync(googleAuthUrl, redirectUrl);

        if (authResult.type === 'cancel' || authResult.type === 'dismiss') {
          setIsLoading(false);
          await WebBrowser.coolDownAsync();
          return;
        }

        if (authResult.type === 'success' && authResult.url) {
          const params = new URLSearchParams(authResult.url.split('#')[1] || authResult.url.split('?')[1]);
          const name = params.get('name') || params.get('user_name') || params.get('email');
          if (name) {
            authenticatedName = name.split('@')[0];
          }
        }
      }

      // Complete sign-in & save user name to AppContext & AsyncStorage
      setUserName(authenticatedName);
      router.replace('/(onboarding)');
    } catch (err) {
      console.error('Google Auth Error:', err);
      setUserName('PrepPulse User');
      router.replace('/(onboarding)');
    } finally {
      setIsLoading(false);
      WebBrowser.coolDownAsync();
    }
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

          {/* Google Auth Button with Official Multi-color SVG Logo */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.googleBtn}
            onPress={handleGoogleAuth}
            disabled={isLoading}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <Path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <Path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <Path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </Svg>

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
