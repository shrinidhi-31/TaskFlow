import { useState } from 'react';

interface AvatarProps {
  src: string;
  name: string;
  size?: 'sm' | 'lg';
}

export function Avatar({ src, name, size = 'sm' }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const sizeClass = size === 'lg' ? 'w-16 h-16 text-title-lg' : 'w-9 h-9 text-label-md';

  if (imgError || !src) {
    return (
      <div
        aria-label={name}
        className={`${sizeClass} rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-headline font-semibold flex items-center justify-center shrink-0 border border-light-outline-variant/60 dark:border-dark-outline-variant/60`}
      >
        {initials || 'ML'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className={`${sizeClass} rounded-full object-cover shrink-0 ${
        size === 'lg' ? 'border border-light-outline-variant/70 dark:border-dark-outline-variant/70' : ''
      }`}
    />
  );
}
