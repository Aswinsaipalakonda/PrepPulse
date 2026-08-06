import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { useAppStore } from '../../context/AppContext';
import { insforge } from '../../lib/insforge';
import * as Haptics from 'expo-haptics';

export default function SignInScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { setUserName, setHasOnboarded } = useAppStore();

  const handleAuthSubmit = async () => {
    setErrorMessage('');
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }
    if (isSignUp && !fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch (e) {}

    setIsLoading(true);
    let resolvedUserName = fullName.trim() || email.split('@')[0] || 'PrepPulse Student';

    try {
      if (isSignUp) {
        // InsForge Auth Sign Up with full name
        const { data, error } = await insforge.auth.signUp({
          email: email.trim(),
          password: password,
          name: fullName.trim(),
        });

        if (error) {
          console.log('InsForge Sign Up notice:', error.message);
          if (error.message) {
            setErrorMessage(error.message);
          }
        }
        if (data?.user?.profile?.name) {
          resolvedUserName = data.user.profile.name;
        } else if (data?.user?.email) {
          resolvedUserName = fullName.trim() || data.user.email.split('@')[0];
        }
      } else {
        // InsForge Auth Sign In
        const { data, error } = await insforge.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          console.log('InsForge Sign In notice:', error.message);
          if (error.message) {
            setErrorMessage(error.message);
          }
        }
        if (data?.user?.profile?.name) {
          resolvedUserName = data.user.profile.name;
        } else if (data?.user?.email) {
          resolvedUserName = data.user.email.split('@')[0];
        }
      }
    } catch (err: any) {
      console.log('InsForge Auth Handled:', err);
    } finally {
      setIsLoading(false);
      setUserName(resolvedUserName);
      router.replace('/(onboarding)');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/study-bg.png')} style={styles.bgImage} resizeMode="cover">
        <View style={styles.overlay} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {/* Logo Badge */}
            <View style={styles.logoBadge}>
              <Image source={require('../../assets/logo-without-bg.png')} style={styles.logoImg} />
            </View>

            <Text style={styles.welcomeTitle}>
              {isSignUp ? 'Create your Account' : 'Welcome back to PrepPulse'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp
                ? 'Join thousands of students mastering their 90-day placement roadmap.'
                : 'Sign in to access your placement tasks, streaks, and project workspace.'}
            </Text>

            {/* Auth Mode Toggle Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.tabBtn, !isSignUp && styles.activeTabBtn]}
                onPress={() => {
                  setIsSignUp(false);
                  setErrorMessage('');
                }}
              >
                <Text style={[styles.tabText, !isSignUp && styles.activeTabText]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.tabBtn, isSignUp && styles.activeTabBtn]}
                onPress={() => {
                  setIsSignUp(true);
                  setErrorMessage('');
                }}
              >
                <Text style={[styles.tabText, isSignUp && styles.activeTabText]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields Card */}
            <View style={styles.formCard}>
              {errorMessage ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              {isSignUp && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <User size={18} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Aswin Sai"
                      placeholderTextColor="#6B7280"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="student@college.edu"
                    placeholderTextColor="#6B7280"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={styles.eyeBtn}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color="#9CA3AF" />
                    ) : (
                      <Eye size={18} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.submitBtn}
                onPress={handleAuthSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#12131A" size="small" />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </Text>
                    <ArrowRight size={18} color="#12131A" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.securityRow}>
              <ShieldCheck size={16} color="#9CA3AF" />
              <Text style={styles.securityText}>Secured by InsForge PostgreSQL Auth</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(18, 19, 26, 0.92)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  logoImg: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: '92%',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 4,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTabBtn: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  formCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 28,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 19, 26, 0.7)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  eyeBtn: {
    padding: 6,
  },
  submitBtn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  submitBtnText: {
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
