"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { Interactive3DPlane, type Vector3Value } from "./Interactive3DPlane";

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
  { name: "Crossing line", description: "A line that meets the plane once.", linePoint: [1, 1, -1], lineDirection: [2, -1, 1], planeNormal: [1, 1, 1], planeConstant: 2, secondPlaneEnabled: false, secondPlaneNormal: [1, -1, 1], secondPlaneConstant: 0 },
  { name: "Parallel line", description: "The line direction lies parallel to the plane.", linePoint: [0, 0, 0], lineDirection: [1, -1, 0], planeNormal: [1, 1, 1], planeConstant: 2, secondPlaneEnabled: false, secondPlaneNormal: [1, -1, 1], secondPlaneConstant: 0 },
  { name: "Contained line", description: "Every point on the line lies in the plane.", linePoint: [1, 1, 0], lineDirection: [1, -1, 0], planeNormal: [1, 1, 1], planeConstant: 2, secondPlaneEnabled: false, secondPlaneNormal: [1, -1, 1], secondPlaneConstant: 0 },
  { name: "Two planes", description: "Two non-parallel planes intersect in a line.", linePoint: [1, 1, -1], lineDirection: [2, -1, 1], planeNormal: [1, 1, 1], planeConstant: 2, secondPlaneEnabled: true, secondPlaneNormal: [1, -1, 1], secondPlaneConstant: 0 },
];

const defaults = { ...presets[0], parameter: 0, mode: "both" as Mode, gridSize: 18, showNumberLabels: true, showAxes: true, showNormalVectors: true };
const EPSILON = 1e-8;

function dot(first: Vector3Value, second: Vector3Value) {
  return first[0] * second[0] + first[1] * second[1] + first[2] * second[2];
}

function cross(first: Vector3Value, second: Vector3Value): Vector3Value {
  return [first[1] * second[2] - first[2] * second[1], first[2] * second[0] - first[0] * second[2], first[0] * second[1] - first[1] * second[0]];
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
      <legend className="mb-2 text-xs font-semibold text-zinc-400">{label}</legend>
      <div className="grid grid-cols-3 gap-2">
        {(["x", "y", "z"] as const).map((axis, index) => (
          <label key={axis} className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase text-zinc-600">{axis}</span>
            <input
              type="number"
              step="1"
              value={value[index]}
              onChange={(event) => {
                const next = [...value] as Vector3Value;
                next[index] = Number(event.target.value);
                onChange(next);
              }}
              className="h-10 w-full border border-white/10 bg-[#0b0b0b] pl-6 pr-2 text-right font-mono text-xs text-zinc-200 focus:border-sky-400/60 focus:outline-none"
              aria-label={`${label} ${axis}-component`}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 border border-white/10 bg-[#0b0b0b] px-3 py-2.5 text-xs text-zinc-300">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="accent-sky-400" />
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
  const [animating, setAnimating] = useState(false);

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

  const lineRelationship = useMemo(() => {
    if (magnitude(planeNormal) < EPSILON) return { title: "Plane normal required", detail: "Use a non-zero normal vector to define a plane.", math: String.raw`\[\vec n\ne\vec 0\]` };
    if (magnitude(lineDirection) < EPSILON) return { title: "Line direction required", detail: "Use a non-zero direction vector to define a line.", math: String.raw`\[\vec d\ne\vec 0\]` };
    const denominator = dot(planeNormal, lineDirection);
    const numerator = planeConstant - dot(planeNormal, linePoint);
    if (Math.abs(denominator) < EPSILON) {
      return Math.abs(numerator) < EPSILON
        ? { title: "Line lies in the plane", detail: "Every value of t satisfies the plane equation.", math: String.raw`\[\vec n\cdot\vec d=0,\quad \vec n\cdot\vec r_0=k\]` }
        : { title: "Line is parallel to the plane", detail: "There is no intersection because the anchor is outside the plane.", math: String.raw`\[\vec n\cdot\vec d=0,\quad \vec n\cdot\vec r_0\ne k\]` };
    }
    const t = numerator / denominator;
    const point: Vector3Value = [linePoint[0] + t * lineDirection[0], linePoint[1] + t * lineDirection[1], linePoint[2] + t * lineDirection[2]];
    return { title: "One line–plane intersection", detail: `The line crosses the plane when t = ${formatNumber(t)}.`, math: `\\[P=(${point.map(formatNumber).join(",")})\\]` };
  }, [lineDirection, linePoint, planeConstant, planeNormal]);

  const planeRelationship = useMemo(() => {
    if (!secondPlaneEnabled) return null;
    if (magnitude(planeNormal) < EPSILON || magnitude(secondPlaneNormal) < EPSILON) return { title: "Two valid normals are required", detail: "Each plane needs a non-zero normal vector.", math: String.raw`\[\vec n_1\ne\vec0,\quad\vec n_2\ne\vec0\]` };
    const direction = cross(planeNormal, secondPlaneNormal);
    if (magnitude(direction) >= EPSILON) return { title: "The planes intersect in a line", detail: `The intersection direction is (${direction.map(formatNumber).join(", ")}).`, math: `\\[\\vec d=\\vec n_1\\times\\vec n_2=(${direction.map(formatNumber).join(",")})\\]` };
    const index = planeNormal.findIndex((value) => Math.abs(value) >= EPSILON);
    const ratio = secondPlaneNormal[index] / planeNormal[index];
    const coincident = Math.abs(secondPlaneConstant - ratio * planeConstant) < EPSILON;
    return coincident
      ? { title: "The planes are coincident", detail: "Both equations describe the same plane.", math: String.raw`\[\Pi_1=\Pi_2\]` }
      : { title: "The planes are parallel", detail: "Parallel normals and different constants give no intersection.", math: String.raw`\[\vec n_1\parallel\vec n_2\]` };
  }, [planeConstant, planeNormal, secondPlaneConstant, secondPlaneEnabled, secondPlaneNormal]);

  const trackedPoint: Vector3Value = [linePoint[0] + parameter * lineDirection[0], linePoint[1] + parameter * lineDirection[1], linePoint[2] + parameter * lineDirection[2]];

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
  };

  return (
    <div className="overflow-hidden border border-white/10 bg-[#101010]">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="micro-label text-sky-300">Experiment presets</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Choose a relationship, then change any coordinate to test what happens.</p>
          </div>
          <button type="button" onClick={reset} className="secondary-action">Reset all values</button>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {presets.map((preset) => (
            <button key={preset.name} type="button" onClick={() => applyPreset(preset)} className="border border-white/10 bg-[#0b0b0b] p-4 text-left transition hover:border-sky-400/35 hover:bg-sky-400/[0.04]">
              <span className="block text-sm font-semibold text-zinc-200">{preset.name}</span>
              <span className="mt-1 block text-xs leading-5 text-zinc-500">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="relative min-h-[570px] border-b border-white/10 xl:min-h-[760px] xl:border-b-0 xl:border-r">
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
          />
          <div className="pointer-events-none absolute left-4 top-4 max-w-[240px] border border-white/10 bg-black/80 px-3 py-2 backdrop-blur">
            <p className="text-xs font-semibold text-zinc-200">Scene controls</p>
            <p className="mt-1 text-[11px] leading-5 text-zinc-400">Drag to orbit. Use the mouse wheel or trackpad to zoom.</p>
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 grid gap-2 sm:right-auto sm:grid-cols-2">
            <div className="border border-white/10 bg-black/80 px-3 py-2 text-[11px] text-zinc-300">White: line or second plane</div>
            <div className="border border-sky-400/20 bg-black/80 px-3 py-2 text-[11px] text-sky-200">Blue: primary plane and vectors</div>
          </div>
        </div>

        <motion.div layout className="space-y-6 p-5 sm:p-6">
          <section>
            <p className="micro-label text-sky-300">Visible geometry</p>
            <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Visualizer layers">
              {(["line", "plane", "both"] as Mode[]).map((item) => (
                <button key={item} type="button" onClick={() => setMode(item)} className={`min-h-10 border px-3 text-xs font-semibold capitalize ${mode === item ? "border-sky-400/45 bg-sky-400/[0.08] text-sky-300" : "border-white/10 text-zinc-400"}`}>{item}</button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Toggle label="Grid numbers" checked={showNumberLabels} onChange={setShowNumberLabels} />
              <Toggle label="Coordinate axes" checked={showAxes} onChange={setShowAxes} />
              <Toggle label="Normal vectors" checked={showNormalVectors} onChange={setShowNormalVectors} />
              <Toggle label="Second plane" checked={secondPlaneEnabled} onChange={setSecondPlaneEnabled} />
            </div>
            <label className="mt-4 block">
              <span className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-400">Grid size <b className="font-mono font-normal text-sky-300">{gridSize}</b></span>
              <input className="range-input w-full" type="range" min="12" max="28" step="2" value={gridSize} onChange={(event) => setGridSize(Number(event.target.value))} />
            </label>
          </section>

          <section className="space-y-5 border-t border-white/10 pt-6">
            <p className="micro-label text-sky-300">Line controls</p>
            <NumericVectorInput label="Anchor point r₀" value={linePoint} onChange={setLinePoint} />
            <NumericVectorInput label="Direction vector d" value={lineDirection} onChange={setLineDirection} />
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="parameter" className="text-xs font-semibold text-zinc-400">Parameter t</label>
                <span className="font-mono text-xs text-sky-300">{parameter.toFixed(1)}</span>
              </div>
              <input id="parameter" className="range-input w-full" type="range" min="-3" max="3" step="0.1" value={parameter} onChange={(event) => setParameter(Number(event.target.value))} />
              <button type="button" onClick={() => setAnimating((current) => !current)} className="secondary-action mt-3 w-full">{animating ? "Stop parameter animation" : "Start parameter animation"}</button>
            </div>
          </section>

          <section className="space-y-5 border-t border-white/10 pt-6">
            <p className="micro-label text-sky-300">Primary plane controls</p>
            <NumericVectorInput label="Normal vector n₁" value={planeNormal} onChange={setPlaneNormal} />
            <label className="block">
              <span className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-400">Constant k₁ <b className="font-mono font-normal text-sky-300">{planeConstant.toFixed(1)}</b></span>
              <input className="range-input w-full" type="range" min="-6" max="6" step="0.1" value={planeConstant} onChange={(event) => setPlaneConstant(Number(event.target.value))} />
            </label>
          </section>

          {secondPlaneEnabled && (
            <section className="space-y-5 border-t border-white/10 pt-6">
              <p className="micro-label text-sky-300">Second plane controls</p>
              <NumericVectorInput label="Normal vector n₂" value={secondPlaneNormal} onChange={setSecondPlaneNormal} />
              <label className="block">
                <span className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-400">Constant k₂ <b className="font-mono font-normal text-sky-300">{secondPlaneConstant.toFixed(1)}</b></span>
                <input className="range-input w-full" type="range" min="-6" max="6" step="0.1" value={secondPlaneConstant} onChange={(event) => setSecondPlaneConstant(Number(event.target.value))} />
              </label>
            </section>
          )}

          <section className="space-y-3 border-t border-white/10 pt-6">
            <p className="micro-label text-sky-300">Live equations</p>
            <MathJaxRenderer math={`\\(\\vec r=(${linePoint.join(",")})+t(${lineDirection.join(",")})\\)`} className="text-sm text-zinc-200" />
            <MathJaxRenderer math={`\\(${formatPlaneEquation(planeNormal, planeConstant)}\\)`} className="text-sm text-zinc-200" />
            {secondPlaneEnabled && <MathJaxRenderer math={`\\(${formatPlaneEquation(secondPlaneNormal, secondPlaneConstant)}\\)`} className="text-sm text-zinc-200" />}
            <p className="pt-2 text-xs text-zinc-500">Tracked point: ({trackedPoint.map(formatNumber).join(", ")})</p>
          </section>
        </motion.div>
      </div>

      <div className="grid gap-px border-t border-white/10 bg-white/10 lg:grid-cols-2">
        <section className="bg-[#0d0d0d] p-6">
          <p className="micro-label text-sky-300">Line and primary plane</p>
          <h3 className="mt-3 text-xl font-semibold">{lineRelationship.title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{lineRelationship.detail}</p>
          <MathJaxRenderer math={lineRelationship.math} className="mt-5 text-base text-zinc-100" />
        </section>
        <section className="bg-[#0d0d0d] p-6">
          <p className="micro-label text-sky-300">Plane relationship</p>
          {planeRelationship ? (
            <><h3 className="mt-3 text-xl font-semibold">{planeRelationship.title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{planeRelationship.detail}</p><MathJaxRenderer math={planeRelationship.math} className="mt-5 text-base text-zinc-100" /></>
          ) : (
            <><h3 className="mt-3 text-xl font-semibold">Second plane is hidden</h3><p className="mt-2 text-sm leading-6 text-zinc-400">Turn on the second plane to experiment with plane–plane intersections.</p></>
          )}
        </section>
      </div>
    </div>
  );
}
