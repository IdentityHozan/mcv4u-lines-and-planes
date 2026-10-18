"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { NumberStepper } from "@/components/ui/NumberStepper";
import {
  Interactive3DPlane,
  type CameraView,
  type DistanceMode,
  type GridPlacementTarget,
  type ScenePointSelection,
  type Vector3Value,
} from "./Interactive3DPlane";

type Experiment = "line-plane" | "two-planes" | "distance";
type MotionMode = "approach" | "travel" | "slide-plane";

export type VectorLabProps = {
  embedded?: boolean;
};

const EPSILON = 1e-8;

const experimentOptions: Array<{ id: Experiment; label: string; description: string }> = [
  { id: "line-plane", label: "Line and plane", description: "See whether a line crosses, misses, or lies inside a plane." },
  { id: "two-planes", label: "Two planes", description: "Compare intersecting, parallel, and coincident planes." },
  { id: "distance", label: "Shortest distance", description: "Show the perpendicular path from a point to a line or plane." },
];

const cameras: Array<{ id: CameraView; label: string }> = [
  { id: "isometric", label: "Isometric" },
  { id: "front", label: "Front" },
  { id: "side", label: "Side" },
  { id: "top", label: "Top" },
];

function dot(first: Vector3Value, second: Vector3Value) {
  return first[0] * second[0] + first[1] * second[1] + first[2] * second[2];
}

function cross(first: Vector3Value, second: Vector3Value): Vector3Value {
  return [
    first[1] * second[2] - first[2] * second[1],
    first[2] * second[0] - first[0] * second[2],
    first[0] * second[1] - first[1] * second[0],
  ];
}

function add(first: Vector3Value, second: Vector3Value): Vector3Value {
  return [first[0] + second[0], first[1] + second[1], first[2] + second[2]];
}

function subtract(first: Vector3Value, second: Vector3Value): Vector3Value {
  return [first[0] - second[0], first[1] - second[1], first[2] - second[2]];
}

function scale(vector: Vector3Value, factor: number): Vector3Value {
  return [vector[0] * factor, vector[1] * factor, vector[2] * factor];
}

function magnitude(vector: Vector3Value) {
  return Math.sqrt(dot(vector, vector));
}

function formatNumber(value: number) {
  if (Math.abs(value) < EPSILON) return "0";
  if (Number.isInteger(value)) return String(value);
  return Number(value.toFixed(3)).toString();
}

function formatVector(vector: Vector3Value) {
  return vector.map(formatNumber).join(", ");
}

function formatPlane(normal: Vector3Value, constant: number) {
  const variables = ["x", "y", "z"];
  const terms = normal.flatMap((coefficient, index) => {
    if (Math.abs(coefficient) < EPSILON) return [];
    const sign = coefficient < 0 ? "-" : "+";
    const absolute = Math.abs(coefficient);
    return [{ sign, body: `${Math.abs(absolute - 1) < EPSILON ? "" : formatNumber(absolute)}${variables[index]}` }];
  });
  const left = terms.map((term, index) => `${index === 0 && term.sign === "+" ? "" : term.sign}${term.body}`).join("") || "0";
  return `${left}=${formatNumber(constant)}`;
}

function VectorFields({ label, value, onChange }: { label: string; value: Vector3Value; onChange: (value: Vector3Value) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-zinc-200">{label}</legend>
      <div className="grid grid-cols-3 gap-2">
        {(["X", "Y", "Z"] as const).map((axis, index) => (
          <NumberStepper
            key={axis}
            compact
            label={axis}
            value={value[index]}
            onChange={(nextValue) => {
              const next = [...value] as Vector3Value;
              next[index] = nextValue;
              onChange(next);
            }}
          />
        ))}
      </div>
    </fieldset>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-2 border border-white/10 bg-[#0b0b0b] px-3 text-xs text-zinc-400">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="accent-sky-400" />
      {label}
    </label>
  );
}

export function VectorLab({ embedded = false }: VectorLabProps = {}) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const travelDirectionRef = useRef(1);
  const planeDirectionRef = useRef(1);

  const [experiment, setExperiment] = useState<Experiment>("line-plane");
  const [linePoint, setLinePoint] = useState<Vector3Value>([1, 1, -1]);
  const [lineDirection, setLineDirection] = useState<Vector3Value>([2, -1, 1]);
  const [planeNormal, setPlaneNormal] = useState<Vector3Value>([1, 1, 1]);
  const [planeConstant, setPlaneConstant] = useState(2);
  const [secondPlaneNormal, setSecondPlaneNormal] = useState<Vector3Value>([1, -1, 1]);
  const [secondPlaneConstant, setSecondPlaneConstant] = useState(0);
  const [externalPoint, setExternalPoint] = useState<Vector3Value>([3, 2, 0]);
  const [distanceMode, setDistanceMode] = useState<Exclude<DistanceMode, "none">>("point-line");
  const [parameter, setParameter] = useState(0);

  const [motionMode, setMotionMode] = useState<MotionMode>("approach");
  const [motionProgress, setMotionProgress] = useState(0);
  const [motionSpeed, setMotionSpeed] = useState(1);
  const [animating, setAnimating] = useState(false);

  const [cameraView, setCameraView] = useState<CameraView>("isometric");
  const [gridSize, setGridSize] = useState(18);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showSideGrids, setShowSideGrids] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showNormals, setShowNormals] = useState(true);
  const [gridEditing, setGridEditing] = useState(false);
  const [gridTarget, setGridTarget] = useState<GridPlacementTarget>("line-anchor");
  const [gridHeight, setGridHeight] = useState(0);
  const [gridSnap, setGridSnap] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState<ScenePointSelection | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const linePlane = useMemo(() => {
    if (magnitude(lineDirection) < EPSILON) return { type: "invalid-line" as const };
    if (magnitude(planeNormal) < EPSILON) return { type: "invalid-plane" as const };
    const denominator = dot(planeNormal, lineDirection);
    const numerator = planeConstant - dot(planeNormal, linePoint);
    if (Math.abs(denominator) < EPSILON) {
      return Math.abs(numerator) < EPSILON ? { type: "contained" as const, denominator, numerator } : { type: "parallel" as const, denominator, numerator };
    }
    const t = numerator / denominator;
    return { type: "point" as const, denominator, numerator, t, point: add(linePoint, scale(lineDirection, t)) };
  }, [lineDirection, linePoint, planeConstant, planeNormal]);

  const planePlane = useMemo(() => {
    if (magnitude(planeNormal) < EPSILON || magnitude(secondPlaneNormal) < EPSILON) return { type: "invalid" as const };
    const direction = cross(planeNormal, secondPlaneNormal);
    const directionSquared = dot(direction, direction);
    if (directionSquared > EPSILON) {
      const firstTerm = scale(cross(secondPlaneNormal, direction), planeConstant);
      const secondTerm = scale(cross(direction, planeNormal), secondPlaneConstant);
      return { type: "line" as const, direction, point: scale(add(firstTerm, secondTerm), 1 / directionSquared) };
    }
    const index = planeNormal.findIndex((value) => Math.abs(value) > EPSILON);
    const ratio = secondPlaneNormal[index] / planeNormal[index];
    return Math.abs(secondPlaneConstant - ratio * planeConstant) < EPSILON ? { type: "coincident" as const } : { type: "parallel" as const };
  }, [planeConstant, planeNormal, secondPlaneConstant, secondPlaneNormal]);

  const distanceResult = useMemo(() => {
    if (distanceMode === "point-line") {
      const denominator = dot(lineDirection, lineDirection);
      if (denominator < EPSILON) return null;
      const displacement = subtract(externalPoint, linePoint);
      const t = dot(displacement, lineDirection) / denominator;
      const foot = add(linePoint, scale(lineDirection, t));
      return { foot, distance: magnitude(subtract(externalPoint, foot)), parameter: t };
    }
    const denominator = dot(planeNormal, planeNormal);
    if (denominator < EPSILON) return null;
    const factor = (dot(planeNormal, externalPoint) - planeConstant) / denominator;
    const foot = subtract(externalPoint, scale(planeNormal, factor));
    return { foot, distance: magnitude(subtract(externalPoint, foot)), parameter: null };
  }, [distanceMode, externalPoint, lineDirection, linePoint, planeConstant, planeNormal]);

  const approachStart = -3;
  const currentParameter = motionMode === "approach" && linePlane.type === "point"
    ? approachStart + (linePlane.t - approachStart) * motionProgress
    : parameter;
  const trackedPoint = add(linePoint, scale(lineDirection, currentParameter));
  const residual = dot(planeNormal, trackedPoint) - planeConstant;
  const planeDistance = magnitude(planeNormal) < EPSILON ? null : Math.abs(residual) / magnitude(planeNormal);

  const headline = useMemo(() => {
    if (experiment === "line-plane") {
      if (linePlane.type === "point") return { title: "One intersection", detail: `The line reaches the plane at t = ${formatNumber(linePlane.t)}.`, math: `\\[P=(${formatVector(linePlane.point)})\\]` };
      if (linePlane.type === "contained") return { title: "The line lies in the plane", detail: "Every point on the line satisfies the plane equation.", math: String.raw`\[\vec n\cdot\vec d=0\]` };
      if (linePlane.type === "parallel") return { title: "The line misses the plane", detail: "The direction is parallel to the plane and the anchor is outside it.", math: String.raw`\[\vec n\cdot\vec d=0\]` };
      return { title: "Enter valid vectors", detail: "The direction and normal vectors must be non-zero.", math: String.raw`\[\vec d\ne\vec0,\quad\vec n\ne\vec0\]` };
    }
    if (experiment === "two-planes") {
      if (planePlane.type === "line") return { title: "The planes meet in a line", detail: `Intersection direction: (${formatVector(planePlane.direction)}).`, math: `\\[\\vec r=(${formatVector(planePlane.point)})+t(${formatVector(planePlane.direction)})\\]` };
      if (planePlane.type === "coincident") return { title: "The equations describe the same plane", detail: "Every point on one plane also lies on the other.", math: String.raw`\[\Pi_1=\Pi_2\]` };
      if (planePlane.type === "parallel") return { title: "The planes are parallel", detail: "Their normal vectors are parallel but their constants do not match.", math: String.raw`\[\vec n_1\parallel\vec n_2\]` };
      return { title: "Enter valid normals", detail: "Both plane normals must be non-zero.", math: String.raw`\[\vec n_1\ne\vec0,\quad\vec n_2\ne\vec0\]` };
    }
    if (!distanceResult) return { title: "Enter a valid direction", detail: "A distance target needs a valid line or plane.", math: "" };
    return { title: `${formatNumber(distanceResult.distance)} units`, detail: distanceMode === "point-line" ? "Shortest distance from the point to the line." : "Shortest distance from the point to the plane.", math: `\\[H=(${formatVector(distanceResult.foot)})\\]` };
  }, [distanceMode, distanceResult, experiment, linePlane, planePlane]);

  useEffect(() => {
    progressRef.current = motionProgress;
  }, [motionProgress]);

  useEffect(() => {
    if (!animating) return;
    let frame = 0;
    let previous = performance.now();
    const animate = (time: number) => {
      const elapsed = Math.min(0.05, (time - previous) / 1000);
      previous = time;

      if (motionMode === "approach") {
        if (linePlane.type !== "point") {
          setAnimating(false);
          return;
        }
        const next = Math.min(1, progressRef.current + elapsed * 0.34 * motionSpeed);
        progressRef.current = next;
        setMotionProgress(next);
        if (next >= 1) {
          setAnimating(false);
          return;
        }
      }

      if (motionMode === "travel") {
        setParameter((current) => {
          let next = current + elapsed * 1.6 * motionSpeed * travelDirectionRef.current;
          if (next >= 3) { next = 3; travelDirectionRef.current = -1; }
          if (next <= -3) { next = -3; travelDirectionRef.current = 1; }
          return Number(next.toFixed(3));
        });
      }

      if (motionMode === "slide-plane") {
        setPlaneConstant((current) => {
          let next = current + elapsed * 1.8 * motionSpeed * planeDirectionRef.current;
          if (next >= 6) { next = 6; planeDirectionRef.current = -1; }
          if (next <= -6) { next = -6; planeDirectionRef.current = 1; }
          return Number(next.toFixed(3));
        });
      }

      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [animating, linePlane.type, motionMode, motionSpeed]);

  useEffect(() => {
    const update = () => setIsFullscreen(document.fullscreenElement === workspaceRef.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  const reset = () => {
    setExperiment("line-plane");
    setLinePoint([1, 1, -1]);
    setLineDirection([2, -1, 1]);
    setPlaneNormal([1, 1, 1]);
    setPlaneConstant(2);
    setSecondPlaneNormal([1, -1, 1]);
    setSecondPlaneConstant(0);
    setExternalPoint([3, 2, 0]);
    setDistanceMode("point-line");
    setParameter(0);
    setMotionMode("approach");
    setMotionProgress(0);
    progressRef.current = 0;
    setAnimating(false);
    setSelectedPoint(null);
    setGridEditing(false);
  };

  const applyLinePreset = (preset: "cross" | "parallel" | "contained") => {
    setAnimating(false);
    setMotionProgress(0);
    progressRef.current = 0;
    if (preset === "cross") { setLinePoint([1, 1, -1]); setLineDirection([2, -1, 1]); setPlaneNormal([1, 1, 1]); setPlaneConstant(2); }
    if (preset === "parallel") { setLinePoint([0, 0, 0]); setLineDirection([1, -1, 0]); setPlaneNormal([1, 1, 1]); setPlaneConstant(2); }
    if (preset === "contained") { setLinePoint([1, 1, 0]); setLineDirection([1, -1, 0]); setPlaneNormal([1, 1, 1]); setPlaneConstant(2); }
  };

  const applyPlanePreset = (preset: "intersect" | "parallel" | "same") => {
    if (preset === "intersect") { setPlaneNormal([1, 1, 1]); setPlaneConstant(2); setSecondPlaneNormal([1, -1, 1]); setSecondPlaneConstant(0); }
    if (preset === "parallel") { setPlaneNormal([1, 1, 1]); setPlaneConstant(2); setSecondPlaneNormal([2, 2, 2]); setSecondPlaneConstant(6); }
    if (preset === "same") { setPlaneNormal([1, 1, 1]); setPlaneConstant(2); setSecondPlaneNormal([2, 2, 2]); setSecondPlaneConstant(4); }
  };

  const handleGridPlace = (target: GridPlacementTarget, position: Vector3Value) => {
    if (target === "line-anchor") setLinePoint(position);
    if (target === "external-point") setExternalPoint(position);
    if (target === "plane-point") setPlaneConstant(dot(planeNormal, position));
    if (target === "tracked-point") {
      const denominator = dot(lineDirection, lineDirection);
      if (denominator > EPSILON) setParameter(dot(subtract(position, linePoint), lineDirection) / denominator);
    }
    setSelectedPoint({ label: "Placed point", position });
  };

  const resetMotion = () => {
    setAnimating(false);
    setMotionProgress(0);
    progressRef.current = 0;
    setParameter(0);
    travelDirectionRef.current = 1;
    planeDirectionRef.current = 1;
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement === workspaceRef.current) await document.exitFullscreen();
    else await workspaceRef.current?.requestFullscreen();
  };

  const sceneMode = experiment === "two-planes" || (experiment === "distance" && distanceMode === "point-plane") ? "plane" : experiment === "distance" ? "line" : "both";
  const sceneDistanceMode: DistanceMode = experiment === "distance" ? distanceMode : "none";

  return (
    <div ref={workspaceRef} className={`visualizer-workspace flex min-h-0 flex-col overflow-hidden bg-[#0a0a0a] ${embedded ? "h-full" : "h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-4.5rem)]"}`}>
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0d0d0d] px-3 py-2 sm:px-5">
        <div>
          <h1 className="text-sm font-semibold text-zinc-100 sm:text-base">3D Lines and Planes</h1>
          <p className="hidden text-[11px] text-zinc-500 sm:block">Choose one experiment and change only the values that matter.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={reset} className="visualizer-toolbar-button">Reset</button>
          <button type="button" onClick={() => void toggleFullscreen()} className="visualizer-toolbar-button">{isFullscreen ? "Exit full screen" : "Full screen"}</button>
          <button type="button" onClick={() => setPanelOpen((current) => !current)} className="visualizer-toolbar-button border-sky-400/30 text-sky-200">{panelOpen ? "Hide controls" : "Show controls"}</button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <section className="relative min-w-0 flex-1" aria-label="Interactive three-dimensional scene">
          <Interactive3DPlane
            linePoint={linePoint}
            lineDirection={lineDirection}
            planeNormal={planeNormal}
            planeConstant={planeConstant}
            secondPlaneEnabled={experiment === "two-planes"}
            secondPlaneNormal={secondPlaneNormal}
            secondPlaneConstant={secondPlaneConstant}
            parameter={currentParameter}
            mode={sceneMode}
            gridSize={gridSize}
            showNumberLabels={showNumbers}
            showAxes={showAxes}
            showSideGrids={showSideGrids}
            showLineSamples={showSamples && sceneMode !== "plane"}
            showCoordinateGuides={showGuides && sceneMode !== "plane"}
            showGridCursor
            showNormalVectors={showNormals}
            showObjectLabels={showLabels}
            cameraView={cameraView}
            distanceMode={sceneDistanceMode}
            externalPoint={externalPoint}
            planeDefinitionMode="normal"
            gridEditingEnabled={gridEditing}
            gridPlacementTarget={gridTarget}
            gridPlacementHeight={gridHeight}
            gridSnap={gridSnap}
            showApproachGuides={experiment === "line-plane" && motionMode === "approach"}
            approachStartParameter={approachStart}
            approachProgress={motionProgress}
            selectedPoint={selectedPoint}
            onSelectPoint={setSelectedPoint}
            onGridPlace={handleGridPlace}
          />

          <div className="pointer-events-none absolute left-3 top-3 hidden border border-white/10 bg-black/85 px-3 py-2 text-[11px] text-zinc-400 backdrop-blur sm:block">
            Click a point or plane to inspect it. Drag to rotate. Scroll or pinch to zoom.
          </div>

          {experiment === "line-plane" && motionMode === "approach" && linePlane.type === "point" && (
            <div className="pointer-events-none absolute left-1/2 top-14 w-[min(92%,390px)] -translate-x-1/2 border border-sky-400/25 bg-black/90 p-3 backdrop-blur sm:top-3">
              <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-300">Approaching the intersection</p><span className="font-mono text-[10px] text-zinc-300">{Math.round(motionProgress * 100)}%</span></div>
              <div className="mt-2 h-1 bg-white/10"><div className="h-full bg-sky-400" style={{ width: `${motionProgress * 100}%` }} /></div>
              <div className="mt-3 grid grid-cols-3 gap-3 font-mono text-[10px]"><div><span className="block text-zinc-500">Parameter t</span><span className="text-zinc-100">{formatNumber(currentParameter)}</span></div><div><span className="block text-zinc-500">Plane residual</span><span className="text-sky-200">{formatNumber(residual)}</span></div><div><span className="block text-zinc-500">Distance</span><span className="text-zinc-100">{planeDistance === null ? "Not defined" : formatNumber(planeDistance)}</span></div></div>
            </div>
          )}

          {selectedPoint && (
            <div className="absolute right-3 top-3 border border-sky-400/25 bg-black/90 p-3 shadow-xl backdrop-blur">
              <div className="flex items-start gap-5"><div><p className="micro-label text-sky-300">Selected point</p><p className="mt-1 text-xs font-semibold">{selectedPoint.label}</p><p className="mt-1 font-mono text-[11px] text-sky-200">({formatVector(selectedPoint.position)})</p></div><button type="button" onClick={() => setSelectedPoint(null)} className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-100">Clear</button></div>
            </div>
          )}

          <div className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] border border-sky-400/25 bg-black/90 p-4 shadow-2xl backdrop-blur sm:max-w-md">
            <p className="micro-label text-sky-300">Live result</p>
            <p className="mt-2 text-sm font-semibold text-zinc-100">{headline.title}</p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">{headline.detail}</p>
            {headline.math && <MathJaxRenderer math={headline.math} className="mt-2 text-xs text-sky-200" />}
          </div>
        </section>

        <AnimatePresence initial={false}>
          {panelOpen && (
            <>
              <motion.button type="button" aria-label="Close visualizer controls" onClick={() => setPanelOpen(false)} className="absolute inset-0 z-20 bg-black/55 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              <motion.aside className="visualizer-control-scroll absolute inset-y-0 right-0 z-30 w-[min(94vw,410px)] overflow-y-auto border-l border-white/10 bg-[#101010] shadow-[-24px_0_70px_rgba(0,0,0,0.55)] lg:static lg:shadow-none" initial={{ x: 26, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 26, opacity: 0 }} transition={{ duration: 0.2 }} aria-label="Visualizer controls">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#101010]/95 px-5 py-3 backdrop-blur"><div><p className="text-sm font-semibold">Controls</p><p className="text-[11px] text-zinc-500">{experimentOptions.find((item) => item.id === experiment)?.label}</p></div><button type="button" onClick={() => setPanelOpen(false)} className="visualizer-toolbar-button lg:hidden">Close</button></div>

                <div className="space-y-7 p-5">
                  <section>
                    <p className="micro-label text-sky-300">Step 1</p>
                    <h2 className="mt-2 text-lg font-semibold">Choose an experiment</h2>
                    <div className="mt-4 space-y-2">
                      {experimentOptions.map((option) => <button key={option.id} type="button" onClick={() => { setExperiment(option.id); setAnimating(false); setMotionProgress(0); progressRef.current = 0; setGridEditing(false); }} aria-pressed={experiment === option.id} className={`w-full border p-4 text-left transition ${experiment === option.id ? "border-sky-400/40 bg-sky-400/[0.07]" : "border-white/10 bg-[#0b0b0b] hover:border-white/25"}`}><span className={`block text-sm font-semibold ${experiment === option.id ? "text-sky-200" : "text-zinc-200"}`}>{option.label}</span><span className="mt-1 block text-xs leading-5 text-zinc-500">{option.description}</span></button>)}
                    </div>
                  </section>

                  <section className="border-t border-white/10 pt-6">
                    <p className="micro-label text-sky-300">Step 2</p>
                    <h2 className="mt-2 text-lg font-semibold">Change the values</h2>

                    {experiment === "line-plane" && (
                      <div className="mt-4 space-y-6">
                        <div className="grid grid-cols-3 gap-2">{(["cross", "parallel", "contained"] as const).map((preset) => <button key={preset} type="button" onClick={() => applyLinePreset(preset)} className="min-h-10 border border-white/10 bg-[#0b0b0b] px-2 text-[10px] font-semibold capitalize text-zinc-400 hover:border-sky-400/35 hover:text-zinc-100">{preset === "cross" ? "Crossing" : preset}</button>)}</div>
                        <VectorFields label="Line anchor r₀" value={linePoint} onChange={setLinePoint} />
                        <VectorFields label="Line direction d" value={lineDirection} onChange={setLineDirection} />
                        <VectorFields label="Plane normal n" value={planeNormal} onChange={setPlaneNormal} />
                        <NumberStepper label="Plane constant k" value={planeConstant} onChange={setPlaneConstant} />
                      </div>
                    )}

                    {experiment === "two-planes" && (
                      <div className="mt-4 space-y-6">
                        <div className="grid grid-cols-3 gap-2">{(["intersect", "parallel", "same"] as const).map((preset) => <button key={preset} type="button" onClick={() => applyPlanePreset(preset)} className="min-h-10 border border-white/10 bg-[#0b0b0b] px-2 text-[10px] font-semibold capitalize text-zinc-400 hover:border-sky-400/35 hover:text-zinc-100">{preset === "intersect" ? "Intersecting" : preset === "same" ? "Same plane" : "Parallel"}</button>)}</div>
                        <VectorFields label="Plane 1 normal" value={planeNormal} onChange={setPlaneNormal} />
                        <NumberStepper label="Plane 1 constant" value={planeConstant} onChange={setPlaneConstant} />
                        <VectorFields label="Plane 2 normal" value={secondPlaneNormal} onChange={setSecondPlaneNormal} />
                        <NumberStepper label="Plane 2 constant" value={secondPlaneConstant} onChange={setSecondPlaneConstant} />
                      </div>
                    )}

                    {experiment === "distance" && (
                      <div className="mt-4 space-y-6">
                        <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setDistanceMode("point-line")} className={`min-h-11 border text-xs font-semibold ${distanceMode === "point-line" ? "border-sky-400/40 bg-sky-400/[0.07] text-sky-200" : "border-white/10 text-zinc-400"}`}>Point to line</button><button type="button" onClick={() => setDistanceMode("point-plane")} className={`min-h-11 border text-xs font-semibold ${distanceMode === "point-plane" ? "border-sky-400/40 bg-sky-400/[0.07] text-sky-200" : "border-white/10 text-zinc-400"}`}>Point to plane</button></div>
                        <VectorFields label="External point P" value={externalPoint} onChange={setExternalPoint} />
                        {distanceMode === "point-line" ? <><VectorFields label="Line anchor r₀" value={linePoint} onChange={setLinePoint} /><VectorFields label="Line direction d" value={lineDirection} onChange={setLineDirection} /></> : <><VectorFields label="Plane normal n" value={planeNormal} onChange={setPlaneNormal} /><NumberStepper label="Plane constant k" value={planeConstant} onChange={setPlaneConstant} /></>}
                      </div>
                    )}
                  </section>

                  {experiment === "line-plane" && (
                    <section className="border-t border-white/10 pt-6">
                      <p className="micro-label text-sky-300">Step 3</p>
                      <h2 className="mt-2 text-lg font-semibold">Animate the geometry</h2>
                      <select value={motionMode} onChange={(event) => { setMotionMode(event.target.value as MotionMode); resetMotion(); }} className="field-control mt-4 min-h-11 text-sm"><option value="approach">Approach the intersection</option><option value="travel">Move along the line</option><option value="slide-plane">Slide the plane</option></select>
                      <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => setAnimating((current) => !current)} disabled={motionMode === "approach" && linePlane.type !== "point"} className="primary-action text-xs disabled:cursor-not-allowed disabled:opacity-35">{animating ? "Pause" : "Play"}</button><button type="button" onClick={resetMotion} className="secondary-action text-xs">Restart</button></div>
                      {motionMode === "approach" && <label className="mt-4 block"><span className="mb-2 flex justify-between text-[11px] text-zinc-500"><span>Animation progress</span><span>{Math.round(motionProgress * 100)}%</span></span><input type="range" min="0" max="1" step="0.01" value={motionProgress} onChange={(event) => { setAnimating(false); setMotionProgress(Number(event.target.value)); }} className="range-input w-full" /></label>}
                      {motionMode === "travel" && <NumberStepper label="Parameter t" value={parameter} step={0.25} onChange={(value) => { setAnimating(false); setParameter(value); }} />}
                      <label className="mt-4 block"><span className="mb-2 flex justify-between text-[11px] text-zinc-500"><span>Speed</span><span>{motionSpeed.toFixed(1)}x</span></span><input type="range" min="0.5" max="2" step="0.1" value={motionSpeed} onChange={(event) => setMotionSpeed(Number(event.target.value))} className="range-input w-full" /></label>
                    </section>
                  )}

                  <section className="border-t border-white/10 pt-6">
                    <p className="micro-label text-sky-300">Equations</p>
                    {(experiment === "line-plane" || (experiment === "distance" && distanceMode === "point-line")) && <MathJaxRenderer math={`\\[\\vec r=(${formatVector(linePoint)})+t(${formatVector(lineDirection)})\\]`} className="mt-3 text-sm text-zinc-200" />}
                    {(experiment !== "distance" || distanceMode === "point-plane") && <MathJaxRenderer math={`\\[${formatPlane(planeNormal, planeConstant)}\\]`} className="mt-2 text-sm text-sky-200" />}
                    {experiment === "two-planes" && <MathJaxRenderer math={`\\[${formatPlane(secondPlaneNormal, secondPlaneConstant)}\\]`} className="mt-2 text-sm text-zinc-200" />}
                  </section>

                  <details className="border border-white/10 bg-[#0b0b0b] p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-zinc-300">Display and grid options</summary>
                    <div className="mt-4 grid grid-cols-2 gap-2"><Toggle label="Axis numbers" checked={showNumbers} onChange={setShowNumbers} /><Toggle label="Axes" checked={showAxes} onChange={setShowAxes} /><Toggle label="Object labels" checked={showLabels} onChange={setShowLabels} /><Toggle label="Normal vectors" checked={showNormals} onChange={setShowNormals} /><Toggle label="Side grids" checked={showSideGrids} onChange={setShowSideGrids} /><Toggle label="Line samples" checked={showSamples} onChange={setShowSamples} /><Toggle label="Coordinate guides" checked={showGuides} onChange={setShowGuides} /><Toggle label="Edit on grid" checked={gridEditing} onChange={setGridEditing} /></div>
                    <div className="mt-4 grid grid-cols-2 gap-2">{cameras.map((camera) => <button key={camera.id} type="button" onClick={() => setCameraView(camera.id)} className={`min-h-10 border text-[11px] font-semibold ${cameraView === camera.id ? "border-sky-400/40 bg-sky-400/[0.07] text-sky-200" : "border-white/10 text-zinc-400"}`}>{camera.label}</button>)}</div>
                    <div className="mt-4 grid grid-cols-2 gap-2"><NumberStepper compact label="Grid size" value={gridSize} min={10} max={30} step={2} onChange={setGridSize} /><NumberStepper compact label="Grid height" value={gridHeight} step={0.5} onChange={setGridHeight} /></div>
                    {gridEditing && <><label className="mt-4 block text-[11px] font-semibold text-zinc-400">Place on click<select value={gridTarget} onChange={(event) => setGridTarget(event.target.value as GridPlacementTarget)} className="field-control mt-2 min-h-10 text-xs"><option value="line-anchor">Line anchor</option><option value="tracked-point">Point on line</option><option value="external-point">External point</option><option value="plane-point">Point on Plane 1</option></select></label><NumberStepper label="Snap size" value={gridSnap} min={0.25} max={2} step={0.25} onChange={setGridSnap} /></>}
                  </details>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
