import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Map, FolderGit2, BarChart2, User } from 'lucide-react-native';
import { View, StyleSheet, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#12131A',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 82 : 70,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          paddingTop: 12,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 32,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <LayoutDashboard size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="roadmap"
        options={{
          title: 'Roadmap',
          tabBarIcon: ({ color }) => <Map size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="fyp"
        options={{
          title: 'FYP',
          tabBarIcon: ({ color }) => <FolderGit2 size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <BarChart2 size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
