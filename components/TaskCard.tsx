import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Task } from '../types/planner';
import { CheckCircle2, Circle, ArrowUpRight, Clock, BookOpen, Code } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete }) => {
  const router = useRouter();

  const getTrackColor = (track: Task['track']) => {
    switch (track) {
      case 'dsa':
        return { bg: '#F0E7FF', text: '#6C2BD9', badge: 'DSA Java' };
      case 'dev':
        return { bg: '#E0F2FE', text: '#0369A1', badge: 'Full-Stack' };
      case 'aptitude':
        return { bg: '#FEF3C7', text: '#B45309', badge: 'Aptitude' };
      case 'interview':
        return { bg: '#DCFCE7', text: '#15803D', badge: 'Interview' };
      case 'fyp':
        return { bg: '#FCE7F3', text: '#BE185D', badge: 'Final Year' };
      default:
        return { bg: '#F3F4F6', text: '#374151', badge: 'General' };
    }
  };

  const trackInfo = getTrackColor(task.track);

  return (
    <View style={[styles.card, task.isCompleted && styles.cardCompleted]}>
      {task.isCarryForward && (
        <View style={styles.carryForwardBadge}>
          <Text style={styles.carryForwardText}>⚡ Carry Forward</Text>
        </View>
      )}

      <View style={styles.headerRow}>
        <View style={[styles.trackBadge, { backgroundColor: trackInfo.bg }]}>
          <Text style={[styles.trackBadgeText, { color: trackInfo.text }]}>{trackInfo.badge}</Text>
        </View>
        <View style={styles.durationRow}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.durationText}>{task.durationMinutes} min</Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/learn/${task.id}`)}
      >
        <Text style={[styles.title, task.isCompleted && styles.titleCompleted]}>{task.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>
          {task.conceptSummary}
        </Text>
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <View style={styles.linksGroup}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(task.learningResourceUrl)}
          >
            <BookOpen size={14} color="#4F46E5" />
            <Text style={styles.linkText}>Learn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkButton, styles.practiceButton]}
            onPress={() => Linking.openURL(task.practiceUrl)}
          >
            <Code size={14} color="#0D9488" />
            <Text style={[styles.linkText, { color: '#0D9488' }]}>Practice</Text>
            <ArrowUpRight size={12} color="#0D9488" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.checkButton}
          onPress={() => onToggleComplete(task.id)}
        >
          {task.isCompleted ? (
            <CheckCircle2 size={28} color="#10B981" />
          ) : (
            <Circle size={28} color="#D1D5DB" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  cardCompleted: {
    backgroundColor: '#F9FAFB',
    opacity: 0.85,
  },
  carryForwardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  carryForwardText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trackBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trackBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  summary: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linksGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  practiceButton: {
    backgroundColor: '#CCFBF1',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  checkButton: {
    padding: 2,
  },
});
