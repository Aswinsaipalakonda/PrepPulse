import React from 'react';
import { Tabs } from 'expo-router';
import { Home, ClipboardList, Calendar, User } from 'lucide-react-native';
import { Platform, View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 78 : 70,
          paddingHorizontal: 8,
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 22 : 14,
          left: 14,
          right: 14,
          borderRadius: 38,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 10,
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
            <View style={[styles.tabItem, focused && styles.activePill]}>
              <Home size={17} color={focused ? '#FFFFFF' : '#12131A'} />
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
              <ClipboardList size={17} color={focused ? '#FFFFFF' : '#12131A'} />
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
              <Calendar size={17} color={focused ? '#FFFFFF' : '#12131A'} />
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
              <User size={17} color={focused ? '#FFFFFF' : '#12131A'} />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width < 380 ? 10 : 14,
    paddingVertical: 10,
    borderRadius: 30,
    minWidth: width < 380 ? 64 : 72,
  },
  activePill: {
    backgroundColor: '#12131A',
    borderRadius: 30,
  },
  label: {
    fontSize: 9.5,
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
