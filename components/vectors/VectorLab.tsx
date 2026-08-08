"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { Interactive3DPlane, type CameraView, type Vector3Value } from "./Interactive3DPlane";

type Mode = "line" | "plane" | "both";

type Preset = {
  name: string;
  description: string;
  linePoint: Vector3Value;
  lineDirection: Vector3Value;
  planeNormal: Vector3Value;
  planeConstant: number;
  secondPlaneEnabled: boolean;
  secondPlaneNormal: Vector3Value;
  secondPlaneConstant: number;
};

const presets: Preset[] = [
  { name: "Crossing line", description: "One line-plane intersection", linePoint: [1, 1, -1], lineDirection: [2, -1, 1], planeNormal: [1, 1, 1], planeConstant: 2, secondPlaneEnabled: false, secondPlaneNormal: [1, -1, 1], secondPlaneConstant: 0 },
  { name: "Parallel line", description: "No line-plane intersection", linePoint: [0, 0, 0], lineDirection: [1, -1, 0], planeNormal: [1, 1, 1], planeConstant: 2, secondPlaneEnabled: false, secondPlaneNormal: [1, -1, 1], secondPlaneConstant: 0 },
  { name: "Contained line", description: "The line lies in Plane 1", linePoint: [1, 1, 0], lineDirection: [1, -1, 0], planeNormal: [1, 1, 1], planeConstant: 2, secondPlaneEnabled: false, secondPlaneNormal: [1, -1, 1], secondPlaneConstant: 0 },
  { name: "Intersecting planes", description: "The planes meet in a line", linePoint: [1, 1, -1], lineDirection: [2, -1, 1], planeNormal: [1, 1, 1], planeConstant: 2, secondPlaneEnabled: true, secondPlaneNormal: [1, -1, 1], secondPlaneConstant: 0 },
  { name: "Parallel planes", description: "Two distinct parallel planes", linePoint: [1, 1, -1], lineDirection: [2, -1, 1], planeNormal: [1, 1, 1], planeConstant: 2, secondPlaneEnabled: true, secondPlaneNormal: [2, 2, 2], secondPlaneConstant: 6 },
  { name: "Same plane", description: "Equivalent plane equations", linePoint: [1, 1, -1], lineDirection: [2, -1, 1], planeNormal: [1, 1, 1], planeConstant: 2, secondPlaneEnabled: true, secondPlaneNormal: [2, 2, 2], secondPlaneConstant: 4 },
];

const cameraViews: Array<{ id: CameraView; label: string }> = [
  { id: "isometric", label: "Isometric" },
  { id: "front", label: "Front" },
  { id: "side", label: "Side" },
  { id: "top", label: "Top" },
];

const defaults = {
  ...presets[0],
  parameter: 0,
  mode: "both" as Mode,
  gridSize: 18,
  showNumberLabels: true,
  showAxes: true,
  showNormalVectors: true,
  showObjectLabels: true,
  cameraView: "isometric" as CameraView,
};

const EPSILON = 1e-8;

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

function magnitude(vector: Vector3Value) {
  return Math.sqrt(dot(vector, vector));
}

function formatNumber(value: number) {
  if (Math.abs(value) < EPSILON) return "0";
  if (Number.isInteger(value)) return String(value);
  return Number(value.toFixed(3)).toString();
}

function formatPlaneEquation(normal: Vector3Value, constant: number) {
  const variables = ["x", "y", "z"];
  const terms = normal.flatMap((coefficient, index) => {
    if (coefficient === 0) return [];
    const magnitudeValue = Math.abs(coefficient);
    return [{ sign: coefficient < 0 ? "-" : "+", body: `${magnitudeValue === 1 ? "" : formatNumber(magnitudeValue)}${variables[index]}` }];
  });
  if (terms.length === 0) return `0=${formatNumber(constant)}`;
  return `${terms.map((term, index) => `${index === 0 && term.sign === "+" ? "" : term.sign}${term.body}`).join("")}=${formatNumber(constant)}`;
}

function NumericVectorInput({ label, value, onChange }: { label: string; value: Vector3Value; onChange: (value: Vector3Value) => void }) {
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
    <label className="flex min-h-11 cursor-pointer items-center gap-3 border border-white/12 bg-[#0b0b0b] px-3 text-xs font-semibold text-zinc-300 transition hover:border-white/25">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-sky-400" />
      {label}
    </label>
  );
}

export function VectorLab() {
  const [linePoint, setLinePoint] = useState<Vector3Value>(defaults.linePoint);
  const [lineDirection, setLineDirection] = useState<Vector3Value>(defaults.lineDirection);
  const [planeNormal, setPlaneNormal] = useState<Vector3Value>(defaults.planeNormal);
  const [planeConstant, setPlaneConstant] = useState(defaults.planeConstant);
  const [secondPlaneEnabled, setSecondPlaneEnabled] = useState(defaults.secondPlaneEnabled);
  const [secondPlaneNormal, setSecondPlaneNormal] = useState<Vector3Value>(defaults.secondPlaneNormal);
  const [secondPlaneConstant, setSecondPlaneConstant] = useState(defaults.secondPlaneConstant);
  const [parameter, setParameter] = useState(defaults.parameter);
  const [mode, setMode] = useState<Mode>(defaults.mode);
  const [gridSize, setGridSize] = useState(defaults.gridSize);
  const [showNumberLabels, setShowNumberLabels] = useState(defaults.showNumberLabels);
  const [showAxes, setShowAxes] = useState(defaults.showAxes);
  const [showNormalVectors, setShowNormalVectors] = useState(defaults.showNormalVectors);
  const [showObjectLabels, setShowObjectLabels] = useState(defaults.showObjectLabels);
  const [cameraView, setCameraView] = useState<CameraView>(defaults.cameraView);
  const [animating, setAnimating] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    if (!animating) return;
    let frame = 0;
    let previous = performance.now();
    const animate = (time: number) => {
      const elapsed = Math.min(0.05, (time - previous) / 1000);
      previous = time;
      setParameter((current) => {
        const next = current + elapsed * 1.4;
        return next > 3 ? -3 : next;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [animating]);

  useEffect(() => {
    if (!copyStatus) return;
    const timer = window.setTimeout(() => setCopyStatus(""), 1800);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  const lineRelationship = useMemo(() => {
    if (magnitude(planeNormal) < EPSILON) return { title: "Plane normal required", detail: "Enter a non-zero normal vector.", math: String.raw`\[\vec n\ne\vec 0\]` };
    if (magnitude(lineDirection) < EPSILON) return { title: "Line direction required", detail: "Enter a non-zero direction vector.", math: String.raw`\[\vec d\ne\vec 0\]` };
    const denominator = dot(planeNormal, lineDirection);
    const numerator = planeConstant - dot(planeNormal, linePoint);
    if (Math.abs(denominator) < EPSILON) {
      return Math.abs(numerator) < EPSILON
        ? { title: "The line lies in Plane 1", detail: "Every value of t satisfies the plane equation.", math: String.raw`\[\vec n\cdot\vec d=0,\quad \vec n\cdot\vec r_0=k\]` }
        : { title: "The line is parallel to Plane 1", detail: "The line does not intersect the plane.", math: String.raw`\[\vec n\cdot\vec d=0,\quad \vec n\cdot\vec r_0\ne k\]` };
    }
    const t = numerator / denominator;
    const point: Vector3Value = [linePoint[0] + t * lineDirection[0], linePoint[1] + t * lineDirection[1], linePoint[2] + t * lineDirection[2]];
    return { title: "One line-plane intersection", detail: `t = ${formatNumber(t)}`, math: `\\[P=(${point.map(formatNumber).join(",")})\\]` };
  }, [lineDirection, linePoint, planeConstant, planeNormal]);

  const planeRelationship = useMemo(() => {
    if (!secondPlaneEnabled) return null;
    if (magnitude(planeNormal) < EPSILON || magnitude(secondPlaneNormal) < EPSILON) return { title: "Two valid normals are required", detail: "Enter a non-zero normal for each plane.", math: String.raw`\[\vec n_1\ne\vec0,\quad\vec n_2\ne\vec0\]` };
    const direction = cross(planeNormal, secondPlaneNormal);
    if (magnitude(direction) >= EPSILON) return { title: "The planes intersect in a line", detail: `Direction: (${direction.map(formatNumber).join(", ")})`, math: `\\[\\vec d=\\vec n_1\\times\\vec n_2=(${direction.map(formatNumber).join(",")})\\]` };
    const index = planeNormal.findIndex((value) => Math.abs(value) >= EPSILON);
    const ratio = secondPlaneNormal[index] / planeNormal[index];
    const coincident = Math.abs(secondPlaneConstant - ratio * planeConstant) < EPSILON;
    return coincident
      ? { title: "The equations describe the same plane", detail: "The planes are coincident.", math: String.raw`\[\Pi_1=\Pi_2\]` }
      : { title: "The planes are parallel", detail: "There is no plane-plane intersection.", math: String.raw`\[\vec n_1\parallel\vec n_2\]` };
  }, [planeConstant, planeNormal, secondPlaneConstant, secondPlaneEnabled, secondPlaneNormal]);

  const trackedPoint: Vector3Value = [
    linePoint[0] + parameter * lineDirection[0],
    linePoint[1] + parameter * lineDirection[1],
    linePoint[2] + parameter * lineDirection[2],
  ];

  const applyPreset = (preset: Preset) => {
    setLinePoint(preset.linePoint);
    setLineDirection(preset.lineDirection);
    setPlaneNormal(preset.planeNormal);
    setPlaneConstant(preset.planeConstant);
    setSecondPlaneEnabled(preset.secondPlaneEnabled);
    setSecondPlaneNormal(preset.secondPlaneNormal);
    setSecondPlaneConstant(preset.secondPlaneConstant);
    setParameter(0);
    setMode("both");
    setAnimating(false);
  };

  const reset = () => {
    applyPreset(presets[0]);
    setGridSize(defaults.gridSize);
    setShowNumberLabels(true);
    setShowAxes(true);
    setShowNormalVectors(true);
    setShowObjectLabels(true);
    setCameraView("isometric");
  };

  const copyEquations = async () => {
    const equations = [
      `Line: r = (${linePoint.join(", ")}) + t(${lineDirection.join(", ")})`,
      `Plane 1: ${formatPlaneEquation(planeNormal, planeConstant)}`,
      ...(secondPlaneEnabled ? [`Plane 2: ${formatPlaneEquation(secondPlaneNormal, secondPlaneConstant)}`] : []),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(equations);
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Copy unavailable");
    }
  };

  return (
    <div className="overflow-hidden border border-white/10 bg-[#101010]">
      <div className="border-b border-white/10 p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="micro-label text-sky-300">Starting configurations</p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-100">Choose a relationship to examine</h2>
          </div>
          <button type="button" onClick={reset} className="secondary-action">Reset all values</button>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {presets.map((preset) => (
            <button key={preset.name} type="button" onClick={() => applyPreset(preset)} className="border border-white/12 bg-[#0b0b0b] p-4 text-left transition hover:border-sky-400/40 hover:bg-sky-400/[0.05]">
              <span className="block text-sm font-semibold text-zinc-100">{preset.name}</span>
              <span className="mt-1 block text-xs text-zinc-400">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_460px]">
        <div className="relative min-h-[600px] border-b border-white/10 xl:min-h-[820px] xl:border-b-0 xl:border-r">
          <Interactive3DPlane
            linePoint={linePoint}
            lineDirection={lineDirection}
            planeNormal={planeNormal}
            planeConstant={planeConstant}
            secondPlaneEnabled={secondPlaneEnabled}
            secondPlaneNormal={secondPlaneNormal}
            secondPlaneConstant={secondPlaneConstant}
            parameter={parameter}
            mode={mode}
            gridSize={gridSize}
            showNumberLabels={showNumberLabels}
            showAxes={showAxes}
            showNormalVectors={showNormalVectors}
            showObjectLabels={showObjectLabels}
            cameraView={cameraView}
          />
          <div className="pointer-events-none absolute left-4 top-4 border border-white/15 bg-black/85 px-3 py-2 text-[11px] text-zinc-300 backdrop-blur">
            Drag to rotate. Scroll to zoom.
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            <div className="border border-white/15 bg-black/85 px-3 py-2 text-[11px] text-zinc-200">White: line and Plane 2</div>
            <div className="border border-sky-400/25 bg-black/85 px-3 py-2 text-[11px] text-sky-200">Blue: Plane 1 and vectors</div>
          </div>
        </div>

        <motion.div layout className="space-y-7 p-5 sm:p-7">
          <section>
            <h3 className="text-base font-semibold text-zinc-100">View</h3>
            <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Camera view">
              {cameraViews.map((view) => (
                <button key={view.id} type="button" onClick={() => setCameraView(view.id)} aria-pressed={cameraView === view.id} className={`min-h-10 border px-3 text-xs font-semibold ${cameraView === view.id ? "border-sky-400/45 bg-sky-400/[0.09] text-sky-200" : "border-white/12 bg-[#0b0b0b] text-zinc-400 hover:border-white/25"}`}>{view.label}</button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Visible objects">
              {(["line", "plane", "both"] as Mode[]).map((item) => (
                <button key={item} type="button" onClick={() => setMode(item)} aria-pressed={mode === item} className={`min-h-10 border px-3 text-xs font-semibold capitalize ${mode === item ? "border-sky-400/45 bg-sky-400/[0.09] text-sky-200" : "border-white/12 bg-[#0b0b0b] text-zinc-400 hover:border-white/25"}`}>{item}</button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Toggle label="Grid numbers" checked={showNumberLabels} onChange={setShowNumberLabels} />
              <Toggle label="Axes" checked={showAxes} onChange={setShowAxes} />
              <Toggle label="Vector directions" checked={showNormalVectors} onChange={setShowNormalVectors} />
              <Toggle label="Object labels" checked={showObjectLabels} onChange={setShowObjectLabels} />
              <Toggle label="Plane 2" checked={secondPlaneEnabled} onChange={setSecondPlaneEnabled} />
            </div>
            <label className="mt-5 block">
              <span className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-300">Grid extent <b className="font-mono font-normal text-sky-300">{gridSize}</b></span>
              <input className="range-input w-full" type="range" min="12" max="28" step="2" value={gridSize} onChange={(event) => setGridSize(Number(event.target.value))} />
            </label>
          </section>

          <section className="space-y-6 border-t border-white/10 pt-7">
            <h3 className="text-base font-semibold text-zinc-100">Line</h3>
            <NumericVectorInput label="Anchor point r₀" value={linePoint} onChange={setLinePoint} />
            <NumericVectorInput label="Direction vector d" value={lineDirection} onChange={setLineDirection} />
            <div>
              <NumberStepper label="Parameter t" value={parameter} step={0.1} min={-3} max={3} onChange={setParameter} />
              <input className="range-input mt-4 w-full" type="range" min="-3" max="3" step="0.1" value={parameter} onChange={(event) => setParameter(Number(event.target.value))} aria-label="Parameter t slider" />
              <button type="button" onClick={() => setAnimating((current) => !current)} className="secondary-action mt-4 w-full">{animating ? "Stop animation" : "Animate point"}</button>
            </div>
          </section>

          <section className="space-y-6 border-t border-white/10 pt-7">
            <h3 className="text-base font-semibold text-zinc-100">Plane 1</h3>
            <NumericVectorInput label="Normal vector n₁" value={planeNormal} onChange={setPlaneNormal} />
            <NumberStepper label="Plane constant k₁" value={planeConstant} step={0.1} min={-6} max={6} onChange={setPlaneConstant} />
            <input className="range-input w-full" type="range" min="-6" max="6" step="0.1" value={planeConstant} onChange={(event) => setPlaneConstant(Number(event.target.value))} aria-label="Plane 1 constant slider" />
          </section>

          {secondPlaneEnabled && (
            <section className="space-y-6 border-t border-white/10 pt-7">
              <h3 className="text-base font-semibold text-zinc-100">Plane 2</h3>
              <NumericVectorInput label="Normal vector n₂" value={secondPlaneNormal} onChange={setSecondPlaneNormal} />
              <NumberStepper label="Plane constant k₂" value={secondPlaneConstant} step={0.1} min={-6} max={6} onChange={setSecondPlaneConstant} />
              <input className="range-input w-full" type="range" min="-6" max="6" step="0.1" value={secondPlaneConstant} onChange={(event) => setSecondPlaneConstant(Number(event.target.value))} aria-label="Plane 2 constant slider" />
            </section>
          )}

          <section className="border-t border-white/10 pt-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-base font-semibold text-zinc-100">Equations</h3>
              <button type="button" onClick={() => void copyEquations()} className="secondary-action min-h-9 px-3 text-xs">Copy equations</button>
            </div>
            <div className="mt-4 space-y-3 border border-white/10 bg-[#0b0b0b] p-4">
              <MathJaxRenderer math={`\\(\\vec r=(${linePoint.join(",")})+t(${lineDirection.join(",")})\\)`} className="text-sm text-zinc-100" />
              <MathJaxRenderer math={`\\(${formatPlaneEquation(planeNormal, planeConstant)}\\)`} className="text-sm text-zinc-100" />
              {secondPlaneEnabled && <MathJaxRenderer math={`\\(${formatPlaneEquation(secondPlaneNormal, secondPlaneConstant)}\\)`} className="text-sm text-zinc-100" />}
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 border border-sky-400/20 bg-sky-400/[0.045] px-4 py-3 text-xs">
              <span className="text-zinc-400">Point at t = {formatNumber(parameter)}</span>
              <span className="font-mono font-semibold text-sky-200">({trackedPoint.map(formatNumber).join(", ")})</span>
            </div>
            {copyStatus && <p className="mt-2 text-right text-xs text-sky-300" role="status">{copyStatus}</p>}
          </section>
        </motion.div>
      </div>

      <div className={`grid gap-px border-t border-white/10 bg-white/10 ${secondPlaneEnabled ? "lg:grid-cols-2" : ""}`}>
        <section className="bg-[#0d0d0d] p-6 sm:p-7">
          <p className="micro-label text-sky-300">Line and Plane 1</p>
          <h3 className="mt-3 text-xl font-semibold text-zinc-100">{lineRelationship.title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{lineRelationship.detail}</p>
          <MathJaxRenderer math={lineRelationship.math} className="mt-5 text-base text-zinc-100" />
        </section>
        {planeRelationship && (
          <section className="bg-[#0d0d0d] p-6 sm:p-7">
            <p className="micro-label text-sky-300">Plane 1 and Plane 2</p>
            <h3 className="mt-3 text-xl font-semibold text-zinc-100">{planeRelationship.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{planeRelationship.detail}</p>
            <MathJaxRenderer math={planeRelationship.math} className="mt-5 text-base text-zinc-100" />
          </section>
        )}
      </div>
    </div>
  );
}
