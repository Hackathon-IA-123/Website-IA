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
}

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
export default function DotField({ focus }: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const focusRef = useRef(focus);
  focusRef.current = focus;

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
            tw: 0.35 + Math.random() * 0.95, // période ~5 à 18 s
            dphase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function render(t: number) {
      const context = ctx!;
      const f = focusRef.current;

      context.fillStyle = "#060606";
      context.fillRect(0, 0, W, H);

      // Dérive lente du foyer + légère respiration du rayon.
      const fx = (f.x + Math.sin(t * 0.045) * 0.05) * W;
      const fy = (f.y + Math.cos(t * 0.035) * 0.05) * H;
      const rad = f.rad * W * (1 + Math.sin(t * 0.05) * 0.07);

      for (const dot of dots) {
        // Micro-déplacement très lent.
        const px =
          dot.x + Math.sin(t * 0.25 + dot.dphase) * 2.4 * motionFactor;
        const py =
          dot.y + Math.cos(t * 0.21 + dot.dphase) * 2.4 * motionFactor;

        const dx = (px - fx) / rad;
        const dy = (py - fy) / rad;
        const d = Math.sqrt(dx * dx + dy * dy);
        const prox = Math.min((1 - Math.min(d, 1)) * f.str, 1);

        const twinkle =
          0.5 + (0.5 * motionFactor + 0.12) * Math.sin(t * dot.tw + dot.phase);

        let col: string;
        let alpha: number;
        if (dot.kind === 0) {
          col = "255,255,255";
          alpha = 0.12 + prox * 0.7;
        } else if (dot.kind === 1) {
          col = "255,196,0";
          alpha = 0.06 + prox * 0.85;
        } else {
          col = "255,196,0";
          alpha = 0.03 + prox * 0.1;
        }
        alpha = Math.min(alpha * twinkle, 0.95);

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
    const interval = 1000 / 36; // ~36 fps : plus fluide et toujours raisonnable en CPU

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
