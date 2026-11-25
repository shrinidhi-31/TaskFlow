import { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { TaskCheckbox } from '../components/TaskCheckbox';
import { useApp } from '../context/AppContext';
import { CELEBRATION_IMAGE, TODAY_ISO } from '../data/initialData';
import { priorityClasses } from '../utils/dateFormat';

export function TodayTasksPage() {
  const { tasks, toggleTask, navigate } = useApp();
  const [imgError, setImgError] = useState(false);

  const todayTasks = tasks.filter((t) => t.dueDate === TODAY_ISO);
  const pending = todayTasks.filter((t) => !t.completed);
  const completed = todayTasks.filter((t) => t.completed);
  const totalToday = todayTasks.length;
  const pct = totalToday > 0 ? Math.round((completed.length / totalToday) * 100) : 0;

  return (
    <AppShell activeNav="today">
      <header className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-gutter-lg flex flex-wrap items-center justify-between gap-gutter-md">
        <div>
          <span className="font-body text-label-md text-light-primary dark:text-dark-primary">
            Wednesday, November 25
          </span>
          <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
            Today&apos;s Tasks
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('add-task', { defaultDueDate: TODAY_ISO })}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-sm hover:bg-light-primary-container whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            add
          </span>
          <span className="font-body text-label-lg">Add Task for Today</span>
        </button>
      </header>

      <main className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pb-gutter-xl flex flex-col gap-gutter-xl">
        {/* Daily Progress Indicator */}
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col gap-gutter-sm">
          <div className="flex items-center justify-between">
            <span className="font-body text-title-md text-light-on-surface dark:text-dark-on-surface">
              Daily Progress
            </span>
            <span className="font-body text-label-lg text-light-primary dark:text-dark-primary tabular-nums">
              {completed.length} of {totalToday} completed ({pct}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-light-surface-container-high dark:bg-dark-surface-container-high overflow-hidden">
            <div
              className="h-full w-full rounded-full bg-light-primary dark:bg-dark-primary origin-left transition-transform duration-progress-fill ease-progress-fill"
              style={{ transform: `scaleX(${totalToday > 0 ? completed.length / totalToday : 0})` }}
            />
          </div>
        </section>

        {/* All Caught Up Celebration when pending is 0 and there are completed tasks */}
        {pending.length === 0 && todayTasks.length > 0 && (
          <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-col sm:flex-row items-center justify-between gap-gutter-md">
            <div className="flex items-center gap-gutter-md">
              {imgError ? (
                <div className="w-24 h-18 rounded-md bg-gradient-to-br from-success-bg via-light-surface-container-low to-light-secondary-container flex items-center justify-center text-success shrink-0">
                  <span className="material-symbols-outlined text-[28px]" aria-hidden="true">
                    task_alt
                  </span>
                </div>
              ) : (
                <img
                  src={CELEBRATION_IMAGE}
                  alt="All caught up illustration"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-24 h-18 object-cover rounded-md shrink-0"
                />
              )}
              <div className="flex flex-col gap-1">
                <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
                  You&apos;re all caught up!
                </h2>
                <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  All tasks for today are completed. Take a moment to recharge.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('add-task', { defaultDueDate: TODAY_ISO })}
              className="px-4 py-2 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-body text-label-lg whitespace-nowrap shrink-0"
            >
              Create New Task
            </button>
          </section>
        )}

        {/* Pending Today */}
        <section className="flex flex-col gap-gutter-sm">
          <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface tabular-nums">
            Pending ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-md border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg text-center">
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                {todayTasks.length === 0
                  ? 'No tasks scheduled for today yet.'
                  : 'Every pending task for today has been completed.'}
              </p>
            </div>
          ) : (
            pending.map((task) => (
              <article
                key={task.id}
                className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-md border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-md flex items-start justify-between gap-gutter-md"
              >
                <div className="flex items-start gap-gutter-md min-w-0">
                  <TaskCheckbox
                    checked={task.completed}
                    onToggle={() => toggleTask(task.id)}
                    label={`Complete "${task.title}"`}
                  />
                  <div className="flex flex-col gap-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => navigate('task-details', { taskId: task.id })}
                      className="text-left font-body text-title-md text-light-on-surface dark:text-dark-on-surface hover:text-light-primary dark:hover:text-dark-primary"
                    >
                      {task.title}
                    </button>
                    {task.description && (
                      <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-gutter-sm pt-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-body text-label-md">
                        {task.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-body text-label-md ${priorityClasses(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
                {task.dueTime && (
                  <span className="font-body text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant tabular-nums shrink-0">
                    {task.dueTime}
                  </span>
                )}
              </article>
            ))
          )}
        </section>

        {/* Completed Today */}
        <section className="flex flex-col gap-gutter-sm">
          <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface tabular-nums">
            Completed Today ({completed.length})
          </h2>
          {completed.length === 0 ? (
            <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-md border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg text-center">
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Completed items for today will appear here.
              </p>
            </div>
          ) : (
            completed.map((task) => (
              <article
                key={task.id}
                className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-md border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-md flex items-start justify-between gap-gutter-md"
              >
                <div className="flex items-start gap-gutter-md min-w-0">
                  <TaskCheckbox
                    checked={task.completed}
                    onToggle={() => toggleTask(task.id)}
                    label={`Restore "${task.title}" to pending`}
                  />
                  <div className="flex flex-col gap-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => navigate('task-details', { taskId: task.id })}
                      className="text-left font-body text-title-md text-light-on-surface-variant dark:text-dark-on-surface-variant line-through hover:text-light-primary dark:hover:text-dark-primary"
                    >
                      {task.title}
                    </button>
                    <div className="flex items-center gap-gutter-sm">
                      <span className="px-2.5 py-0.5 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-body text-label-md">
                        {task.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-success-bg text-success font-body text-label-md">
                        Done
                      </span>
                    </div>
                  </div>
                </div>
                {task.dueTime && (
                  <span className="font-body text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant tabular-nums shrink-0">
                    {task.dueTime}
                  </span>
                )}
              </article>
            ))
          )}
        </section>
      </main>
    </AppShell>
  );
}
