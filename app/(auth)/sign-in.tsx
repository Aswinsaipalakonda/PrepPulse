import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react-native';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleContinue = () => {
    router.replace('/(onboarding)');
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/study-bg.png')} style={styles.bgImage} resizeMode="cover">
        <View style={styles.overlay} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to track your 90-day placement preparation</Text>

          {/* Email input */}
          <View style={styles.inputCard}>
            <Mail size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password input */}
          <View style={styles.inputCard}>
            <Lock size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder="Enter Your Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.rememberRow}>
            <Text style={styles.rememberText}>Remember me</Text>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Main Log In Button */}
          <TouchableOpacity activeOpacity={0.85} style={styles.loginBtn} onPress={handleContinue}>
            <Text style={styles.loginBtnText}>Log In</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or Continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Auth Button */}
          <TouchableOpacity activeOpacity={0.85} style={styles.googleBtn} onPress={handleContinue}>
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 10, 15, 0.88)',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 90,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 32,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rememberText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  forgotText: {
    fontSize: 13,
    color: '#A78BFA',
    fontWeight: '600',
  },
  loginBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#6B7280',
    fontSize: 12,
  },
  googleBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  googleG: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4285F4',
  },
  googleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
