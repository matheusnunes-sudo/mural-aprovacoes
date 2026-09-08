// Icones dos filtros. SVG inline com stroke="currentColor" para herdarem a
// cor do tema — ver regra 8 em docs/design-system.md.

const base = {
  width: 14,
  height: 14,
  viewBox: "0 0 14 14",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconeCurso() {
  return (
    <svg {...base}>
      <path d="M7 2 1 5l6 3 6-3-6-3Z" />
      <path d="M3.5 6.3V9c0 .9 1.6 1.7 3.5 1.7S10.5 9.9 10.5 9V6.3" />
    </svg>
  );
}

export function IconeFaculdade() {
  return (
    <svg {...base}>
      <path d="M1.5 12.5h11M2.5 12.5V6l4.5-3 4.5 3v6.5" />
      <path d="M5.8 12.5V9h2.4v3.5" />
    </svg>
  );
}

export function IconeStatus() {
  return (
    <svg {...base}>
      <circle cx="7" cy="7" r="5.2" />
      <circle cx="7" cy="7" r="1.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconeOlho() {
  return (
    <svg {...base}>
      <path d="M1 7s2.2-3.8 6-3.8S13 7 13 7s-2.2 3.8-6 3.8S1 7 1 7Z" />
      <circle cx="7" cy="7" r="1.7" />
    </svg>
  );
}

export function IconeOrdenar() {
  return (
    <svg {...base}>
      <path d="M3 3.5v7M3 10.5 1.4 8.9M3 10.5l1.6-1.6" />
      <path d="M7 4h6M7 7h4.5M7 10h3" />
    </svg>
  );
}

export function IconeFiltro() {
  return (
    <svg {...base}>
      <path d="M1.5 2.5h11l-4.2 5v4l-2.6-1.3v-2.7l-4.2-5Z" />
    </svg>
  );
}
