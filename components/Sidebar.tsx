"use client";

import { useState } from "react";

interface SidebarProps {
  onNewChat: () => void;
}

export default function Sidebar({ onNewChat }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={`hidden md:flex flex-col gap-2 bg-surface h-full p-3 transition-all duration-200 ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-label="Menu"
        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-hover"
      >
        <MenuIcon />
      </button>

      <button
        onClick={onNewChat}
        className="mt-2 flex items-center gap-3 rounded-full bg-surface-hover px-4 py-2.5 text-sm text-foreground hover:bg-border transition-colors w-fit"
      >
        <PlusIcon />
        {expanded && <span>Nouveau chat</span>}
      </button>

      {expanded && (
        <div className="mt-6 flex-1 overflow-y-auto">
          <p className="px-3 pb-2 text-sm text-muted">Récents</p>
          <ul className="flex flex-col gap-1">
            {["Idées de projet", "Explication React", "Recette du soir"].map(
              (item) => (
                <li key={item}>
                  <button className="flex w-full items-center gap-3 truncate rounded-full px-3 py-2 text-left text-sm text-foreground hover:bg-surface-hover">
                    <ChatIcon />
                    <span className="truncate">{item}</span>
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {expanded && (
        <button className="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-foreground hover:bg-surface-hover">
          <SettingsIcon />
          <span>Paramètres</span>
        </button>
      )}
    </aside>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  );
}
