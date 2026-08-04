import { createClient } from '@insforge/sdk';
import { Task, DayPlan, FYPMilestone, UserStats } from '../types/planner';
import { SEEDED_90_DAYS, INITIAL_FYP_MILESTONES, INITIAL_USER_STATS } from '../constants/curriculum';

const INSFORGE_URL = process.env.EXPO_PUBLIC_INSFORGE_URL || 'https://94x5hqp9.ap-southeast.insforge.app';
const INSFORGE_ANON_KEY = process.env.EXPO_PUBLIC_INSFORGE_ANON_KEY || 'anon_4c190902722184078140cb072c8fa56c8226a664ecedd66c43aa0b2318b7713e';

export const insforge = createClient({
  baseUrl: INSFORGE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

/**
 * Sync daily plan completions with InsForge PostgreSQL database
 */
export async function syncTaskCompletionToInsForge(taskId: string, isCompleted: boolean, userPoints: number) {
  try {
    // InsForge Database insert / update operation
    await insforge.database.from('task_completions').insert([
      {
        task_id: taskId,
        is_completed: isCompleted,
        completed_at: new Date().toISOString(),
        points_awarded: isCompleted ? 10 : 0,
      },
    ]);
  } catch (error) {
    // Graceful offline fallback
    console.log('InsForge sync handled offline/locally');
  }
}

/**
 * Fetch 90-day placement curriculum from InsForge or fallback to seeded roadmap
 */
export async function fetchInsForgeCurriculum(): Promise<DayPlan[]> {
  try {
    const { data, error } = await insforge.database.from('plan_days').select('*');
    if (data && data.length > 0) {
      return data as DayPlan[];
    }
  } catch (e) {
    // Fallback to seeded curriculum
  }
  return SEEDED_90_DAYS;
}
