"use client";

import { Component, useEffect, useState, type ReactNode } from "react";

let supported: boolean | undefined;
function canCreateWebGL() {
  if (supported !== undefined) return supported;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    supported = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch { supported = false; }
  return supported;
}
class RendererBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
/** Avoid mounting Three's renderer when graphics acceleration is unavailable. */
export function WebGLSurface({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [available, setAvailable] = useState(false);
  useEffect(() => { setAvailable(canCreateWebGL()); }, []);
  return available ? <RendererBoundary fallback={fallback}>{children}</RendererBoundary> : fallback;
}
