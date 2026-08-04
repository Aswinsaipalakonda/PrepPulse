import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../context/AppContext';
import {
  Code2,
  Terminal,
  Calendar,
  Brain,
  ArrowRight,
  User,
  Sparkles,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Preload all onboarding background images locally into memory for zero loading delay
const BG_STUDY = require('../../assets/study-bg.png');
const BG_DSA = require('../../assets/dsa-bg.png');
const BG_DEV = require('../../assets/dev-bg.png');
const BG_INTERVIEW = require('../../assets/interview-bg.png');

const ONBOARDING_SLIDES = [
  {
    id: 'slide-1',
    type: 'input',
    title: 'Welcome to PrepPulse!',
    subtitle: 'Enter your name to personalize your 90-day placement dashboard',
    bg: BG_STUDY,
    icon: User,
  },
  {
    id: 'slide-2',
    type: 'highlight',
    title: 'Striver A2Z Java & DSA',
    subtitle: '45-Minute Daily Algorithm Focus',
    description:
      'Master Arrays, HashMaps, Binary Search, Trees, Graphs, and Dynamic Programming with curated LeetCode & Striver A2Z practice sheets.',
    badge: 'DSA Track',
    badgeBg: '#FCE7F3',
    badgeColor: '#BE185D',
    bg: BG_DSA,
    icon: Code2,
  },
  {
    id: 'slide-3',
    type: 'highlight',
    title: 'Full-Stack PERN & Java',
    subtitle: '35-Minute Daily Hands-On Development',
    description:
      'Build real-world web applications using React, PostgreSQL, Express, Node.js, REST APIs, and Spring Boot microservices.',
    badge: 'Web Development',
    badgeBg: '#FEF3C7',
    badgeColor: '#B45309',
    bg: BG_DEV,
    icon: Terminal,
  },
  {
    id: 'slide-4',
    type: 'highlight',
    title: 'Aptitude & CS Fundamentals',
    subtitle: '35-Minute Daily Speed Practice',
    description:
      'IndiaBIX quantitative aptitude practice paired with high-frequency technical interview notes for OOPs, DBMS, OS, and Networks.',
    badge: 'Interview Prep',
    badgeBg: '#ECFDF5',
    badgeColor: '#047857',
    bg: BG_INTERVIEW,
    icon: Brain,
  },
  {
    id: 'slide-5',
    type: 'highlight',
    title: '90-Day Placement Plan',
    subtitle: 'Structured Daily Agenda & FYP Workspace',
    description:
      'Every day includes actionable tasks with study links, practice challenges, streak rewards, and final-year project milestone tracking.',
    badge: '90-Day Plan',
    badgeBg: '#EFF6FF',
    badgeColor: '#1D4ED8',
    bg: BG_STUDY,
    icon: Calendar,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setHasOnboarded, setUserName } = useAppStore();
  const [nameInput, setNameInput] = useState('Aswin Sai');
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Pre-warm local asset images so slides transition instantaneously
  useEffect(() => {
    [BG_STUDY, BG_DSA, BG_DEV, BG_INTERVIEW].forEach((imageAsset) => {
      Image.prefetch(Image.resolveAssetSource(imageAsset).uri);
    });
  }, []);

  const handleNext = () => {
    Keyboard.dismiss();
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      if (nameInput.trim()) {
        setUserName(nameInput.trim());
      }
      setHasOnboarded(true);
      router.replace('/(tabs)');
    }
  };

  const renderSlide = ({ item }: { item: (typeof ONBOARDING_SLIDES)[0] }) => {
    const IconComponent = item.icon;

    return (
      <ImageBackground source={item.bg} style={styles.slideBgImage} resizeMode="cover">
        <View style={styles.slideOverlay} />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.slideContentScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {item.type === 'input' ? (
              <View style={styles.inputSlideContainer}>
                {/* Brand Logo Badge */}
                <View style={styles.brandLogoBadge}>
                  <Image
                    source={require('../../assets/logo-without-bg.png')}
                    style={styles.brandLogoImg}
                  />
                </View>

                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideSubtitle}>{item.subtitle}</Text>

                <View style={styles.inputCard}>
                  <Text style={styles.inputLabel}>Your Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={nameInput}
                    onChangeText={setNameInput}
                    placeholder="e.g. Aswin Sai"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.highlightSlideContainer}>
                {item.badge && (
                  <View style={[styles.badge, { backgroundColor: item.badgeBg }]}>
                    <Text style={[styles.badgeText, { color: item.badgeColor }]}>
                      {item.badge}
                    </Text>
                  </View>
                )}

                <View style={styles.iconCircle}>
                  <IconComponent size={36} color="#EAB308" />
                </View>

                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
                <Text style={styles.slideDescription}>{item.description}</Text>
              </View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <Image
            source={require('../../assets/logo-without-bg.png')}
            style={styles.headerLogoImg}
          />
          <Text style={styles.brandName}>PrepPulse</Text>
        </View>
        <Text style={styles.stepText}>
          {currentIndex + 1} of {ONBOARDING_SLIDES.length}
        </Text>
      </View>

      {/* Instant pre-loaded Slide Carousel */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={(e) => {
          const newIdx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIdx);
        }}
      />

      {/* Bottom Sticky Action Footer */}
      <View style={styles.footerContainer}>
        <View style={styles.paginationRow}>
          {ONBOARDING_SLIDES.map((_, idx) => {
            const isSelected = currentIndex === idx;
            return <View key={idx} style={[styles.dot, isSelected && styles.dotActive]} />;
          })}
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Go to Home Dashboard' : 'Next'}
          </Text>
          <ArrowRight size={20} color="#12131A" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
  },
  topHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogoImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D1D5DB',
  },
  slideBgImage: {
    width: width,
    height: '100%',
  },
  slideOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 10, 15, 0.65)',
  },
  slideContentScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 140,
  },
  inputSlideContainer: {
    alignItems: 'center',
  },
  brandLogoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  brandLogoImg: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  highlightSlideContainer: {
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  slideSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EAB308',
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputCard: {
    width: '100%',
    backgroundColor: 'rgba(9, 10, 15, 0.85)',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D1D5DB',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    alignItems: 'stretch',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#EAB308',
  },
  nextBtn: {
    height: 56,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  nextBtnText: {
    color: '#12131A',
    fontSize: 16,
    fontWeight: '700',
  },
});
