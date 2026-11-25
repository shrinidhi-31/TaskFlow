import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';

interface TaskCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  overdue?: boolean;
}

export function TaskCheckbox({ checked, onToggle, label = 'Toggle task', overdue = false }: TaskCheckboxProps) {
  const { settings } = useApp();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const willCheck = !checked;
    if (
      willCheck &&
      settings.celebrations &&
      containerRef.current &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const colors = ['#3A5946', '#52725D', '#ACCFB6', '#D4AF37'];
      for (let i = 0; i < 10; i++) {
        const dot = document.createElement('span');
        dot.className = 'tf-confetti-dot';
        const angle = (Math.PI * 2 * i) / 10;
        dot.style.left = '10px';
        dot.style.top = '10px';
        dot.style.backgroundColor = colors[i % colors.length];
        dot.style.setProperty('--tx', `${Math.cos(angle) * 28}px`);
        dot.style.setProperty('--ty', `${Math.sin(angle) * 28}px`);
        containerRef.current.appendChild(dot);
        window.setTimeout(() => dot.remove(), 650);
      }
    }
    onToggle();
  };

  return (
    <div ref={containerRef} className="relative mt-0.5 shrink-0">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={label}
        onClick={handleClick}
        className={`tf-checkbox w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-[background-color,border-color] duration-checkbox-draw focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary dark:focus-visible:ring-dark-primary ${
          checked
            ? 'bg-light-primary dark:bg-dark-primary border-light-primary dark:border-dark-primary text-light-on-primary dark:text-dark-on-primary'
            : overdue
            ? 'border-light-error dark:border-dark-error text-transparent hover:bg-light-error-container/30'
            : 'border-light-outline dark:border-dark-outline text-transparent hover:border-light-primary dark:hover:border-dark-primary'
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            className="tf-check-path"
            d="M2.5 7.5L5.5 10.5L11.5 3.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
