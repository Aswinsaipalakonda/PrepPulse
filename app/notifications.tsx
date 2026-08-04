import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../context/AppContext';
import { Bell, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'streak' | 'reminder' | 'milestone' | 'info';
  read: boolean;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { currentDay, userStats, userName } = useAppStore();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: `☀️ Day ${currentDay} Placement Plan Ready!`,
      body: `Good morning ${userName}! Your 90-day agenda for Day ${currentDay} is active. Master Java, DSA & PERN modules.`,
      time: '08:00 AM Today',
      type: 'reminder',
      read: false,
    },
    {
      id: 'n-2',
      title: `🔥 ${userStats.currentStreak}-Day Streak Milestone!`,
      body: `Awesome consistency! You have earned ${userStats.totalPoints} pts on your placement roadmap so far.`,
      time: 'Yesterday',
      type: 'streak',
      read: true,
    },
    {
      id: 'n-3',
      title: '📁 FYP Architecture Finalized',
      body: 'Your Campus Placement Portal capstone project architecture has been updated.',
      time: '2 days ago',
      type: 'milestone',
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#12131A" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Notification Center</Text>
            <Text style={styles.headerSubtitle}>Push alerts, daily reminders & streak rewards</Text>
          </View>
        </View>

        {/* Action Bar */}
        <View style={styles.actionBar}>
          <Text style={styles.unreadCount}>
            {notifications.filter((n) => !n.read).length} Unread Alerts
          </Text>
          <TouchableOpacity style={styles.markReadBtn} onPress={markAllRead}>
            <CheckCircle2 size={14} color="#EAB308" />
            <Text style={styles.markReadText}>Mark All Read</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Feed */}
        <ScrollView contentContainerStyle={styles.feed} showsVerticalScrollIndicator={false}>
          {notifications.map((item) => (
            <View key={item.id} style={[styles.notificationCard, !item.read && styles.unreadCard]}>
              <View style={styles.iconCircle}>
                {item.type === 'streak' ? (
                  <Sparkles size={20} color="#F97316" />
                ) : (
                  <Bell size={20} color="#EAB308" />
                )}
              </View>

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardTime}>{item.time}</Text>
                </View>
                <Text style={styles.cardBody}>{item.body}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
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
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#12131A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  unreadCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#12131A',
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#12131A',
  },
  feed: {
    gap: 12,
    paddingBottom: 40,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  unreadCard: {
    borderColor: '#EAB308',
    backgroundColor: '#FFFDF5',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#12131A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#12131A',
    flex: 1,
  },
  cardTime: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
});
