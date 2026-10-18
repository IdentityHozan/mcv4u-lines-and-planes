"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { VectorCalculator } from "./VectorCalculator";
import { VectorCanvas2D, type DisplayVector } from "./VectorCanvas2D";
import { VectorCanvas3D, type VectorCameraView } from "./VectorCanvas3D";
import {
  VECTOR_EPSILON,
  addVectors,
  angleBetween,
  cross2D,
  crossVectors,
  dotVectors,
  exactMagnitudeLatex,
  forDimension,
  formatNumber,
  formatWorkbenchVector,
  normalizeVector,
  projectVector,
  rejectVector,
  relationship,
  scaleVector,
  squaredMagnitude,
  subtractVectors,
  vectorMagnitude,
  type VectorDimension,
  type WorkbenchVector,
} from "./vectorMath";

type WorkspaceMode = "vectors" | "geometry";
type OperationId =
  | "magnitude"
  | "unit"
  | "add"
  | "subtract"
  | "distance"
  | "scale"
  | "linear-combination"
  | "dot"
  | "angle"
  | "projection"
  | "rejection"
  | "relationship"
  | "cross"
  | "area-parallelogram"
  | "area-triangle"
  | "scalar-triple"
  | "coplanarity";

type VectorEntry = {
  id: "a" | "b" | "c";
  label: "A" | "B" | "C";
  value: WorkbenchVector;
  color: string;
};

type CalculationResult = {
  title: string;
  value: string;
  formula: string;
  explanation: string;
  vector?: WorkbenchVector;
  exactLatex?: string;
  invalid?: boolean;
};

const initialVectors: VectorEntry[] = [
  { id: "a", label: "A", value: [3, 2, 0], color: "#38bdf8" },
  { id: "b", label: "B", value: [-2, 3, 0], color: "#f5f5f5" },
  { id: "c", label: "C", value: [1, 1, 1], color: "#a1a1aa" },
];

const operations: Array<{
  group: string;
  id: OperationId;
  label: string;
  description: string;
  threeDimensional?: boolean;
}> = [
  { group: "Vector basics", id: "magnitude", label: "Magnitude of A", description: "Find the exact length of vector A." },
  { group: "Vector basics", id: "unit", label: "Unit vector in the direction of A", description: "Scale vector A so its magnitude is 1." },
  { group: "Vector basics", id: "add", label: "A plus B", description: "Add corresponding components." },
  { group: "Vector basics", id: "subtract", label: "A minus B", description: "Subtract corresponding components." },
  { group: "Vector basics", id: "distance", label: "Distance between endpoints", description: "Find the magnitude of A minus B." },
  { group: "Scale and combine", id: "scale", label: "Scalar multiple kA", description: "Multiply every component of A by k." },
  { group: "Scale and combine", id: "linear-combination", label: "Linear combination alpha A plus beta B", description: "Build a new vector from A and B." },
  { group: "Relationships", id: "dot", label: "Dot product", description: "Measure directional alignment with a scalar." },
  { group: "Relationships", id: "angle", label: "Angle between A and B", description: "Use the dot product to find the smaller angle." },
  { group: "Relationships", id: "projection", label: "Projection of A onto B", description: "Find the component of A parallel to B." },
  { group: "Relationships", id: "rejection", label: "Perpendicular component of A", description: "Remove the projection of A onto B." },
  { group: "Relationships", id: "relationship", label: "Parallel or perpendicular test", description: "Classify the relationship between A and B." },
  { group: "Area and three dimensions", id: "cross", label: "Cross product", description: "Find a vector perpendicular to A and B.", threeDimensional: true },
  { group: "Area and three dimensions", id: "area-parallelogram", label: "Parallelogram area", description: "Use the magnitude of the cross product." },
  { group: "Area and three dimensions", id: "area-triangle", label: "Triangle area", description: "Take half the parallelogram area." },
  { group: "Area and three dimensions", id: "scalar-triple", label: "Scalar triple product", description: "Measure signed volume using A, B, and C.", threeDimensional: true },
  { group: "Area and three dimensions", id: "coplanarity", label: "Coplanarity test", description: "Check whether A, B, and C share one plane.", threeDimensional: true },
];

const cameras: Array<{ id: VectorCameraView; label: string }> = [
  { id: "isometric", label: "Isometric" },
  { id: "front", label: "Front" },
  { id: "side", label: "Side" },
  { id: "top", label: "Top" },
];

function latexVector(vector: WorkbenchVector, dimension: VectorDimension) {
  const values = dimension === 2 ? vector.slice(0, 2) : vector;
  return `\\langle ${values.map(formatNumber).join(", ")}\\rangle`;
}

function invalid(title: string, formula: string, explanation: string): CalculationResult {
  return { title, value: "Not defined", formula, explanation, invalid: true };
}

function VectorInput({ entry, dimension, onChange }: { entry: VectorEntry; dimension: VectorDimension; onChange: (value: WorkbenchVector) => void }) {
  const axes = dimension === 2 ? ["X", "Y"] : ["X", "Y", "Z"];
  return (
    <fieldset className="border border-white/10 bg-[#0b0b0b] p-4">
      <legend className="px-2 text-xs font-semibold text-zinc-200">
        <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
        Vector {entry.label}
      </legend>
      <div className={`grid gap-2 ${dimension === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {axes.map((axis, index) => (
          <NumberStepper
            key={axis}
            compact
            label={axis}
            value={entry.value[index]}
            onChange={(nextValue) => {
              const next = [...entry.value] as WorkbenchVector;
              next[index] = nextValue;
              onChange(next);
            }}
          />
        ))}
      </div>
    </fieldset>
  );
}

export function VectorWorkbench() {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("vectors");
  const [dimension, setDimension] = useState<VectorDimension>(2);
  const [vectors, setVectors] = useState<VectorEntry[]>(initialVectors);
  const [operationId, setOperationId] = useState<OperationId>("magnitude");
  const [scalar, setScalar] = useState(2);
  const [alpha, setAlpha] = useState(1);
  const [beta, setBeta] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [editOnGrid, setEditOnGrid] = useState(false);
  const [selectedVectorId, setSelectedVectorId] = useState<string | null>("a");
  const [zoom, setZoom] = useState(1);
  const [cameraView, setCameraView] = useState<VectorCameraView>("isometric");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const aEntry = vectors[0];
  const bEntry = vectors[1];
  const cEntry = vectors[2];
  const a = forDimension(aEntry.value, dimension);
  const b = forDimension(bEntry.value, dimension);
  const c = forDimension(cEntry.value, dimension);

  useEffect(() => {
    const update = () => setIsFullscreen(document.fullscreenElement === workspaceRef.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  const result = useMemo<CalculationResult>(() => {
    const aLatex = latexVector(a, dimension);
    const bLatex = latexVector(b, dimension);
    const vectorResult = (title: string, value: WorkbenchVector, formula: string, explanation: string): CalculationResult => ({
      title,
      value: formatWorkbenchVector(value, dimension),
      vector: forDimension(value, dimension),
      formula,
      explanation,
    });

    if (operationId === "magnitude") {
      const exact = exactMagnitudeLatex(a, dimension);
      return {
        title: "Magnitude of A",
        value: formatNumber(vectorMagnitude(a, dimension)),
        exactLatex: exact,
        formula: `\\[\\lVert\\vec A\\rVert=\\sqrt{${formatNumber(squaredMagnitude(a, dimension))}}=${exact}\\]`,
        explanation: "Square the components, add them, then take the square root. The radical is the exact value.",
      };
    }

    if (operationId === "unit") {
      const output = normalizeVector(a, dimension);
      if (!output) return invalid("A must be non-zero", String.raw`\[\lVert\vec A\rVert\ne0\]`, "A zero vector has no direction, so it cannot be normalized.");
      return vectorResult("Unit vector in the direction of A", output, `\\[\\hat A=\\frac{\\vec A}{\\lVert\\vec A\\rVert}=\\frac{${aLatex}}{${exactMagnitudeLatex(a, dimension)}}\\approx${latexVector(output, dimension)}\\]`, "The direction stays the same while the length becomes 1.");
    }

    if (operationId === "add") {
      const output = addVectors(a, b);
      return vectorResult("A plus B", output, `\\[\\vec A+\\vec B=${aLatex}+${bLatex}=${latexVector(output, dimension)}\\]`, "Add matching components.");
    }

    if (operationId === "subtract") {
      const output = subtractVectors(a, b);
      return vectorResult("A minus B", output, `\\[\\vec A-\\vec B=${aLatex}-${bLatex}=${latexVector(output, dimension)}\\]`, "Subtract matching components in the stated order.");
    }

    if (operationId === "distance") {
      const difference = subtractVectors(a, b);
      const exact = exactMagnitudeLatex(difference, dimension);
      return {
        title: "Distance between endpoints",
        value: formatNumber(vectorMagnitude(difference, dimension)),
        exactLatex: exact,
        formula: `\\[d=\\lVert\\vec A-\\vec B\\rVert=\\sqrt{${formatNumber(squaredMagnitude(difference, dimension))}}=${exact}\\]`,
        explanation: "The displacement from B to A is A minus B. Its magnitude is the endpoint distance.",
      };
    }

    if (operationId === "scale") {
      const output = scaleVector(a, scalar);
      return vectorResult("Scalar multiple", output, `\\[${formatNumber(scalar)}\\vec A=${formatNumber(scalar)}${aLatex}=${latexVector(output, dimension)}\\]`, "Multiply every component by the same scalar.");
    }

    if (operationId === "linear-combination") {
      const output = addVectors(scaleVector(a, alpha), scaleVector(b, beta));
      return vectorResult("Linear combination", output, `\\[${formatNumber(alpha)}\\vec A+${formatNumber(beta)}\\vec B=${latexVector(output, dimension)}\\]`, "The result lies in the span of A and B.");
    }

    if (operationId === "dot") {
      const output = dotVectors(a, b, dimension);
      return { title: "Dot product", value: formatNumber(output), formula: `\\[\\vec A\\cdot\\vec B=${aLatex}\\cdot${bLatex}=${formatNumber(output)}\\]`, explanation: "Multiply matching components, then add the products." };
    }

    if (operationId === "angle") {
      const output = angleBetween(a, b, dimension);
      if (output === null) return invalid("Both vectors must be non-zero", String.raw`\[\lVert\vec A\rVert\lVert\vec B\rVert\ne0\]`, "An angle is not defined when either vector has no direction.");
      return { title: "Angle between A and B", value: `${formatNumber(output)}°`, formula: `\\[\\theta=\\cos^{-1}\\left(\\frac{\\vec A\\cdot\\vec B}{\\lVert\\vec A\\rVert\\lVert\\vec B\\rVert}\\right)\\approx${formatNumber(output)}^{\\circ}\\]`, explanation: "The calculator reports the smaller angle from 0° to 180°." };
    }

    if (operationId === "projection") {
      const output = projectVector(a, b, dimension);
      if (!output) return invalid("B must be non-zero", String.raw`\[\vec B\cdot\vec B\ne0\]`, "The target vector must have a direction.");
      return vectorResult("Projection of A onto B", output, `\\[\\operatorname{proj}_{\\vec B}\\vec A=\\frac{\\vec A\\cdot\\vec B}{\\vec B\\cdot\\vec B}\\vec B=${latexVector(output, dimension)}\\]`, "This is the part of A that points along B.");
    }

    if (operationId === "rejection") {
      const output = rejectVector(a, b, dimension);
      if (!output) return invalid("B must be non-zero", String.raw`\[\vec B\cdot\vec B\ne0\]`, "The target vector must have a direction.");
      return vectorResult("Perpendicular component of A", output, `\\[\\vec A-\\operatorname{proj}_{\\vec B}\\vec A=${latexVector(output, dimension)}\\]`, "This is the part of A perpendicular to B.");
    }

    if (operationId === "relationship") {
      return { title: "Relationship", value: relationship(a, b, dimension), formula: `\\[\\vec A\\cdot\\vec B=${formatNumber(dotVectors(a, b, dimension))}\\]`, explanation: "A zero dot product means perpendicular vectors. A zero determinant or cross product means parallel vectors." };
    }

    if (operationId === "cross") {
      const output = crossVectors(a, b);
      return vectorResult("Cross product", output, `\\[\\vec A\\times\\vec B=${latexVector(output, 3)}\\]`, "The result is perpendicular to both A and B.");
    }

    if (operationId === "area-parallelogram" || operationId === "area-triangle") {
      const areaBase = dimension === 2 ? Math.abs(cross2D(a, b)) : vectorMagnitude(crossVectors(a, b), 3);
      const output = operationId === "area-triangle" ? areaBase / 2 : areaBase;
      const factor = operationId === "area-triangle" ? String.raw`\frac12` : "";
      return { title: operationId === "area-triangle" ? "Triangle area" : "Parallelogram area", value: formatNumber(output), formula: `\\[A=${factor}\\lVert\\vec A\\times\\vec B\\rVert=${formatNumber(output)}\\]`, explanation: operationId === "area-triangle" ? "A triangle uses half the area spanned by A and B." : "The cross-product magnitude equals the area spanned by A and B." };
    }

    const triple = dotVectors(a, crossVectors(b, c), 3);
    if (operationId === "scalar-triple") {
      return { title: "Scalar triple product", value: formatNumber(triple), formula: `\\[\\vec A\\cdot(\\vec B\\times\\vec C)=${formatNumber(triple)}\\]`, explanation: "Its absolute value is the volume of the parallelepiped." };
    }

    const coplanar = Math.abs(triple) < VECTOR_EPSILON;
    return { title: "Coplanarity test", value: coplanar ? "A, B, and C are coplanar" : "A, B, and C are not coplanar", formula: `\\[\\vec A\\cdot(\\vec B\\times\\vec C)=${formatNumber(triple)}\\]`, explanation: "A zero scalar triple product means the three vectors lie in one plane." };
  }, [a, alpha, b, beta, c, dimension, operationId, scalar]);

  const selectedOperation = operations.find((item) => item.id === operationId) ?? operations[0];
  const visibleOperations = operations.filter((item) => dimension === 3 || !item.threeDimensional);
  const operationGroups = Array.from(new Set(visibleOperations.map((item) => item.group)));
  const needsC = operationId === "scalar-triple" || operationId === "coplanarity";
  const needsScalar = operationId === "scale" || operationId === "linear-combination";

  const displayVectors = useMemo<DisplayVector[]>(() => {
    const output: DisplayVector[] = vectors.map((entry) => ({ ...entry, value: forDimension(entry.value, dimension) }));
    if (result.vector) output.push({ id: "result", label: "Result", value: result.vector, color: "#7dd3fc", result: true });
    return output;
  }, [dimension, result.vector, vectors]);

  const updateVector = (id: VectorEntry["id"], value: WorkbenchVector) => {
    setVectors((current) => current.map((entry) => entry.id === id ? { ...entry, value } : entry));
  };

  const reset = () => {
    setVectors(initialVectors);
    setDimension(2);
    setOperationId("magnitude");
    setScalar(2);
    setAlpha(1);
    setBeta(1);
    setSelectedVectorId("a");
    setEditOnGrid(false);
    setZoom(1);
    setCameraView("isometric");
  };

  const applyPreset = (preset: "general" | "perpendicular" | "parallel") => {
    const values: Record<typeof preset, [WorkbenchVector, WorkbenchVector, WorkbenchVector]> = {
      general: dimension === 2 ? [[3, 2, 0], [1, 4, 0], [1, 1, 0]] : [[3, 2, 1], [1, 4, -2], [2, -1, 3]],
      perpendicular: dimension === 2 ? [[3, 2, 0], [-2, 3, 0], [1, 1, 0]] : [[1, 2, 0], [2, -1, 0], [0, 0, 1]],
      parallel: dimension === 2 ? [[2, 1, 0], [6, 3, 0], [1, 1, 0]] : [[1, 2, 3], [2, 4, 6], [0, 1, 0]],
    };
    setVectors((current) => current.map((entry, index) => ({ ...entry, value: values[preset][index] })));
  };

  const placeSelectedVector = (value: WorkbenchVector) => {
    const target = selectedVectorId === "b" || selectedVectorId === "c" ? selectedVectorId : "a";
    updateVector(target, value);
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement === workspaceRef.current) await document.exitFullscreen();
    else await workspaceRef.current?.requestFullscreen();
  };

  return (
    <div ref={workspaceRef} className="visualizer-workspace flex h-[calc(100dvh-4rem)] flex-col overflow-hidden bg-[#0a0a0a] sm:h-[calc(100dvh-4.5rem)]">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0d0d0d] px-3 py-2 sm:px-5">
        <div>
          <h1 className="text-sm font-semibold text-zinc-100 sm:text-base">Vector Calculator</h1>
          <p className="hidden text-[11px] text-zinc-500 sm:block">Choose a task, enter the values, then read the exact result.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-white/12 bg-black/60 p-1" role="group" aria-label="Calculator section">
            <button type="button" onClick={() => setWorkspaceMode("vectors")} aria-pressed={workspaceMode === "vectors"} className={`min-h-8 px-3 text-[11px] font-semibold ${workspaceMode === "vectors" ? "bg-sky-400/15 text-sky-200" : "text-zinc-400"}`}>Vectors</button>
            <button type="button" onClick={() => setWorkspaceMode("geometry")} aria-pressed={workspaceMode === "geometry"} className={`min-h-8 px-3 text-[11px] font-semibold ${workspaceMode === "geometry" ? "bg-sky-400/15 text-sky-200" : "text-zinc-400"}`}>Lines and planes</button>
          </div>
          <button type="button" onClick={reset} className="visualizer-toolbar-button">Reset</button>
          <button type="button" onClick={() => void toggleFullscreen()} className="visualizer-toolbar-button">{isFullscreen ? "Exit full screen" : "Full screen"}</button>
        </div>
      </header>

      {workspaceMode === "geometry" ? (
        <div className="visualizer-control-scroll min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="mx-auto max-w-6xl"><VectorCalculator /></div>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[390px_minmax(0,1fr)] lg:overflow-hidden">
          <aside className="visualizer-control-scroll border-b border-white/10 bg-[#101010] p-4 lg:overflow-y-auto lg:border-b-0 lg:border-r sm:p-5" aria-label="Vector calculator inputs">
            <section>
              <div className="flex items-end justify-between gap-4">
                <div><p className="micro-label text-sky-300">Step 1</p><h2 className="mt-2 text-lg font-semibold">Choose the dimension</h2></div>
                <div className="flex border border-white/12 bg-[#0b0b0b] p-1">
                  {([2, 3] as VectorDimension[]).map((item) => <button key={item} type="button" onClick={() => { setDimension(item); if (item === 2 && selectedOperation.threeDimensional) setOperationId("magnitude"); }} aria-pressed={dimension === item} className={`min-h-8 px-4 text-xs font-semibold ${dimension === item ? "bg-sky-400/15 text-sky-200" : "text-zinc-500"}`}>{item}D</button>)}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {(["general", "perpendicular", "parallel"] as const).map((preset) => <button key={preset} type="button" onClick={() => applyPreset(preset)} className="min-h-10 border border-white/10 bg-[#0b0b0b] px-2 text-[11px] font-semibold capitalize text-zinc-400 hover:border-sky-400/35 hover:text-zinc-100">{preset}</button>)}
              </div>
            </section>

            <section className="mt-7 border-t border-white/10 pt-6">
              <p className="micro-label text-sky-300">Step 2</p>
              <h2 className="mt-2 text-lg font-semibold">Enter the vectors</h2>
              <div className="mt-4 space-y-3">
                <VectorInput entry={aEntry} dimension={dimension} onChange={(value) => updateVector("a", value)} />
                <VectorInput entry={bEntry} dimension={dimension} onChange={(value) => updateVector("b", value)} />
                {(needsC || dimension === 3) && <VectorInput entry={cEntry} dimension={dimension} onChange={(value) => updateVector("c", value)} />}
              </div>
            </section>

            <section className="mt-7 border-t border-white/10 pt-6">
              <p className="micro-label text-sky-300">Step 3</p>
              <label className="mt-2 block text-lg font-semibold" htmlFor="vector-operation">Choose the calculation</label>
              <select id="vector-operation" value={operationId} onChange={(event) => setOperationId(event.target.value as OperationId)} className="field-control mt-4 min-h-12 text-sm">
                {operationGroups.map((group) => <optgroup key={group} label={group}>{visibleOperations.filter((item) => item.group === group).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</optgroup>)}
              </select>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{selectedOperation.description}</p>

              {needsScalar && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {operationId === "scale" ? <NumberStepper label="Scalar k" value={scalar} onChange={setScalar} /> : <><NumberStepper compact label="Alpha" value={alpha} onChange={setAlpha} /><NumberStepper compact label="Beta" value={beta} onChange={setBeta} /></>}
                </div>
              )}
            </section>

            <section className="mt-7 border border-sky-400/25 bg-sky-400/[0.045] p-5" aria-live="polite">
              <p className="micro-label text-sky-300">Result</p>
              <h2 className={`mt-3 text-xl font-semibold ${result.invalid ? "text-zinc-400" : "text-zinc-100"}`}>{result.title}</h2>
              {result.exactLatex ? (
                <div className="mt-4"><MathJaxRenderer math={`\\[${result.exactLatex}\\]`} className="text-3xl text-sky-200" /><p className="mt-2 text-xs text-zinc-500">Approximate value: {result.value}</p></div>
              ) : <p className="mt-4 break-words font-mono text-lg font-semibold text-sky-200">{result.value}</p>}
              <MathJaxRenderer math={result.formula} className="mt-4 overflow-x-auto text-sm text-zinc-200" />
              <p className="mt-3 text-xs leading-6 text-zinc-400">{result.explanation}</p>
            </section>

            <details className="mt-5 border border-white/10 bg-[#0b0b0b] p-4">
              <summary className="cursor-pointer text-sm font-semibold text-zinc-300">Display options</summary>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {[{ label: "Grid", value: showGrid, set: setShowGrid }, { label: "Grid numbers", value: showNumbers, set: setShowNumbers }, { label: "Vector labels", value: showLabels, set: setShowLabels }].map((item) => (
                  <label key={item.label} className="flex min-h-10 items-center gap-2 border border-white/10 px-3 text-zinc-400"><input type="checkbox" checked={item.value} onChange={(event) => item.set(event.target.checked)} className="accent-sky-400" />{item.label}</label>
                ))}
                {dimension === 2 && <label className="flex min-h-10 items-center gap-2 border border-white/10 px-3 text-zinc-400"><input type="checkbox" checked={editOnGrid} onChange={(event) => setEditOnGrid(event.target.checked)} className="accent-sky-400" />Edit selected vector on grid</label>}
              </div>
            </details>
          </aside>

          <section className="relative min-h-[500px] bg-[#0b0b0b] lg:min-h-0" aria-label="Vector graph">
            <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
              {dimension === 2 ? (
                <div className="flex border border-white/12 bg-black/90 p-1 backdrop-blur">
                  <button type="button" onClick={() => setZoom((current) => Math.max(0.5, current - 0.25))} className="min-h-8 px-3 text-[10px] font-semibold text-zinc-300">Zoom out</button>
                  <span className="grid min-w-12 place-items-center border-x border-white/10 px-2 font-mono text-[10px] text-zinc-400">{Math.round(zoom * 100)}%</span>
                  <button type="button" onClick={() => setZoom((current) => Math.min(3, current + 0.25))} className="min-h-8 px-3 text-[10px] font-semibold text-zinc-300">Zoom in</button>
                </div>
              ) : (
                <div className="flex border border-white/12 bg-black/90 p-1 backdrop-blur">{cameras.map((camera) => <button key={camera.id} type="button" onClick={() => setCameraView(camera.id)} aria-pressed={cameraView === camera.id} className={`min-h-8 px-2.5 text-[10px] font-semibold ${cameraView === camera.id ? "bg-sky-400/15 text-sky-200" : "text-zinc-400"}`}>{camera.label}</button>)}</div>
              )}
            </div>

            {dimension === 2 ? (
              <VectorCanvas2D vectors={displayVectors} selectedId={selectedVectorId} showGrid={showGrid} showNumbers={showNumbers} showLabels={showLabels} editMode={editOnGrid} zoom={zoom} onPlaceVector={placeSelectedVector} onSelectVector={setSelectedVectorId} />
            ) : (
              <VectorCanvas3D vectors={displayVectors} selectedId={selectedVectorId} cameraView={cameraView} showGrid={showGrid} showNumbers={showNumbers} showLabels={showLabels} onSelectVector={setSelectedVectorId} />
            )}

            <div className="pointer-events-none absolute bottom-3 right-3 border border-white/10 bg-black/85 px-3 py-2 text-[10px] text-zinc-400 backdrop-blur">Select a vector to inspect it. In 2D, enable grid editing to place its endpoint.</div>
          </section>
        </div>
      )}
    </div>
  );
}
