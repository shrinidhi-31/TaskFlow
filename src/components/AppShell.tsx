import React from 'react';
import { useApp } from '../context/AppContext';
import { RouteId } from '../types';
import { Avatar } from './Avatar';
import { BrandMark } from './BrandMark';

interface NavItem {
  id: RouteId;
  label: string;
  icon: string;
}

const SIDEBAR_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'all-tasks', label: 'My Tasks', icon: 'task_alt' },
  { id: 'today', label: 'Today', icon: 'today' },
  { id: 'upcoming', label: 'Upcoming', icon: 'event_upcoming' },
  { id: 'completed', label: 'Completed', icon: 'check_circle' },
  { id: 'categories', label: 'Categories', icon: 'folder' },
];

const MOBILE_NAV: { id: RouteId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Home', icon: 'dashboard' },
  { id: 'all-tasks', label: 'Tasks', icon: 'task_alt' },
  { id: 'today', label: 'Today', icon: 'today' },
  { id: 'categories', label: 'Categories', icon: 'folder' },
  { id: 'profile', label: 'Profile', icon: 'person' },
];

export function AppShell({
  children,
  activeNav,
}: {
  children: React.ReactNode;
  activeNav?: RouteId;
}) {
  const { route, navigate, user, toastMessage } = useApp();
  const current = activeNav ?? route;

  return (
    <div className="min-h-screen flex bg-light-background dark:bg-dark-background text-light-on-background dark:text-dark-on-background pb-20 lg:pb-0 transition-colors duration-state-change">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] shrink-0 min-h-screen sticky top-0 h-screen bg-light-surface-container-low dark:bg-dark-surface-container-low border-r border-light-outline-variant/60 dark:border-dark-outline-variant/60 flex-col justify-between p-gutter-lg">
        <div className="flex flex-col gap-gutter-xl">
          <button
            type="button"
            onClick={() => navigate('welcome')}
            className="flex items-center gap-gutter-sm px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary rounded-md"
          >
            <BrandMark />
            <div className="flex flex-col">
              <span className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface leading-tight">
                TaskFlow
              </span>
              <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Organise your day.
              </span>
            </div>
          </button>

          <nav aria-label="Main navigation" className="flex flex-col gap-gutter-xs">
            {SIDEBAR_NAV.map((item) => {
              const isActive = current === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={`flex items-center gap-gutter-sm px-3 py-2.5 rounded text-left transition-colors duration-state-change whitespace-nowrap ${
                    isActive
                      ? 'bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container'
                      : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container dark:hover:bg-dark-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="font-body text-label-lg">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-gutter-xs pt-gutter-lg border-t border-light-outline-variant/60 dark:border-dark-outline-variant/60">
          <button
            type="button"
            onClick={() => navigate('settings')}
            className={`flex items-center gap-gutter-sm px-3 py-2 rounded text-left transition-colors duration-state-change whitespace-nowrap ${
              current === 'settings'
                ? 'bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container'
                : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container dark:hover:bg-dark-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              settings
            </span>
            <span className="font-body text-label-lg">Settings</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('profile')}
            className={`flex items-center gap-gutter-sm px-2 py-1.5 rounded-md text-left transition-colors duration-state-change ${
              current === 'profile'
                ? 'bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container'
                : 'bg-light-surface-container-lowest dark:bg-dark-surface-container border border-light-outline-variant/50 dark:border-dark-outline-variant/50 hover:bg-light-surface-container dark:hover:bg-dark-surface-container-high'
            }`}
          >
            <Avatar src={user.avatarUrl} name={user.name} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="font-body text-title-md text-light-on-surface dark:text-dark-on-surface truncate">
                {user.name}
              </span>
              <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant truncate">
                Profile
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>

      {/* Mobile Bottom Nav */}
      <nav
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-light-surface-container-lowest dark:bg-dark-surface-container-low border-t border-light-outline-variant/60 dark:border-dark-outline-variant/60 px-2 py-2 grid grid-cols-5 gap-1"
      >
        {MOBILE_NAV.map((item) => {
          const isActive = current === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 ${
                isActive
                  ? 'text-light-primary dark:text-dark-primary'
                  : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                {item.icon}
              </span>
              <span className="font-body text-label-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 inline-flex items-center gap-gutter-sm px-4 py-3 rounded-md bg-light-inverse-surface dark:bg-dark-inverse-surface text-light-inverse-on-surface dark:text-dark-inverse-on-surface shadow-lg transition-all duration-200 ${
          toastMessage ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <span className="w-6 h-6 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary inline-flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
            check
          </span>
        </span>
        <span className="font-body text-body-md">{toastMessage || ''}</span>
      </div>
    </div>
  );
}
