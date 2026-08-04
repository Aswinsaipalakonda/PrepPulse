import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppStore } from '../../context/AppContext';
import { ArrowLeft, BookOpen, Code, Clock, CheckCircle2, Circle, ExternalLink, Save } from 'lucide-react-native';

export default function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const { dayPlans, toggleTaskCompletion, updateTaskNotes } = useAppStore();

  let foundTask = null;
  for (const plan of dayPlans) {
    const t = plan.tasks.find((item) => item.id === taskId);
    if (t) {
      foundTask = t;
      break;
    }
  }

  if (!foundTask) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Task not found</Text>
      </View>
    );
  }

  const [notes, setNotes] = useState(foundTask.notes || '');

  const handleSaveNotes = () => {
    updateTaskNotes(foundTask.id, notes);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#12131A" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Concept Detail</Text>
        <TouchableOpacity style={styles.completeHeaderBtn} onPress={() => toggleTaskCompletion(foundTask.id)}>
          {foundTask.isCompleted ? (
            <CheckCircle2 size={24} color="#10B981" />
          ) : (
            <Circle size={24} color="#9CA3AF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Main Content Card */}
      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <View style={styles.trackBadge}>
            <Text style={styles.trackText}>{foundTask.track.toUpperCase()}</Text>
          </View>
          <View style={styles.durationBadge}>
            <Clock size={12} color="#6B7280" />
            <Text style={styles.durationText}>{foundTask.durationMinutes} Minutes</Text>
          </View>
        </View>

        <Text style={styles.title}>{foundTask.title}</Text>
        <Text style={styles.description}>{foundTask.conceptSummary}</Text>

        {/* Resources & Links */}
        <Text style={styles.sectionHeader}>Learning & Practice Resources</Text>
        <TouchableOpacity
          style={styles.resourceCard}
          onPress={() => Linking.openURL(foundTask.learningResourceUrl)}
        >
          <BookOpen size={20} color="#4F46E5" />
          <View style={styles.resourceTextCol}>
            <Text style={styles.resourceTitle}>Concept Article / Video</Text>
            <Text style={styles.resourceUrl} numberOfLines={1}>{foundTask.learningResourceUrl}</Text>
          </View>
          <ExternalLink size={16} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resourceCard, { backgroundColor: '#CCFBF1' }]}
          onPress={() => Linking.openURL(foundTask.practiceUrl)}
        >
          <Code size={20} color="#0D9488" />
          <View style={styles.resourceTextCol}>
            <Text style={[styles.resourceTitle, { color: '#0D9488' }]}>Practice Problem Sheet</Text>
            <Text style={styles.resourceUrl} numberOfLines={1}>{foundTask.practiceUrl}</Text>
          </View>
          <ExternalLink size={16} color="#0D9488" />
        </TouchableOpacity>

        {/* Notes Editor */}
        <Text style={styles.sectionHeader}>Personal Study Notes</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          placeholder="Write key code snippets, edge cases, or complexity notes here..."
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity style={styles.saveNotesBtn} onPress={handleSaveNotes}>
          <Save size={18} color="#FFFFFF" />
          <Text style={styles.saveNotesText}>Save Notes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 54,
    paddingBottom: 40,
    backgroundColor: '#F5EBF0',
  },
  notFound: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#12131A',
  },
  completeHeaderBtn: {
    padding: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  trackBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trackText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8B5CF6',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#12131A',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#12131A',
    marginTop: 10,
    marginBottom: 12,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 14,
    borderRadius: 16,
    gap: 12,
    marginBottom: 10,
  },
  resourceTextCol: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
  resourceUrl: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  notesInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#111827',
    marginBottom: 14,
  },
  saveNotesBtn: {
    backgroundColor: '#12131A',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveNotesText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
