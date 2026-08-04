import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useAppStore } from '../../context/AppContext';
import { ProgressRing } from '../../components/ProgressRing';
import { TaskCard } from '../../components/TaskCard';
import { HeaderStats } from '../../components/HeaderStats';
import { Bell, Plus, Calendar as CalendarIcon, Play, CheckCircle2, X } from 'lucide-react-native';
import { sendInstantTestNotification } from '../../lib/notifications';

export default function TodayScreen() {
  const { dayPlans, currentDay, userName, toggleTaskCompletion, isDayStarted, startDay, addNewCustomTask } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'todo' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTrack, setTaskTrack] = useState<'dsa' | 'dev' | 'aptitude' | 'interview' | 'fyp'>('dsa');

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

  const handleStartDay = () => {
    startDay();
    sendInstantTestNotification(
      `🚀 Day ${currentDay} Challenge Started!`,
      `Let's conquer today's ${totalCount} placement modules, ${userName}!`
    );
    Alert.alert(
      `Day ${currentDay} Started! 🚀`,
      `Your 90-day placement timer for Day ${currentDay} is active. Complete your tasks to maintain your streak!`
    );
  };

  const handleNotificationPress = () => {
    sendInstantTestNotification(
      '🔔 PrepPulse Focus Alert',
      `You have ${pendingCount} pending tasks for Day ${currentDay}. Complete them to earn points!`
    );
    Alert.alert(
      'Notification Test Sent 🔔',
      `A push notification has been scheduled. (${pendingCount} pending tasks for today)`
    );
  };

  const handleCreateTask = () => {
    if (taskTitle.trim()) {
      addNewCustomTask(taskTitle.trim(), taskTrack);
      setTaskTitle('');
      setShowAddModal(false);
      Alert.alert('Task Created 🎯', 'New task added to today\'s placement agenda!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Navigation */}
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
            <TouchableOpacity style={styles.iconCircle} onPress={() => setShowAddModal(true)}>
              <Plus size={20} color="#12131A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle} onPress={handleNotificationPress}>
              <Bell size={20} color="#12131A" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.heroHeading}>Let’s Make{"\n"}Today Productive</Text>

        <HeaderStats />

        {/* Start Learning Day Action Banner */}
        <View style={styles.startDayCard}>
          <View style={styles.startDayInfo}>
            <Text style={styles.startDayTitle}>
              {isDayStarted ? `Day ${currentDay} in Progress ⚡` : `Ready for Day ${currentDay}?`}
            </Text>
            <Text style={styles.startDaySub}>
              {isDayStarted
                ? `${completedCount} of ${totalCount} modules finished`
                : 'Click to start your daily timer & streak tracking'}
            </Text>
          </View>

          {!isDayStarted ? (
            <TouchableOpacity style={styles.startBtn} onPress={handleStartDay}>
              <Play size={16} color="#12131A" fill="#12131A" />
              <Text style={styles.startBtnText}>Start Learning</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.startedBadge}>
              <CheckCircle2 size={16} color="#10B981" />
              <Text style={styles.startedText}>Active</Text>
            </View>
          )}
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressCardHeader}>
            <Text style={styles.progressCardTitle}>Today's Progress</Text>
          </View>
          <View style={styles.progressCardBody}>
            <ProgressRing percentage={completionPercentage} size={110} strokeWidth={10} color="#EAB308" />

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

        {/* Filter Bar */}
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

        {/* Task List */}
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

      {/* Add Custom Task Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Custom Task for Today</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Task title..."
              value={taskTitle}
              onChangeText={setTaskTitle}
            />

            <Text style={styles.trackSelectLabel}>Select Track:</Text>
            <View style={styles.trackSelectRow}>
              {(['dsa', 'dev', 'aptitude', 'interview', 'fyp'] as const).map((tr) => (
                <TouchableOpacity
                  key={tr}
                  style={[styles.trackChip, taskTrack === tr && styles.trackChipActive]}
                  onPress={() => setTaskTrack(tr)}
                >
                  <Text style={[styles.trackChipText, taskTrack === tr && styles.trackChipTextActive]}>
                    {tr.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleCreateTask}>
              <Text style={styles.modalSaveBtnText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EBF0',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    padding: 20,
    paddingBottom: 90,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    shadowRadius: 4,
    elevation: 2,
  },
  heroHeading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#12131A',
    lineHeight: 34,
    marginBottom: 16,
  },
  startDayCard: {
    backgroundColor: '#12131A',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  startDayInfo: {
    flex: 1,
    paddingRight: 10,
  },
  startDayTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  startDaySub: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  startBtn: {
    backgroundColor: '#EAB308',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  startBtnText: {
    color: '#12131A',
    fontSize: 13,
    fontWeight: '800',
  },
  startedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  startedText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  progressCard: {
    backgroundColor: '#12131A',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  progressCardHeader: {
    marginBottom: 16,
  },
  progressCardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  progressCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsColumn: {
    gap: 12,
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#12131A',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterPillActive: {
    backgroundColor: '#84CC16',
  },
  countBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
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
    gap: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#12131A',
  },
  modalInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    marginBottom: 16,
  },
  trackSelectLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  trackSelectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  trackChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  trackChipActive: {
    backgroundColor: '#12131A',
  },
  trackChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  trackChipTextActive: {
    color: '#FFFFFF',
  },
  modalSaveBtn: {
    backgroundColor: '#EAB308',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveBtnText: {
    color: '#12131A',
    fontWeight: '800',
    fontSize: 15,
  },
});
