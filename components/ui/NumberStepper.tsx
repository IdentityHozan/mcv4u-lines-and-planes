"use client";

import { useState } from "react";

type NumberStepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  compact?: boolean;
};

function clamp(value: number, min?: number, max?: number) {
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;
  return value;
}

function decimalPlaces(step: number) {
  const text = String(step);
  return text.includes(".") ? text.split(".")[1].length : 0;
}

export function NumberStepper({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  compact = false,
}: NumberStepperProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const changeBy = (amount: number) => {
    const next = clamp(value + amount, min, max);
    onChange(Number(next.toFixed(decimalPlaces(step))));
    setDraft(null);
  };

  const updateDraft = (text: string) => {
    setDraft(text);
    if (text.trim() === "" || text === "-" || text === "." || text === "-.") return;
    const next = Number(text);
    if (Number.isFinite(next)) {
      const clamped = clamp(next, min, max);
      onChange(clamped);
      if (clamped !== next) setDraft(String(clamped));
    }
  };

  return (
    <div className={compact ? "min-w-0" : "w-full"}>
      <span className="mb-1.5 block text-[11px] font-semibold text-zinc-400">{label}</span>
      <div className="grid grid-cols-[34px_minmax(0,1fr)_34px] overflow-hidden border border-white/15 bg-[#090909] transition focus-within:border-sky-400/55">
        <button
          type="button"
          onClick={() => changeBy(-step)}
          disabled={min !== undefined && value <= min}
          className="grid h-10 place-items-center border-r border-white/10 bg-white/[0.025] text-lg text-zinc-300 transition hover:bg-sky-400/10 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <input
          type="text"
          inputMode="decimal"
          value={draft ?? String(value)}
          onFocus={() => setDraft(String(value))}
          onChange={(event) => updateDraft(event.target.value)}
          onBlur={() => setDraft(null)}
          onWheel={(event) => event.currentTarget.blur()}
          className="min-w-0 bg-transparent px-1 text-center font-mono text-sm font-semibold text-zinc-100 outline-none"
          aria-label={label}
        />
        <button
          type="button"
          onClick={() => changeBy(step)}
          disabled={max !== undefined && value >= max}
          className="grid h-10 place-items-center border-l border-white/10 bg-white/[0.025] text-lg text-zinc-300 transition hover:bg-sky-400/10 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
