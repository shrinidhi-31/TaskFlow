import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export function ForgotPasswordPage() {
  const { navigate } = useApp();
  const [email, setEmail] = useState('maya.lin@taskflow.app');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(true);
      return;
    }
    setError(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-gutter-md py-gutter-xl bg-light-background dark:bg-dark-background text-light-on-background dark:text-dark-on-background">
      <div className="w-full max-w-md flex flex-col gap-gutter-lg">
        <div className="flex flex-col items-center text-center gap-gutter-sm">
          <div className="w-11 h-11 rounded-md bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
              lock_reset
            </span>
          </div>
          <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
            Reset your password
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <main className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg sm:p-gutter-xl shadow-[0_4px_20px_rgba(26,28,26,0.05)]">
          {!sent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-md" noValidate>
              {error && (
                <div
                  className="rounded-md bg-light-error-container dark:bg-dark-error-container text-light-on-error-container dark:text-dark-on-error-container px-3.5 py-2.5 font-body text-body-sm"
                  role="alert"
                >
                  Please enter a valid email address.
                </div>
              )}
              <label className="flex flex-col gap-gutter-xs">
                <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                  Email address
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="w-full py-2.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-sm hover:bg-light-primary-container active:scale-[0.98] transition-[transform,background-color] duration-state-change"
              >
                <span className="font-body text-label-lg">Send Reset Link</span>
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center gap-gutter-md py-gutter-sm">
              <span
                className="w-12 h-12 rounded-full bg-success-bg text-success inline-flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
              </span>
              <div className="flex flex-col gap-gutter-xs">
                <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
                  Reset link sent
                </h2>
                <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant text-pretty">
                  We&apos;ve sent password reset instructions to{' '}
                  <span className="font-medium text-light-on-surface dark:text-dark-on-surface">{email}</span>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('login')}
                className="w-full py-2.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary text-center font-body text-label-lg"
              >
                Back to Login
              </button>
            </div>
          )}
        </main>

        <p className="text-center font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
          <button
            type="button"
            onClick={() => navigate('login')}
            className="inline-flex items-center gap-1 font-body text-label-lg text-light-primary dark:text-dark-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              arrow_back
            </span>
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
