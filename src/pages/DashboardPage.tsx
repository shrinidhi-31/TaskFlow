import React from 'react';
import { AppShell } from '../components/AppShell';
import { TaskCheckbox } from '../components/TaskCheckbox';
import { useApp } from '../context/AppContext';
import { TODAY_ISO } from '../data/initialData';
import { formatShortDate, priorityClasses } from '../utils/dateFormat';

export function DashboardPage() {
  const {
    user,
    tasks,
    toggleTask,
    activities,
    unreadCount,
    navigate,
    globalSearch,
    setGlobalSearch,
  } = useApp();

  const total = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = total - completedCount;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const circumference = 113.1;
  const dashOffset = circumference - (pct / 100) * circumference;

  const todayTasks = tasks.filter((t) => t.dueDate === TODAY_ISO);
  const dueTodayPending = todayTasks.filter((t) => !t.completed).length;

  const displayedTodayTasks = todayTasks.filter((t) => {
    if (!globalSearch.trim()) return true;
    const q = globalSearch.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
  });

  const upcomingDeadlines = tasks
    .filter((t) => !t.completed && t.dueDate > TODAY_ISO)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  const firstName = user.name.split(' ')[0] || 'Maya';

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      navigate('all-tasks');
    }
  };

  return (
    <AppShell activeNav="dashboard">
      <header className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-gutter-lg flex flex-wrap items-center justify-between gap-gutter-md">
        <div className="flex flex-col gap-gutter-xs">
          <span className="font-body text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Wednesday, Nov 25, 2026
          </span>
          <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
            Good morning, {firstName}!
          </h1>
        </div>

        <div className="flex items-center gap-gutter-sm lg:gap-gutter-md">
          <label className="relative flex items-center w-44 sm:w-64">
            <span
              className="material-symbols-outlined text-[18px] text-light-on-surface-variant dark:text-dark-on-surface-variant absolute left-3 pointer-events-none"
              aria-hidden="true"
            >
              search
            </span>
            <input
              type="search"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search your tasks..."
              aria-label="Search your tasks"
              className="w-full rounded-md border border-light-outline-variant/80 dark:border-dark-outline-variant/80 bg-light-surface-container-lowest dark:bg-dark-surface-container pl-9 pr-3 py-2 font-body text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant/70 focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
            />
          </label>

          <button
            type="button"
            onClick={() => navigate('notifications')}
            aria-label="Notifications"
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-md bg-light-surface-container-lowest dark:bg-dark-surface-container border border-light-outline-variant/60 dark:border-dark-outline-variant/60 text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              notifications
            </span>
            {unreadCount > 0 && (
              <span
                className="w-2 h-2 rounded-full bg-light-primary dark:bg-dark-primary absolute top-2 right-2.5"
                aria-hidden="true"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('add-task')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-sm hover:bg-light-primary-container active:scale-[0.98] transition-[transform,background-color] duration-state-change whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              add
            </span>
            <span className="font-body text-label-lg">Quick Add</span>
          </button>
        </div>
      </header>

      <main className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pb-gutter-xl flex flex-col gap-gutter-xl">
        {/* 3 Stat Cards + Animated Progress Ring */}
        <section
          aria-label="Task statistics"
          className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md lg:gap-gutter-lg items-stretch"
        >
          <article className="h-full bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg shadow-[0_1px_3px_rgba(26,28,26,0.04)] flex flex-col justify-between gap-gutter-md">
            <header className="flex items-center justify-between">
              <h2 className="font-body text-label-lg text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Total Tasks
              </h2>
              <span className="w-9 h-9 rounded bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container inline-flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">assignment</span>
              </span>
            </header>
            <div className="flex items-center justify-between">
              <p className="font-headline text-display-md text-light-on-surface dark:text-dark-on-surface tabular-nums">
                {total}
              </p>
              <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Across 3 categories
              </span>
            </div>
          </article>

          <article className="h-full bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg shadow-[0_1px_3px_rgba(26,28,26,0.04)] flex flex-col justify-between gap-gutter-md">
            <header className="flex items-center justify-between">
              <h2 className="font-body text-label-lg text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Completed Tasks
              </h2>
              <span className="w-9 h-9 rounded bg-success-bg text-success inline-flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </span>
            </header>
            <div className="flex items-center justify-between">
              <p className="font-headline text-display-md text-light-on-surface dark:text-dark-on-surface tabular-nums">
                {completedCount}
              </p>
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-light-surface-container-high dark:text-dark-surface-container-high"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className="text-light-primary dark:text-dark-primary transition-[stroke-dashoffset] duration-progress-fill ease-progress-fill"
                  />
                </svg>
                <span className="absolute font-body text-label-sm text-light-on-surface dark:text-dark-on-surface tabular-nums">
                  {pct}%
                </span>
              </div>
            </div>
          </article>

          <article className="h-full bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg shadow-[0_1px_3px_rgba(26,28,26,0.04)] flex flex-col justify-between gap-gutter-md">
            <header className="flex items-center justify-between">
              <h2 className="font-body text-label-lg text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Pending Tasks
              </h2>
              <span className="w-9 h-9 rounded bg-warning-bg text-warning inline-flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">pending_actions</span>
              </span>
            </header>
            <div className="flex items-center justify-between">
              <p className="font-headline text-display-md text-light-on-surface dark:text-dark-on-surface tabular-nums">
                {pendingCount}
              </p>
              <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant tabular-nums">
                {dueTodayPending} due today
              </span>
            </div>
          </article>
        </section>

        {/* Two-Column Workspace: Today's Tasks + Upcoming Deadlines & Recent Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          {/* Today's Tasks */}
          <div className="lg:col-span-7 flex flex-col gap-gutter-md">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface">
                Today&apos;s Tasks
              </h2>
              <button
                type="button"
                onClick={() => navigate('today')}
                className="font-body text-label-md text-light-primary dark:text-dark-primary hover:underline"
              >
                View all
              </button>
            </div>

            <div className="flex flex-col gap-gutter-sm">
              {displayedTodayTasks.length === 0 ? (
                <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg text-center flex flex-col items-center gap-2">
                  <span className="font-headline text-title-md text-light-on-surface dark:text-dark-on-surface">
                    No matching tasks for today
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('add-task')}
                    className="font-body text-label-md text-light-primary dark:text-dark-primary hover:underline"
                  >
                    Add a task for today
                  </button>
                </div>
              ) : (
                displayedTodayTasks.map((task) => (
                  <article
                    key={task.id}
                    className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-md border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-md shadow-[0_1px_2px_rgba(26,28,26,0.03)] hover:shadow-[0_4px_12px_rgba(26,28,26,0.06)] transition-[box-shadow,transform] duration-state-change flex items-start justify-between gap-gutter-md"
                  >
                    <div className="flex items-start gap-gutter-md min-w-0">
                      <TaskCheckbox
                        checked={task.completed}
                        onToggle={() => toggleTask(task.id)}
                        label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'completed'}`}
                      />
                      <div className="flex flex-col gap-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => navigate('task-details', { taskId: task.id })}
                          className={`text-left font-body text-title-md hover:text-light-primary dark:hover:text-dark-primary transition-colors ${
                            task.completed
                              ? 'line-through text-light-on-surface-variant dark:text-dark-on-surface-variant'
                              : 'text-light-on-surface dark:text-dark-on-surface'
                          }`}
                        >
                          {task.title}
                        </button>
                        <div className="flex flex-wrap items-center gap-gutter-xs">
                          <span className="px-2 py-0.5 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-body text-label-sm">
                            {task.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-body text-label-sm ${priorityClasses(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    {task.dueTime && (
                      <span className="font-body text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant shrink-0 tabular-nums">
                        {task.dueTime}
                      </span>
                    )}
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Deadlines & Recent Activity */}
          <div className="lg:col-span-5 flex flex-col gap-gutter-lg">
            <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col gap-gutter-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
                  Upcoming Deadlines
                </h2>
                <button
                  type="button"
                  onClick={() => navigate('upcoming')}
                  className="font-body text-label-md text-light-primary dark:text-dark-primary hover:underline"
                >
                  Schedule
                </button>
              </div>
              {upcomingDeadlines.length === 0 ? (
                <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant py-1">
                  No upcoming deadlines.
                </p>
              ) : (
                <ul className="flex flex-col gap-gutter-sm">
                  {upcomingDeadlines.map((task, idx) => (
                    <li
                      key={task.id}
                      className={`flex items-center justify-between gap-gutter-sm py-1.5 ${
                        idx < upcomingDeadlines.length - 1
                          ? 'border-b border-light-outline-variant/40 dark:border-dark-outline-variant/40'
                          : ''
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => navigate('task-details', { taskId: task.id })}
                        className="font-body text-body-md text-light-on-surface dark:text-dark-on-surface hover:text-light-primary dark:hover:text-dark-primary text-left truncate"
                      >
                        {task.title}
                      </button>
                      <span className="font-body text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant tabular-nums shrink-0">
                        {formatShortDate(task.dueDate)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col gap-gutter-md">
              <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
                Recent Activity
              </h2>
              <ul className="flex flex-col gap-gutter-sm">
                {activities.slice(0, 4).map((act) => (
                  <li key={act.id} className="flex items-center gap-gutter-sm">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        act.action === 'Completed'
                          ? 'bg-light-primary dark:bg-dark-primary'
                          : 'bg-light-secondary dark:bg-dark-secondary'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                      {act.action}{' '}
                      <strong className="text-light-on-surface dark:text-dark-on-surface font-medium">
                        {act.taskTitle}
                      </strong>{' '}
                      · {act.timeAgo}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
