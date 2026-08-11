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
      title: '☀️ Daily Morning Focus Ready',
      body: `Good morning ${userName}! Day ${currentDay} tasks are prepared for your 90-day placement agenda.`,
      time: '08:00 AM',
      type: 'reminder',
      read: false,
    },
    {
      id: 'n-2',
      title: '🔥 Streak Preservation Alert',
      body: `Keep your ${userStats.currentStreak}-day placement streak alive by completing 2 or more modules today.`,
      time: '08:00 PM',
      type: 'streak',
      read: false,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleTestPushTrigger = () => {
    const newAlert: NotificationItem = {
      id: `test-${Date.now()}`,
      title: '🔔 Test Notification Triggered',
      body: `Dynamic OneSignal notification reminder created successfully for ${userName}!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'reminder',
      read: false,
    };
    setNotifications([newAlert, ...notifications]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header Dark Banner */}
      <View style={styles.darkHeaderBanner}>
        <TouchableOpacity style={styles.iconCircleDark} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.darkHeaderTitle}>Notification Center</Text>

        <TouchableOpacity style={styles.testPushBtn} onPress={handleTestPushTrigger}>
          <Sparkles size={16} color="#12131A" />
          <Text style={styles.testPushText}>Test Push</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Action Bar */}
        <View style={styles.actionBar}>
          <Text style={styles.unreadCount}>
            {notifications.filter((n) => !n.read).length} Unread Alerts
          </Text>
          {notifications.length > 0 && (
            <TouchableOpacity style={styles.markReadBtn} onPress={markAllRead}>
              <CheckCircle2 size={14} color="#EAB308" />
              <Text style={styles.markReadText}>Mark All Read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications Feed */}
        <ScrollView contentContainerStyle={styles.feed} showsVerticalScrollIndicator={false}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Bell size={40} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No New Notifications</Text>
              <Text style={styles.emptySub}>
                Real-time OneSignal placement alerts & daily morning focus reminders will appear here.
              </Text>
            </View>
          ) : (
            notifications.map((item) => (
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
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 10,
  },
  iconCircleDark: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  testPushBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAB308',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  testPushText: {
    color: '#12131A',
    fontSize: 12,
    fontWeight: '800',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#12131A',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 18,
  },
});
