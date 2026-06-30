"use client";

import { useEffect, useRef } from "react";

interface Focus {
  /** position du foyer lumineux, en fraction de la largeur/hauteur (peut dépasser 1) */
  x: number;
  y: number;
  /** rayon du foyer, en fraction de la largeur du viewport */
  rad: number;
  /** intensité */
  str: number;
}

interface DotFieldProps {
  focus: Focus;
  theme: "dark" | "light";
}

interface Palette {
  bg: string;
  spark: string; // "r,g,b"
  vivid: string;
  ambient: string;
}

const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    bg: "#060606",
    spark: "255,255,255",
    vivid: "255,196,0",
    ambient: "255,196,0",
  },
  // Points foncés sur fond clair pour rester visibles.
  light: {
    bg: "#f3f3f5",
    spark: "40,40,48",
    vivid: "196,138,0",
    ambient: "70,70,82",
  },
};

type Dot = {
  x: number;
  y: number;
  kind: 0 | 1 | 2; // 0 = étincelle blanche, 1 = jaune vif, 2 = jaune ambiant
  phase: number; // déphasage du scintillement
  tw: number; // vitesse du scintillement (rad/s)
  dphase: number; // déphasage du déplacement
};

/**
 * Fond « champ de points » qui s'illumine en jaune autour d'un foyer.
 * Reprise fidèle du rendu de la maquette (espacement 15px, rayon 1.9,
 * étincelles blanches rares, halo jaune), mais animé **en continu et très
 * lentement** : scintillement, micro-déplacement des points et lente dérive du
 * foyer lumineux. Les couleurs et positions de base sont figées par point pour
 * éviter tout clignotement brutal — seule la luminosité oscille doucement.
 */
export default function DotField({ focus, theme }: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const focusRef = useRef(focus);
  focusRef.current = focus;
  const paletteRef = useRef<Palette>(PALETTES[theme]);
  paletteRef.current = PALETTES[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Keep a subtle animation even when reduced motion is enabled.
    const motionFactor = reduceMotion ? 0.38 : 1;

    const sp = 15;
    const r = 1.9;
    let W = 0;
    let H = 0;
    let dots: Dot[] = [];

    function build() {
      const c = canvas!;
      const context = ctx!;
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      c.style.width = W + "px";
      c.style.height = H + "px";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      for (let y = sp / 2; y < H; y += sp) {
        for (let x = sp / 2; x < W; x += sp) {
          const n = Math.random();
          const kind: Dot["kind"] = n < 0.028 ? 0 : n < 0.5 ? 1 : 2;
          dots.push({
            x: x + (Math.random() - 0.5) * 1.6,
            y: y + (Math.random() - 0.5) * 1.6,
            kind,
            phase: Math.random() * Math.PI * 2,
            tw: 0.45 + Math.random() * 1.2, // période ~4 à 14 s
            dphase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function render(t: number) {
      const context = ctx!;
      const f = focusRef.current;
      const pal = paletteRef.current;
      const introDuration = 3.2; // animation de départ uniquement
      const introProgress = Math.min(t / introDuration, 1);
      const centerX = W * 0.5;
      const centerY = H * 0.5;
      const maxCenterDist = Math.hypot(centerX, centerY);
      const waveFront = introProgress * 1.18;

      context.fillStyle = pal.bg;
      context.fillRect(0, 0, W, H);

      // Dérive plus visible du foyer + légère respiration du rayon.
      const fx = (f.x + Math.sin(t * 0.08) * 0.07) * W;
      const fy = (f.y + Math.cos(t * 0.065) * 0.07) * H;
      const rad = f.rad * W * (1 + Math.sin(t * 0.085) * 0.1);

      for (const dot of dots) {
        // Micro-déplacement très lent.
        const px =
          dot.x + Math.sin(t * 0.42 + dot.dphase) * 3.2 * motionFactor;
        const py =
          dot.y + Math.cos(t * 0.36 + dot.dphase) * 3.2 * motionFactor;

        const dx = (px - fx) / rad;
        const dy = (py - fy) / rad;
        const d = Math.sqrt(dx * dx + dy * dy);
        const prox = Math.min((1 - Math.min(d, 1)) * f.str, 1);
        // Apparition au lancement : onde qui part du centre de l'écran.
        const centerDistNorm =
          Math.hypot(px - centerX, py - centerY) / maxCenterDist;
        const revealBand = 0.14;
        const reveal = Math.min(
          Math.max((waveFront - centerDistNorm) / revealBand, 0),
          1,
        );
        const introRing =
          introProgress < 1
            ? Math.max(
                0,
                1 - Math.abs(centerDistNorm - waveFront) / (revealBand * 0.85),
              )
            : 0;

        const twinkle =
          0.54 +
          (0.52 * motionFactor + 0.13) * Math.sin(t * dot.tw + dot.phase);

        let col: string;
        let alpha: number;
        if (dot.kind === 0) {
          col = pal.spark;
          alpha = 0.1 + prox * 0.62 + introRing * 0.2;
        } else if (dot.kind === 1) {
          col = pal.vivid;
          alpha = 0.06 + prox * 0.8 + introRing * 0.26;
        } else {
          col = pal.ambient;
          alpha = 0.03 + prox * 0.12 + introRing * 0.08;
        }
        alpha = Math.min(alpha * twinkle, 0.95);
        alpha *= introProgress < 1 ? 0.08 + reveal * 0.92 : 1;

        context.fillStyle = "rgba(" + col + "," + alpha.toFixed(3) + ")";
        context.beginPath();
        context.arc(px, py, r, 0, 6.2832);
        context.fill();
      }
    }

    build();

    let raf = 0;
    let last = 0;
    const start = performance.now();
    const interval = 1000 / 44; // ~44 fps : animation plus vivante

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (now - last < interval) return;
      last = now;
      render((now - start) / 1000);
    }

    raf = requestAnimationFrame(loop);

    let resizeRaf = 0;
    function onResize() {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        build();
        render((performance.now() - start) / 1000);
      });
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full"
      aria-hidden
    />
  );
}
