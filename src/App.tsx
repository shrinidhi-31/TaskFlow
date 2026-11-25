import { AppProvider, useApp } from './context/AppContext';
import { AddTaskPage } from './pages/AddTaskPage';
import { AllTasksPage } from './pages/AllTasksPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CompletedTasksPage } from './pages/CompletedTasksPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmptyStatesPage } from './pages/EmptyStatesPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LoginPage } from './pages/LoginPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SignUpPage } from './pages/SignUpPage';
import { TaskDetailsPage } from './pages/TaskDetailsPage';
import { TodayTasksPage } from './pages/TodayTasksPage';
import { UpcomingTasksPage } from './pages/UpcomingTasksPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { WelcomePage } from './pages/WelcomePage';

function AppRouter() {
  const { route } = useApp();

  switch (route) {
    case 'welcome':
      return <WelcomePage />;
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignUpPage />;
    case 'forgot-password':
      return <ForgotPasswordPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'all-tasks':
      return <AllTasksPage />;
    case 'today':
      return <TodayTasksPage />;
    case 'upcoming':
      return <UpcomingTasksPage />;
    case 'completed':
      return <CompletedTasksPage />;
    case 'categories':
      return <CategoriesPage />;
    case 'add-task':
      return <AddTaskPage />;
    case 'task-details':
      return <TaskDetailsPage />;
    case 'notifications':
      return <NotificationsPage />;
    case 'profile':
      return <UserProfilePage />;
    case 'settings':
      return <SettingsPage />;
    case 'empty-states':
      return <EmptyStatesPage />;
    default:
      return <WelcomePage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
