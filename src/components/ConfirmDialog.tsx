import { useEffect } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-gutter-md bg-black/40 backdrop-blur-[2px]"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="tf-confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg border border-light-outline-variant/60 dark:border-dark-outline-variant/60 bg-light-surface-container-lowest dark:bg-dark-surface-container-low p-gutter-lg shadow-xl"
      >
        <div className="flex flex-col gap-gutter-md">
          <h2
            id="tf-confirm-title"
            className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface"
          >
            {title}
          </h2>
          <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            {description}
          </p>
          <div className="flex justify-end gap-gutter-sm">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded border border-light-outline-variant dark:border-dark-outline-variant font-body text-label-lg text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-light-error dark:bg-dark-error text-light-on-error dark:text-dark-on-error font-body text-label-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
