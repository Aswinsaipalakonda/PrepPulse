import React, { createContext, useContext, useState } from 'react';
import { Task, DayPlan, FYPMilestone, UserStats } from '../types/planner';
import { SEEDED_90_DAYS, INITIAL_FYP_MILESTONES, INITIAL_USER_STATS } from '../constants/curriculum';
import { syncTaskCompletionToInsForge, syncCustomTaskToInsForge } from '../lib/insforge';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProjectTodo {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  todos: ProjectTodo[];
}

interface AppContextType {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  userName: string;
  setUserName: (name: string) => void;
  dayPlans: DayPlan[];
  userStats: UserStats;
  fypMilestones: FYPMilestone[];
  projects: ProjectItem[];
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
  addProject: (name: string, category: string, description: string) => void;
  addProjectTodo: (projectId: string, title: string) => void;
  toggleProjectTodo: (projectId: string, todoId: string) => void;
  deleteProjectTodo: (projectId: string, todoId: string) => void;
  updateProjectStatus: (projectId: string, status: 'planned' | 'in_progress' | 'completed') => void;
  resetProgram: () => void;
  isLoaded: boolean;
}

const STORAGE_KEYS = {
  HAS_ONBOARDED: 'preppulse_has_onboarded',
  USER_NAME: 'preppulse_user_name',
  USER_STATS: 'preppulse_user_stats',
  DAY_PLANS: 'preppulse_day_plans',
  FYP_MILESTONES: 'preppulse_fyp_milestones',
  PROJECTS: 'preppulse_projects',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [userNameState, setUserNameState] = useState<string>('');
  const [dayPlans, setDayPlans] = useState<DayPlan[]>(SEEDED_90_DAYS);
  const [fypMilestones, setFypMilestones] = useState<FYPMilestone[]>(INITIAL_FYP_MILESTONES);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [hasOnboardedState, setHasOnboardedState] = useState<boolean>(false);
  const [isDayStarted, setIsDayStarted] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);


  // Load persistent state on mount
  React.useEffect(() => {
    let isMounted = true;
    async function loadStorage() {
      try {
        const savedOnboarded = await AsyncStorage.getItem(STORAGE_KEYS.HAS_ONBOARDED).catch(() => null);
        const savedName = await AsyncStorage.getItem(STORAGE_KEYS.USER_NAME).catch(() => null);
        const savedStats = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS).catch(() => null);
        const savedPlans = await AsyncStorage.getItem(STORAGE_KEYS.DAY_PLANS).catch(() => null);
        const savedMilestones = await AsyncStorage.getItem(STORAGE_KEYS.FYP_MILESTONES).catch(() => null);
        const savedProjects = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS).catch(() => null);

        if (!isMounted) return;

        if (savedOnboarded !== null) {
          setHasOnboardedState(savedOnboarded === 'true');
        }
        if (savedName !== null && savedName.trim().length > 0) {
          setUserNameState(savedName);
        }
        if (savedStats !== null) {
          try {
            setUserStats(JSON.parse(savedStats));
          } catch (e) {}
        }
        if (savedPlans !== null) {
          try {
            const parsedPlans = JSON.parse(savedPlans);
            if (Array.isArray(parsedPlans) && parsedPlans.length > 0) {
              setDayPlans(parsedPlans);
            }
          } catch (e) {}
        }
        if (savedMilestones !== null) {
          try {
            const parsed = JSON.parse(savedMilestones);
            if (Array.isArray(parsed)) setFypMilestones(parsed);
          } catch (e) {}
        }
        if (savedProjects !== null) {
          try {
            const parsed = JSON.parse(savedProjects);
            if (Array.isArray(parsed)) setProjects(parsed);
          } catch (e) {}
        }
      } catch (err) {
        // Fallback gracefully
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }
    loadStorage();
    return () => {
      isMounted = false;
    };
  }, []);

  const saveDayPlans = (plans: DayPlan[]) => {
    setDayPlans(plans);
    AsyncStorage.setItem(STORAGE_KEYS.DAY_PLANS, JSON.stringify(plans)).catch(() => {});
  };

  const saveFypMilestones = (milestones: FYPMilestone[]) => {
    setFypMilestones(milestones);
    AsyncStorage.setItem(STORAGE_KEYS.FYP_MILESTONES, JSON.stringify(milestones)).catch(() => {});
  };

  const saveProjects = (projs: ProjectItem[]) => {
    setProjects(projs);
    AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projs)).catch(() => {});
  };

  const setHasOnboarded = (val: boolean) => {
    setHasOnboardedState(val);
    AsyncStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, String(val)).catch(() => {});
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name).catch(() => {});
  };

  const startDay = () => {
    setIsDayStarted(true);
    setUserStats((prev) => {
      const updated = {
        ...prev,
        currentStreak: prev.currentStreak === 0 ? 1 : prev.currentStreak,
      };
      AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const toggleStartDay = () => {
    setIsDayStarted((prev) => !prev);
  };

  const toggleTaskCompletion = (taskId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}

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

      // Save to AsyncStorage
      AsyncStorage.setItem(STORAGE_KEYS.DAY_PLANS, JSON.stringify(updatedPlans)).catch(() => {});

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

        const updatedStreak = currentDayCompletedCount >= 2
          ? Math.max(prev.currentStreak, 1)
          : (currentDayCompletedCount === 0 ? 0 : prev.currentStreak);

        syncTaskCompletionToInsForge(taskId, taskWasCompleted, newTotalPoints);

        const updatedStats = {
          ...prev,
          currentStreak: updatedStreak,
          bestStreak: Math.max(prev.bestStreak, updatedStreak),
          totalPoints: newTotalPoints,
          completedTasksCount: newCompletedCount,
          solvedProblems: newSolved,
        };
        AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updatedStats)).catch(() => {});
        return updatedStats;
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

    // Sync to InsForge PostgreSQL
    syncCustomTaskToInsForge(newTask);

    setDayPlans((prevPlans) => {
      const updatedPlans = prevPlans.map((plan) =>
        plan.dayNumber === currentDay
          ? { ...plan, tasks: [...plan.tasks, newTask] }
          : plan
      );
      AsyncStorage.setItem(STORAGE_KEYS.DAY_PLANS, JSON.stringify(updatedPlans)).catch(() => {});
      return updatedPlans;
    });
  };

  const updateTaskNotes = (taskId: string, notes: string) => {
    setDayPlans((prevPlans) => {
      const updatedPlans = prevPlans.map((plan) => ({
        ...plan,
        tasks: plan.tasks.map((task) => (task.id === taskId ? { ...task, notes } : task)),
      }));
      AsyncStorage.setItem(STORAGE_KEYS.DAY_PLANS, JSON.stringify(updatedPlans)).catch(() => {});
      return updatedPlans;
    });
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
    const updated = [...fypMilestones, newMilestone];
    saveFypMilestones(updated);
  };

  const toggleFYPMilestoneStatus = (id: string) => {
    const updated: FYPMilestone[] = fypMilestones.map((m) => {
      if (m.id === id) {
        const nextStatus: FYPMilestone['status'] =
          m.status === 'planned' ? 'in_progress' : m.status === 'in_progress' ? 'completed' : 'planned';
        return {
          ...m,
          status: nextStatus,
          completedTasksCount: nextStatus === 'completed' ? m.tasksCount : 0,
        };
      }
      return m;
    });
    saveFypMilestones(updated);
  };


  const deleteFYPMilestone = (id: string) => {
    const updated = fypMilestones.filter((m) => m.id !== id);
    saveFypMilestones(updated);
  };

  // Projects Hub Actions
  const addProject = (name: string, category: string, description: string) => {
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name,
      category: category || 'General Project',
      description,
      status: 'planned',
      createdAt: nowStr,
      updatedAt: nowStr,
      todos: [],
    };
    saveProjects([newProj, ...projects]);
  };

  const addProjectTodo = (projectId: string, title: string) => {
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const newTodo: ProjectTodo = {
          id: `ptodo-${Date.now()}`,
          title,
          isCompleted: false,
          createdAt: nowStr,
        };
        return {
          ...p,
          updatedAt: nowStr,
          todos: [newTodo, ...p.todos],
        };
      }
      return p;
    });
    saveProjects(updated);
  };

  const toggleProjectTodo = (projectId: string, todoId: string) => {
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const updatedTodos = p.todos.map((t) => {
          if (t.id === todoId) {
            const isComp = !t.isCompleted;
            return {
              ...t,
              isCompleted: isComp,
              completedAt: isComp ? nowStr : undefined,
            };
          }
          return t;
        });
        return {
          ...p,
          updatedAt: nowStr,
          todos: updatedTodos,
        };
      }
      return p;
    });
    saveProjects(updated);
  };

  const deleteProjectTodo = (projectId: string, todoId: string) => {
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          updatedAt: nowStr,
          todos: p.todos.filter((t) => t.id !== todoId),
        };
      }
      return p;
    });
    saveProjects(updated);
  };

  const updateProjectStatus = (projectId: string, status: 'planned' | 'in_progress' | 'completed') => {
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const updated = projects.map((p) => (p.id === projectId ? { ...p, status, updatedAt: nowStr } : p));
    saveProjects(updated);
  };

  // Reset 90-day plan without logging out the authenticated user
  const resetProgram = () => {
    setDayPlans(SEEDED_90_DAYS);
    setFypMilestones(INITIAL_FYP_MILESTONES);
    setUserStats(INITIAL_USER_STATS);
    setIsDayStarted(false);
    setCurrentDay(1);

    AsyncStorage.removeItem(STORAGE_KEYS.DAY_PLANS).catch(() => {});
    AsyncStorage.removeItem(STORAGE_KEYS.FYP_MILESTONES).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(INITIAL_USER_STATS)).catch(() => {});
    // CRITICAL FIX: Do NOT set hasOnboarded to false, preserving user auth session
  };

  return (
    <AppContext.Provider
      value={{
        currentDay,
        setCurrentDay,
        userName: userNameState,
        setUserName,
        dayPlans,
        userStats,
        fypMilestones,
        projects,
        hasOnboarded: hasOnboardedState,
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
        addProject,
        addProjectTodo,
        toggleProjectTodo,
        deleteProjectTodo,
        updateProjectStatus,
        resetProgram,
        isLoaded,
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

