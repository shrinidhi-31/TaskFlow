import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { initialSettings, TODAY_ISO } from '../data/initialData';
import { authService } from '../services/authService';
import { taskService } from '../services/taskService';
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

export interface NewTaskInput {
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
  authLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  user: UserProfile;
  updateProfile: (name: string, email: string) => void;
  tasks: Task[];
  tasksLoading: boolean;
  tasksError: string | null;
  refreshTasks: () => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  addTask: (input: NewTaskInput) => Promise<Task | null>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  restoreTask: (id: string) => Promise<void>;
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

const SETTINGS_KEY = 'taskflow_settings_v1';
const ACTIVITIES_KEY_PREFIX = 'taskflow_activities_';

const defaultGuestUser: UserProfile = {
  name: 'Maya Lin',
  email: 'maya.lin@taskflow.app',
  memberSince: 'Member since Nov 2026',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return initialSettings;
    const parsed = JSON.parse(raw);
    return { ...initialSettings, ...parsed };
  } catch {
    return initialSettings;
  }
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>(defaultGuestUser);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState<boolean>(false);
  const [tasksError, setTasksError] = useState<string | null>(null);

  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [route, setRoute] = useState<RouteId>('welcome');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Personal');
  const [addTaskDefaultDueDate, setAddTaskDefaultDueDate] = useState<string>(TODAY_ISO);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimerRef = useRef<number | null>(null);

  // Sync dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Ignore quota errors
    }
  }, [settings]);

  // Load activities for authenticated user
  useEffect(() => {
    if (!currentUserId) {
      setActivities([]);
      return;
    }
    try {
      const raw = localStorage.getItem(`${ACTIVITIES_KEY_PREFIX}${currentUserId}`);
      if (raw) {
        setActivities(JSON.parse(raw));
      } else {
        setActivities([]);
      }
    } catch {
      setActivities([]);
    }
  }, [currentUserId]);

  const addActivity = useCallback(
    (action: ActivityItem['action'], taskTitle: string) => {
      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        action,
        taskTitle,
        timeAgo: 'Just now',
      };
      setActivities((prev) => {
        const next = [newActivity, ...prev.slice(0, 9)];
        if (currentUserId) {
          try {
            localStorage.setItem(
              `${ACTIVITIES_KEY_PREFIX}${currentUserId}`,
              JSON.stringify(next)
            );
          } catch {
            // Ignore
          }
        }
        return next;
      });
    },
    [currentUserId]
  );

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Fetch tasks from Supabase
  const refreshTasks = useCallback(async () => {
    setTasksLoading(true);
    setTasksError(null);
    try {
      const fetched = await taskService.fetchTasks();
      setTasks(fetched);
      if (fetched.length > 0 && !selectedTaskId) {
        setSelectedTaskId(fetched[0].id);
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to fetch tasks from database.';
      setTasksError(msg);
      showToast(msg);
    } finally {
      setTasksLoading(false);
    }
  }, [selectedTaskId, showToast]);

  // Build notifications from tasks
  useEffect(() => {
    const today = TODAY_ISO;
    const items: NotificationItem[] = [];

    const overdueTasks = tasks.filter((t) => !t.completed && t.dueDate < today);
    if (overdueTasks.length > 0) {
      items.push({
        id: 'notif-overdue',
        type: 'overdue',
        title: `${overdueTasks.length} Overdue ${overdueTasks.length === 1 ? 'Task' : 'Tasks'}`,
        subtitle: `You have ${overdueTasks.length} task(s) past their scheduled deadline.`,
        unread: true,
        taskId: overdueTasks[0]?.id,
      });
    }

    const todayTasks = tasks.filter((t) => !t.completed && t.dueDate === today);
    if (todayTasks.length > 0) {
      items.push({
        id: 'notif-today',
        type: 'due-today',
        title: `${todayTasks.length} Due Today`,
        subtitle: `Keep your momentum going! Finish your scheduled items.`,
        unread: true,
        taskId: todayTasks[0]?.id,
      });
    }

    setNotifications(items);
  }, [tasks]);

  // Initialize and listen to Supabase Authentication
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const session = await authService.getSession();
        if (!mounted) return;

        if (session?.user) {
          setIsAuthenticated(true);
          setCurrentUserId(session.user.id);
          setUser(authService.formatUserProfile(session.user));
          setRoute((prev) => (prev === 'welcome' || prev === 'login' || prev === 'signup' ? settings.defaultStartView : prev));
        } else {
          setIsAuthenticated(false);
          setCurrentUserId(null);
          setTasks([]);
        }
      } catch (err) {
        console.error('[TaskFlow] Auth init error:', err);
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    }

    initAuth();

    const subscription = authService.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setIsAuthenticated(true);
          setCurrentUserId(session.user.id);
          setUser(authService.formatUserProfile(session.user));
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setCurrentUserId(null);
        setUser(defaultGuestUser);
        setTasks([]);
        setRoute('login');
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [settings.defaultStartView]);

  // Automatically fetch tasks whenever authentication state becomes true
  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      refreshTasks();
    }
  }, [isAuthenticated, currentUserId, refreshTasks]);

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
        setAddTaskDefaultDueDate(options?.defaultDueDate ?? TODAY_ISO);
      }
      setRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    []
  );

  const login = useCallback(
    async (email: string, password?: string) => {
      if (!password) {
        throw new Error('Password is required for login.');
      }
      const data = await authService.signIn(email, password);
      if (data?.user) {
        setIsAuthenticated(true);
        setCurrentUserId(data.user.id);
        setUser(authService.formatUserProfile(data.user));
        setRoute(settings.defaultStartView);
        showToast('Welcome back to TaskFlow!');
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    },
    [settings.defaultStartView, showToast]
  );

  const signup = useCallback(
    async (name: string, email: string, password?: string) => {
      if (!password) {
        throw new Error('Password is required to create an account.');
      }
      const data = await authService.signUp(email, password, name);
      if (data?.user) {
        if (data.session) {
          setIsAuthenticated(true);
          setCurrentUserId(data.user.id);
          setUser(authService.formatUserProfile(data.user));
          setRoute(settings.defaultStartView);
          showToast('Account created successfully! Welcome to TaskFlow.');
        } else {
          showToast('Account registered! Please check your email to confirm your account.');
          setRoute('login');
        }
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    },
    [settings.defaultStartView, showToast]
  );

  const logout = useCallback(async () => {
    try {
      await authService.signOut();
    } catch {
      // Continue cleanup even if server signOut encounters network error
    }
    setIsAuthenticated(false);
    setCurrentUserId(null);
    setUser(defaultGuestUser);
    setTasks([]);
    setRoute('login');
    showToast('Signed out successfully.');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [showToast]);

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
    async (id: string) => {
      const existing = tasks.find((t) => t.id === id);
      if (!existing) return;

      const nextCompleted = !existing.completed;

      // Optimistic local update for instant UI feedback & confetti
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
      );

      addActivity(nextCompleted ? 'Completed' : 'Restored', existing.title);

      if (nextCompleted && settings.celebrations) {
        showToast('Amazing! One more task conquered! 🎉');
      }

      try {
        await taskService.updateTask(id, { completed: nextCompleted });
      } catch (err: any) {
        // Rollback on failure
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: existing.completed } : t))
        );
        showToast(err?.message || 'Failed to update task status in database.');
      }
    },
    [tasks, addActivity, settings.celebrations, showToast]
  );

  const addTask = useCallback(
    async (input: NewTaskInput): Promise<Task | null> => {
      if (!currentUserId) {
        showToast('You must be signed in to add tasks.');
        return null;
      }

      try {
        const created = await taskService.createTask(input, currentUserId);
        setTasks((prev) => [created, ...prev]);
        setSelectedTaskId(created.id);
        addActivity('Added', created.title);
        showToast('Task added successfully.');
        return created;
      } catch (err: any) {
        const msg = err?.message || 'Failed to save task to Supabase.';
        showToast(msg);
        throw err;
      }
    },
    [currentUserId, addActivity, showToast]
  );

  const updateTask = useCallback(
    async (id: string, patch: Partial<Task>) => {
      const existing = tasks.find((t) => t.id === id);
      if (!existing) return;

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
      );

      const titleChanged = patch.title && patch.title !== existing.title;
      addActivity('Updated', patch.title || existing.title);

      try {
        const updated = await taskService.updateTask(id, patch);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        showToast('Task changes saved.');
      } catch (err: any) {
        // Rollback
        setTasks((prev) => prev.map((t) => (t.id === id ? existing : t)));
        showToast(err?.message || 'Failed to update task.');
        throw err;
      }
    },
    [tasks, addActivity, showToast]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const existing = tasks.find((t) => t.id === id);
      // Optimistic update
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setNotifications((prev) => prev.filter((n) => n.taskId !== id));

      try {
        await taskService.deleteTask(id);
        showToast('Task removed.');
      } catch (err: any) {
        // Rollback
        if (existing) {
          setTasks((prev) => [existing, ...prev]);
        }
        showToast(err?.message || 'Failed to delete task from database.');
        throw err;
      }
    },
    [tasks, showToast]
  );

  const restoreTask = useCallback(
    async (id: string) => {
      const existing = tasks.find((t) => t.id === id);
      if (!existing) return;

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: false } : t))
      );
      addActivity('Restored', existing.title);

      try {
        await taskService.updateTask(id, { completed: false });
        showToast('Task restored to pending.');
      } catch (err: any) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: existing.completed } : t))
        );
        showToast(err?.message || 'Failed to restore task.');
      }
    },
    [tasks, addActivity, showToast]
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
    authLoading,
    login,
    signup,
    logout,
    user,
    updateProfile,
    tasks,
    tasksLoading,
    tasksError,
    refreshTasks,
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
