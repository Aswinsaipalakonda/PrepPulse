import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, DayPlan, FYPMilestone, UserStats } from '../types/planner';
import { SEEDED_90_DAYS, INITIAL_FYP_MILESTONES, INITIAL_USER_STATS } from '../constants/curriculum';
import * as Haptics from 'expo-haptics';

interface AppContextType {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  dayPlans: DayPlan[];
  userStats: UserStats;
  fypMilestones: FYPMilestone[];
  toggleTaskCompletion: (taskId: string) => void;
  updateTaskNotes: (taskId: string, notes: string) => void;
  addFYPMilestone: (title: string, dueDate: string) => void;
  resetProgram: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>(SEEDED_90_DAYS);
  const [fypMilestones, setFypMilestones] = useState<FYPMilestone[]>(INITIAL_FYP_MILESTONES);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);

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

      // Update points and stats
      setUserStats((prev) => {
        const pointDiff = taskWasCompleted ? 10 : -10;
        const countDiff = taskWasCompleted ? 1 : -1;
        const newTotalPoints = Math.max(0, prev.totalPoints + pointDiff);
        const newCompletedCount = Math.max(0, prev.completedTasksCount + countDiff);
        const newSolved = taskWasCompleted ? prev.solvedProblems + 1 : Math.max(0, prev.solvedProblems - 1);

        return {
          ...prev,
          totalPoints: newTotalPoints,
          completedTasksCount: newCompletedCount,
          solvedProblems: newSolved,
        };
      });

      return updatedPlans;
    });
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

  const resetProgram = () => {
    setDayPlans(SEEDED_90_DAYS);
    setFypMilestones(INITIAL_FYP_MILESTONES);
    setUserStats(INITIAL_USER_STATS);
    setCurrentDay(1);
  };

  return (
    <AppContext.Provider
      value={{
        currentDay,
        setCurrentDay,
        dayPlans,
        userStats,
        fypMilestones,
        toggleTaskCompletion,
        updateTaskNotes,
        addFYPMilestone,
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
