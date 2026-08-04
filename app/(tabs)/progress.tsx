import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useAppStore } from '../../context/AppContext';
import { Flame, Award, BookOpen, Clock, CheckCircle2 } from 'lucide-react-native';

export default function ProgressScreen() {
  const { userStats, dayPlans } = useAppStore();

  // Calculate real track breakdown dynamically from completed tasks
  const allTasks = dayPlans.flatMap((p) => p.tasks);
  const totalTasksCount = allTasks.length;
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

  // GitHub contribution graph data (last 28 days breakdown)
  const past28Days = Array.from({ length: 28 }, (_, i) => {
    const dayNum = i + 1;
    const plan = dayPlans.find((p) => p.dayNumber === dayNum);
    const completedInDay = plan ? plan.tasks.filter((t) => t.isCompleted).length : 0;
    return { dayNum, count: completedInDay };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
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
            <Text style={styles.statValue}>{Math.round((userStats.completedTasksCount * 40) / 60)} hrs</Text>
            <Text style={styles.statLabel}>Total Study Time</Text>
          </View>
        </View>

        {/* GitHub Style Contribution Graph Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>28-Day Streak Contribution Grid</Text>
          <Text style={styles.cardSub}>Daily task completion heatmap</Text>

          <View style={styles.githubGrid}>
            {past28Days.map((item) => {
              const intensity = item.count === 0 ? 0 : item.count <= 2 ? 1 : item.count <= 4 ? 2 : 3;
              const bgColors = ['#E5E7EB', '#86EFAC', '#22C55E', '#15803D'];
              return (
                <View key={item.dayNum} style={styles.githubGridItem}>
                  <View style={[styles.githubSquare, { backgroundColor: bgColors[intensity] }]} />
                  <Text style={styles.githubDayLabel}>D{item.dayNum}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.legendRow}>
            <Text style={styles.legendText}>Less</Text>
            <View style={[styles.legendSquare, { backgroundColor: '#E5E7EB' }]} />
            <View style={[styles.legendSquare, { backgroundColor: '#86EFAC' }]} />
            <View style={[styles.legendSquare, { backgroundColor: '#22C55E' }]} />
            <View style={[styles.legendSquare, { backgroundColor: '#15803D' }]} />
            <Text style={styles.legendText}>More</Text>
          </View>
        </View>

        {/* Dynamic Track Distribution */}
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
      </ScrollView>
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
  githubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  githubGridItem: {
    alignItems: 'center',
    gap: 4,
  },
  githubSquare: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },
  githubDayLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6B7280',
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
    borderRadius: 3,
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
});
