export default function FlaskIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M9 3h6M10 3v5.5a1 1 0 01-.2.6L4.8 16.9A2 2 0 006.4 20h11.2a2 2 0 001.6-3.1L14.2 9.1a1 1 0 01-.2-.6V3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="14.5" r="1" fill="currentColor" />
    </svg>
  );
}
