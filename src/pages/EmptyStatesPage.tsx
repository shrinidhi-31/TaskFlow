import React, { useRef, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { useApp } from '../context/AppContext';
import { CELEBRATION_IMAGE } from '../data/initialData';

export function EmptyStatesPage() {
  const { navigate, showToast } = useApp();
  const [imgError, setImgError] = useState(false);
  const celebrateBtnWrapRef = useRef<HTMLDivElement | null>(null);

  const triggerCelebration = () => {
    if (
      celebrateBtnWrapRef.current &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const colors = ['#3A5946', '#52725D', '#ACCFB6', '#D4AF37'];
      for (let i = 0; i < 12; i++) {
        const dot = document.createElement('span');
        dot.className = 'tf-confetti-dot';
        const angle = (Math.PI * 2 * i) / 12;
        dot.style.left = '50%';
        dot.style.top = '50%';
        dot.style.backgroundColor = colors[i % colors.length];
        dot.style.setProperty('--tx', `${Math.cos(angle) * 44}px`);
        dot.style.setProperty('--ty', `${Math.sin(angle) * 44}px`);
        celebrateBtnWrapRef.current.appendChild(dot);
        window.setTimeout(() => dot.remove(), 650);
      }
    }
    showToast('Amazing! One more task conquered! 🎉');
  };

  return (
    <AppShell activeNav="settings">
      <header className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-gutter-lg flex flex-wrap items-center justify-between gap-gutter-md">
        <div>
          <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
            Empty States &amp; Celebrations
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Visual reference for all empty, feedback, and celebratory states across TaskFlow.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('settings')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface font-body text-label-md hover:bg-light-surface-container-low"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
            arrow_back
          </span>
          Back to Settings
        </button>
      </header>

      <main className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pb-gutter-xl grid grid-cols-1 md:grid-cols-2 gap-gutter-lg items-stretch">
        {/* 1. All Tasks Completed Celebration */}
        <article className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col items-center text-center justify-between gap-gutter-md">
          {imgError ? (
            <div className="w-44 h-32 rounded-md bg-gradient-to-br from-success-bg via-light-surface-container-low to-light-secondary-container flex items-center justify-center text-success">
              <span className="material-symbols-outlined text-[36px]" aria-hidden="true">
                task_alt
              </span>
            </div>
          ) : (
            <img
              src={CELEBRATION_IMAGE}
              alt="Celebratory illustration"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-44 h-32 object-cover rounded-md"
            />
          )}
          <div className="flex flex-col gap-1">
            <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
              You&apos;re all caught up!
            </h2>
            <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
              All tasks completed. Take a moment to recharge.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('add-task')}
            className="px-4 py-2 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-body text-label-lg"
          >
            Create New Task
          </button>
        </article>

        {/* 2. Task Completion Celebration Trigger */}
        <article className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col items-center text-center justify-between gap-gutter-md">
          <span className="w-12 h-12 rounded-full bg-success-bg text-success inline-flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
              celebration
            </span>
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
              Task Completion Celebration
            </h2>
            <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Localized confetti burst paired with a brief congratulatory toast.
            </p>
          </div>
          <div ref={celebrateBtnWrapRef} className="relative">
            <button
              type="button"
              onClick={triggerCelebration}
              className="px-4 py-2 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-body text-label-lg"
            >
              Trigger Celebration
            </button>
          </div>
        </article>

        {/* 3. No Tasks Yet */}
        <article className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col items-center text-center justify-center gap-gutter-sm">
          <span className="w-11 h-11 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container inline-flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
              assignment_add
            </span>
          </span>
          <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
            No tasks yet
          </h2>
          <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Start your day by adding your first task.
          </p>
        </article>

        {/* 4. No Completed Tasks */}
        <article className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col items-center text-center justify-center gap-gutter-sm">
          <span className="w-11 h-11 rounded-full bg-light-surface-container dark:bg-dark-surface-container-high text-light-on-surface-variant dark:text-dark-on-surface-variant inline-flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
              check_box_outline_blank
            </span>
          </span>
          <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
            No completed tasks
          </h2>
          <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Completed items will appear here once checked off.
          </p>
        </article>

        {/* 5. No Search Results */}
        <article className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col items-center text-center justify-center gap-gutter-sm">
          <span className="w-11 h-11 rounded-full bg-light-surface-container dark:bg-dark-surface-container-high text-light-on-surface-variant dark:text-dark-on-surface-variant inline-flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
              search_off
            </span>
          </span>
          <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
            No search results
          </h2>
          <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
            No tasks match your current search or filter.
          </p>
        </article>

        {/* 6. Successful Task Creation */}
        <article className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col items-center text-center justify-center gap-gutter-sm">
          <span className="w-11 h-11 rounded-full bg-success-bg text-success inline-flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
              task_alt
            </span>
          </span>
          <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
            Successful task creation
          </h2>
          <div className="px-4 py-2 rounded-md bg-success-bg text-success font-body text-body-sm">
            Task added to your list!
          </div>
        </article>
      </main>
    </AppShell>
  );
}
