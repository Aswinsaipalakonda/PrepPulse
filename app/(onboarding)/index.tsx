import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../context/AppContext';
import { ChevronLeft, Check, Target, BookOpen, Clock, Rocket } from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setHasOnboarded } = useAppStore();
  const [step, setStep] = useState(1);

  // Step 1: Personal Details
  const [firstName, setFirstName] = useState('Aswin');
  const [lastName, setLastName] = useState('Sai');
  const [displayName, setDisplayName] = useState('Aswin Sai');
  const [userRole, setUserRole] = useState<'student' | 'professional' | 'final_year'>('final_year');

  // Step 2: Placement Goals & Capacity
  const [targetRole, setTargetRole] = useState('SDE 1 / Full Stack Engineer');
  const [dailyHours, setDailyHours] = useState('2-3 Hours');
  const [projectTitle, setProjectTitle] = useState('Campus Placement Portal');

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else {
      setHasOnboarded(true);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          {step === 2 && (
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
              <ChevronLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <View style={styles.headerTitles}>
            <Text style={styles.greetingText}>Hello {firstName || 'there'}!</Text>
            <Text style={styles.subGreeting}>
              {step === 1 ? 'We’re happy to have you. Just a few details...' : 'Set your 90-day placement preparation goals'}
            </Text>
          </View>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicatorRow}>
          <View style={[styles.stepBar, step >= 1 && styles.stepBarActive]} />
          <View style={[styles.stepBar, step >= 2 && styles.stepBarActive]} />
        </View>

        {step === 1 ? (
          <>
            {/* First & Last Name */}
            <View style={styles.nameRow}>
              <View style={styles.nameCol}>
                <Text style={styles.label}>First name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.nameCol}>
                <Text style={styles.label}>Last name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Display Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>What should others call you?</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Role Options matching screen reference */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Which option best defines You?*</Text>

              {[
                { key: 'student', label: 'Pre-uni student' },
                { key: 'professional', label: 'Working Professional' },
                { key: 'final_year', label: 'Final Year Uni Student' },
              ].map((opt) => {
                const isSelected = userRole === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    activeOpacity={0.8}
                    style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                    onPress={() => setUserRole(opt.key as any)}
                  >
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <View style={styles.radioInnerDot} />}
                    </View>
                    <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          <>
            {/* Target Placement Role */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Target Role / Position</Text>
              <TextInput
                style={styles.input}
                value={targetRole}
                onChangeText={setTargetRole}
                placeholder="e.g. SDE 1, Java Developer"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Daily Capacity */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Daily Capacity</Text>
              <View style={styles.pillContainer}>
                {['1-2 Hours', '2-3 Hours', '3-4 Hours'].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.pillBtn, dailyHours === opt && styles.pillBtnSelected]}
                    onPress={() => setDailyHours(opt)}
                  >
                    <Text style={[styles.pillBtnText, dailyHours === opt && styles.pillBtnTextSelected]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* FYP Title */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Final-Year Project Title</Text>
              <TextInput
                style={styles.input}
                value={projectTitle}
                onChangeText={setProjectTitle}
                placeholder="e.g. AI Placement Portal"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </>
        )}

        {/* Submit / Continue Button */}
        <TouchableOpacity activeOpacity={0.85} style={styles.submitBtn} onPress={handleNextStep}>
          <Text style={styles.submitBtnText}>
            {step === 1 ? 'Continue to Goals' : 'Start 90-Day Placement Plan'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitles: {
    flex: 1,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subGreeting: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  stepBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  stepBarActive: {
    backgroundColor: '#7C3AED',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  nameCol: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  radioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 14,
  },
  radioCardSelected: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderColor: '#7C3AED',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#A78BFA',
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#A78BFA',
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  radioLabelSelected: {
    color: '#FFFFFF',
  },
  pillContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  pillBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pillBtnSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  pillBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  pillBtnTextSelected: {
    color: '#FFFFFF',
  },
  submitBtn: {
    marginTop: 20,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
