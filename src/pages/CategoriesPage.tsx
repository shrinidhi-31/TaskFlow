import { AppShell } from '../components/AppShell';
import { TaskCheckbox } from '../components/TaskCheckbox';
import { useApp } from '../context/AppContext';
import { TODAY_ISO } from '../data/initialData';
import { Category } from '../types';
import { formatShortDate, priorityClasses } from '../utils/dateFormat';

interface CategoryMeta {
  name: Category;
  icon: string;
  iconBg: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    name: 'Personal',
    icon: 'person',
    iconBg:
      'bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container',
  },
  {
    name: 'Study',
    icon: 'school',
    iconBg:
      'bg-light-tertiary-container dark:bg-dark-tertiary-container text-light-on-tertiary-container dark:text-dark-on-tertiary-container',
  },
  {
    name: 'Work',
    icon: 'work',
    iconBg:
      'bg-light-primary-container dark:bg-dark-primary-container text-light-on-primary-container dark:text-dark-on-primary-container',
  },
];

export function CategoriesPage() {
  const { tasks, selectedCategory, setSelectedCategory, toggleTask, navigate } = useApp();

  const categoryTasks = tasks.filter((t) => t.category === selectedCategory);

  return (
    <AppShell activeNav="categories">
      <header className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-gutter-lg flex flex-wrap items-center justify-between gap-gutter-md">
        <div>
          <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
            Categories
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Organise your tasks across Personal, Study, and Work.
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
          <span className="font-body text-label-lg">Add Task</span>
        </button>
      </header>

      <main className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pb-gutter-xl flex flex-col gap-gutter-xl">
        {/* 3 Category Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md lg:gap-gutter-lg items-stretch">
          {CATEGORIES.map((cat) => {
            const catItems = tasks.filter((t) => t.category === cat.name);
            const pendingCount = catItems.filter((t) => !t.completed).length;
            const completedCount = catItems.filter((t) => t.completed).length;
            const isActive = selectedCategory === cat.name;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`text-left bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg p-gutter-lg flex flex-col justify-between gap-gutter-md transition-colors ${
                  isActive
                    ? 'border-2 border-light-primary dark:border-dark-primary shadow-sm'
                    : 'border border-light-outline-variant/60 dark:border-dark-outline-variant/60 hover:border-light-primary/60 dark:hover:border-dark-primary/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`w-10 h-10 rounded-md inline-flex items-center justify-center ${cat.iconBg}`}>
                    <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                      {cat.icon}
                    </span>
                  </span>
                  <span
                    className={`font-body text-label-md tabular-nums ${
                      isActive
                        ? 'text-light-primary dark:text-dark-primary'
                        : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'
                    }`}
                  >
                    {catItems.length} {catItems.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <div>
                  <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
                    {cat.name}
                  </h2>
                  <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant tabular-nums">
                    {pendingCount} pending · {completedCount} completed
                  </p>
                </div>
              </button>
            );
          })}
        </section>

        {/* Category Task List */}
        <section className="flex flex-col gap-gutter-sm">
          <h2 className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface">
            {selectedCategory} Tasks
          </h2>
          {categoryTasks.length === 0 ? (
            <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-xl text-center">
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                No tasks in {selectedCategory} yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-gutter-sm">
              {categoryTasks.map((task) => (
                <article
                  key={task.id}
                  className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-md border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-md flex items-center justify-between gap-gutter-md"
                >
                  <div className="flex items-center gap-gutter-md min-w-0">
                    <TaskCheckbox
                      checked={task.completed}
                      onToggle={() => toggleTask(task.id)}
                      label={`Toggle "${task.title}"`}
                    />
                    <button
                      type="button"
                      onClick={() => navigate('task-details', { taskId: task.id })}
                      className={`text-left font-body text-title-md hover:text-light-primary dark:hover:text-dark-primary truncate ${
                        task.completed
                          ? 'line-through text-light-on-surface-variant dark:text-dark-on-surface-variant'
                          : 'text-light-on-surface dark:text-dark-on-surface'
                      }`}
                    >
                      {task.title}
                    </button>
                  </div>
                  <div className="flex items-center gap-gutter-sm shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-light-surface-container dark:bg-dark-surface-container-high text-light-on-surface-variant dark:text-dark-on-surface-variant font-body text-label-md tabular-nums">
                      {task.dueDate === TODAY_ISO ? 'Today' : formatShortDate(task.dueDate)}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-body text-label-md ${priorityClasses(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}
