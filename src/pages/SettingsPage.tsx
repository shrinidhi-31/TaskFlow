import { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useApp } from '../context/AppContext';
import { AppSettings } from '../types';

export function SettingsPage() {
  const { user, settings, updateSettings, logout, navigate } = useApp();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <AppShell activeNav="settings">
      <header className="w-full max-w-3xl mx-auto px-gutter-md lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-gutter-lg">
        <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
          Settings
        </h1>
        <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
          Configure account, notification, and appearance preferences.
        </p>
      </header>

      <main className="w-full max-w-3xl mx-auto px-gutter-md lg:px-gutter-xl pb-gutter-xl flex flex-col gap-gutter-lg">
        {/* Account Preferences */}
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col gap-gutter-md">
          <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
            Account Preferences
          </h2>
          <div className="flex items-center justify-between gap-gutter-md">
            <div>
              <p className="font-body text-title-md text-light-on-surface dark:text-dark-on-surface">
                Default start view
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Choose which screen opens when you sign in.
              </p>
            </div>
            <select
              aria-label="Default start view"
              value={settings.defaultStartView}
              onChange={(e) =>
                updateSettings({
                  defaultStartView: e.target.value as AppSettings['defaultStartView'],
                })
              }
              className="rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3 py-2 font-body text-body-md text-light-on-surface dark:text-dark-on-surface"
            >
              <option value="dashboard">Dashboard</option>
              <option value="today">Today&apos;s Tasks</option>
              <option value="all-tasks">My Tasks</option>
            </select>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col gap-gutter-md">
          <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
            Notification Preferences
          </h2>
          <label className="flex items-center justify-between gap-gutter-md cursor-pointer">
            <div>
              <p className="font-body text-title-md text-light-on-surface dark:text-dark-on-surface">
                Daily morning digest
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Receive a summary of today&apos;s tasks at 8:00 AM.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.dailyDigest}
              onChange={(e) => updateSettings({ dailyDigest: e.target.checked })}
              className="rounded-sm border-light-outline-variant text-light-primary focus:ring-light-primary"
            />
          </label>
          <label className="flex items-center justify-between gap-gutter-md cursor-pointer pt-gutter-sm border-t border-light-outline-variant/40 dark:border-dark-outline-variant/40">
            <div>
              <p className="font-body text-title-md text-light-on-surface dark:text-dark-on-surface">
                Overdue task alerts
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Notify when a scheduled task passes its due date.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.overdueAlerts}
              onChange={(e) => updateSettings({ overdueAlerts: e.target.checked })}
              className="rounded-sm border-light-outline-variant text-light-primary focus:ring-light-primary"
            />
          </label>
        </section>

        {/* Appearance Preferences */}
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col gap-gutter-md">
          <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
            Appearance Preferences
          </h2>
          <label className="flex items-center justify-between gap-gutter-md cursor-pointer">
            <div>
              <p className="font-body text-title-md text-light-on-surface dark:text-dark-on-surface">
                Completion celebrations
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Show subtle confetti burst and toast when completing tasks.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.celebrations}
              onChange={(e) => updateSettings({ celebrations: e.target.checked })}
              className="rounded-sm border-light-outline-variant text-light-primary focus:ring-light-primary"
            />
          </label>

          <label className="flex items-center justify-between gap-gutter-md cursor-pointer pt-gutter-sm border-t border-light-outline-variant/40 dark:border-dark-outline-variant/40">
            <div>
              <p className="font-body text-title-md text-light-on-surface dark:text-dark-on-surface">
                Dark theme
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Switch between warm alabaster light mode and calm evening dark mode.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => updateSettings({ darkMode: e.target.checked })}
              className="rounded-sm border-light-outline-variant text-light-primary focus:ring-light-primary"
            />
          </label>

          <div className="flex items-center justify-between gap-gutter-md pt-gutter-sm border-t border-light-outline-variant/40 dark:border-dark-outline-variant/40">
            <div>
              <p className="font-body text-title-md text-light-on-surface dark:text-dark-on-surface">
                Empty states &amp; celebrations gallery
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Preview all empty, feedback, and celebratory states.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('empty-states')}
              className="px-3.5 py-2 rounded border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface font-body text-label-md hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-high whitespace-nowrap"
            >
              View Gallery
            </button>
          </div>
        </section>

        {/* Logout */}
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex items-center justify-between gap-gutter-md">
          <div>
            <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
              Sign out
            </h2>
            <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Log out of {user.name}&apos;s session on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowLogoutDialog(true)}
            className="px-4 py-2 rounded bg-light-error-container dark:bg-dark-error-container text-light-on-error-container dark:text-dark-on-error-container font-body text-label-lg hover:opacity-90 whitespace-nowrap"
          >
            Logout
          </button>
        </section>
      </main>

      <ConfirmDialog
        open={showLogoutDialog}
        title="Log out of TaskFlow?"
        description="You can sign back in anytime with your email and password."
        confirmLabel="Logout"
        onCancel={() => setShowLogoutDialog(false)}
        onConfirm={() => {
          setShowLogoutDialog(false);
          logout();
        }}
      />
    </AppShell>
  );
}
