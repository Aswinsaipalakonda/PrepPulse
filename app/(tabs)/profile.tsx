import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useAppStore } from '../../context/AppContext';
import { Bell, Shield, RotateCcw, LogOut, ChevronRight, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { resetProgram } = useAppStore();

  const [morningReminder, setMorningReminder] = useState(true);
  const [eveningReminder, setEveningReminder] = useState(true);

  const handleReset = () => {
    resetProgram();
    Alert.alert('Program Reset', 'Your 90-day study plan has been reset to Day 1.');
  };

  const handleSignOut = () => {
    router.replace('/(auth)/sign-in');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile & Preferences</Text>
        <Text style={styles.headerSubtitle}>Manage notification times & program settings</Text>
      </View>

      {/* User Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>O</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Olivia Reed</Text>
          <Text style={styles.userEmail}>olivia.placement@gmail.com</Text>
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Bell size={18} color="#8B5CF6" />
          <Text style={styles.cardTitle}>Daily Push Notifications</Text>
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Morning Plan Ready (08:00 AM)</Text>
            <Text style={styles.settingSub}>Daily focus tasks notification</Text>
          </View>
          <Switch
            value={morningReminder}
            onValueChange={setMorningReminder}
            trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
          />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Evening Focus Check (08:00 PM)</Text>
            <Text style={styles.settingSub}>Streak preservation reminder</Text>
          </View>
          <Switch
            value={eveningReminder}
            onValueChange={setEveningReminder}
            trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
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
    color: '#FFFFFF',
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#12131A',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
