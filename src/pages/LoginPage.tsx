import React, { useState } from 'react';
import { BrandMark } from '../components/BrandMark';
import { useApp } from '../context/AppContext';

export function LoginPage() {
  const { navigate, login, user } = useApp();
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-gutter-md py-gutter-xl bg-light-background dark:bg-dark-background text-light-on-background dark:text-dark-on-background">
      <div className="w-full max-w-md flex flex-col gap-gutter-lg">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-gutter-sm">
          <button
            type="button"
            onClick={() => navigate('welcome')}
            aria-label="Back to TaskFlow welcome page"
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary"
          >
            <BrandMark size="lg" />
          </button>
          <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
            Welcome back
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Sign in to TaskFlow to organise your day.
          </p>
        </div>

        {/* Login Card */}
        <main className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg sm:p-gutter-xl shadow-[0_4px_20px_rgba(26,28,26,0.05)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-md" noValidate>
            {errorMessage && (
              <div
                className="rounded-md bg-light-error-container dark:bg-dark-error-container text-light-on-error-container dark:text-dark-on-error-container px-3.5 py-2.5 font-body text-body-sm"
                role="alert"
              >
                {errorMessage}
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
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="you@example.com"
                className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant/70 focus:border-light-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-gutter-xs">
              <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                Password
              </span>
              <div className="relative flex items-center">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container pl-3.5 pr-10 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant/70 focus:border-light-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute right-2.5 w-8 h-8 rounded inline-flex items-center justify-center text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                    {showPwd ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between gap-gutter-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-sm border-light-outline-variant text-light-primary focus:ring-light-primary"
                />
                <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => navigate('forgot-password')}
                className="font-body text-label-md text-light-primary dark:text-dark-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-sm hover:bg-light-primary-container active:scale-[0.98] transition-[transform,background-color] duration-state-change disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              <span className="font-body text-label-lg">
                {isSubmitting ? 'Logging in...' : 'Login'}
              </span>
            </button>
          </form>
        </main>

        <p className="text-center font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('signup')}
            className="font-body text-label-lg text-light-primary dark:text-dark-primary hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
