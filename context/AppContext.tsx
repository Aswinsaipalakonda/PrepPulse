import React, { createContext, useContext, useState } from 'react';
import { Task, DayPlan, FYPMilestone, UserStats } from '../types/planner';
import { SEEDED_90_DAYS, INITIAL_FYP_MILESTONES, INITIAL_USER_STATS } from '../constants/curriculum';
import { syncTaskCompletionToInsForge } from '../lib/insforge';
import * as Haptics from 'expo-haptics';

interface AppContextType {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  userName: string;
  setUserName: (name: string) => void;
  dayPlans: DayPlan[];
  userStats: UserStats;
  fypMilestones: FYPMilestone[];
  hasOnboarded: boolean;
  setHasOnboarded: (val: boolean) => void;
  isDayStarted: boolean;
  startDay: () => void;
  toggleStartDay: () => void;
  toggleTaskCompletion: (taskId: string) => void;
  updateTaskNotes: (taskId: string, notes: string) => void;
  addNewCustomTask: (title: string, track: 'dsa' | 'dev' | 'aptitude' | 'interview' | 'fyp') => void;
  addFYPMilestone: (title: string, dueDate: string) => void;
  toggleFYPMilestoneStatus: (id: string) => void;
  deleteFYPMilestone: (id: string) => void;
  resetProgram: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [userName, setUserName] = useState<string>('Aswin Sai');
  const [dayPlans, setDayPlans] = useState<DayPlan[]>(SEEDED_90_DAYS);
  const [fypMilestones, setFypMilestones] = useState<FYPMilestone[]>(INITIAL_FYP_MILESTONES);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  const [isDayStarted, setIsDayStarted] = useState<boolean>(false);

  const startDay = () => {
    setIsDayStarted(true);
    setUserStats((prev) => ({
      ...prev,
      currentStreak: prev.currentStreak === 0 ? 1 : prev.currentStreak,
    }));
  };

  const toggleStartDay = () => {
    setIsDayStarted((prev) => !prev);
  };

  const toggleTaskCompletion = (taskId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // Ignore if web or not supported
    }

    setDayPlans((prevPlans) => {
      let taskWasCompleted = false;
      const updatedPlans = prevPlans.map((plan) => {
        const updatedTasks = plan.tasks.map((task) => {
          if (task.id === taskId) {
            taskWasCompleted = !task.isCompleted;
            return { ...task, isCompleted: !task.isCompleted };
          }
          return task;
        });
        return { ...plan, tasks: updatedTasks };
      });

      // Check completed tasks for current day
      const currentDayPlan = updatedPlans.find((p) => p.dayNumber === currentDay);
      const currentDayCompletedCount = currentDayPlan
        ? currentDayPlan.tasks.filter((t) => t.isCompleted).length
        : 0;

      setUserStats((prev) => {
        const pointDiff = taskWasCompleted ? 10 : -10;
        const countDiff = taskWasCompleted ? 1 : -1;
        const newTotalPoints = Math.max(0, prev.totalPoints + pointDiff);
        const newCompletedCount = Math.max(0, prev.completedTasksCount + countDiff);
        const newSolved = taskWasCompleted ? prev.solvedProblems + 1 : Math.max(0, prev.solvedProblems - 1);

        // Update streak if at least 2 tasks of the day are completed
        const updatedStreak = currentDayCompletedCount >= 2
          ? Math.max(prev.currentStreak, 1)
          : (currentDayCompletedCount === 0 ? 0 : prev.currentStreak);

        // Sync with InsForge Backend
        syncTaskCompletionToInsForge(taskId, taskWasCompleted, newTotalPoints);

        return {
          ...prev,
          currentStreak: updatedStreak,
          bestStreak: Math.max(prev.bestStreak, updatedStreak),
          totalPoints: newTotalPoints,
          completedTasksCount: newCompletedCount,
          solvedProblems: newSolved,
        };
      });

      return updatedPlans;
    });
  };

  const addNewCustomTask = (title: string, track: 'dsa' | 'dev' | 'aptitude' | 'interview' | 'fyp') => {
    const newTask: Task = {
      id: `custom-${Date.now()}`,
      dayNumber: currentDay,
      track,
      title,
      conceptSummary: `Custom placement task created for Day ${currentDay}.`,
      durationMinutes: 30,
      learningResourceUrl: 'https://google.com',
      practiceUrl: 'https://google.com',
      difficulty: 'Medium',
      isCompleted: false,
    };

    setDayPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.dayNumber === currentDay
          ? { ...plan, tasks: [...plan.tasks, newTask] }
          : plan
      )
    );
  };

  const updateTaskNotes = (taskId: string, notes: string) => {
    setDayPlans((prevPlans) =>
      prevPlans.map((plan) => ({
        ...plan,
        tasks: plan.tasks.map((task) => (task.id === taskId ? { ...task, notes } : task)),
      }))
    );
  };

  const addFYPMilestone = (title: string, dueDate: string) => {
    const newMilestone: FYPMilestone = {
      id: `m-${Date.now()}`,
      title,
      status: 'planned',
      dueDate,
      tasksCount: 1,
      completedTasksCount: 0,
    };
    setFypMilestones((prev) => [...prev, newMilestone]);
  };

  const toggleFYPMilestoneStatus = (id: string) => {
    setFypMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus =
            m.status === 'planned' ? 'in_progress' : m.status === 'in_progress' ? 'completed' : 'planned';
          return {
            ...m,
            status: nextStatus,
            completedTasksCount: nextStatus === 'completed' ? m.tasksCount : 0,
          };
        }
        return m;
      })
    );
  };

  const deleteFYPMilestone = (id: string) => {
    setFypMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const resetProgram = () => {
    setDayPlans(SEEDED_90_DAYS);
    setFypMilestones(INITIAL_FYP_MILESTONES);
    setUserStats(INITIAL_USER_STATS);
    setHasOnboarded(false);
    setIsDayStarted(false);
    setCurrentDay(1);
  };

  return (
    <AppContext.Provider
      value={{
        currentDay,
        setCurrentDay,
        userName,
        setUserName,
        dayPlans,
        userStats,
        fypMilestones,
        hasOnboarded,
        setHasOnboarded,
        isDayStarted,
        startDay,
        toggleStartDay,
        toggleTaskCompletion,
        updateTaskNotes,
        addNewCustomTask,
        addFYPMilestone,
        toggleFYPMilestoneStatus,
        deleteFYPMilestone,
        resetProgram,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
