import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  initialActivities,
  initialNotifications,
  initialSettings,
  initialTasks,
  initialUser,
  TODAY_ISO,
} from '../data/initialData';
import {
  ActivityItem,
  AppSettings,
  Category,
  NotificationItem,
  Priority,
  RouteId,
  Task,
  UserProfile,
} from '../types';

interface NewTaskInput {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string;
  dueTime?: string;
}

interface AppContextValue {
  route: RouteId;
  navigate: (
    route: RouteId,
    options?: { taskId?: string; category?: Category; defaultDueDate?: string }
  ) => void;
  selectedTaskId: string;
  setSelectedTaskId: (id: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  addTaskDefaultDueDate: string;
  isAuthenticated: boolean;
  login: (email?: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  user: UserProfile;
  updateProfile: (name: string, email: string) => void;
  tasks: Task[];
  toggleTask: (id: string) => void;
  addTask: (input: NewTaskInput) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  restoreTask: (id: string) => void;
  activities: ActivityItem[];
  notifications: NotificationItem[];
  unreadCount: number;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEY = 'taskflow_app_state_v1';

const AppContext = createContext<AppContextValue | null>(null);

interface StoredState {
  isAuthenticated: boolean;
  user: UserProfile;
  tasks: Task[];
  activities: ActivityItem[];
  notifications: NotificationItem[];
  settings: AppSettings;
}

function loadStoredState(): Partial<StoredState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    if (!parsed || typeof parsed !== 'object') return {};
    return {
      isAuthenticated: typeof parsed.isAuthenticated === 'boolean' ? parsed.isAuthenticated : undefined,
      user: parsed.user && typeof parsed.user === 'object' ? { ...initialUser, ...parsed.user } : undefined,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : undefined,
      activities: Array.isArray(parsed.activities) ? parsed.activities : undefined,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : undefined,
      settings:
        parsed.settings && typeof parsed.settings === 'object'
          ? { ...initialSettings, ...parsed.settings }
          : undefined,
    };
  } catch {
    return {};
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initial = useMemo(() => loadStoredState(), []);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initial.isAuthenticated ?? false);
  const [user, setUser] = useState<UserProfile>(initial.user ?? initialUser);
  const [tasks, setTasks] = useState<Task[]>(initial.tasks ?? initialTasks);
  const [activities, setActivities] = useState<ActivityItem[]>(initial.activities ?? initialActivities);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    initial.notifications ?? initialNotifications
  );
  const [settings, setSettings] = useState<AppSettings>(initial.settings ?? initialSettings);

  const [route, setRoute] = useState<RouteId>(() => {
    if (initial.isAuthenticated) {
      return (initial.settings?.defaultStartView ?? 'dashboard') as RouteId;
    }
    return 'welcome';
  });

  const [selectedTaskId, setSelectedTaskId] = useState<string>('1');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Personal');
  const [addTaskDefaultDueDate, setAddTaskDefaultDueDate] = useState<string>('2026-11-26');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const idCounterRef = useRef<number>(0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  useEffect(() => {
    try {
      const stateToSave: StoredState = {
        isAuthenticated,
        user,
        tasks,
        activities,
        notifications,
        settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // Ignore storage quota errors
    }
  }, [isAuthenticated, user, tasks, activities, notifications, settings]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  const navigate = useCallback(
    (
      nextRoute: RouteId,
      options?: { taskId?: string; category?: Category; defaultDueDate?: string }
    ) => {
      if (options?.taskId) {
        setSelectedTaskId(options.taskId);
      }
      if (options?.category) {
        setSelectedCategory(options.category);
      }
      if (nextRoute === 'add-task') {
        setAddTaskDefaultDueDate(options?.defaultDueDate ?? '2026-11-26');
      }
      setRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    []
  );

  const login = useCallback(
    (email?: string) => {
      if (email && email.trim()) {
        setUser((prev) => ({ ...prev, email: email.trim() }));
      }
      setIsAuthenticated(true);
      setRoute(settings.defaultStartView);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [settings.defaultStartView]
  );

  const signup = useCallback(
    (name: string, email: string) => {
      setUser((prev) => ({
        ...prev,
        name: name.trim() || prev.name,
        email: email.trim() || prev.email,
      }));
      setIsAuthenticated(true);
      setRoute(settings.defaultStartView);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [settings.defaultStartView]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setRoute('login');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const updateProfile = useCallback(
    (name: string, email: string) => {
      setUser((prev) => ({
        ...prev,
        name: name.trim() || prev.name,
        email: email.trim() || prev.email,
      }));
      showToast('Profile details updated.');
    },
    [showToast]
  );

  const toggleTask = useCallback(
    (id: string) => {
      let toggledTitle = '';
      let becameCompleted = false;

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== id) return task;
          becameCompleted = !task.completed;
          toggledTitle = task.title;
          return {
            ...task,
            completed: becameCompleted,
            completedAt: becameCompleted ? 'Completed Nov 25, Just now' : undefined,
          };
        })
      );

      if (toggledTitle) {
        setActivities((prev) => [
          {
            id: `act-${Date.now()}`,
            action: becameCompleted ? 'Completed' : 'Restored',
            taskTitle: toggledTitle,
            timeAgo: 'Just now',
          },
          ...prev.slice(0, 5),
        ]);
        if (becameCompleted && settings.celebrations) {
          showToast('Amazing! One more task conquered! 🎉');
        }
      }
    },
    [settings.celebrations, showToast]
  );

  const addTask = useCallback((input: NewTaskInput): Task => {
    idCounterRef.current += 1;
    const seq = String(idCounterRef.current).padStart(3, '0');
    const now = Date.now();
    const newTask: Task = {
      id: `task-${now}-${seq}`,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      priority: input.priority,
      dueDate: input.dueDate || TODAY_ISO,
      dueTime: input.dueTime?.trim() || undefined,
      completed: false,
      createdAt: 'Nov 25, 2026',
    };
    setTasks((prev) => [newTask, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${now}-${seq}`,
        action: 'Added',
        taskTitle: newTask.title,
        timeAgo: 'Just now',
      },
      ...prev.slice(0, 5),
    ]);
    return newTask;
  }, []);

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      let updatedTitle = '';
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== id) return task;
          updatedTitle = patch.title ?? task.title;
          const nextCompleted = patch.completed ?? task.completed;
          return {
            ...task,
            ...patch,
            completedAt:
              patch.completed !== undefined
                ? nextCompleted
                  ? task.completedAt || 'Completed Nov 25, Just now'
                  : undefined
                : task.completedAt,
          };
        })
      );
      if (updatedTitle) {
        idCounterRef.current += 1;
        setActivities((prev) => [
          {
            id: `act-${Date.now()}-${idCounterRef.current}`,
            action: 'Updated',
            taskTitle: updatedTitle,
            timeAgo: 'Just now',
          },
          ...prev.slice(0, 5),
        ]);
      }
      showToast('Task changes saved.');
    },
    [showToast]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setNotifications((prev) => prev.filter((n) => n.taskId !== id));
      showToast('Task removed.');
    },
    [showToast]
  );

  const restoreTask = useCallback(
    (id: string) => {
      let restoredTitle = '';
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          restoredTitle = t.title;
          return { ...t, completed: false, completedAt: undefined };
        })
      );
      if (restoredTitle) {
        setActivities((prev) => [
          {
            id: `act-${Date.now()}`,
            action: 'Restored',
            taskTitle: restoredTitle,
            timeAgo: 'Just now',
          },
          ...prev.slice(0, 5),
        ]);
        showToast('Task restored to pending.');
      }
    },
    [showToast]
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const value: AppContextValue = {
    route,
    navigate,
    selectedTaskId,
    setSelectedTaskId,
    selectedCategory,
    setSelectedCategory,
    addTaskDefaultDueDate,
    isAuthenticated,
    login,
    signup,
    logout,
    user,
    updateProfile,
    tasks,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    restoreTask,
    activities,
    notifications,
    unreadCount,
    markAllNotificationsRead,
    clearNotifications,
    settings,
    updateSettings,
    globalSearch,
    setGlobalSearch,
    toastMessage,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
