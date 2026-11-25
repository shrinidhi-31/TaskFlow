export function BrandMark({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const iconDim = size === 'lg' ? 22 : 20;
  return (
    <div
      className={`${dim} rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary flex items-center justify-center shrink-0 shadow-sm`}
    >
      <svg width={iconDim} height={iconDim} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M8 12.5L10.8 15.2L16.5 9.2"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
