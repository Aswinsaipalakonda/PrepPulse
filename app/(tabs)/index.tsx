import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppStore } from '../../context/AppContext';
import { ProgressRing } from '../../components/ProgressRing';
import { TaskCard } from '../../components/TaskCard';
import { HeaderStats } from '../../components/HeaderStats';
import { Bell, Plus, Calendar as CalendarIcon } from 'lucide-react-native';
export default function TodayScreen() {
  const { dayPlans, currentDay, userName, toggleTaskCompletion } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'todo' | 'completed'>('all');

  const todayPlan = dayPlans.find((p) => p.dayNumber === currentDay) || dayPlans[0];
  const tasks = todayPlan.tasks;

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;
  const pendingCount = totalCount - completedCount;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'todo') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <View style={styles.userProfile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.greetingTitle}>Good Morning</Text>
            <Text style={styles.userName}>{userName} 👋</Text>
          </View>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconCircle}>
            <Plus size={20} color="#12131A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Bell size={20} color="#12131A" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.heroHeading}>Let’s Make{"\n"}Today Productive</Text>

      <HeaderStats />

      {/* Progress Card (Dark Glassmorphism style matching screen.png) */}
      <View style={styles.progressCard}>
        <View style={styles.progressCardHeader}>
          <Text style={styles.progressCardTitle}>Today's Progress</Text>
        </View>
        <View style={styles.progressCardBody}>
          <ProgressRing percentage={completionPercentage} size={110} strokeWidth={10} color="#9333EA" />

          <View style={styles.statsColumn}>
            <View style={styles.statRow}>
              <View style={styles.statIconBadge}>
                <CalendarIcon size={14} color="#9CA3AF" />
              </View>
              <View>
                <Text style={styles.statNumber}>{totalCount}</Text>
                <Text style={styles.statLabel}>Total Tasks</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statIconBadge}>
                <CalendarIcon size={14} color="#10B981" />
              </View>
              <View>
                <Text style={styles.statNumber}>{completedCount}</Text>
                <Text style={styles.statLabel}>Completed Task</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statIconBadge}>
                <CalendarIcon size={14} color="#F59E0B" />
              </View>
              <View>
                <Text style={styles.statNumber}>{pendingCount}</Text>
                <Text style={styles.statLabel}>Pending Task</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Pill Status Filter Bar */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'all' && styles.filterPillActive]}
          onPress={() => setFilter('all')}
        >
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{totalCount}</Text>
          </View>
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, filter === 'todo' && styles.filterPillActive]}
          onPress={() => setFilter('todo')}
        >
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{pendingCount}</Text>
          </View>
          <Text style={[styles.filterText, filter === 'todo' && styles.filterTextActive]}>To Do</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, filter === 'completed' && styles.filterPillActive]}
          onPress={() => setFilter('completed')}
        >
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{completedCount}</Text>
          </View>
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Task Cards List */}
      <View style={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks found in this view 🎉</Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggleComplete={toggleTaskCompletion} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 54,
    paddingBottom: 110,
    backgroundColor: '#F5EBF0',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  greetingTitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#12131A',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  heroHeading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#12131A',
    lineHeight: 38,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  progressCard: {
    backgroundColor: '#12131A',
    borderRadius: 28,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  progressCardHeader: {
    marginBottom: 16,
  },
  progressCardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  progressCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsColumn: {
    gap: 12,
    flex: 1,
    marginLeft: 24,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#12131A',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  filterPillActive: {
    backgroundColor: '#BEF264',
  },
  countBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#12131A',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  filterTextActive: {
    color: '#12131A',
  },
  taskList: {
    marginBottom: 20,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
});
