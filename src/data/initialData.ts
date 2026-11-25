import { ActivityItem, AppSettings, NotificationItem, Task, UserProfile } from '../types';

export const TODAY_ISO = '2026-11-25';
export const TOMORROW_ISO = '2026-11-26';

export const WELCOME_HERO_IMAGE = '/src/assets/images/welcome_hero_1795600849814.jpg';
export const CELEBRATION_IMAGE = '/src/assets/images/empty_celebration_1795600850452.jpg';
export const MAYA_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida/ALJJyrDq9ysTzRbUL8_Urohea31wbAxNCJOdQK4aDdEuXEBadH8yC5Q-cgrJkaPz9BFswMXK-RQxtN3XnG7-fwaOxoWDegZ1amOAOZLAYiEzELuovQq8Ll63X3epdrP4QOue-HyXOwA-xMWaG6MTaqDivUIHt5h-368xHFe6T1VGsTVRgiAJw8bqLNEbxXKP5ECgDrJUj54wf5QJqvNwOx5uh1JxXCCzHC48h5ZQSBpHGBqBwWpwOZPa';

export const initialUser: UserProfile = {
  name: 'Maya Lin',
  email: 'maya.lin@taskflow.app',
  memberSince: 'Member since Oct 2025',
  avatarUrl: MAYA_AVATAR_URL,
};

export const initialSettings: AppSettings = {
  defaultStartView: 'dashboard',
  dailyDigest: true,
  overdueAlerts: true,
  celebrations: true,
  darkMode: false,
};

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Prepare Q4 product roadmap deck',
    description:
      'Consolidate milestone timelines, engineering estimates, and design review notes for the Friday leadership sync.',
    category: 'Work',
    priority: 'High',
    dueDate: '2026-11-25',
    dueTime: '5:00 PM',
    completed: false,
    createdAt: 'Nov 23, 2026',
  },
  {
    id: '2',
    title: 'Review cognitive psychology Ch. 7 notes',
    description:
      'Summarise memory consolidation models and highlight key citations.',
    category: 'Study',
    priority: 'Medium',
    dueDate: '2026-11-25',
    dueTime: '7:30 PM',
    completed: false,
    createdAt: 'Nov 24, 2026',
  },
  {
    id: '3',
    title: 'Morning 20-minute focus planning',
    description:
      'Set top three intentions and block uninterrupted deep-work hours.',
    category: 'Personal',
    priority: 'Low',
    dueDate: '2026-11-25',
    dueTime: '9:15 AM',
    completed: true,
    completedAt: 'Completed Nov 25, 9:15 AM',
    createdAt: 'Nov 25, 2026',
  },
  {
    id: '4',
    title: 'Renew library research database access',
    description:
      'Submit academic credentials to extend IEEE & APA PsycInfo access.',
    category: 'Study',
    priority: 'High',
    dueDate: '2026-11-24',
    completed: false,
    createdAt: 'Nov 20, 2026',
  },
  {
    id: '5',
    title: 'Send weekly client progress update',
    description:
      'Attach sprint velocity chart and next week priorities.',
    category: 'Work',
    priority: 'Medium',
    dueDate: '2026-11-26',
    completed: false,
    createdAt: 'Nov 24, 2026',
  },
  {
    id: '6',
    title: 'Pick up organic groceries & matcha',
    description:
      'Oat milk, spinach, avocados, and ceremonial matcha powder.',
    category: 'Personal',
    priority: 'Low',
    dueDate: '2026-11-26',
    completed: false,
    createdAt: 'Nov 24, 2026',
  },
  {
    id: '7',
    title: 'Lab report peer review',
    description:
      'Check statistical methodology section and add margin feedback.',
    category: 'Study',
    priority: 'Medium',
    dueDate: '2026-11-28',
    completed: false,
    createdAt: 'Nov 23, 2026',
  },
  {
    id: '8',
    title: 'Submit UX research synthesis draft',
    description:
      'Share participant insights and affinity map takeaways with research lead.',
    category: 'Study',
    priority: 'High',
    dueDate: '2026-11-24',
    completed: true,
    completedAt: 'Completed Nov 25, 10:40 AM',
    createdAt: 'Nov 21, 2026',
  },
  {
    id: '9',
    title: 'Evening 30-minute mobility stretch',
    description:
      'Post-work shoulder and hip decompression sequence.',
    category: 'Personal',
    priority: 'Low',
    dueDate: '2026-11-24',
    completed: true,
    completedAt: 'Completed Nov 24, 8:20 PM',
    createdAt: 'Nov 24, 2026',
  },
  {
    id: '10',
    title: 'Finalise design system spacing tokens',
    description:
      'Audit 4px/8px gutter scale across dashboard and list cards.',
    category: 'Work',
    priority: 'Medium',
    dueDate: '2026-11-23',
    completed: true,
    completedAt: 'Completed Nov 23, 4:15 PM',
    createdAt: 'Nov 20, 2026',
  },
  {
    id: '11',
    title: 'Archive sprint retrospective action items',
    description:
      'Tag owners and move completed follow-ups to the team workspace.',
    category: 'Work',
    priority: 'Low',
    dueDate: '2026-11-22',
    completed: true,
    completedAt: 'Completed Nov 22, 3:05 PM',
    createdAt: 'Nov 19, 2026',
  },
  {
    id: '12',
    title: 'Organise digital receipts for November',
    description:
      'Upload software invoices and studio supply receipts to folder.',
    category: 'Personal',
    priority: 'Low',
    dueDate: '2026-11-21',
    completed: true,
    completedAt: 'Completed Nov 21, 11:30 AM',
    createdAt: 'Nov 18, 2026',
  },
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'a1',
    action: 'Completed',
    taskTitle: 'Submit UX research synthesis',
    timeAgo: '1h ago',
  },
  {
    id: 'a2',
    action: 'Added',
    taskTitle: 'Pick up organic groceries',
    timeAgo: '3h ago',
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'overdue',
    title: 'Overdue: Renew library research database access',
    subtitle: 'Was due Nov 24 · Study',
    unread: true,
    taskId: '4',
  },
  {
    id: 'n2',
    type: 'due-today',
    title: 'Due today at 5:00 PM: Prepare Q4 product roadmap deck',
    subtitle: 'High priority · Work',
    unread: true,
    taskId: '1',
  },
];
