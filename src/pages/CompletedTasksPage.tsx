import { AppShell } from '../components/AppShell';
import { useApp } from '../context/AppContext';

export function CompletedTasksPage() {
  const { tasks, restoreTask, navigate } = useApp();

  const completedTasks = tasks.filter((t) => t.completed);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <AppShell activeNav="completed">
      <header className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-gutter-lg">
        <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
          Completed Tasks
        </h1>
        <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
          Review everything you&apos;ve accomplished or restore a task to pending.
        </p>
      </header>

      <main className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pb-gutter-xl flex flex-col gap-gutter-lg">
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg flex flex-wrap items-center justify-between gap-gutter-md">
          <div className="flex items-center gap-gutter-md">
            <span className="w-11 h-11 rounded-full bg-success-bg text-success inline-flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                emoji_events
              </span>
            </span>
            <div>
              <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface tabular-nums">
                {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'} completed this week
              </h2>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant tabular-nums">
                {completionRate}% overall completion rate
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-success-bg text-success font-body text-label-md">
            Steady momentum
          </span>
        </section>

        {completedTasks.length > 0 ? (
          <div className="flex flex-col gap-gutter-sm">
            {completedTasks.map((task) => (
              <article
                key={task.id}
                className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-md border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-md flex flex-wrap items-center justify-between gap-gutter-md"
              >
                <div className="flex items-start gap-gutter-md min-w-0">
                  <span className="mt-0.5 w-5 h-5 rounded-sm bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary inline-flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                      check
                    </span>
                  </span>
                  <div className="flex flex-col gap-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => navigate('task-details', { taskId: task.id })}
                      className="text-left font-body text-title-md text-light-on-surface-variant dark:text-dark-on-surface-variant line-through hover:text-light-primary dark:hover:text-dark-primary"
                    >
                      {task.title}
                    </button>
                    <div className="flex flex-wrap items-center gap-gutter-sm">
                      <span className="px-2.5 py-0.5 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-body text-label-md">
                        {task.category}
                      </span>
                      <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant tabular-nums">
                        {task.completedAt || `Completed ${task.dueDate}`}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => restoreTask(task.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface dark:text-dark-on-surface font-body text-label-md hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-high transition-colors whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                    undo
                  </span>
                  Restore to pending
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-xl flex flex-col items-center text-center gap-gutter-sm">
            <span className="w-12 h-12 rounded-full bg-light-surface-container dark:bg-dark-surface-container-high text-light-on-surface-variant dark:text-dark-on-surface-variant inline-flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">check_box_outline_blank</span>
            </span>
            <h3 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
              No completed tasks yet
            </h3>
            <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Check off a task from your list to see your progress here.
            </p>
          </div>
        )}
      </main>
    </AppShell>
  );
}
