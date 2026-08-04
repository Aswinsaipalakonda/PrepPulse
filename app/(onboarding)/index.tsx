import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Target, Clock, FolderGit2, CheckCircle } from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const [dailyHours, setDailyHours] = useState('2-3');
  const [projectTitle, setProjectTitle] = useState('Campus Placement Portal');
  const [targetRole, setTargetRole] = useState('SDE 1 / Full Stack Engineer');

  const handleCompleteOnboarding = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>Step 1 of 1</Text>
        <Text style={styles.title}>Personalize Your 90-Day Plan</Text>
        <Text style={styles.subtitle}>Configure your daily study capacity & final-year project focus</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Target size={18} color="#4F46E5" />
          <Text style={styles.label}>Target Role</Text>
        </View>
        <TextInput
          style={styles.input}
          value={targetRole}
          onChangeText={setTargetRole}
          placeholder="e.g. SDE 1, Java Developer"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Clock size={18} color="#4F46E5" />
          <Text style={styles.label}>Daily Study Hours</Text>
        </View>
        <View style={styles.pillRow}>
          {['1-2 Hours', '2-3 Hours', '3-4 Hours'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.pillOption, dailyHours.includes(opt.split('-')[0]) && styles.pillSelected]}
              onPress={() => setDailyHours(opt)}
            >
              <Text style={[styles.pillText, dailyHours.includes(opt.split('-')[0]) && styles.pillTextSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <FolderGit2 size={18} color="#4F46E5" />
          <Text style={styles.label}>Final-Year Project Title</Text>
        </View>
        <TextInput
          style={styles.input}
          value={projectTitle}
          onChangeText={setProjectTitle}
          placeholder="e.g. AI Resume Parser, Healthcare App"
        />
      </View>

      <TouchableOpacity activeOpacity={0.85} style={styles.submitButton} onPress={handleCompleteOnboarding}>
        <Text style={styles.submitButtonText}>Start 90-Day Placement Plan</Text>
        <CheckCircle size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#F5EBF0',
    flexGrow: 1,
  },
  header: {
    marginBottom: 32,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#12131A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 15,
    color: '#111827',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pillOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  pillSelected: {
    backgroundColor: '#12131A',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#12131A',
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
