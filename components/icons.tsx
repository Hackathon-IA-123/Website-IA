/* Icônes reprises telles quelles des maquettes « Jean ». */

type P = { className?: string; size?: number };

const base = (size = 22) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function PenIcon({ size }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
      <path d="M13.5 6.5l3 3" />
    </svg>
  );
}

export function SearchIcon({ size }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.2-4.2" />
    </svg>
  );
}

export function ImageIcon({ size }: P) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="8.5" cy="9" r="1.6" />
      <path d="M21 16l-5-4.5L6 21" />
    </svg>
  );
}

export function BagIcon({ size }: P) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="6" width="18" height="13" rx="3.5" />
      <path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6" />
    </svg>
  );
}

export function GridIcon({ size }: P) {
  return (
    <svg {...{ ...base(size), strokeLinecap: undefined, strokeLinejoin: undefined }}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </svg>
  );
}

export function HistoryIcon({ size }: P) {
  return (
    <svg {...base(size)}>
      <path d="M3.5 9a9 9 0 1 1-1 5" />
      <path d="M3 4v5h5" />
      <path d="M12 8v4.5l3 1.8" />
    </svg>
  );
}

export function GearIcon({ size }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" />
    </svg>
  );
}

export function PlusIcon({ size }: P) {
  return (
    <svg {...base(size)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MicIcon({ size }: P) {
  return (
    <svg {...base(size)}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 16 }: P) {
  return (
    <svg {...{ ...base(size), strokeWidth: 2 }}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ArrowUpIcon({ size }: P) {
  return (
    <svg {...{ ...base(size), strokeWidth: 2 }}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function ShareIcon({ size = 21 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}

export function DotsIcon({ size = 21 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}

export function CopyIcon({ size = 19 }: P) {
  return (
    <svg {...base(size)}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function ThumbUpIcon({ size = 19 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3zM7 11l4.5-8a2 2 0 0 1 2.7 2.6L13 9h5.5a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17 20H7" />
    </svg>
  );
}

export function ThumbDownIcon({ size = 19 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M17 13v-9h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-3zM17 13l-4.5 8a2 2 0 0 1-2.7-2.6L11 15H5.5a2 2 0 0 1-2-2.4l1.4-7A2 2 0 0 1 7 4h10" />
    </svg>
  );
}

export function RegenIcon({ size = 19 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}

export function PanelLeftIcon({ size }: P) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M9 4v16" />
    </svg>
  );
}

/** Icône « chat temporaire » : bulle de discussion en pointillés. */
export function TemporaryChatIcon({ size }: P) {
  return (
    <svg {...base(size)}>
      <path
        d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.9A8.5 8.5 0 1 1 21 11.5Z"
        strokeDasharray="2.6 2.8"
      />
    </svg>
  );
}

/** Étincelle de marque (fallback si le logo PNG est absent). */
export function SparkIcon({ size = 30 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z"
        fill="#FFC400"
      />
    </svg>
  );
}
