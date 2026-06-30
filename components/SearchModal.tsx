"use client";

import { useEffect, useRef, useState } from "react";
import type { ConversationSummary } from "@/app/types";
import { SearchIcon } from "./icons";

interface Result {
  id: string;
  title: string;
  model: string;
  snippet?: string | null;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  conversations: ConversationSummary[];
  onSelect: (id: string) => void;
}

export default function SearchModal({
  open,
  onClose,
  conversations,
  onSelect,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const recent = (): Result[] =>
    conversations.map((c) => ({ id: c.id, title: c.title, model: c.model }));

  // À l'ouverture : focus, reset, et liste récente par défaut.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    setResults(recent());
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Recherche serveur (titre + contenu), debouncée.
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) {
      setResults(recent());
      setActive(0);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/conversations/search?q=${encodeURIComponent(q)}`,
          { signal: ctrl.signal },
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setResults(data.results);
        setActive(0);
      } catch {
        if (ctrl.signal.aborted) return;
        // Repli : filtrage par titre côté client.
        const lc = q.toLowerCase();
        setResults(recent().filter((r) => r.title.toLowerCase().includes(lc)));
        setActive(0);
      }
    }, 160);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open]);

  // Navigation clavier.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const r = results[active];
        if (r) {
          onSelect(r.id);
          onClose();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, onClose, onSelect]);

  // Garde l'élément actif visible.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${active}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Rechercher une conversation"
        className="animate-ui-fade-up mt-[12vh] w-full max-w-[600px] overflow-hidden rounded-2xl border border-(--border-soft) bg-(--menu-bg) shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-[14px]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Champ de recherche */}
        <div className="flex items-center gap-3 border-b border-(--border-soft) px-4">
          <span className="text-(--ink-dim)">
            <SearchIcon size={20} />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une conversation…"
            className="flex-1 bg-transparent py-4 text-[16px] text-(--ink-strong) placeholder:text-muted focus:outline-none"
          />
          <kbd className="rounded-md border border-(--border-soft) px-1.5 py-0.5 text-[11px] text-(--ink-dim)">
            Esc
          </kbd>
        </div>

        {/* Résultats */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-[14px] text-(--ink-dim)">
              {query.trim() ? "Aucun résultat" : "Aucune conversation"}
            </p>
          ) : (
            <>
              {!query.trim() && (
                <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-(--ink-dim)">
                  Récents
                </p>
              )}
              {results.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  data-index={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => {
                    onSelect(r.id);
                    onClose();
                  }}
                  className={`flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    i === active ? "bg-(--surface)" : ""
                  }`}
                >
                  <span className="truncate text-[15px] text-(--ink-strong)">
                    {r.title}
                  </span>
                  {r.snippet && (
                    <span className="truncate text-[13px] text-(--ink-dim)">
                      {r.snippet}
                    </span>
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
