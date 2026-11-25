import React, { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Avatar } from '../components/Avatar';
import { useApp } from '../context/AppContext';

export function UserProfilePage() {
  const { user, updateProfile, showToast } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileError, setProfileError] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setProfileError(true);
      return;
    }
    setProfileError(false);
    updateProfile(name, trimmedEmail);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPwd.trim() || !newPwd.trim()) {
      showToast('Please enter both current and new passwords.');
      return;
    }
    setCurrentPwd('');
    setNewPwd('');
    showToast('Password updated successfully.');
  };

  return (
    <AppShell activeNav="profile">
      <header className="w-full max-w-3xl mx-auto px-gutter-md lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-gutter-lg">
        <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
          User Profile
        </h1>
        <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
          Manage your personal details and account security.
        </p>
      </header>

      <main className="w-full max-w-3xl mx-auto px-gutter-md lg:px-gutter-xl pb-gutter-xl flex flex-col gap-gutter-lg">
        {/* Profile Identity Card */}
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-wrap items-center justify-between gap-gutter-md">
          <div className="flex items-center gap-gutter-md">
            <Avatar src={user.avatarUrl} name={user.name} size="lg" />
            <div>
              <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
                {user.name}
              </h2>
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                {user.email}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-body text-label-sm">
                {user.memberSince}
              </span>
            </div>
          </div>
        </section>

        {/* Edit Profile */}
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col gap-gutter-md">
          <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
            Edit Profile
          </h2>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-gutter-md" noValidate>
            {profileError && (
              <div
                className="rounded-md bg-light-error-container dark:bg-dark-error-container text-light-on-error-container dark:text-dark-on-error-container px-3.5 py-2.5 font-body text-body-sm"
                role="alert"
              >
                Please enter your name and a valid email address.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                  Full name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (profileError) setProfileError(false);
                  }}
                  className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2 font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                  Email address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (profileError) setProfileError(false);
                  }}
                  className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2 font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-body text-label-lg hover:bg-light-primary-container transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>
        </section>

        {/* Change Password */}
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col gap-gutter-md">
          <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
            Change Password
          </h2>
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-gutter-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                  Current password
                </span>
                <input
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2 font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                  New password
                </span>
                <input
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2 font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface font-body text-label-lg hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-high transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        </section>
      </main>
    </AppShell>
  );
}
