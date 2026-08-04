import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../context/AppContext';
import { Sparkles, ArrowRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { hasOnboarded } = useAppStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNext = () => {
    if (hasOnboarded) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/sign-in');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/study-bg.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          {/* Logo */}
          <View style={styles.logoBadge}>
            <Image
              source={require('../assets/logo-without-bg.png')}
              style={styles.logoImg}
            />
          </View>

          <Text style={styles.appTitle}>PrepPulse</Text>
          <Text style={styles.tagline}>Study Together • Crack Placements</Text>

          <Text style={styles.description}>
            Your 90-Day daily placement prep agenda covering Striver A2Z Java DSA, PERN/Spring Web Dev, Aptitude, CS Notes, and Final Year Project.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.slideButton}
            onPress={handleNext}
          >
            <View style={styles.slideIconCircle}>
              <ArrowRight size={22} color="#12131A" />
            </View>
            <Text style={styles.slideText}>Tap to Start Plan</Text>
          </TouchableOpacity>
        </Animated.View>
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
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 10, 15, 0.75)',
  },
  contentContainer: {
    paddingHorizontal: 28,
    paddingBottom: 50,
    alignItems: 'center',
  },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  logoImg: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A78BFA',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },
  slideButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  slideIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideText: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 46,
  },
});
