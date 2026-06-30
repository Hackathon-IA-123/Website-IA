"use client";

import type { ConversationSummary, SessionUser } from "@/app/types";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import Logo from "./Logo";
import { useTheme } from "./ThemeProvider";
import {
  BagIcon,
  GridIcon,
  HistoryIcon,
  ImageIcon,
  MoonIcon,
  PanelLeftIcon,
  PenIcon,
  SearchIcon,
  SunIcon,
} from "./icons";

interface RailProps {
  user: SessionUser;
  conversations: ConversationSummary[];
  activeId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onOpenSearch: () => void;
}

export default function Rail({
  user,
  conversations,
  activeId,
  onNewChat,
  onSelect,
  onOpenSearch,
}: RailProps) {
  const [expanded, setExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const initial = (user.name ?? user.email ?? "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <nav
      className={`animate-ui-fade-up z-20 flex h-full shrink-0 flex-col gap-2 py-6 transition-[width] duration-200 ease-out ${
        expanded ? "w-[260px] px-3" : "w-[72px] items-center px-0"
      }`}
    >
      {/* En-tête : logo (= bascule au survol quand replié) */}
      {expanded ? (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <Logo size={34} />
            <span className="whitespace-nowrap text-[16px] font-semibold text-foreground">
              Jean
            </span>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            aria-label="Réduire le menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-(--ink-dim) transition-colors hover:bg-(--surface) hover:text-(--hover-text)"
          >
            <PanelLeftIcon size={20} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Agrandir le menu"
          className="group relative flex h-[34px] w-[34px] items-center justify-center self-center"
        >
          <span className="transition-opacity duration-150 group-hover:opacity-0">
            <Logo size={34} />
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-(--ink) opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <PanelLeftIcon size={22} />
          </span>
        </button>
      )}

      {/* Nouveau chat */}
      <button
        type="button"
        onClick={onNewChat}
        className={`mt-3 flex items-center bg-(--surface) text-(--ink-strong) transition-colors hover:bg-(--surface-hover) ${
          expanded
            ? "gap-3 rounded-full px-4 py-2.5 text-[14px]"
            : "h-[46px] w-[46px] justify-center self-center rounded-full"
        }`}
      >
        <PenIcon size={22} />
        {expanded && <span className="whitespace-nowrap">Nouveau chat</span>}
      </button>

      {/* Navigation principale */}
      <div
        className={`mt-4 flex flex-col ${
          expanded ? "gap-1" : "items-center gap-[18px]"
        }`}
      >
        <NavItem expanded={expanded} label="Rechercher" onClick={onOpenSearch}>
          <SearchIcon />
        </NavItem>
      </div>

      {/* Historique des conversations */}
      {expanded ? (
        <div className="mt-5 flex min-h-0 flex-1 flex-col">
          <p className="px-3 pb-2 text-[12px] font-medium uppercase tracking-wide text-(--ink-dim)">
            Récents
          </p>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="px-3 py-2 text-[13px] text-(--ink-dim)">
                Aucune conversation
              </p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {conversations.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(c.id)}
                      title={c.title}
                      className={`w-full truncate rounded-full px-3 py-2 text-left text-[14px] transition-colors ${
                        c.id === activeId
                          ? "bg-(--surface) text-(--ink-strong)"
                          : "text-(--ink) hover:bg-(--surface-soft)"
                      }`}
                    >
                      {c.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <>
          <NavItem
            expanded={false}
            label="Historique"
            dim
            onClick={() => setExpanded(true)}
          >
            <HistoryIcon />
          </NavItem>
          <div className="flex-1" />
        </>
      )}

      {/* Bas : thème, profil, déconnexion */}
      <div
        className={`flex flex-col ${
          expanded ? "gap-1" : "items-center gap-[18px]"
        }`}
      >
        <NavItem
          expanded={expanded}
          label={isDark ? "Mode clair" : "Mode sombre"}
          onClick={toggleTheme}
          dim
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </NavItem>

        {expanded ? (
          <div className="mt-1 flex items-center justify-between gap-2 px-2 py-1">
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar user={user} initial={initial} />
              <span className="truncate text-[14px] text-(--ink)">
                {user.name ?? user.email ?? "Compte"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => signOut({ redirectTo: "/" })}
              aria-label="Se déconnecter"
              title="Se déconnecter"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-(--ink-dim) transition-colors hover:bg-(--surface) hover:text-(--hover-text)"
            >
              <LogoutIcon />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => signOut({ redirectTo: "/" })}
            aria-label="Se déconnecter"
            title="Se déconnecter"
          >
            <Avatar user={user} initial={initial} />
          </button>
        )}
      </div>
    </nav>
  );
}

function Avatar({ user, initial }: { user: SessionUser; initial: string }) {
  if (user.image) {
    return (
      <Image
        src={user.image}
        alt={user.name ?? "Profil"}
        width={34}
        height={34}
        className="h-[34px] w-[34px] shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-accent text-[14px] font-semibold text-accent-ink">
      {initial}
    </div>
  );
}

function NavItem({
  children,
  label,
  expanded,
  dim,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  expanded: boolean;
  dim?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex items-center transition-colors hover:text-(--hover-text) ${
        dim ? "text-(--ink-dim)" : "text-(--ink)"
      } ${
        expanded
          ? "w-full gap-3 rounded-full px-3 py-2 hover:bg-(--surface-soft)"
          : "h-11 w-11 justify-center"
      }`}
    >
      <span className="flex shrink-0 items-center justify-center">
        {children}
      </span>
      {expanded && (
        <span className="whitespace-nowrap text-[14px]">{label}</span>
      )}
    </button>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
