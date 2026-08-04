import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../context/AppContext';
import {
  Code2,
  Terminal,
  Calendar,
  Brain,
  CheckCircle2,
  ArrowRight,
  User,
  Sparkles,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    id: 'slide-1',
    type: 'input',
    title: 'Welcome to PrepPulse!',
    subtitle: 'Enter your name to personalize your 90-day placement dashboard',
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

  const handleNext = () => {
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

  const renderSlide = ({ item, index }: { item: (typeof ONBOARDING_SLIDES)[0]; index: number }) => {
    const IconComponent = item.icon;

    if (item.type === 'input') {
      return (
        <View style={styles.slideContainer}>
          <View style={styles.iconCircle}>
            <IconComponent size={36} color="#EAB308" />
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
            />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.slideContainer}>
        <View style={[styles.badge, { backgroundColor: item.badgeBg }]}>
          <Text style={[styles.badgeText, { color: item.badgeColor }]}>{item.badge}</Text>
        </View>

        <View style={styles.iconCircle}>
          <IconComponent size={40} color="#EAB308" />
        </View>

        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <Sparkles size={20} color="#EAB308" />
          <Text style={styles.brandName}>PrepPulse</Text>
        </View>
        <Text style={styles.stepText}>
          {currentIndex + 1} of {ONBOARDING_SLIDES.length}
        </Text>
      </View>

      {/* Smooth Horizontal Slide Carousel */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={(e) => {
          const newIdx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIdx);
        }}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationRow}>
        {ONBOARDING_SLIDES.map((_, idx) => {
          const isSelected = currentIndex === idx;
          return <View key={idx} style={[styles.dot, isSelected && styles.dotActive]} />;
        })}
      </View>

      {/* Action Button */}
      <View style={styles.bottomNav}>
        <TouchableOpacity activeOpacity={0.85} style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Go to Home Dashboard' : 'Next'}
          </Text>
          <ArrowRight size={20} color="#12131A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12131A',
    paddingTop: 54,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  slideContainer: {
    width: width,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
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
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '90%',
  },
  inputCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D1D5DB',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#EAB308',
  },
  bottomNav: {
    paddingHorizontal: 24,
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
