import { createClient } from '@insforge/sdk';

const INSFORGE_URL = process.env.EXPO_PUBLIC_INSFORGE_URL;
const INSFORGE_ANON_KEY = process.env.EXPO_PUBLIC_INSFORGE_ANON_KEY;

export const insforge = createClient({
  baseUrl: INSFORGE_URL!,
  anonKey: INSFORGE_ANON_KEY!,
});
