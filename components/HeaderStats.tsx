import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Flame, Award, Calendar } from 'lucide-react-native';
import { useAppStore } from '../context/AppContext';

export const HeaderStats: React.FC = () => {
  const { userStats, currentDay } = useAppStore();

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Calendar size={14} color="#12131A" />
        <Text style={styles.badgeText}>Day {currentDay}/90</Text>
      </View>

      <View style={styles.rightGroup}>
        <View style={[styles.badge, styles.streakBadge]}>
          <Flame size={15} color="#F97316" fill="#F97316" />
          <Text style={[styles.badgeText, { color: '#C2410C' }]}>{userStats.currentStreak} Days</Text>
        </View>

        <View style={[styles.badge, styles.pointsBadge]}>
          <Award size={15} color="#8B5CF6" />
          <Text style={[styles.badgeText, { color: '#6D28D9' }]}>{userStats.totalPoints} pts</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rightGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  streakBadge: {
    backgroundColor: '#FFEDD5',
    borderColor: '#FDBA74',
  },
  pointsBadge: {
    backgroundColor: '#F3E8FF',
    borderColor: '#DDD6FE',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#12131A',
  },
});
