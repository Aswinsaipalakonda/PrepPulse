import { createClient } from '@insforge/sdk';

const INSFORGE_URL = process.env.EXPO_PUBLIC_INSFORGE_URL || 'https://94x5hqp9.ap-southeast.insforge.app';
const INSFORGE_ANON_KEY = process.env.EXPO_PUBLIC_INSFORGE_ANON_KEY || 'anon_4c190902722184078140cb072c8fa56c8226a664ecedd66c43aa0b2318b7713e';

export const insforge = createClient({
  baseUrl: INSFORGE_URL,
  anonKey: INSFORGE_ANON_KEY,
});
