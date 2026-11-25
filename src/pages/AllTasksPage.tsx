import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { TaskCheckbox } from '../components/TaskCheckbox';
import { useApp } from '../context/AppContext';
import { priorityClasses } from '../utils/dateFormat';

type FilterTab = 'all' | 'pending' | 'completed';
type SortMode = 'dueDate' | 'priority' | 'recent';

export function AllTasksPage() {
  const { tasks, toggleTask, deleteTask, navigate, globalSearch, setGlobalSearch } = useApp();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [sort, setSort] = useState<SortMode>('dueDate');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    const rank = { High: 0, Medium: 1, Low: 2 };
    const q = globalSearch.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (filter === 'pending' && t.completed) return false;
        if (filter === 'completed' && !t.completed) return false;
        if (!q) return true;
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sort === 'priority') return rank[a.priority] - rank[b.priority];
        if (sort === 'recent') {
          const score = (id: string) => {
            if (id.startsWith('task-')) {
              const parts = id.split('-');
              const ts = Number(parts[1]) || 0;
              const seq = Number(parts[2]) || 0;
              return ts * 1000 + seq;
            }
            return Number(id) || 0;
          };
          return score(b.id) - score(a.id);
        }
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [tasks, filter, sort, globalSearch]);

  return (
    <AppShell activeNav="all-tasks">
      <header className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-gutter-lg flex flex-wrap items-center justify-between gap-gutter-md">
        <div>
          <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
            My Tasks
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Search, filter, and manage all your tasks in one place.
          </p>
        </div>
        <div className="flex items-center gap-gutter-sm">
          <label className="relative flex items-center w-52 sm:w-72">
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
              placeholder="Search your tasks..."
              aria-label="Search your tasks"
              className="w-full rounded-md border border-light-outline-variant/80 dark:border-dark-outline-variant/80 bg-light-surface-container-lowest dark:bg-dark-surface-container pl-9 pr-3 py-2 font-body text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant/70 focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => navigate('add-task')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-sm hover:bg-light-primary-container whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              add
            </span>
            <span className="font-body text-label-lg">Add New Task</span>
          </button>
        </div>
      </header>

      <main className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pb-gutter-xl flex flex-col gap-gutter-md">
        {/* Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-gutter-md">
          <div
            role="tablist"
            aria-label="Task status filter"
            className="inline-flex items-center p-1 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline-variant/50 dark:border-dark-outline-variant/50 gap-1"
          >
            {(['all', 'pending', 'completed'] as FilterTab[]).map((tab) => {
              const active = filter === tab;
              const label = tab.charAt(0).toUpperCase() + tab.slice(1);
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded font-body text-label-md transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-light-surface-container-lowest dark:bg-dark-surface-container-high text-light-on-surface dark:text-dark-on-surface shadow-sm'
                      : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            aria-label="Sort tasks"
            className="rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3 py-2 font-body text-label-lg text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus-visible:ring-2 focus-visible:ring-light-primary focus:outline-none"
          >
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="recent">Sort: Recently Added</option>
          </select>
        </div>

        {/* Task List */}
        {filteredTasks.length > 0 ? (
          <div className="flex flex-col gap-gutter-sm">
            {filteredTasks.map((task) => (
              <article
                key={task.id}
                className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-md border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-md shadow-[0_1px_2px_rgba(26,28,26,0.03)] hover:shadow-[0_4px_12px_rgba(26,28,26,0.06)] transition-[box-shadow,transform] duration-state-change flex items-start justify-between gap-gutter-md"
              >
                <div className="flex items-start gap-gutter-md min-w-0">
                  <TaskCheckbox
                    checked={task.completed}
                    onToggle={() => toggleTask(task.id)}
                    label={`Toggle "${task.title}"`}
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
                    {task.description && (
                      <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-gutter-sm pt-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-light-surface-container dark:bg-dark-surface-container-high text-light-on-surface-variant dark:text-dark-on-surface-variant font-body text-label-md tabular-nums">
                        {task.dueDate}
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

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate('task-details', { taskId: task.id })}
                    aria-label={`Edit ${task.title}`}
                    className="w-8 h-8 rounded inline-flex items-center justify-center text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container dark:hover:bg-dark-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      edit
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(task.id)}
                    aria-label={`Delete ${task.title}`}
                    className="w-8 h-8 rounded inline-flex items-center justify-center text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-error-container dark:hover:bg-dark-error-container hover:text-light-on-error-container dark:hover:text-dark-on-error-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      delete
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-xl flex flex-col items-center text-center gap-gutter-md">
            <span className="w-12 h-12 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container inline-flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">assignment_add</span>
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
                No tasks yet
              </h2>
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Start your day by adding your first task.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('add-task')}
              className="px-4 py-2 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-body text-label-lg"
            >
              Add New Task
            </button>
          </div>
        ) : (
          <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-xl flex flex-col items-center text-center gap-gutter-md">
            <span className="w-12 h-12 rounded-full bg-light-surface-container dark:bg-dark-surface-container-high text-light-on-surface-variant dark:text-dark-on-surface-variant inline-flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">search_off</span>
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
                No matching tasks found
              </h2>
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Try adjusting your search query or filter selection.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setGlobalSearch('');
                setFilter('all');
              }}
              className="px-4 py-2 rounded border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface dark:text-dark-on-surface font-body text-label-lg hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-high"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this task?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteTask(pendingDeleteId);
          setPendingDeleteId(null);
        }}
      />
    </AppShell>
  );
}
