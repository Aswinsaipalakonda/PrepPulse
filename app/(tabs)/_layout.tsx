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
          height: Platform.OS === 'ios' ? 70 : 64,
          paddingHorizontal: 8,
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 20 : 14,
          left: 16,
          right: 16,
          borderRadius: 36,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 14,
          elevation: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabPill]}>
              <Home size={18} color={focused ? '#FFFFFF' : '#12131A'} />
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
              <ClipboardList size={18} color={focused ? '#FFFFFF' : '#12131A'} />
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
              <Calendar size={18} color={focused ? '#FFFFFF' : '#12131A'} />
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
              <User size={18} color={focused ? '#FFFFFF' : '#12131A'} />
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
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 28,
    marginHorizontal: 2,
  },
  activeTabPill: {
    backgroundColor: '#12131A',
    paddingVertical: 8,
    borderRadius: 28,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
  inactiveTabLabel: {
    color: '#12131A',
  },
});
