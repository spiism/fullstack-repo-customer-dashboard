import type { ReactNode } from "react";

function MetaIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-github-muted"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      {children}
    </svg>
  );
}

export function StarIcon() {
  return (
    <MetaIcon>
      <path d="M8 .75a.75.75 0 0 1 .67.41l1.88 3.81 4.2.61a.75.75 0 0 1 .42 1.28l-3.04 2.96.72 4.18a.75.75 0 0 1-1.09.79L8 12.81l-3.76 1.98a.75.75 0 0 1-1.09-.79l.72-4.18L.83 6.86a.75.75 0 0 1 .42-1.28l4.2-.61 1.88-3.81A.75.75 0 0 1 8 .75Z" />
    </MetaIcon>
  );
}

export function ForkIcon() {
  return (
    <MetaIcon>
      <path d="M5 3.25a1.75 1.75 0 1 1-2.5-1.58 1.75 1.75 0 0 1 2.5 1.58Zm-1.75-.25a.25.25 0 1 0 .5 0 .25.25 0 0 0-.5 0Zm9.25.25a1.75 1.75 0 0 1-2.5 1.58 1.75 1.75 0 1 1 2.5-1.58Zm-1.75-.25a.25.25 0 1 0 .5 0 .25.25 0 0 0-.5 0ZM8.75 11.1a1.75 1.75 0 1 1-1.5 0V9.5a2 2 0 0 1 2-2h1a.5.5 0 0 0 .5-.5V4.5h1.5V7a2 2 0 0 1-2 2h-1a.5.5 0 0 0-.5.5v1.6Zm-.75 1.4a.25.25 0 1 0 0 .5.25.25 0 0 0 0-.5ZM3.75 4.5h-1.5v2.75A2.75 2.75 0 0 0 5 10h1v-1.5H5a1.25 1.25 0 0 1-1.25-1.25V4.5Z" />
    </MetaIcon>
  );
}

export function ClockIcon() {
  return (
    <MetaIcon>
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8.75-3.25v2.96l2.02 1.21a.75.75 0 0 1-.77 1.29L7.61 8.78A.75.75 0 0 1 7.25 8V4.75a.75.75 0 0 1 1.5 0Z" />
    </MetaIcon>
  );
}
