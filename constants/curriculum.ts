import { Task, DayPlan, FYPMilestone, FYPTask, UserStats } from '../types/planner';

export const SEEDED_90_DAYS: DayPlan[] = Array.from({ length: 90 }, (_, index) => {
  const dayNum = index + 1;
  const isSunday = dayNum % 7 === 0;
  const isSaturday = dayNum % 7 === 6;

  if (isSunday) {
    return {
      dayNumber: dayNum,
      dateStr: `Day ${dayNum}`,
      title: 'Weekly Review & Backlog Planning',
      isSundayRest: true,
      tasks: [
        {
          id: `d${dayNum}-t1`,
          dayNumber: dayNum,
          track: 'dsa',
          title: 'Review Missed Striver A2Z Problems & Revision',
          conceptSummary: 'Consolidate weak concepts learned throughout the week.',
          durationMinutes: 30,
          learningResourceUrl: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
          practiceUrl: 'https://leetcode.com/problemset/all/',
          difficulty: 'Medium',
          isCompleted: false,
        },
        {
          id: `d${dayNum}-t2`,
          dayNumber: dayNum,
          track: 'interview',
          title: 'Weekly CS Fundamentals Speed Quiz',
          conceptSummary: 'Revise OOP, OS, DBMS notes from past 6 days.',
          durationMinutes: 20,
          learningResourceUrl: 'https://www.geeksforgeeks.org/computer-science-projects/',
          practiceUrl: 'https://www.indiabix.com/',
          difficulty: 'Easy',
          isCompleted: false,
        },
        {
          id: `d${dayNum}-t3`,
          dayNumber: dayNum,
          track: 'fyp',
          title: 'Sync Final Year Project Backlog & Weekly Plan',
          conceptSummary: 'Review milestones and adjust remaining tasks for the upcoming week.',
          durationMinutes: 30,
          learningResourceUrl: 'https://github.com',
          practiceUrl: 'https://github.com',
          difficulty: 'Easy',
          isCompleted: false,
        }
      ]
    };
  }

  if (isSaturday) {
    return {
      dayNumber: dayNum,
      dateStr: `Day ${dayNum}`,
      title: 'Saturday Deep Dive & Mock Tests',
      isSaturdayDeepDive: true,
      tasks: [
        {
          id: `d${dayNum}-t1`,
          dayNumber: dayNum,
          track: 'dsa',
          title: `Striver A2Z Hard Topic & Timed Contest #${Math.ceil(dayNum / 7)}`,
          conceptSummary: 'Timed coding challenge under real exam constraints.',
          durationMinutes: 60,
          learningResourceUrl: 'https://takeuforward.org/strivers-a2z-dsa-course/',
          practiceUrl: 'https://leetcode.com/contest/',
          difficulty: 'Hard',
          isCompleted: false,
        },
        {
          id: `d${dayNum}-t2`,
          dayNumber: dayNum,
          track: 'dev',
          title: 'Full-Stack Feature Implementation (PERN/Spring)',
          conceptSummary: 'Build authentication, database relationships, and API endpoints.',
          durationMinutes: 60,
          learningResourceUrl: 'https://react.dev/learn',
          practiceUrl: 'https://github.com',
          difficulty: 'Medium',
          isCompleted: false,
        },
        {
          id: `d${dayNum}-t3`,
          dayNumber: dayNum,
          track: 'aptitude',
          title: 'Full IndiaBIX Mock Aptitude Test',
          conceptSummary: '30-minute timed quantitative and logical reasoning speed test.',
          durationMinutes: 30,
          learningResourceUrl: 'https://www.indiabix.com/aptitude/questions-and-answers/',
          practiceUrl: 'https://www.indiabix.com/online-test/aptitude-test/',
          difficulty: 'Medium',
          isCompleted: false,
        },
        {
          id: `d${dayNum}-t4`,
          dayNumber: dayNum,
          track: 'fyp',
          title: 'Final-Year Project Core Feature Development',
          conceptSummary: 'Dedicated 45-minute coding session on key project module.',
          durationMinutes: 45,
          learningResourceUrl: 'https://github.com',
          practiceUrl: 'https://github.com',
          difficulty: 'Medium',
          isCompleted: false,
        }
      ]
    };
  }

  // Weekday standard 2-3 hour plan
  return {
    dayNumber: dayNum,
    dateStr: `Day ${dayNum}`,
    title: `Placement Prep Day ${dayNum}`,
    tasks: [
      {
        id: `d${dayNum}-t1`,
        dayNumber: dayNum,
        track: 'dsa',
        title: dayNum <= 15 ? 'Arrays & HashMaps (Striver A2Z Java)' : dayNum <= 35 ? 'Binary Search & Linked List' : dayNum <= 55 ? 'Trees & Graphs' : 'Dynamic Programming & Tries',
        conceptSummary: 'Master core algorithmic patterns with Java implementation.',
        durationMinutes: 45,
        learningResourceUrl: 'https://takeuforward.org/strivers-a2z-dsa-course/',
        practiceUrl: 'https://leetcode.com/problemset/all/',
        difficulty: dayNum > 40 ? 'Hard' : 'Medium',
        isCompleted: false,
      },
      {
        id: `d${dayNum}-t2`,
        dayNumber: dayNum,
        track: 'dev',
        title: dayNum <= 30 ? 'React Hooks & State Management' : dayNum <= 60 ? 'PostgreSQL Schema & REST APIs' : 'Spring Boot & Microservices Fundamentals',
        conceptSummary: 'Hands-on full-stack development practice.',
        durationMinutes: 35,
        learningResourceUrl: 'https://react.dev/reference/react',
        practiceUrl: 'https://github.com',
        difficulty: 'Medium',
        isCompleted: false,
      },
      {
        id: `d${dayNum}-t3`,
        dayNumber: dayNum,
        track: 'aptitude',
        title: dayNum % 3 === 1 ? 'Quantitative Ability (Percentages & Ratios)' : dayNum % 3 === 2 ? 'Logical Reasoning (Puzzles & Coding-Decoding)' : 'Verbal Ability & Comprehension',
        conceptSummary: 'IndiaBIX daily aptitude topic practice.',
        durationMinutes: 20,
        learningResourceUrl: 'https://www.indiabix.com/aptitude/questions-and-answers/',
        practiceUrl: 'https://www.indiabix.com/aptitude/online-test/',
        difficulty: 'Easy',
        isCompleted: false,
      },
      {
        id: `d${dayNum}-t4`,
        dayNumber: dayNum,
        track: 'interview',
        title: dayNum % 4 === 1 ? 'OOPs & Java Internal Mechanics' : dayNum % 4 === 2 ? 'DBMS, SQL Queries & Indexing' : dayNum % 4 === 3 ? 'Operating System & Computer Networks' : 'HR STAR Method & Project Resume Pitch',
        conceptSummary: 'Technical interview notes and concise answers.',
        durationMinutes: 15,
        learningResourceUrl: 'https://www.geeksforgeeks.org/top-100-technical-interview-questions/',
        practiceUrl: 'https://www.hackerrank.com/domains/tutorials/10-days-of-javascript',
        difficulty: 'Easy',
        isCompleted: false,
      },
      {
        id: `d${dayNum}-t5`,
        dayNumber: dayNum,
        track: 'fyp',
        title: `FYP Daily Task: ${dayNum <= 30 ? 'Architecture & DB Setup' : dayNum <= 60 ? 'API & UI Integration' : 'Testing, Bug Fixes & Presentation'}`,
        conceptSummary: 'Actionable daily step for your final year capstone project.',
        durationMinutes: 30,
        learningResourceUrl: 'https://github.com',
        practiceUrl: 'https://github.com',
        difficulty: 'Medium',
        isCompleted: false,
      }
    ]
  };
});

export const INITIAL_FYP_MILESTONES: FYPMilestone[] = [
  { id: 'm1', title: 'System Architecture & Database Design', status: 'completed', dueDate: 'Day 20', tasksCount: 5, completedTasksCount: 5 },
  { id: 'm2', title: 'Core Backend API & Authentication', status: 'in_progress', dueDate: 'Day 45', tasksCount: 8, completedTasksCount: 4 },
  { id: 'm3', title: 'Frontend Mobile UI & Dashboards', status: 'planned', dueDate: 'Day 70', tasksCount: 6, completedTasksCount: 1 },
  { id: 'm4', title: 'Testing, Deployment & Thesis Report', status: 'planned', dueDate: 'Day 90', tasksCount: 4, completedTasksCount: 0 },
];

export const INITIAL_USER_STATS: UserStats = {
  currentStreak: 3,
  bestStreak: 7,
  totalPoints: 240,
  solvedProblems: 42,
  studyMinutes: 1250,
  totalTasks: 450,
  completedTasksCount: 24,
};
