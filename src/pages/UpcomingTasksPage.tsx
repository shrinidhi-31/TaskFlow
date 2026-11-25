import { AppShell } from '../components/AppShell';
import { TaskCheckbox } from '../components/TaskCheckbox';
import { useApp } from '../context/AppContext';
import { TODAY_ISO, TOMORROW_ISO } from '../data/initialData';
import { formatShortDate, priorityClasses } from '../utils/dateFormat';

export function UpcomingTasksPage() {
  const { tasks, toggleTask, navigate } = useApp();

  const pendingTasks = tasks.filter((t) => !t.completed);
  const overdue = pendingTasks
    .filter((t) => t.dueDate < TODAY_ISO)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const tomorrow = pendingTasks.filter((t) => t.dueDate === TOMORROW_ISO);
  const later = pendingTasks
    .filter((t) => t.dueDate > TOMORROW_ISO)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  // Group later tasks by date
  const laterGroups = later.reduce<Record<string, typeof later>>((acc, task) => {
    acc[task.dueDate] = acc[task.dueDate] || [];
    acc[task.dueDate].push(task);
    return acc;
  }, {});

  return (
    <AppShell activeNav="upcoming">
      <header className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-gutter-lg flex flex-wrap items-center justify-between gap-gutter-md">
        <div>
          <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
            Upcoming Tasks
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Stay ahead of overdue items and upcoming deadlines.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('add-task')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-sm hover:bg-light-primary-container whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            add
          </span>
          <span className="font-body text-label-lg">Schedule Task</span>
        </button>
      </header>

      <main className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pb-gutter-xl flex flex-col gap-gutter-xl">
        {/* Overdue Section */}
        {overdue.length > 0 && (
          <section className="flex flex-col gap-gutter-sm">
            <div className="flex items-center gap-gutter-sm">
              <h2 className="font-headline text-title-lg text-priority-high dark:text-dark-error">
                Overdue
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-priority-high-bg text-priority-high font-body text-label-sm tabular-nums">
                {overdue.length}
              </span>
            </div>
            {overdue.map((task) => (
              <article
                key={task.id}
                className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-md border border-light-error/40 dark:border-dark-error/40 p-gutter-md flex items-start justify-between gap-gutter-md"
              >
                <div className="flex items-start gap-gutter-md min-w-0">
                  <TaskCheckbox
                    checked={task.completed}
                    overdue
                    onToggle={() => toggleTask(task.id)}
                    label={`Complete overdue task "${task.title}"`}
                  />
                  <div className="flex flex-col gap-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => navigate('task-details', { taskId: task.id })}
                      className="text-left font-body text-title-md text-light-on-surface dark:text-dark-on-surface hover:text-light-primary dark:hover:text-dark-primary"
                    >
                      {task.title}
                    </button>
                    <div className="flex flex-wrap items-center gap-gutter-sm">
                      <span className="px-2.5 py-0.5 rounded-full bg-priority-high-bg text-priority-high font-body text-label-md tabular-nums">
                        Due {formatShortDate(task.dueDate)} · Overdue
                      </span>
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
              </article>
            ))}
          </section>
        )}

        {/* Tomorrow */}
        <section className="flex flex-col gap-gutter-sm">
          <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
            Tomorrow · Nov 26
          </h2>
          {tomorrow.length === 0 ? (
            <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-md border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-md text-light-on-surface-variant dark:text-dark-on-surface-variant font-body text-body-md">
              No tasks scheduled for tomorrow.
            </div>
          ) : (
            tomorrow.map((task) => (
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
                    <div className="flex flex-wrap items-center gap-gutter-sm">
                      <span className="px-2.5 py-0.5 rounded-full bg-light-surface-container dark:bg-dark-surface-container-high text-light-on-surface-variant dark:text-dark-on-surface-variant font-body text-label-md tabular-nums">
                        {formatShortDate(task.dueDate)}
                      </span>
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
              </article>
            ))
          )}
        </section>

        {/* Later This Week */}
        {Object.entries(laterGroups).map(([dateIso, groupTasks]) => (
          <section key={dateIso} className="flex flex-col gap-gutter-sm">
            <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
              {dateIso === '2026-11-28' ? 'Friday · Nov 28' : formatShortDate(dateIso)}
            </h2>
            {groupTasks.map((task) => (
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
                    <div className="flex flex-wrap items-center gap-gutter-sm">
                      <span className="px-2.5 py-0.5 rounded-full bg-light-surface-container dark:bg-dark-surface-container-high text-light-on-surface-variant dark:text-dark-on-surface-variant font-body text-label-md tabular-nums">
                        {formatShortDate(task.dueDate)}
                      </span>
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
              </article>
            ))}
          </section>
        ))}
      </main>
    </AppShell>
  );
}
