import { OneSignal, LogLevel } from 'react-native-onesignal';
import Platform from 'react-native';

const ONESIGNAL_APP_ID = '0d7d15da-d7a9-4b0e-aa5e-4d37fb2ed8be';

let isOneSignalInitialized = false;

export function initOneSignal() {
  if (isOneSignalInitialized) return;

  try {
    // Enable verbose logging for debugging during development
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // Initialize OneSignal with App ID
    OneSignal.initialize(ONESIGNAL_APP_ID);

    // Request push notification permission
    OneSignal.Notifications.requestPermission(true);

    // Add click event listener
    OneSignal.Notifications.addEventListener('click', (event: any) => {
      console.log('OneSignal Notification Clicked:', event);
    });

    // Add foreground event listener
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event: any) => {
      console.log('OneSignal Notification Foreground Will Display:', event);
    });

    isOneSignalInitialized = true;
    console.log('OneSignal initialized successfully');
  } catch (error) {
    console.log('OneSignal initialization skipped on web/unsupported runtime:', error);
  }
}

export function setOneSignalUserTag(key: string, value: string) {
  try {
    OneSignal.User.addTag(key, value);
  } catch (e) {
    // Ignore if not initialized
  }
}

export function setOneSignalUserExternalId(externalId: string) {
  try {
    OneSignal.login(externalId);
  } catch (e) {
    // Ignore if not initialized
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    return await OneSignal.Notifications.requestPermission(true);
  } catch (e) {
    return false;
  }
}

export async function scheduleDailyReminders(morningEnabled: boolean, eveningEnabled: boolean) {
  try {
    setOneSignalUserTag('morning_reminders', morningEnabled ? 'true' : 'false');
    setOneSignalUserTag('evening_reminders', eveningEnabled ? 'true' : 'false');
  } catch (e) {
    console.log('OneSignal tag update error:', e);
  }
}

export async function sendInstantTestNotification(title: string, body: string) {
  try {
    console.log(`Sending OneSignal Test Alert: [${title}] ${body}`);
  } catch (e) {
    console.log('Instant notification error:', e);
  }
}
