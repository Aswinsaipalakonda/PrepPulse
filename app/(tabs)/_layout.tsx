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
          height: Platform.OS === 'ios' ? 76 : 68,
          paddingHorizontal: 10,
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 22 : 14,
          left: 12,
          right: 12,
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
            <View style={[styles.tabItem, focused && styles.activePill]}>
              <Home size={18} color={focused ? '#FFFFFF' : '#12131A'} />
              <Text style={[styles.label, focused ? styles.activeText : styles.inactiveText]}>
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
            <View style={[styles.tabItem, focused && styles.activePill]}>
              <ClipboardList size={18} color={focused ? '#FFFFFF' : '#12131A'} />
              <Text style={[styles.label, focused ? styles.activeText : styles.inactiveText]}>
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
            <View style={[styles.tabItem, focused && styles.activePill]}>
              <Calendar size={18} color={focused ? '#FFFFFF' : '#12131A'} />
              <Text style={[styles.label, focused ? styles.activeText : styles.inactiveText]}>
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
            <View style={[styles.tabItem, focused && styles.activePill]}>
              <User size={18} color={focused ? '#FFFFFF' : '#12131A'} />
              <Text style={[styles.label, focused ? styles.activeText : styles.inactiveText]}>
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
    width: 66,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
  },
  activePill: {
    backgroundColor: '#12131A',
    width: 66,
    height: 52,
    borderRadius: 26,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#12131A',
  },
});
