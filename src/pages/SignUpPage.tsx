import React, { useState } from 'react';
import { BrandMark } from '../components/BrandMark';
import { useApp } from '../context/AppContext';

export function SignUpPage() {
  const { navigate, signup } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!pwd || pwd.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (pwd !== confirm) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await signup(name, email, pwd);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-gutter-md py-gutter-xl bg-light-background dark:bg-dark-background text-light-on-background dark:text-dark-on-background">
      <div className="w-full max-w-md flex flex-col gap-gutter-lg">
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
            Create your account
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Start organising your day with TaskFlow.
          </p>
        </div>

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
                Full name
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Maya Lin"
                className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant/70 focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
              />
            </label>

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
                className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant/70 focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-gutter-xs">
              <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                Password
              </span>
              <input
                type="password"
                required
                value={pwd}
                onChange={(e) => {
                  setPwd(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="At least 6 characters"
                className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant/70 focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-gutter-xs">
              <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                Confirm password
              </span>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Re-enter your password"
                className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant/70 focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-sm hover:bg-light-primary-container active:scale-[0.98] transition-[transform,background-color] duration-state-change disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              <span className="font-body text-label-lg">
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </span>
            </button>
          </form>
        </main>

        <p className="text-center font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('login')}
            className="font-body text-label-lg text-light-primary dark:text-dark-primary hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
