import React from 'react';
import { Tabs } from 'expo-router';
import { Home, ClipboardList, Calendar, User } from 'lucide-react-native';
import { Platform, View, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 72 : 64,
          paddingHorizontal: 12,
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 16 : 12,
          left: 20,
          right: 20,
          borderRadius: 36,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabPill]}>
              <Home size={20} color={focused ? '#FFFFFF' : '#12131A'} />
              <Text style={[styles.tabLabel, focused ? styles.activeTabLabel : styles.inactiveTabLabel]}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="fyp"
        options={{
          title: 'Projects',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabPill]}>
              <ClipboardList size={20} color={focused ? '#FFFFFF' : '#12131A'} />
              <Text style={[styles.tabLabel, focused ? styles.activeTabLabel : styles.inactiveTabLabel]}>
                Projects
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="roadmap"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabPill]}>
              <Calendar size={20} color={focused ? '#FFFFFF' : '#12131A'} />
              <Text style={[styles.tabLabel, focused ? styles.activeTabLabel : styles.inactiveTabLabel]}>
                Calendar
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabPill]}>
              <User size={20} color={focused ? '#FFFFFF' : '#12131A'} />
              <Text style={[styles.tabLabel, focused ? styles.activeTabLabel : styles.inactiveTabLabel]}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          href: null, // Merged inside Profile screen
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
  },
  activeTabPill: {
    backgroundColor: '#12131A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
  inactiveTabLabel: {
    color: '#12131A',
  },
});
