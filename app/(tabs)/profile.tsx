import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useAppStore } from '../../context/AppContext';
import { Bell, RotateCcw, LogOut, ChevronRight, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { scheduleDailyReminders, sendInstantTestNotification } from '../../lib/notifications';

export default function ProfileScreen() {
  const router = useRouter();
  const { userName, resetProgram } = useAppStore();

  const [morningReminder, setMorningReminder] = useState(true);
  const [eveningReminder, setEveningReminder] = useState(true);

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile & Preferences</Text>
          <Text style={styles.headerSubtitle}>Manage notification times & program settings</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userName.toLowerCase().replace(/\s+/g, '')}.placement@gmail.com</Text>
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
