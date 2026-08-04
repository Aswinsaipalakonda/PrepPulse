import React from 'react';
import { Tabs } from 'expo-router';
import { Home, ClipboardList, Calendar, User } from 'lucide-react-native';
import { Platform, View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');
const BAR_MARGIN = 12;
const BAR_WIDTH = width - BAR_MARGIN * 2;
const TAB_WIDTH = BAR_WIDTH / 4;
const PILL_WIDTH = 68;
const PILL_HEIGHT = 52;

function CustomTabBar({ state, descriptors, navigation }: any) {
  const [translateX] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    const activeIndex = state.index;
    const targetX = activeIndex * TAB_WIDTH + (TAB_WIDTH - PILL_WIDTH) / 2;
    Animated.spring(translateX, {
      toValue: targetX,
      useNativeDriver: true,
      stiffness: 220,
      damping: 24,
      mass: 0.8,
    }).start();
  }, [state.index]);

  return (
    <View style={styles.tabBarContainer}>
      {/* Sliding Dark Pill Indicator */}
      <Animated.View
        style={[
          styles.slidingPill,
          {
            transform: [{ translateX }],
          },
        ]}
      />

      {state.routes.map((route: any, index: number) => {
        if (route.name === 'progress') return null;

        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const renderIcon = () => {
          const color = isFocused ? '#FFFFFF' : '#12131A';
          if (route.name === 'index') return <Home size={18} color={color} />;
          if (route.name === 'fyp') return <ClipboardList size={18} color={color} />;
          if (route.name === 'roadmap') return <Calendar size={18} color={color} />;
          if (route.name === 'profile') return <User size={18} color={color} />;
          return null;
        };

        const label =
          route.name === 'index'
            ? 'Home'
            : route.name === 'fyp'
            ? 'Projects'
            : route.name === 'roadmap'
            ? 'Calendar'
            : 'Profile';

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.tabCell}
          >
            <View style={styles.tabContent}>
              {renderIcon()}
              <Text style={[styles.label, isFocused ? styles.activeLabel : styles.inactiveLabel]}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="fyp" options={{ title: 'Projects' }} />
      <Tabs.Screen name="roadmap" options={{ title: 'Calendar' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="progress" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    height: Platform.OS === 'ios' ? 76 : 68,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 22 : 14,
    left: BAR_MARGIN,
    right: BAR_MARGIN,
    borderRadius: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  slidingPill: {
    position: 'absolute',
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    backgroundColor: '#12131A',
    borderRadius: 26,
  },
  tabCell: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  clickableArea: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#FFFFFF',
  },
  inactiveLabel: {
    color: '#12131A',
  },
});
