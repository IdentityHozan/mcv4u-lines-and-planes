"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";

type V3 = [number, number, number];
type Mode = "given" | "triangle" | "parameter" | "two-points" | "space";
const presets: Record<Mode, { p: V3; m: V3 }> = {
  given: { p: [1, 2, 0], m: [2, 1, 0] },
  triangle: { p: [1, 2, 0], m: [2, 1, 0] },
  parameter: { p: [5, 7, 0], m: [6, 11, 0] },
  "two-points": { p: [1, 4, 0], m: [2, -3, 0] },
  space: { p: [-2, 3, 5], m: [0, 1, -6] },
};
const pointAt = (p: V3, m: V3, t: number): V3 => [p[0] + t * m[0], p[1] + t * m[1], p[2] + t * m[2]];
function texNumber(n: number) {
  if (Number.isInteger(n)) return String(n);
  const sign = n < 0 ? "-" : "";
  let num = Math.round(Math.abs(n) * 4), den = 4;
  while (num % 2 === 0 && den % 2 === 0) { num /= 2; den /= 2; }
  return `${sign}\\frac{${num}}{${den}}`;
}

export function LineTeachingDemo({ mode }: { mode: Mode }) {
  const { p, m } = presets[mode];
  const is3D = mode === "space";
  const [t, setT] = useState(mode === "triangle" || mode === "given" ? 2 : 0);
  const [playing, setPlaying] = useState(false);
  const [vectors, setVectors] = useState(mode !== "given");
  const [view, setView] = useState({ yaw: 0.65, pitch: 0.4 });
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);
  const uid = useId().replace(/:/g, "");
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setT((value) => value >= 3 ? -1 : Math.round((value + 0.25) * 4) / 4), 350);
    return () => clearInterval(timer);
  }, [playing]);
  const moving = pointAt(p, m, t);
  const dim = is3D ? 3 : 2;
  const coords = (v: V3) => v.slice(0, dim).map(texNumber).join(",");
  const norm2 = m.reduce((total, n) => total + n * n, 0);
  const freeStart: V3 = mode === "parameter" ? [-8, 25, 0] : mode === "two-points" ? [-3, 4, 0] : [-2, 5, 0];
  const project = useMemo(() => {
    const raw = (v: V3): [number, number] => {
      if (!is3D) return [v[0], -v[1]];
      const horizontal = v[0] * Math.cos(view.yaw) - v[1] * Math.sin(view.yaw);
      const depth = v[0] * Math.sin(view.yaw) + v[1] * Math.cos(view.yaw);
      return [horizontal, depth * Math.sin(view.pitch) - v[2] * Math.cos(view.pitch)];
    };
    const extent = is3D ? 7 : mode === "parameter" ? 12 : 5;
    const axes: V3[] = [[-extent, 0, 0], [extent, 0, 0], [0, -extent, 0], [0, extent, 0], [0, 0, -extent], [0, 0, extent]];
    const samples: V3[] = [[0, 0, 0], ...axes, pointAt(p, m, -1.3), pointAt(p, m, 3.3)];
    if (!is3D) samples.push(freeStart, pointAt(freeStart, m, 1));
    const projected = samples.map(raw);
    const minX = Math.min(...projected.map((q) => q[0]));
    const maxX = Math.max(...projected.map((q) => q[0]));
    const minY = Math.min(...projected.map((q) => q[1]));
    const maxY = Math.max(...projected.map((q) => q[1]));
    const scale = Math.min(470 / Math.max(1, maxX - minX), 365 / Math.max(1, maxY - minY));
    return { extent, to: (v: V3): [number, number] => { const a = raw(v); return [320 + (a[0] - (minX + maxX) / 2) * scale, 225 + (a[1] - (minY + maxY) / 2) * scale]; } };
  // Presets are fixed for the lifetime of this scene. The scale stays fixed as t changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, is3D, view.yaw, view.pitch]);
  const to = project.to;
  const line = (a: V3, b: V3, color: string, width = 2, arrow = false, key?: string) => {
    const aa = to(a), bb = to(b);
    return <line key={key} x1={aa[0]} y1={aa[1]} x2={bb[0]} y2={bb[1]} stroke={color} strokeWidth={width} markerEnd={arrow ? `url(#${uid}-${color.replace("#", "")})` : undefined} />;
  };
  const label = (v: V3, name: string, color = "#f5f5f5", dy = -14) => {
    const a = to(v);
    return <text x={Math.max(24, Math.min(525, a[0] + 12))} y={Math.max(22, Math.min(430, a[1] + dy))} fill={color} fontSize="19" fontFamily="Arial, sans-serif">{name}</text>;
  };
  const origin: V3 = [0, 0, 0];
  const canMove = mode !== "given";
  return (
    <figure className="teaching-demo">
      <svg viewBox="0 0 640 460" role="img" aria-label={is3D ? "Rotatable three dimensional line through P zero with a moving point P of t" : "Coordinate diagram of a line through P zero and a moving point P of t"}
        className={`block w-full select-none ${is3D ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
        tabIndex={is3D ? 0 : undefined}
        onKeyDown={(e) => {
          if (!is3D || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
          e.preventDefault(); e.stopPropagation();
          setView((value) => ({ yaw: value.yaw + (e.key === "ArrowLeft" ? -0.15 : e.key === "ArrowRight" ? 0.15 : 0), pitch: Math.max(-1.1, Math.min(1.1, value.pitch + (e.key === "ArrowUp" ? -0.1 : e.key === "ArrowDown" ? 0.1 : 0))) }));
        }}
        onPointerDown={(e) => { if (!is3D) return; e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, ...view }; }}
        onPointerMove={(e) => { if (!drag.current) return; setView({ yaw: drag.current.yaw + (e.clientX - drag.current.x) * 0.009, pitch: Math.max(-1.1, Math.min(1.1, drag.current.pitch + (e.clientY - drag.current.y) * 0.006)) }); }}
        onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
        <defs>{["#7dd3fc", "#c4b5fd", "#86efac", "#fda4af"].map((color) => <marker key={color} id={`${uid}-${color.replace("#", "")}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill={color} /></marker>)}</defs>
        {line([-project.extent, 0, 0], [project.extent, 0, 0], "#444850", 1)}
        {line([0, -project.extent, 0], [0, project.extent, 0], "#444850", 1)}
        {is3D && line([0, 0, -project.extent], [0, 0, project.extent], "#444850", 1)}
        {label([project.extent, 0, 0], "x", "#9198a3", 18)}{label([0, project.extent, 0], "y", "#9198a3")}
        {is3D && label([0, 0, project.extent], "z", "#9198a3")}
        {label(origin, "O", "#9198a3", 24)}
        {line(pointAt(p, m, -1.3), pointAt(p, m, 3.3), "#e4e4e7", 2.5)}
        {vectors && <>{line(origin, p, "#7dd3fc", 3, true)}{Math.abs(t) > 0.001 && line(origin, moving, "#c4b5fd", 3, true)}{Math.abs(t) > 0.001 && line(p, moving, "#86efac", 4, true)}</>}
        {!is3D && <>{line(freeStart, pointAt(freeStart, m, 1), "#fda4af", 3, true)}{label(pointAt(freeStart, m, 0.5), "direction m", "#fda4af", -20)}</>}
        <circle cx={to(p)[0]} cy={to(p)[1]} r="5" fill="#7dd3fc" />{label(p, "P₀", "#7dd3fc", 25)}
        {mode !== "given" && <><circle cx={to(moving)[0]} cy={to(moving)[1]} r="5.5" fill="#c4b5fd" />{Math.abs(t) > 0.001 && label(moving, "P(t)", "#c4b5fd")}</>}
      </svg>
      {canMove && <div className="space-y-4 border-t border-white/10 pt-5">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor={`${uid}-t`} className="text-base font-semibold text-sky-200">Parameter t</label>
          <input id={`${uid}-t`} type="range" min={-1} max={3} step={0.25} value={t} onChange={(e) => { setPlaying(false); setT(Number(e.target.value)); }} className="min-w-24 flex-1 accent-sky-300" />
          <output htmlFor={`${uid}-t`} className="w-12 text-right font-mono">{t}</output>
          <button type="button" className="teaching-small-button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Animate"}</button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">{[-1, 0, 1, 3].map((value) => <button type="button" key={value} className="teaching-small-button" aria-pressed={t === value} onClick={() => { setPlaying(false); setT(value); }}>t = {value}</button>)}</div>
          <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={vectors} onChange={(e) => setVectors(e.target.checked)} className="accent-sky-300" />Position vectors</label>
        </div>
        {is3D && <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-400"><span>Drag to rotate, or focus the diagram and use arrow keys</span><button type="button" className="teaching-small-button" onClick={() => setView({ yaw: 0.65, pitch: 0.4 })}>Reset view</button></div>}
      </div>}
      <figcaption className="mt-4 space-y-2 text-base">
        {mode !== "given" && <MathJaxRenderer key={`point-${t}`} math={`\\[P(${texNumber(t)})=(${coords(moving)})\\]`} className="text-xl text-violet-200" />}
        <MathJaxRenderer math={`\\[\\vec m=[${coords(m)}],\\qquad\\lVert\\vec m\\rVert=\\sqrt{${norm2}}\\approx${Math.sqrt(norm2).toFixed(3)}\\]`} className="text-sm text-rose-200" />
        {vectors && <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs"><span className="text-sky-200">Known position vector</span><span className="text-violet-200">Moving position vector</span><span className="text-green-200">Displacement along the line</span></div>}
      </figcaption>
    </figure>
  );
}
