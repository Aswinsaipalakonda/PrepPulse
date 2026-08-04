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
          paddingHorizontal: 6,
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 12,
          right: 12,
          borderRadius: 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 10,
          flexDirection: 'row',
          alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabWrapper, focused && styles.activePill]}>
              <Home size={18} color={focused ? '#FFFFFF' : '#12131A'} />
              <Text style={[styles.label, focused ? styles.activeText : styles.inactiveText]} numberOfLines={1}>
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
            <View style={[styles.tabWrapper, focused && styles.activePill]}>
              <ClipboardList size={18} color={focused ? '#FFFFFF' : '#12131A'} />
              <Text style={[styles.label, focused ? styles.activeText : styles.inactiveText]} numberOfLines={1}>
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
            <View style={[styles.tabWrapper, focused && styles.activePill]}>
              <Calendar size={18} color={focused ? '#FFFFFF' : '#12131A'} />
              <Text style={[styles.label, focused ? styles.activeText : styles.inactiveText]} numberOfLines={1}>
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
            <View style={[styles.tabWrapper, focused && styles.activePill]}>
              <User size={18} color={focused ? '#FFFFFF' : '#12131A'} />
              <Text style={[styles.label, focused ? styles.activeText : styles.inactiveText]} numberOfLines={1}>
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
  tabWrapper: {
    width: '100%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    paddingHorizontal: 2,
  },
  activePill: {
    backgroundColor: '#12131A',
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
