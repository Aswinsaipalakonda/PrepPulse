import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppStore } from '../../context/AppContext';
import { Flame, Award, BookOpen, Clock, CheckCircle2 } from 'lucide-react-native';

export default function ProgressScreen() {
  const { userStats } = useAppStore();

  const mockWeeklyActivity = [
    { day: 'Mon', count: 5, active: true },
    { day: 'Tue', count: 4, active: true },
    { day: 'Wed', count: 5, active: true },
    { day: 'Thu', count: 0, active: false },
    { day: 'Fri', count: 4, active: true },
    { day: 'Sat', count: 4, active: true },
    { day: 'Sun', count: 3, active: true },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Analytics & Progress</Text>
        <Text style={styles.headerSubtitle}>Comprehensive report of solved problems & streaks</Text>
      </View>

      {/* Grid Summary Cards */}
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
          <Text style={styles.statValue}>{userStats.totalPoints}</Text>
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
          <Text style={styles.statValue}>{Math.round(userStats.studyMinutes / 60)} hrs</Text>
          <Text style={styles.statLabel}>Total Study Time</Text>
        </View>
      </View>

      {/* Weekly Activity Grid */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Week's Activity Heatmap</Text>
        <View style={styles.heatmapRow}>
          {mockWeeklyActivity.map((item, idx) => (
            <View key={idx} style={styles.heatmapCol}>
              <View style={[styles.heatSquare, item.active ? styles.heatActive : styles.heatInactive]}>
                {item.active && <CheckCircle2 size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.heatDayText}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Track Distribution */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Track Breakdown</Text>
        <View style={styles.trackBreakdownList}>
          {[
            { label: 'Striver A2Z Java DSA', pct: '75%', color: '#8B5CF6' },
            { label: 'PERN & Spring Full-Stack', pct: '60%', color: '#0284C7' },
            { label: 'IndiaBIX Aptitude', pct: '85%', color: '#F59E0B' },
            { label: 'CS Notes & Technical HR', pct: '70%', color: '#10B981' },
            { label: 'Final-Year Project', pct: '50%', color: '#EC4899' },
          ].map((item, idx) => (
            <View key={idx} style={styles.trackItem}>
              <View style={styles.trackItemHeader}>
                <Text style={styles.trackItemLabel}>{item.label}</Text>
                <Text style={styles.trackItemPct}>{item.pct}</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: item.pct as `${number}%`, backgroundColor: item.color }]} />
              </View>
            </View>
          ))}
        </View>
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
  header: {
    marginBottom: 20,
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
    marginBottom: 16,
  },
  heatmapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heatmapCol: {
    alignItems: 'center',
    gap: 6,
  },
  heatSquare: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatActive: {
    backgroundColor: '#10B981',
  },
  heatInactive: {
    backgroundColor: '#E5E7EB',
  },
  heatDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  trackBreakdownList: {
    gap: 14,
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
});
