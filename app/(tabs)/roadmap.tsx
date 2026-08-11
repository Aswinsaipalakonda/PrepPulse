import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../context/AppContext';
import { TaskCard } from '../../components/TaskCard';
import { Calendar } from 'lucide-react-native';

export default function RoadmapScreen() {
  const { dayPlans, currentDay, setCurrentDay, toggleTaskCompletion } = useAppStore();
  const [selectedTrack, setSelectedTrack] = useState<'all' | 'dsa' | 'dev' | 'aptitude' | 'interview' | 'fyp'>('all');

  const selectedPlan = dayPlans.find((p) => p.dayNumber === currentDay) || dayPlans[0];

  const filteredTasks = selectedPlan.tasks.filter(
    (t) => selectedTrack === 'all' || t.track === selectedTrack || (selectedTrack === 'dev' && (t.track === 'javafullstack' || t.track === 'pern'))
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header Dark Banner */}
      <View style={styles.darkHeaderBanner}>
        <Text style={styles.darkHeaderTitle}>90-Day Placement Roadmap</Text>
      </View>

      <View style={styles.container}>


        {/* Compact Horizontal Day Chips Picker */}
        <View style={styles.pickerWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayPickerContainer}
          >
            {dayPlans.map((plan) => {
              const isActive = plan.dayNumber === currentDay;
              return (
                <TouchableOpacity
                  key={plan.dayNumber}
                  activeOpacity={0.8}
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
        </View>

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
            <Calendar size={16} color="#EAB308" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EBF0',
  },
  darkHeaderBanner: {
    backgroundColor: '#12131A',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 10,
  },
  darkHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  container: {
    flex: 1,
  },

  pickerWrapper: {
    height: 48,
    marginBottom: 12,
  },
  dayPickerContainer: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  dayChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  dayChipActive: {
    backgroundColor: '#12131A',
    borderColor: '#12131A',
  },
  dayChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  dayChipTextActive: {
    color: '#EAB308',
  },
  restDot: {
    fontSize: 10,
  },
  trackFilters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 6,
    marginBottom: 12,
  },
  trackPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  trackPillActive: {
    backgroundColor: '#12131A',
  },
  trackPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  trackPillTextActive: {
    color: '#EAB308',
  },
  dayBanner: {
    marginHorizontal: 20,
    backgroundColor: '#12131A',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  dayBannerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dayBannerSub: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  taskList: {
    paddingHorizontal: 20,
    paddingBottom: 90,
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
