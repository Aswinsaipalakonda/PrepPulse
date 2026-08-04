import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppStore } from '../../context/AppContext';
import { TaskCard } from '../../components/TaskCard';
import { Calendar, ChevronRight, Sparkles } from 'lucide-react-native';

export default function RoadmapScreen() {
  const { dayPlans, currentDay, setCurrentDay, toggleTaskCompletion } = useAppStore();
  const [selectedTrack, setSelectedTrack] = useState<'all' | 'dsa' | 'dev' | 'aptitude' | 'interview' | 'fyp'>('all');

  const selectedPlan = dayPlans.find((p) => p.dayNumber === currentDay) || dayPlans[0];

  const filteredTasks = selectedPlan.tasks.filter(
    (t) => selectedTrack === 'all' || t.track === selectedTrack
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>90-Day Placement Roadmap</Text>
        <Text style={styles.headerSubtitle}>Structured curriculum from Day 1 to Day 90</Text>
      </View>

      {/* Days Horizontal Scrollbar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayPickerContainer}
      >
        {dayPlans.slice(0, 30).map((plan) => {
          const isActive = plan.dayNumber === currentDay;
          return (
            <TouchableOpacity
              key={plan.dayNumber}
              style={[styles.dayChip, isActive && styles.dayChipActive]}
              onPress={() => setCurrentDay(plan.dayNumber)}
            >
              <Text style={[styles.dayChipText, isActive && styles.dayChipTextActive]}>
                Day {plan.dayNumber}
              </Text>
              {plan.isSundayRest && <Text style={styles.restDot}>💤</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Track Filters */}
      <View style={styles.trackFilters}>
        {[
          { key: 'all', label: 'All' },
          { key: 'dsa', label: 'DSA' },
          { key: 'dev', label: 'Dev' },
          { key: 'aptitude', label: 'Aptitude' },
          { key: 'interview', label: 'Interview' },
          { key: 'fyp', label: 'FYP' },
        ].map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.trackPill, selectedTrack === t.key && styles.trackPillActive]}
            onPress={() => setSelectedTrack(t.key as any)}
          >
            <Text style={[styles.trackPillText, selectedTrack === t.key && styles.trackPillTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Day Overview Banner */}
      <View style={styles.dayBanner}>
        <View style={styles.bannerRow}>
          <Calendar size={18} color="#FFFFFF" />
          <Text style={styles.dayBannerTitle}>{selectedPlan.title}</Text>
        </View>
        <Text style={styles.dayBannerSub}>
          {selectedPlan.tasks.length} Modules • {selectedPlan.isSundayRest ? 'Rest & Planning Day' : 'Standard 2-3 Hours'}
        </Text>
      </View>

      {/* Tasks List */}
      <ScrollView contentContainerStyle={styles.taskList} showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks match selected filter for Day {currentDay}</Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggleComplete={toggleTaskCompletion} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EBF0',
    paddingTop: 54,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#12131A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  dayPickerContainer: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  dayChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayChipActive: {
    backgroundColor: '#12131A',
  },
  dayChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  dayChipTextActive: {
    color: '#FFFFFF',
  },
  restDot: {
    fontSize: 10,
  },
  trackFilters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 6,
    marginBottom: 16,
  },
  trackPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  trackPillActive: {
    backgroundColor: '#8B5CF6',
  },
  trackPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  trackPillTextActive: {
    color: '#FFFFFF',
  },
  dayBanner: {
    marginHorizontal: 20,
    backgroundColor: '#12131A',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dayBannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dayBannerSub: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  taskList: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 13,
  },
});
