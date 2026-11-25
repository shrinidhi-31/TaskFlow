import { useEffect } from 'react';
import { BrandMark } from './components/BrandMark';
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
import { RouteId } from './types';

const PUBLIC_ROUTES: RouteId[] = ['welcome', 'login', 'signup', 'forgot-password'];

function AppRouter() {
  const { route, isAuthenticated, authLoading, navigate } = useApp();

  // Enforce route protection: redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !PUBLIC_ROUTES.includes(route)) {
      navigate('login');
    }
  }, [authLoading, isAuthenticated, route, navigate]);

  // Loading splash while checking Supabase auth session
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-light-background dark:bg-dark-background text-light-on-surface dark:text-dark-on-surface">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <BrandMark size="lg" />
          <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Loading TaskFlow...
          </p>
        </div>
      </div>
    );
  }

  // If user is not authenticated and trying to view a protected page
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(route)) {
    return <LoginPage />;
  }

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
