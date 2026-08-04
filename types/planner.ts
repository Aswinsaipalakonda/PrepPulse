export interface Task {
  id: string;
  dayNumber: number;
  track: 'dsa' | 'dev' | 'aptitude' | 'interview' | 'fyp' | 'javafullstack' | 'pern' | 'revision' | string;
  title: string;
  conceptSummary: string;
  durationMinutes: number;
  learningResourceUrl: string;
  practiceUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isCompleted: boolean;
  isCarryForward?: boolean;
  notes?: string;
}

export interface FYPMilestone {
  id: string;
  title: string;
  status: 'planned' | 'in_progress' | 'completed';
  dueDate: string;
  tasksCount: number;
  completedTasksCount: number;
}

export interface FYPTask {
  id: string;
  milestoneId: string;
  title: string;
  isCompleted: boolean;
  estimatedMinutes: number;
  date: string;
}

export interface UserStats {
  currentStreak: number;
  bestStreak: number;
  totalPoints: number;
  solvedProblems: number;
  studyMinutes: number;
  totalTasks: number;
  completedTasksCount: number;
}

export interface DayPlan {
  dayNumber: number;
  dateStr: string;
  title: string;
  isSundayRest?: boolean;
  isSaturdayDeepDive?: boolean;
  tasks: Task[];
}
