import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width - 56;
const SWIPE_THRESHOLD = BUTTON_WIDTH - 64;

export default function SplashScreen() {
  const router = useRouter();
  const { hasOnboarded } = useAppStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;
  const panX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= SWIPE_THRESHOLD) {
          panX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= SWIPE_THRESHOLD * 0.7) {
          Animated.timing(panX, {
            toValue: SWIPE_THRESHOLD,
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            handleNext();
          });
        } else {
          Animated.spring(panX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/study-bg.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* Subtle, crystal-clear background overlay */}
        <View style={styles.overlay} />

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo Badge */}
          <View style={styles.logoBadge}>
            <Image source={require('../assets/logo-without-bg.png')} style={styles.logoImg} />
          </View>

          <Text style={styles.appTitle}>PrepPulse</Text>
          <Text style={styles.tagline}>Study Together • Crack Placements</Text>

          <Text style={styles.description}>
            Your 90-Day daily placement prep agenda covering Striver A2Z Java DSA, PERN/Spring Web Dev, Aptitude, CS Notes, and Final Year Project.
          </Text>

          {/* Radio Captain Swipe / Slide to Start Button */}
          <View style={styles.slideTrack}>
            <Text style={styles.slideTrackText}>👉 Slide to Accept Challenge </Text>

            <Animated.View
              style={[
                styles.swipeThumb,
                {
                  transform: [{ translateX: panX }],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <ArrowRight size={22} color="#12131A" />
            </Animated.View>
          </View>
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
    backgroundColor: 'rgba(9, 10, 15, 0.42)', // Reduced dark shadow for clear image visibility
  },
  contentContainer: {
    paddingHorizontal: 28,
    paddingBottom: 50,
    alignItems: 'center',
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  logoImg: {
    width: 72,
    height: 72,
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
    color: '#EAB308', // Replaced purple with warm logo gold accent
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },
  slideTrack: {
    width: BUTTON_WIDTH,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#12131A', // Dark charcoal matching logo badge
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  slideTrackText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#EAB308', // Warm logo gold text
    fontSize: 15,
    fontWeight: '700',
  },
  swipeThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
