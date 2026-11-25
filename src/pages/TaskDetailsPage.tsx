import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useApp } from '../context/AppContext';
import { Category, Priority } from '../types';
import { formatLongDate, priorityClasses } from '../utils/dateFormat';

export function TaskDetailsPage() {
  const { tasks, selectedTaskId, toggleTask, updateTask, deleteTask, navigate } = useApp();
  const task = tasks.find((t) => t.id === selectedTaskId) ?? tasks[0];

  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [category, setCategory] = useState<Category>(task?.category ?? 'Work');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'High');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '2026-11-25');

  const syncFieldsFromTask = () => {
    if (!task) return;
    setTitle(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setEditError(false);
  };

  useEffect(() => {
    syncFieldsFromTask();
    setIsEditing(false);
  }, [task?.id]);

  if (!task) {
    return (
      <AppShell activeNav="all-tasks">
        <div className="w-full max-w-3xl mx-auto px-gutter-md lg:px-gutter-xl py-gutter-xl">
          <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 p-gutter-xl text-center flex flex-col items-center gap-gutter-md">
            <h1 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
              Task not found
            </h1>
            <button
              type="button"
              onClick={() => navigate('all-tasks')}
              className="px-4 py-2 rounded bg-light-primary text-light-on-primary font-body text-label-lg"
            >
              Back to My Tasks
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setEditError(true);
      return;
    }
    setEditError(false);
    updateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate,
    });
    setIsEditing(false);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      syncFieldsFromTask();
      setIsEditing(false);
    } else {
      syncFieldsFromTask();
      setIsEditing(true);
    }
  };

  return (
    <AppShell activeNav="all-tasks">
      <header className="w-full max-w-3xl mx-auto px-gutter-md lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-gutter-md flex flex-wrap items-center justify-between gap-gutter-md">
        <div className="flex items-center gap-gutter-sm">
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
          <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
            Task Details
          </h1>
        </div>
        <div className="flex items-center gap-gutter-sm">
          <button
            type="button"
            onClick={handleToggleEdit}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface font-body text-label-lg hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-high"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              {isEditing ? 'close' : 'edit'}
            </span>
            {isEditing ? 'Cancel Edit' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-light-error-container dark:bg-dark-error-container text-light-on-error-container dark:text-dark-on-error-container font-body text-label-lg hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              delete
            </span>
            Delete
          </button>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-gutter-md lg:px-gutter-xl pb-gutter-xl flex flex-col gap-gutter-lg">
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-lg sm:p-gutter-xl shadow-[0_4px_20px_rgba(26,28,26,0.04)] flex flex-col gap-gutter-lg">
          <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
            <span
              className={`px-3 py-1 rounded-full font-body text-label-md ${
                task.completed ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
              }`}
            >
              {task.completed ? 'Completed' : 'Pending'}
            </span>
            <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant tabular-nums">
              Created {task.createdAt}
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="flex flex-col gap-gutter-md" noValidate>
              {editError && (
                <div
                  className="rounded-md bg-light-error-container dark:bg-dark-error-container text-light-on-error-container dark:text-dark-on-error-container px-4 py-3 font-body text-body-sm"
                  role="alert"
                >
                  Please enter a task title before saving.
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
                    if (editError) setEditError(false);
                  }}
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
                    className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface"
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
                    className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface"
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
                    className="w-full rounded-md border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container px-3.5 py-2.5 font-body text-body-md text-light-on-surface dark:text-dark-on-surface"
                  />
                </label>
              </div>

              <div className="pt-gutter-md border-t border-light-outline-variant/50 dark:border-dark-outline-variant/50 flex justify-end gap-gutter-sm">
                <button
                  type="button"
                  onClick={() => {
                    syncFieldsFromTask();
                    setIsEditing(false);
                  }}
                  className="px-4 py-2.5 rounded border border-light-outline-variant dark:border-dark-outline-variant font-body text-label-lg text-light-on-surface dark:text-dark-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-body text-label-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex flex-col gap-gutter-sm">
                <h2 className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface">
                  {task.title}
                </h2>
                <p className="font-body text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant text-pretty">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md pt-gutter-md border-t border-light-outline-variant/50 dark:border-dark-outline-variant/50">
                <div className="flex flex-col gap-1">
                  <span className="font-body text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant uppercase">
                    Category
                  </span>
                  <span className="w-fit px-2.5 py-0.5 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-body text-label-md">
                    {task.category}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-body text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant uppercase">
                    Priority
                  </span>
                  <span
                    className={`w-fit px-2.5 py-0.5 rounded-full font-body text-label-md ${priorityClasses(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-body text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant uppercase">
                    Due Date
                  </span>
                  <span className="font-body text-title-md text-light-on-surface dark:text-dark-on-surface tabular-nums">
                    {formatLongDate(task.dueDate)}
                  </span>
                </div>
              </div>

              <div className="pt-gutter-md border-t border-light-outline-variant/50 dark:border-dark-outline-variant/50 flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-sm hover:bg-light-primary-container font-body text-label-lg"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                    {task.completed ? 'undo' : 'check_circle'}
                  </span>
                  {task.completed ? 'Reopen Task' : 'Mark as Completed'}
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete this task?"
        description="Are you sure you want to permanently remove this task?"
        confirmLabel="Confirm Delete"
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          deleteTask(task.id);
          setShowDeleteDialog(false);
          navigate('all-tasks');
        }}
      />
    </AppShell>
  );
}
