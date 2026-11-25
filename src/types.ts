export type Category = 'Personal' | 'Study' | 'Work';

export type Priority = 'High' | 'Medium' | 'Low';

export type RouteId =
  | 'welcome'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'dashboard'
  | 'all-tasks'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'categories'
  | 'add-task'
  | 'task-details'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'empty-states';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // e.g. '5:00 PM'
  completed: boolean;
  completedAt?: string; // display label e.g. 'Completed Nov 25, 9:15 AM'
  createdAt: string; // display label e.g. 'Nov 23, 2026'
}

export interface ActivityItem {
  id: string;
  action: 'Completed' | 'Added' | 'Updated' | 'Restored';
  taskTitle: string;
  timeAgo: string;
}

export interface NotificationItem {
  id: string;
  type: 'overdue' | 'due-today' | 'info';
  title: string;
  subtitle: string;
  unread: boolean;
  taskId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  avatarUrl: string;
}

export interface AppSettings {
  defaultStartView: 'dashboard' | 'today' | 'all-tasks';
  dailyDigest: boolean;
  overdueAlerts: boolean;
  celebrations: boolean;
  darkMode: boolean;
}
