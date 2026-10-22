"use client";

import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    MathJax?: {
      startup?: { promise?: Promise<void> };
      typesetClear?: (elements?: HTMLElement[]) => void;
      typesetPromise?: (elements?: HTMLElement[]) => Promise<void>;
    };
  }
}

type MathJaxRendererProps = {
  math: string;
  className?: string;
  ariaLabel?: string;
};

export function MathJaxRenderer({
  math,
  className = "",
  ariaLabel,
}: MathJaxRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const hasMath = /\\[([]/.test(math);
  const [ready, setReady] = useState(!hasMath);

  useEffect(() => {
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    if (!hasMath) {
      queueMicrotask(() => { if (active) setReady(true); });
      return () => { active = false; };
    }

    const render = async () => {
      const node = ref.current;
      const mathJax = window.MathJax;

      if (!node || !mathJax?.typesetPromise) {
        attempts += 1;
        if (attempts < 80) retryTimer = setTimeout(render, 75);
        else if (active) setReady(true);
        return;
      }

      try {
        await mathJax.startup?.promise;
        mathJax.typesetClear?.([node]);
        await mathJax.typesetPromise([node]);
      } catch {
        // Keep the source notation readable when the external renderer fails.
      } finally {
        if (active) setReady(true);
      }
    };

    queueMicrotask(() => {
      if (active) setReady(false);
    });
    render();

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [hasMath, math]);

  return (
    <div
      ref={ref}
      id={`math-${id.replace(/:/g, "")}`}
      className={`math-content ${className}`}
      data-ready={!hasMath || ready}
      aria-label={ariaLabel ?? math.replace(/[\\()[\]]/g, "")}
    >
      {math}
    </div>
  );
}
