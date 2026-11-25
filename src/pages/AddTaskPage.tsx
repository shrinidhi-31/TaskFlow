import React, { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { useApp } from '../context/AppContext';
import { Category, Priority } from '../types';

export function AddTaskPage() {
  const { addTask, navigate, selectedCategory, addTaskDefaultDueDate } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(selectedCategory || 'Work');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState(addTaskDefaultDueDate || '2026-11-26');
  const [error, setError] = useState(false);
  const [created, setCreated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(true);
      setCreated(false);
      return;
    }
    setError(false);
    addTask({
      title,
      description,
      category,
      priority,
      dueDate,
    });
    setCreated(true);
    setTitle('');
    setDescription('');
    setCategory(selectedCategory || 'Work');
    setPriority('Medium');
    setDueDate(addTaskDefaultDueDate || '2026-11-26');
  };

  return (
    <AppShell activeNav="all-tasks">
      <header className="w-full max-w-3xl mx-auto px-gutter-md lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-gutter-md flex items-center gap-gutter-sm">
        <button
          type="button"
          onClick={() => navigate('all-tasks')}
          aria-label="Back to tasks"
          className="w-9 h-9 rounded-md border border-light-outline-variant/60 dark:border-dark-outline-variant/60 bg-light-surface-container-lowest dark:bg-dark-surface-container inline-flex items-center justify-center text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-high"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            arrow_back
          </span>
        </button>
        <div>
          <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
            Add New Task
          </h1>
          <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Capture a new task with category, priority, and due date.
          </p>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-gutter-md lg:px-gutter-xl pb-gutter-xl">
        <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg sm:p-gutter-xl shadow-[0_4px_20px_rgba(26,28,26,0.04)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-md" noValidate>
            {error && (
              <div
                className="rounded-md bg-light-error-container dark:bg-dark-error-container text-light-on-error-container dark:text-dark-on-error-container px-4 py-3 font-body text-body-sm"
                role="alert"
              >
                Please enter a task title before saving.
              </div>
            )}
            {created && (
              <div
                className="rounded-md bg-success-bg text-success px-4 py-3 font-body text-body-sm flex items-center justify-between gap-2"
                role="status"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                    check_circle
                  </span>
                  Task created! Ready to add another or return to your list.
                </span>
                <button
                  type="button"
                  onClick={() => navigate('all-tasks')}
                  className="font-body text-label-md underline whitespace-nowrap"
                >
                  View list
                </button>
              </div>
            )}

            <label className="flex flex-col gap-gutter-xs">
              <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                Task title
              </span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError(false);
                  if (created) setCreated(false);
                }}
                placeholder="e.g., Draft research methodology section"
                className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-gutter-xs">
              <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                Description
              </span>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context, links, or sub-steps..."
                className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md">
              <label className="flex flex-col gap-gutter-xs">
                <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                  Category
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus-visible:ring-2 focus-visible:ring-light-primary focus:outline-none"
                >
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                </select>
              </label>

              <label className="flex flex-col gap-gutter-xs">
                <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                  Priority
                </span>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus-visible:ring-2 focus-visible:ring-light-primary focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>

              <label className="flex flex-col gap-gutter-xs">
                <span className="font-body text-label-md text-light-on-surface dark:text-dark-on-surface">
                  Due date
                </span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus-visible:ring-2 focus-visible:ring-light-primary focus:outline-none"
                />
              </label>
            </div>

            <footer className="flex items-center justify-end gap-gutter-sm pt-gutter-md border-t border-light-outline-variant/50 dark:border-dark-outline-variant/50">
              <button
                type="button"
                onClick={() => navigate('all-tasks')}
                className="px-4 py-2.5 rounded border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface font-body text-label-lg hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-high"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-sm hover:bg-light-primary-container font-body text-label-lg"
              >
                Save Task
              </button>
            </footer>
          </form>
        </div>
      </main>
    </AppShell>
  );
}
