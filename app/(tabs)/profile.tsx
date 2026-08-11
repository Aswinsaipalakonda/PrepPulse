import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../context/AppContext';
import { Bell, RotateCcw, LogOut, ChevronRight, Flame, Award, BookOpen, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { scheduleDailyReminders, sendInstantTestNotification } from '../../lib/notifications';

export default function ProfileScreen() {
  const router = useRouter();
  const { userName, resetProgram, userStats, dayPlans } = useAppStore();

  const [morningReminder, setMorningReminder] = useState(true);
  const [eveningReminder, setEveningReminder] = useState(true);

  // Dynamic progress stats calculation
  const allTasks = dayPlans.flatMap((p) => p.tasks);
  const completedTasks = allTasks.filter((t) => t.isCompleted);

  const getTrackStats = (trackKey: string) => {
    const trackTotal = allTasks.filter((t) => t.track === trackKey || (trackKey === 'dev' && (t.track === 'javafullstack' || t.track === 'pern'))).length;
    const trackDone = completedTasks.filter((t) => t.track === trackKey || (trackKey === 'dev' && (t.track === 'javafullstack' || t.track === 'pern'))).length;
    const pct = trackTotal > 0 ? Math.round((trackDone / trackTotal) * 100) : 0;
    return { trackTotal, trackDone, pct };
  };

  const tracks = [
    { key: 'dsa', label: 'Striver A2Z Java DSA', color: '#8B5CF6' },
    { key: 'dev', label: 'PERN & Spring Full-Stack', color: '#0284C7' },
    { key: 'aptitude', label: 'IndiaBIX Aptitude', color: '#F59E0B' },
    { key: 'interview', label: 'CS Notes & Technical HR', color: '#10B981' },
    { key: 'fyp', label: 'Final-Year Project', color: '#EC4899' },
  ];

  // Interactive Monthly Calendar View (31-day layout with day-of-week headers)
  const monthDays = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const plan = dayPlans.find((p) => p.dayNumber === dayNum);
    const totalInDay = plan ? plan.tasks.length : 0;
    const completedInDay = plan ? plan.tasks.filter((t) => t.isCompleted).length : 0;
    const isCompletedDay = completedInDay >= 2;
    return { dayNum, totalInDay, completedInDay, isCompletedDay };
  });

  const weekHeaderLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<any>(null);

  const handleMorningToggle = (val: boolean) => {
    setMorningReminder(val);
    scheduleDailyReminders(val, eveningReminder);
    if (val) {
      sendInstantTestNotification('☀️ Morning Reminder Scheduled', 'Daily 08:00 AM placement focus reminder is active.');
    }
  };

  const handleEveningToggle = (val: boolean) => {
    setEveningReminder(val);
    scheduleDailyReminders(morningReminder, val);
    if (val) {
      sendInstantTestNotification('🌆 Evening Reminder Scheduled', 'Daily 08:00 PM streak preservation reminder is active.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset 90-Day Curriculum',
      'Are you sure you want to reset your placement progress back to Day 1?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetProgram();
            Alert.alert('Program Reset', 'Your 90-day study plan has been reset to Day 1.');
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header Dark Banner */}
      <View style={styles.darkHeaderBanner}>
        <Text style={styles.darkHeaderTitle}>Profile & Placement Analytics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>


        {/* User Profile Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userName.toLowerCase().replace(/\s+/g, '')}.placement@gmail.com</Text>
          </View>
        </View>

        {/* Study Analytics Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#FFEDD5' }]}>
              <Flame size={20} color="#F97316" fill="#F97316" />
            </View>
            <Text style={styles.statValue}>{userStats.currentStreak} Days</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
              <Award size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.statValue}>{userStats.totalPoints} pts</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#CCFBF1' }]}>
              <BookOpen size={20} color="#0D9488" />
            </View>
            <Text style={styles.statValue}>{userStats.solvedProblems}</Text>
            <Text style={styles.statLabel}>Problems Solved</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Clock size={20} color="#0284C7" />
            </View>
            <Text style={styles.statValue}>{Math.round((userStats.completedTasksCount * 40) / 60)} hrs</Text>
            <Text style={styles.statLabel}>Total Study Time</Text>
          </View>
        </View>

        {/* Interactive Calendar View Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Placement Progress Calendar</Text>
          <Text style={styles.cardSub}>Tap any day to view completion breakdown</Text>

          {/* Weekday Labels Header */}
          <View style={styles.calendarHeaderRow}>
            {weekHeaderLabels.map((dayLabel) => (
              <Text key={dayLabel} style={styles.calendarHeaderCell}>
                {dayLabel}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {monthDays.map((item) => {
              const bgColors = ['#F3F4F6', '#DCFCE7', '#22C55E', '#15803D'];
              const intensity = item.completedInDay === 0 ? 0 : item.completedInDay === 1 ? 1 : item.completedInDay === 2 ? 2 : 3;
              return (
                <TouchableOpacity
                  key={item.dayNum}
                  style={[styles.calendarDayCell, { backgroundColor: bgColors[intensity] }]}
                  onPress={() => setSelectedCalendarDay(item)}
                >
                  <Text
                    style={[
                      styles.calendarDayNum,
                      item.completedInDay >= 2 && { color: '#FFFFFF', fontWeight: '800' },
                    ]}
                  >
                    {item.dayNum}
                  </Text>
                  {item.completedInDay >= 2 && <Text style={styles.checkDot}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.legendRow}>
            <Text style={styles.legendText}>0 tasks</Text>
            <View style={[styles.legendSquare, { backgroundColor: '#F3F4F6' }]} />
            <View style={[styles.legendSquare, { backgroundColor: '#DCFCE7' }]} />
            <View style={[styles.legendSquare, { backgroundColor: '#22C55E' }]} />
            <View style={[styles.legendSquare, { backgroundColor: '#15803D' }]} />
            <Text style={styles.legendText}>Completed (2+ tasks)</Text>
          </View>
        </View>

        {/* Track Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Real-Time Track Breakdown</Text>
          <View style={styles.trackBreakdownList}>
            {tracks.map((item) => {
              const { pct, trackDone, trackTotal } = getTrackStats(item.key);
              return (
                <View key={item.key} style={styles.trackItem}>
                  <View style={styles.trackItemHeader}>
                    <Text style={styles.trackItemLabel}>{item.label}</Text>
                    <Text style={styles.trackItemPct}>{pct}% ({trackDone}/{trackTotal})</Text>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: item.color }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Bell size={18} color="#EAB308" />
            <Text style={styles.cardTitle}>Daily Push Notifications</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Morning Plan Ready (08:00 AM)</Text>
              <Text style={styles.settingSub}>Daily focus tasks notification</Text>
            </View>
            <Switch
              value={morningReminder}
              onValueChange={handleMorningToggle}
              trackColor={{ false: '#D1D5DB', true: '#EAB308' }}
              thumbColor={morningReminder ? '#12131A' : '#F4F4F5'}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Evening Focus Check (08:00 PM)</Text>
              <Text style={styles.settingSub}>Streak preservation reminder</Text>
            </View>
            <Switch
              value={eveningReminder}
              onValueChange={handleEveningToggle}
              trackColor={{ false: '#D1D5DB', true: '#EAB308' }}
              thumbColor={eveningReminder ? '#12131A' : '#F4F4F5'}
            />
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handleReset}>
            <RotateCcw size={18} color="#EF4444" />
            <Text style={[styles.actionLabel, { color: '#EF4444' }]}>Reset 90-Day Curriculum</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionRow, { borderBottomWidth: 0 }]} onPress={handleSignOut}>
            <LogOut size={18} color="#6B7280" />
            <Text style={styles.actionLabel}>Sign Out</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Calendar Day Detail Modal */}
      <Modal visible={!!selectedCalendarDay} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Day {selectedCalendarDay?.dayNum} Placement Breakdown</Text>
            <Text style={styles.modalSub}>
              {selectedCalendarDay?.completedInDay >= 2
                ? '🔥 Day Streak Completed!'
                : `${selectedCalendarDay?.completedInDay || 0} of ${selectedCalendarDay?.totalInDay || 4} tasks completed`}
            </Text>

            <View style={styles.modalBadgeRow}>
              <Text style={[styles.modalStatusBadge, selectedCalendarDay?.isCompletedDay ? styles.badgeSuccess : styles.badgePending]}>
                {selectedCalendarDay?.isCompletedDay ? 'Streak Earned ✓' : 'Incomplete'}
              </Text>
            </View>

            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedCalendarDay(null)}>
              <Text style={styles.modalCloseText}>Close</Text>
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
  },
  darkHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  container: {
    padding: 20,
    paddingBottom: 110,
  },

  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#12131A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#12131A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#EAB308',
    fontSize: 22,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#12131A',
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#12131A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#12131A',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  calendarHeaderCell: {
    width: '13%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarDayCell: {
    width: '13%',
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  checkDot: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '800',
    marginTop: -2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  legendSquare: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#12131A',
  },
  modalSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalBadgeRow: {
    marginVertical: 6,
  },
  modalStatusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
  },
  badgePending: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  modalCloseBtn: {
    backgroundColor: '#12131A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 6,
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  trackBreakdownList: {
    gap: 14,
    marginTop: 12,
  },
  trackItem: {
    gap: 6,
  },
  trackItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackItemLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  trackItemPct: {
    fontSize: 13,
    fontWeight: '700',
    color: '#12131A',
  },
  barBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  settingSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
});
