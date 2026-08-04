import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Set notification handler behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const permissions: any = await Notifications.getPermissionsAsync();
    let isGranted = permissions?.status === 'granted' || permissions?.granted === true;
    if (!isGranted) {
      const request: any = await Notifications.requestPermissionsAsync();
      isGranted = request?.status === 'granted' || request?.granted === true;
    }
    return isGranted;
  } catch (e) {
    console.log('Notification permission request skipped on unsupported runtime');
    return false;
  }
}

export async function scheduleDailyReminders(morningEnabled: boolean, eveningEnabled: boolean) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (morningEnabled) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '☀️ PrepPulse Morning Focus Ready!',
          body: "Your placement tasks for today are waiting. Let's make today productive!",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 8,
          minute: 0,
        },
      });
    }

    if (eveningEnabled) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔥 Keep Your Streak Alive!',
          body: 'Check off your remaining tasks before the day ends to preserve your streak.',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 20,
          minute: 0,
        },
      });
    }
  } catch (e) {
    console.log('Notification scheduling skipped on unsupported environment');
  }
}

export async function sendInstantTestNotification(title: string, body: string) {
  try {
    const hasPerm = await requestNotificationPermissions();
    if (!hasPerm) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // instant
    });
  } catch (e) {
    console.log('Instant notification error:', e);
  }
}
