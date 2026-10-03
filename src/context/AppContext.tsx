import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  defaultPlan,
  WorkoutPlan,
  defaultUserProfile,
  createDefaultNutritionHistory,
  createDefaultGymHistory,
  createDefaultProgressHistory,
} from '../data';

export type LoggedSet = {
  kg: string;
  reps: string;
  completed: boolean;
};

export type LoggedExercise = {
  name: string;
  sets: LoggedSet[];
  notes: string;
};

export type LoggedSession = {
  id: string;
  date: string;
  dayId: string;
  name: string;
  exercises: LoggedExercise[];
};

export type FoodLog = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  imageUrl?: string;
  time?: string;
};

export type DailyNutrition = {
  date: string;
  foods: FoodLog[];
  water: number; // in ml
};

export type Measurements = {
  chest?: number;
  arms?: number;
  waist?: number;
  shoulders?: number;
};

export type ProgressLog = {
  id: string;
  date: string;
  weight: number;
  photoUrl?: string;
  notes?: string;
  measurements?: Measurements;
  bodyFat?: number;
};

export type UserProfile = {
  age?: number;
  weight?: number; // kg
  height?: number; // cm
  gender?: 'male' | 'female';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'cut' | 'maintain' | 'bulk';
  experienceLevel?: string;
  daysPerWeek?: string;
  preferredSplit?: string;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFats?: number;
};

export type HealthSync = {
  connected: boolean;
  lastSync?: string;
  steps?: number;
  sleep?: number; // hours
};

export type AppSettings = {
  theme: 'dark' | 'light';
  restTimerDefault: number;
  autoMacros: boolean;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
};

interface AppContextType {
  customPlan: WorkoutPlan;
  setCustomPlan: (plan: WorkoutPlan) => void;
  gymHistory: LoggedSession[];
  setGymHistory: (history: LoggedSession[]) => void;
  nutritionHistory: DailyNutrition[];
  setNutritionHistory: (history: DailyNutrition[]) => void;
  progressHistory: ProgressLog[];
  setProgressHistory: (history: ProgressLog[]) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  healthSync: HealthSync;
  setHealthSync: (sync: HealthSync) => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  activeTimer: number;
  setActiveTimer: (time: number) => void;
  coachMessages: ChatMessage[];
  setCoachMessages: (messages: ChatMessage[]) => void;
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [customPlan, setCustomPlanState] = useState<WorkoutPlan>(defaultPlan);
  const [gymHistory, setGymHistoryState] = useState<LoggedSession[]>([]);
  const [nutritionHistory, setNutritionHistoryState] = useState<DailyNutrition[]>([]);
  const [progressHistory, setProgressHistoryState] = useState<ProgressLog[]>([]);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [healthSync, setHealthSyncState] = useState<HealthSync>({ connected: false });
  const [settings, setSettingsState] = useState<AppSettings>({ theme: 'dark', restTimerDefault: 90, autoMacros: true });
  const [activeTimer, setActiveTimer] = useState<number>(0);
  const [coachMessages, setCoachMessagesState] = useState<ChatMessage[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
  };

  const dismissToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const savedPlan = localStorage.getItem('customPlan');
    if (savedPlan) {
      setCustomPlanState(JSON.parse(savedPlan));
    } else {
      setCustomPlanState(defaultPlan);
    }

    const savedGym = localStorage.getItem('gymHistory');
    if (savedGym) {
      setGymHistoryState(JSON.parse(savedGym));
    } else {
      const initialGym = createDefaultGymHistory();
      setGymHistoryState(initialGym);
      localStorage.setItem('gymHistory', JSON.stringify(initialGym));
    }

    const savedNutrition = localStorage.getItem('nutritionHistory');
    if (savedNutrition) {
      setNutritionHistoryState(JSON.parse(savedNutrition));
    } else {
      const initialNutrition = createDefaultNutritionHistory();
      setNutritionHistoryState(initialNutrition);
      localStorage.setItem('nutritionHistory', JSON.stringify(initialNutrition));
    }

    const savedProgress = localStorage.getItem('progressHistory');
    if (savedProgress) {
      setProgressHistoryState(JSON.parse(savedProgress));
    } else {
      const initialProgress = createDefaultProgressHistory();
      setProgressHistoryState(initialProgress);
      localStorage.setItem('progressHistory', JSON.stringify(initialProgress));
    }

    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfileState(JSON.parse(savedProfile));
    } else {
      setUserProfileState(defaultUserProfile);
      localStorage.setItem('userProfile', JSON.stringify(defaultUserProfile));
    }

    const savedHealth = localStorage.getItem('healthSync');
    if (savedHealth) {
      setHealthSyncState(JSON.parse(savedHealth));
    } else {
      setHealthSyncState({
        connected: true,
        lastSync: '12 mins ago',
        steps: 8420,
        sleep: 7.8,
      });
    }

    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) setSettingsState(JSON.parse(savedSettings));

    const savedCoach = localStorage.getItem('coachMessages');
    if (savedCoach) {
      setCoachMessagesState(JSON.parse(savedCoach));
    } else {
      setCoachMessagesState([
        {
          id: '1',
          role: 'model',
          text: "What's up bro! I'm your virtual gym partner and nutrition co-pilot. I have live access to your workout logs, recovery status, and macro counts for today. Need quick form advice, swap an exercise, or want to know what to eat next? Let's get to work!"
        }
      ]);
    }
  }, []);

  useEffect(() => {
    if (settings.theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [settings.theme]);

  const setCustomPlan = (plan: WorkoutPlan) => {
    setCustomPlanState(plan);
    localStorage.setItem('customPlan', JSON.stringify(plan));
  };

  const setGymHistory = (history: LoggedSession[]) => {
    setGymHistoryState(history);
    localStorage.setItem('gymHistory', JSON.stringify(history));
  };

  const setNutritionHistory = (history: DailyNutrition[]) => {
    setNutritionHistoryState(history);
    localStorage.setItem('nutritionHistory', JSON.stringify(history));
  };

  const setProgressHistory = (history: ProgressLog[]) => {
    setProgressHistoryState(history);
    localStorage.setItem('progressHistory', JSON.stringify(history));
  };

  const setUserProfile = (profile: UserProfile | null) => {
    setUserProfileState(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const setHealthSync = (sync: HealthSync) => {
    setHealthSyncState(sync);
    localStorage.setItem('healthSync', JSON.stringify(sync));
  };

  const setSettings = (newSettings: AppSettings) => {
    setSettingsState(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  };

  const setCoachMessages = (messages: ChatMessage[]) => {
    setCoachMessagesState(messages);
    localStorage.setItem('coachMessages', JSON.stringify(messages));
  };

  return (
    <AppContext.Provider value={{
      customPlan, setCustomPlan,
      gymHistory, setGymHistory,
      nutritionHistory, setNutritionHistory,
      progressHistory, setProgressHistory,
      userProfile, setUserProfile,
      healthSync, setHealthSync,
      settings, setSettings,
      activeTimer, setActiveTimer,
      coachMessages, setCoachMessages,
      toast, showToast, dismissToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
