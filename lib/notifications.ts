import Constants from 'expo-constants';

const ONESIGNAL_APP_ID = '0d7d15da-d7a9-4b0e-aa5e-4d37fb2ed8be';
const isExpoGo = Constants.appOwnership === 'expo';

let isOneSignalInitialized = false;

// Dynamically get OneSignal module on standalone builds only
function getOneSignalModule(): any {
  if (isExpoGo) return null;
  try {
    const { OneSignal } = require('react-native-onesignal');
    return OneSignal;
  } catch (e) {
    return null;
  }
}

export function initOneSignal() {
  if (isOneSignalInitialized || isExpoGo) return;

  const OneSignal = getOneSignalModule();
  if (!OneSignal) return;

  try {
    OneSignal.Debug?.setLogLevel?.(0);
    OneSignal.initialize(ONESIGNAL_APP_ID);
    OneSignal.Notifications?.requestPermission?.(true);

    OneSignal.Notifications?.addEventListener?.('click', (event: any) => {
      console.log('OneSignal Notification Clicked:', event);
    });

    OneSignal.Notifications?.addEventListener?.('foregroundWillDisplay', (event: any) => {
      console.log('OneSignal Notification Foreground Will Display:', event);
    });

    isOneSignalInitialized = true;
    console.log('OneSignal initialized successfully');
  } catch (error) {
    console.log('OneSignal initialization skipped on Expo Go preview environment');
  }
}

export function setOneSignalUserTag(key: string, value: string) {
  const OneSignal = getOneSignalModule();
  if (!OneSignal) return;
  try {
    OneSignal.User?.addTag?.(key, value);
  } catch (e) {
    // Ignore
  }
}

export function setOneSignalUserExternalId(externalId: string) {
  const OneSignal = getOneSignalModule();
  if (!OneSignal) return;
  try {
    OneSignal.login?.(externalId);
  } catch (e) {
    // Ignore
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const OneSignal = getOneSignalModule();
  if (!OneSignal) return false;
  try {
    return await OneSignal.Notifications?.requestPermission?.(true);
  } catch (e) {
    return false;
  }
}

export async function scheduleDailyReminders(morningEnabled: boolean, eveningEnabled: boolean) {
  setOneSignalUserTag('morning_reminders', morningEnabled ? 'true' : 'false');
  setOneSignalUserTag('evening_reminders', eveningEnabled ? 'true' : 'false');
}

export async function sendInstantTestNotification(title: string, body: string) {
  console.log(`OneSignal Test Alert: [${title}] ${body}`);
}
