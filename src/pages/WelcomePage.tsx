import { useState } from 'react';
import { BrandMark } from '../components/BrandMark';
import { useApp } from '../context/AppContext';
import { WELCOME_HERO_IMAGE } from '../data/initialData';

export function WelcomePage() {
  const { navigate, isAuthenticated } = useApp();
  const [heroError, setHeroError] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-on-background dark:text-dark-on-background">
      {/* Top Site Navigation */}
      <header className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl py-gutter-lg flex items-center justify-between gap-gutter-md">
        <div className="flex items-center gap-gutter-sm">
          <BrandMark />
          <span className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface whitespace-nowrap">
            TaskFlow
          </span>
        </div>
        <div className="flex items-center gap-gutter-sm">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => navigate('dashboard')}
              className="px-4 py-2 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-sm hover:bg-light-primary-container active:scale-[0.98] transition-[transform,background-color] duration-state-change whitespace-nowrap"
            >
              <span className="font-body text-label-lg">Open Dashboard</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('login')}
                className="px-4 py-2 rounded bg-light-surface-container-lowest dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface border border-light-outline-variant dark:border-dark-outline-variant hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-high active:scale-[0.98] transition-[transform,background-color] duration-state-change whitespace-nowrap"
              >
                <span className="font-body text-label-lg">Login</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('signup')}
                className="px-4 py-2 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-sm hover:bg-light-primary-container active:scale-[0.98] transition-[transform,background-color] duration-state-change whitespace-nowrap"
              >
                <span className="font-body text-label-lg">Get Started</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl py-gutter-xl flex flex-col justify-center gap-gutter-xl">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-center">
          <div className="lg:col-span-6 flex flex-col gap-gutter-lg">
            <div className="flex flex-col gap-gutter-sm">
              <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-body text-label-md">
                <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
                  task_alt
                </span>
                Personal Productivity
              </span>
              <h1 className="font-headline text-display-md-mobile lg:text-display-md text-light-on-surface dark:text-dark-on-surface text-balance">
                Organise your day. Get things done.
              </h1>
              <p className="font-body text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant text-pretty max-w-prose">
                TaskFlow helps students and working professionals plan daily priorities, track deadlines across
                Personal, Study, and Work, and celebrate every completed milestone without visual clutter.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-gutter-sm">
              <button
                type="button"
                onClick={() => navigate(isAuthenticated ? 'dashboard' : 'signup')}
                className="inline-flex items-center justify-center gap-gutter-sm px-5 py-3 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-sm hover:bg-light-primary-container active:scale-[0.98] transition-[transform,background-color] duration-state-change whitespace-nowrap"
              >
                <span className="font-body text-label-lg">Get Started</span>
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate('login')}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded bg-light-surface-container-lowest dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface border border-light-outline-variant dark:border-dark-outline-variant hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-high active:scale-[0.98] transition-[transform,background-color] duration-state-change whitespace-nowrap"
              >
                <span className="font-body text-label-lg">Login to Account</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-md shadow-[0_4px_20px_rgba(26,28,26,0.05)]">
              {heroError ? (
                <div className="w-full h-72 sm:h-80 rounded-md bg-gradient-to-br from-light-secondary-container via-light-surface-container-low to-light-surface-variant flex flex-col items-center justify-center gap-2 text-light-on-secondary-container">
                  <span className="material-symbols-outlined text-[40px]" aria-hidden="true">
                    edit_note
                  </span>
                  <span className="font-headline text-title-lg">Calm Daily Planning</span>
                </div>
              ) : (
                <img
                  src={WELCOME_HERO_IMAGE}
                  alt="Minimal productivity desk illustration with notebook and sage plant"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroError(true)}
                  className="w-full h-72 sm:h-80 object-cover rounded-md"
                />
              )}
            </div>
          </div>
        </section>

        {/* Value Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md pt-gutter-lg border-t border-light-outline-variant/50 dark:border-dark-outline-variant/50">
          <article className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col gap-gutter-sm">
            <span
              className="w-9 h-9 rounded bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container inline-flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="material-symbols-outlined text-[20px]">today</span>
            </span>
            <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
              Focused Daily View
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant text-pretty">
              See what matters today, spot upcoming deadlines early, and keep your workload calm.
            </p>
          </article>

          <article className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col gap-gutter-sm">
            <span
              className="w-9 h-9 rounded bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container inline-flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
            </span>
            <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
              Clear Categories
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant text-pretty">
              Separate Personal, Study, and Work commitments with priority labels and instant filters.
            </p>
          </article>

          <article className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col gap-gutter-sm">
            <span
              className="w-9 h-9 rounded bg-success-bg text-success inline-flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="material-symbols-outlined text-[20px]">celebration</span>
            </span>
            <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
              Rewarding Progress
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant text-pretty">
              Smooth completion rings and gentle celebratory feedback keep momentum steady.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
