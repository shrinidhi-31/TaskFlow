import { AppShell } from '../components/AppShell';
import { useApp } from '../context/AppContext';

export function NotificationsPage() {
  const { notifications, markAllNotificationsRead, clearNotifications, navigate } = useApp();

  return (
    <AppShell activeNav="dashboard">
      <header className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-gutter-lg flex flex-wrap items-center justify-between gap-gutter-md">
        <div>
          <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
            Notifications
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Upcoming deadline reminders and overdue task alerts.
          </p>
        </div>
        <div className="flex items-center gap-gutter-sm">
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="px-3.5 py-2 rounded border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-lowest dark:bg-dark-surface-container font-body text-label-lg text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-high whitespace-nowrap"
          >
            Mark all as read
          </button>
          <button
            type="button"
            onClick={clearNotifications}
            className="px-3.5 py-2 rounded bg-light-error-container dark:bg-dark-error-container text-light-on-error-container dark:text-dark-on-error-container font-body text-label-lg hover:opacity-90 whitespace-nowrap"
          >
            Clear all
          </button>
        </div>
      </header>

      <main className="w-full max-w-[1120px] mx-auto px-gutter-md lg:px-gutter-xl pb-gutter-xl flex flex-col gap-gutter-sm">
        {notifications.length > 0 ? (
          <div className="flex flex-col gap-gutter-sm">
            {notifications.map((notif) => {
              const isOverdue = notif.type === 'overdue';
              return (
                <article
                  key={notif.id}
                  onClick={() => notif.taskId && navigate('task-details', { taskId: notif.taskId })}
                  className={`bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-md border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-md flex items-start justify-between gap-gutter-md ${
                    notif.taskId ? 'cursor-pointer hover:border-light-primary/50 transition-colors' : ''
                  }`}
                >
                  <div className="flex items-start gap-gutter-md">
                    <span
                      className={`w-9 h-9 rounded-full inline-flex items-center justify-center shrink-0 ${
                        isOverdue ? 'bg-priority-high-bg text-priority-high' : 'bg-warning-bg text-warning'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                        {isOverdue ? 'warning' : 'schedule'}
                      </span>
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <h2 className="font-body text-title-md text-light-on-surface dark:text-dark-on-surface">
                        {notif.title}
                      </h2>
                      <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                        {notif.subtitle}
                      </p>
                    </div>
                  </div>
                  {notif.unread && (
                    <span
                      className="w-2.5 h-2.5 rounded-full bg-light-primary dark:bg-dark-primary mt-2 shrink-0"
                      aria-label="Unread"
                    />
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-low rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 p-gutter-xl flex flex-col items-center text-center gap-gutter-sm">
            <span className="w-12 h-12 rounded-full bg-light-surface-container dark:bg-dark-surface-container-high text-light-on-surface-variant dark:text-dark-on-surface-variant inline-flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">notifications_off</span>
            </span>
            <h2 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
              No notifications
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
              You&apos;re all caught up on reminders and deadline alerts.
            </p>
          </div>
        )}
      </main>
    </AppShell>
  );
}
