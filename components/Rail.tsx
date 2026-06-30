"use client";

import { useState } from "react";
import Logo from "./Logo";
import {
  PenIcon,
  SearchIcon,
  ImageIcon,
  BagIcon,
  GridIcon,
  HistoryIcon,
  GearIcon,
  PanelLeftIcon,
} from "./icons";

interface RailProps {
  onNewChat: () => void;
}

export default function Rail({ onNewChat }: RailProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      className={`z-20 flex h-full shrink-0 flex-col gap-2 py-6 transition-[width] duration-200 ease-out ${
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
            onClick={() => setExpanded(false)}
            aria-label="Réduire le menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#9c9c9c] transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <PanelLeftIcon size={20} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          aria-label="Agrandir le menu"
          className="group relative flex h-[34px] w-[34px] items-center justify-center self-center"
        >
          <span className="transition-opacity duration-150 group-hover:opacity-0">
            <Logo size={34} />
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[#cfcfcf] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <PanelLeftIcon size={22} />
          </span>
        </button>
      )}

      {/* Nouveau chat */}
      <button
        onClick={onNewChat}
        className={`mt-3 flex items-center bg-white/[0.07] text-[#e6e6e6] transition-colors hover:bg-white/[0.12] ${
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
        <NavItem expanded={expanded} label="Rechercher">
          <SearchIcon />
        </NavItem>
        <NavItem expanded={expanded} label="Images">
          <ImageIcon />
        </NavItem>
        <NavItem expanded={expanded} label="Espace">
          <BagIcon />
        </NavItem>
        <NavItem expanded={expanded} label="Applications">
          <GridIcon />
        </NavItem>
      </div>

      <div className="flex-1" />

      {/* Bas : historique, paramètres, profil */}
      <div
        className={`flex flex-col ${
          expanded ? "gap-1" : "items-center gap-[18px]"
        }`}
      >
        <NavItem expanded={expanded} label="Historique" dim>
          <HistoryIcon />
        </NavItem>
        <NavItem expanded={expanded} label="Paramètres" dim>
          <GearIcon />
        </NavItem>
        <div
          className={`flex items-center ${
            expanded ? "mt-1 gap-3 px-3 py-1" : "flex-col"
          }`}
        >
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-accent text-[14px] font-semibold text-accent-ink">
            T
          </div>
          {expanded && (
            <span className="whitespace-nowrap text-[14px] text-[#cfcfcf]">
              Thomas
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  children,
  label,
  expanded,
  dim,
}: {
  children: React.ReactNode;
  label: string;
  expanded: boolean;
  dim?: boolean;
}) {
  return (
    <button
      aria-label={label}
      className={`flex items-center transition-colors hover:text-white ${
        dim ? "text-[#9c9c9c]" : "text-[#bdbdbd]"
      } ${
        expanded
          ? "w-full gap-3 rounded-full px-3 py-2 hover:bg-white/[0.06]"
          : "h-11 w-11 justify-center"
      }`}
    >
      <span className="flex shrink-0 items-center justify-center">
        {children}
      </span>
      {expanded && <span className="whitespace-nowrap text-[14px]">{label}</span>}
    </button>
  );
}
