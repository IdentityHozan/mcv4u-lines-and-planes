"use client";

import { AnimatePresence, motion } from "framer-motion";
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
  componentProduct,
  componentQuotient,
  cross2D,
  crossVectors,
  directionAngles,
  dotVectors,
  forDimension,
  formatNumber,
  formatWorkbenchVector,
  normalizeVector,
  projectVector,
  reflectVector,
  rejectVector,
  relationship,
  rotate2D,
  rotate3D,
  scaleVector,
  subtractVectors,
  vectorMagnitude,
  type RotationAxis,
  type VectorDimension,
  type WorkbenchVector,
} from "./vectorMath";

type WorkspaceMode = "vectors" | "geometry";
type ControlPanel = "vectors" | "operations" | "transform" | "analysis";
type OperationId =
  | "add"
  | "subtract"
  | "reverse-subtract"
  | "dot"
  | "cross"
  | "magnitude-a"
  | "magnitude-b"
  | "normalize-a"
  | "distance"
  | "angle"
  | "projection-a-on-b"
  | "projection-b-on-a"
  | "rejection-a-from-b"
  | "scalar-projection"
  | "area-parallelogram"
  | "area-triangle"
  | "relationship"
  | "component-product"
  | "component-quotient"
  | "scalar-multiple"
  | "linear-combination"
  | "midpoint"
  | "rotate"
  | "reflect"
  | "scalar-triple"
  | "vector-triple"
  | "coplanarity"
  | "direction-angles";

type VectorEntry = Omit<DisplayVector, "result">;

type CalculationResult = {
  title: string;
  value: string;
  formula: string;
  detail?: string;
  vector?: WorkbenchVector;
  invalid?: boolean;
};

const vectorColors = ["#38bdf8", "#f5f5f5", "#a1a1aa", "#7dd3fc", "#d4d4d8", "#71717a"];
const vectorLabels = ["A", "B", "C", "D", "E", "F"];

const initialVectors: VectorEntry[] = [
  { id: "vector-a", label: "A", value: [3, 2, 0], color: vectorColors[0] },
  { id: "vector-b", label: "B", value: [1, 4, 0], color: vectorColors[1] },
  { id: "vector-c", label: "C", value: [2, -2, 1], color: vectorColors[2] },
];

const cameraViews: Array<{ id: VectorCameraView; label: string }> = [
  { id: "isometric", label: "Isometric" },
  { id: "front", label: "Front" },
  { id: "side", label: "Side" },
  { id: "top", label: "Top" },
];

const panels: Array<{ id: ControlPanel; label: string }> = [
  { id: "vectors", label: "Vectors" },
  { id: "operations", label: "Calculate" },
  { id: "transform", label: "Transform" },
  { id: "analysis", label: "Analysis" },
];

const presets: Array<{ name: string; dimension: VectorDimension; values: WorkbenchVector[] }> = [
  { name: "2D general", dimension: 2, values: [[3, 2, 0], [1, 4, 0], [2, -2, 0]] },
  { name: "Perpendicular", dimension: 2, values: [[3, 2, 0], [-2, 3, 0], [1, 1, 0]] },
  { name: "Parallel", dimension: 2, values: [[2, 1, 0], [6, 3, 0], [-2, -1, 0]] },
  { name: "3D general", dimension: 3, values: [[3, 2, 1], [1, 4, -2], [2, -1, 3]] },
  { name: "3D basis", dimension: 3, values: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] },
  { name: "Coplanar", dimension: 3, values: [[1, 2, 0], [2, -1, 1], [3, 1, 1]] },
];

const operationGroups: Array<{ title: string; operations: Array<{ id: OperationId; label: string }> }> = [
  {
    title: "Core operations",
    operations: [
      { id: "add", label: "Add" },
      { id: "subtract", label: "First minus second" },
      { id: "reverse-subtract", label: "Second minus first" },
      { id: "dot", label: "Dot product" },
      { id: "cross", label: "Cross product" },
      { id: "magnitude-a", label: "First magnitude" },
      { id: "magnitude-b", label: "Second magnitude" },
      { id: "normalize-a", label: "Unit vector" },
      { id: "distance", label: "Endpoint distance" },
      { id: "angle", label: "Angle between" },
      { id: "midpoint", label: "Endpoint midpoint" },
    ],
  },
  {
    title: "Projection and geometry",
    operations: [
      { id: "projection-a-on-b", label: "Project first onto second" },
      { id: "projection-b-on-a", label: "Project second onto first" },
      { id: "rejection-a-from-b", label: "Reject first from second" },
      { id: "scalar-projection", label: "Scalar projection" },
      { id: "area-parallelogram", label: "Parallelogram area" },
      { id: "area-triangle", label: "Triangle area" },
      { id: "relationship", label: "Vector relationship" },
    ],
  },
  {
    title: "Component operations",
    operations: [
      { id: "component-product", label: "Component product" },
      { id: "component-quotient", label: "Component quotient" },
    ],
  },
];

const threeDimensionalOperations = new Set<OperationId>(["scalar-triple", "vector-triple", "coplanarity", "direction-angles"]);

function latexVector(vector: WorkbenchVector, dimension: VectorDimension) {
  const values = dimension === 2 ? vector.slice(0, 2) : vector;
  return `\\langle ${values.map(formatNumber).join(", ")}\\rangle`;
}

function vectorResult(title: string, vector: WorkbenchVector, dimension: VectorDimension, formula: string, detail?: string): CalculationResult {
  return { title, vector: forDimension(vector, dimension), value: formatWorkbenchVector(vector, dimension), formula, detail };
}

function scalarResult(title: string, value: number, formula: string, detail?: string): CalculationResult {
  return { title, value: formatNumber(value), formula, detail };
}

function invalidResult(title: string, formula: string): CalculationResult {
  return { title, value: "Not defined", formula, invalid: true };
}

function VectorEditor({
  vector,
  dimension,
  active,
  canRemove,
  onActivate,
  onChange,
  onRemove,
}: {
  vector: VectorEntry;
  dimension: VectorDimension;
  active: boolean;
  canRemove: boolean;
  onActivate: () => void;
  onChange: (value: WorkbenchVector) => void;
  onRemove: () => void;
}) {
  const axes = dimension === 2 ? ["X", "Y"] : ["X", "Y", "Z"];
  return (
    <div className={`border p-3 transition ${active ? "border-sky-400/45 bg-sky-400/[0.06]" : "border-white/10 bg-[#0b0b0b]"}`}>
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={onActivate} className="flex min-h-8 flex-1 items-center gap-2 text-left">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: vector.color }} />
          <span className="text-xs font-semibold text-zinc-100">Vector {vector.label}</span>
          <span className="ml-auto font-mono text-[10px] text-zinc-400">{formatWorkbenchVector(vector.value, dimension)}</span>
        </button>
        {canRemove && (
          <button type="button" onClick={onRemove} className="min-h-8 px-2 text-[10px] font-semibold text-zinc-500 hover:text-zinc-100">
            Remove
          </button>
        )}
      </div>
      {active && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`mt-3 grid gap-2 ${dimension === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {axes.map((axis, index) => (
            <NumberStepper
              key={axis}
              compact
              label={axis}
              value={vector.value[index]}
              step={0.5}
              onChange={(nextValue) => {
                const next = [...vector.value] as WorkbenchVector;
                next[index] = nextValue;
                onChange(next);
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 border border-white/10 bg-[#0b0b0b] px-3 text-[11px] font-semibold text-zinc-300 hover:border-white/25">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-sky-400" />
      {label}
    </label>
  );
}

function OperandSelectors({
  vectors,
  firstId,
  secondId,
  onFirstChange,
  onSecondChange,
}: {
  vectors: VectorEntry[];
  firstId: string;
  secondId: string;
  onFirstChange: (id: string) => void;
  onSecondChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <label>
        <span className="mb-1.5 block text-[11px] font-semibold text-zinc-400">First vector</span>
        <select value={firstId} onChange={(event) => onFirstChange(event.target.value)} className="field-control min-h-10 py-2 text-xs">
          {vectors.map((vector) => <option key={vector.id} value={vector.id}>Vector {vector.label}</option>)}
        </select>
      </label>
      <label>
        <span className="mb-1.5 block text-[11px] font-semibold text-zinc-400">Second vector</span>
        <select value={secondId} onChange={(event) => onSecondChange(event.target.value)} className="field-control min-h-10 py-2 text-xs">
          {vectors.map((vector) => <option key={vector.id} value={vector.id}>Vector {vector.label}</option>)}
        </select>
      </label>
    </div>
  );
}

function OperationButton({ id, label, activeId, onSelect }: { id: OperationId; label: string; activeId: OperationId; onSelect: (id: OperationId) => void }) {
  const active = id === activeId;
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-pressed={active}
      className={`min-h-11 border px-3 py-2 text-left text-[11px] font-semibold transition ${
        active
          ? "border-sky-400/50 bg-sky-400/[0.09] text-sky-100"
          : "border-white/10 bg-[#0b0b0b] text-zinc-300 hover:border-white/25 hover:text-zinc-100"
      }`}
    >
      {label}
    </button>
  );
}

export function VectorWorkbench() {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("vectors");
  const [dimension, setDimension] = useState<VectorDimension>(2);
  const [vectors, setVectors] = useState<VectorEntry[]>(initialVectors);
  const [firstId, setFirstId] = useState(initialVectors[0].id);
  const [secondId, setSecondId] = useState(initialVectors[1].id);
  const [thirdId, setThirdId] = useState(initialVectors[2].id);
  const [activeVectorId, setActiveVectorId] = useState(initialVectors[0].id);
  const [selectedVectorId, setSelectedVectorId] = useState<string | null>(initialVectors[0].id);
  const [operationId, setOperationId] = useState<OperationId>("add");
  const [activePanel, setActivePanel] = useState<ControlPanel>("vectors");
  const [controlsOpen, setControlsOpen] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [editOnGrid, setEditOnGrid] = useState(false);
  const [zoom2D, setZoom2D] = useState(1);
  const [cameraView, setCameraView] = useState<VectorCameraView>("isometric");
  const [scalar, setScalar] = useState(2);
  const [alpha, setAlpha] = useState(1);
  const [beta, setBeta] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(45);
  const [rotationAxis, setRotationAxis] = useState<RotationAxis>("z");
  const [reflection, setReflection] = useState<"x-axis" | "y-axis" | "xy" | "xz" | "yz">("x-axis");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    const updateFullscreenState = () => setIsFullscreen(document.fullscreenElement === workspaceRef.current);
    document.addEventListener("fullscreenchange", updateFullscreenState);
    return () => document.removeEventListener("fullscreenchange", updateFullscreenState);
  }, []);

  useEffect(() => {
    if (!copyStatus) return;
    const timer = window.setTimeout(() => setCopyStatus(""), 1800);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  const firstEntry = vectors.find((vector) => vector.id === firstId) ?? vectors[0];
  const secondEntry = vectors.find((vector) => vector.id === secondId) ?? vectors[Math.min(1, vectors.length - 1)];
  const thirdEntry = vectors.find((vector) => vector.id === thirdId) ?? vectors[Math.min(2, vectors.length - 1)] ?? vectors[0];
  const first = forDimension(firstEntry.value, dimension);
  const second = forDimension(secondEntry.value, dimension);
  const third = forDimension(thirdEntry.value, dimension);

  const result = useMemo<CalculationResult>(() => {
    const firstLatex = latexVector(first, dimension);
    const secondLatex = latexVector(second, dimension);
    const firstName = `\\vec ${firstEntry.label}`;
    const secondName = `\\vec ${secondEntry.label}`;
    const thirdName = `\\vec ${thirdEntry.label}`;

    if (operationId === "add") {
      const output = addVectors(first, second);
      return vectorResult("Vector sum", output, dimension, `\\[${firstName}+${secondName}=${firstLatex}+${secondLatex}=${latexVector(output, dimension)}\\]`);
    }
    if (operationId === "subtract") {
      const output = subtractVectors(first, second);
      return vectorResult("Vector difference", output, dimension, `\\[${firstName}-${secondName}=${firstLatex}-${secondLatex}=${latexVector(output, dimension)}\\]`);
    }
    if (operationId === "reverse-subtract") {
      const output = subtractVectors(second, first);
      return vectorResult("Reverse vector difference", output, dimension, `\\[${secondName}-${firstName}=${secondLatex}-${firstLatex}=${latexVector(output, dimension)}\\]`);
    }
    if (operationId === "dot") {
      const output = dotVectors(first, second, dimension);
      return scalarResult("Dot product", output, `\\[${firstName}\\cdot${secondName}=${firstLatex}\\cdot${secondLatex}=${formatNumber(output)}\\]`);
    }
    if (operationId === "cross") {
      if (dimension === 2) {
        const output = cross2D(first, second);
        return scalarResult("2D determinant", output, `\\[${firstEntry.label}_x${secondEntry.label}_y-${firstEntry.label}_y${secondEntry.label}_x=${formatNumber(first[0])}(${formatNumber(second[1])})-${formatNumber(first[1])}(${formatNumber(second[0])})=${formatNumber(output)}\\]`, "The absolute value is the parallelogram area.");
      }
      const output = crossVectors(first, second);
      return vectorResult("Cross product", output, 3, `\\[${firstName}\\times${secondName}=${firstLatex}\\times${secondLatex}=${latexVector(output, 3)}\\]`);
    }
    if (operationId === "magnitude-a" || operationId === "magnitude-b") {
      const source = operationId === "magnitude-a" ? first : second;
      const sourceName = operationId === "magnitude-a" ? firstName : secondName;
      const sourceLatex = operationId === "magnitude-a" ? firstLatex : secondLatex;
      const output = vectorMagnitude(source, dimension);
      return scalarResult("Vector magnitude", output, `\\[\\lVert${sourceName}\\rVert=\\sqrt{${sourceLatex}\\cdot${sourceLatex}}=${formatNumber(output)}\\]`);
    }
    if (operationId === "normalize-a") {
      const output = normalizeVector(first, dimension);
      if (!output) return invalidResult("Unit vector requires a non-zero vector", `\\[\\lVert${firstName}\\rVert\\ne0\\]`);
      return vectorResult("Unit vector", output, dimension, `\\[\\hat ${firstEntry.label}=\\frac{${firstName}}{\\lVert${firstName}\\rVert}=${latexVector(output, dimension)}\\]`);
    }
    if (operationId === "distance") {
      const difference = subtractVectors(first, second);
      const output = vectorMagnitude(difference, dimension);
      return scalarResult("Endpoint distance", output, `\\[d=\\lVert${firstName}-${secondName}\\rVert=\\lVert${latexVector(difference, dimension)}\\rVert=${formatNumber(output)}\\]`, "Distance between the two vector endpoints.");
    }
    if (operationId === "angle") {
      const output = angleBetween(first, second, dimension);
      if (output === null) return invalidResult("Angle requires two non-zero vectors", `\\[\\lVert${firstName}\\rVert\\lVert${secondName}\\rVert\\ne0\\]`);
      return scalarResult("Angle between vectors", output, `\\[\\theta=\\cos^{-1}\\left(\\frac{${firstName}\\cdot${secondName}}{\\lVert${firstName}\\rVert\\lVert${secondName}\\rVert}\\right)=${formatNumber(output)}^{\\circ}\\]`);
    }
    if (operationId === "midpoint") {
      const output = scaleVector(addVectors(first, second), 0.5);
      return vectorResult("Endpoint midpoint", output, dimension, `\\[M=\\frac{${firstName}+${secondName}}{2}=${latexVector(output, dimension)}\\]`);
    }
    if (operationId === "projection-a-on-b" || operationId === "projection-b-on-a") {
      const source = operationId === "projection-a-on-b" ? first : second;
      const onto = operationId === "projection-a-on-b" ? second : first;
      const sourceName = operationId === "projection-a-on-b" ? firstName : secondName;
      const ontoName = operationId === "projection-a-on-b" ? secondName : firstName;
      const output = projectVector(source, onto, dimension);
      if (!output) return invalidResult("Projection requires a non-zero target vector", `\\[${ontoName}\\cdot${ontoName}\\ne0\\]`);
      return vectorResult("Vector projection", output, dimension, `\\[\\operatorname{proj}_{${ontoName}}${sourceName}=\\frac{${sourceName}\\cdot${ontoName}}{${ontoName}\\cdot${ontoName}}${ontoName}=${latexVector(output, dimension)}\\]`);
    }
    if (operationId === "rejection-a-from-b") {
      const output = rejectVector(first, second, dimension);
      if (!output) return invalidResult("Rejection requires a non-zero second vector", `\\[${secondName}\\cdot${secondName}\\ne0\\]`);
      return vectorResult("Vector rejection", output, dimension, `\\[\\operatorname{rej}_{${secondName}}${firstName}=${firstName}-\\operatorname{proj}_{${secondName}}${firstName}=${latexVector(output, dimension)}\\]`);
    }
    if (operationId === "scalar-projection") {
      const denominator = vectorMagnitude(second, dimension);
      if (denominator < VECTOR_EPSILON) return invalidResult("Scalar projection requires a non-zero second vector", `\\[\\lVert${secondName}\\rVert\\ne0\\]`);
      const output = dotVectors(first, second, dimension) / denominator;
      return scalarResult("Scalar projection", output, `\\[\\operatorname{comp}_{${secondName}}${firstName}=\\frac{${firstName}\\cdot${secondName}}{\\lVert${secondName}\\rVert}=${formatNumber(output)}\\]`);
    }
    if (operationId === "area-parallelogram" || operationId === "area-triangle") {
      const crossMagnitude = dimension === 2 ? Math.abs(cross2D(first, second)) : vectorMagnitude(crossVectors(first, second), 3);
      const output = operationId === "area-triangle" ? crossMagnitude / 2 : crossMagnitude;
      const factor = operationId === "area-triangle" ? "\\frac12" : "";
      return scalarResult(operationId === "area-triangle" ? "Triangle area" : "Parallelogram area", output, `\\[A=${factor}\\lVert${firstName}\\times${secondName}\\rVert=${formatNumber(output)}\\]`);
    }
    if (operationId === "relationship") {
      const output = relationship(first, second, dimension);
      return { title: "Vector relationship", value: output, formula: `\\[${firstName}\\cdot${secondName}=${formatNumber(dotVectors(first, second, dimension))}\\]` };
    }
    if (operationId === "component-product") {
      const output = componentProduct(first, second, dimension);
      return vectorResult("Component product", output, dimension, `\\[${firstName}\\odot${secondName}=${latexVector(output, dimension)}\\]`);
    }
    if (operationId === "component-quotient") {
      const output = componentQuotient(first, second, dimension);
      if (!output) return invalidResult("Every divisor component must be non-zero", `\\[${secondEntry.label}_i\\ne0\\]`);
      return vectorResult("Component quotient", output, dimension, `\\[${firstName}\\oslash${secondName}=${latexVector(output, dimension)}\\]`);
    }
    if (operationId === "scalar-multiple") {
      const output = scaleVector(first, scalar);
      return vectorResult("Scalar multiple", output, dimension, `\\[${formatNumber(scalar)}${firstName}=${formatNumber(scalar)}${firstLatex}=${latexVector(output, dimension)}\\]`);
    }
    if (operationId === "linear-combination") {
      const output = addVectors(scaleVector(first, alpha), scaleVector(second, beta));
      return vectorResult("Linear combination", output, dimension, `\\[${formatNumber(alpha)}${firstName}+${formatNumber(beta)}${secondName}=${latexVector(output, dimension)}\\]`);
    }
    if (operationId === "rotate") {
      const output = dimension === 2 ? rotate2D(first, rotationAngle) : rotate3D(first, rotationAngle, rotationAxis);
      const axisText = dimension === 2 ? "" : `\\text{ about the ${rotationAxis}-axis}`;
      return vectorResult("Rotated vector", output, dimension, `\\[R(${formatNumber(rotationAngle)}^{\\circ})${firstName}=${latexVector(output, dimension)}${axisText}\\]`);
    }
    if (operationId === "reflect") {
      const output = reflectVector(first, reflection);
      const planeText = reflection.replace("-axis", "\\text{-axis}");
      return vectorResult("Reflected vector", output, dimension, `\\[\\operatorname{Ref}_{${planeText}}(${firstName})=${latexVector(output, dimension)}\\]`);
    }
    if (operationId === "scalar-triple") {
      const output = dotVectors(first, crossVectors(second, third), 3);
      return scalarResult("Scalar triple product", output, `\\[${firstName}\\cdot(${secondName}\\times${thirdName})=${formatNumber(output)}\\]`, "The absolute value is the parallelepiped volume.");
    }
    if (operationId === "vector-triple") {
      const output = crossVectors(first, crossVectors(second, third));
      return vectorResult("Vector triple product", output, 3, `\\[${firstName}\\times(${secondName}\\times${thirdName})=${latexVector(output, 3)}\\]`);
    }
    if (operationId === "coplanarity") {
      const triple = dotVectors(first, crossVectors(second, third), 3);
      const coplanar = Math.abs(triple) < VECTOR_EPSILON;
      return { title: "Coplanarity test", value: coplanar ? "The vectors are coplanar." : "The vectors are not coplanar.", formula: `\\[${firstName}\\cdot(${secondName}\\times${thirdName})=${formatNumber(triple)}\\]` };
    }
    const angles = directionAngles(first);
    if (!angles) return invalidResult("Direction angles require a non-zero vector", `\\[\\lVert${firstName}\\rVert\\ne0\\]`);
    return {
      title: "Direction angles",
      value: `alpha ${formatNumber(angles[0])}°, beta ${formatNumber(angles[1])}°, gamma ${formatNumber(angles[2])}°`,
      formula: `\\[\\alpha=${formatNumber(angles[0])}^{\\circ},\\quad\\beta=${formatNumber(angles[1])}^{\\circ},\\quad\\gamma=${formatNumber(angles[2])}^{\\circ}\\]`,
    };
  }, [alpha, beta, dimension, first, firstEntry.label, operationId, reflection, rotationAngle, rotationAxis, scalar, second, secondEntry.label, third, thirdEntry.label]);

  const displayVectors = useMemo<DisplayVector[]>(() => {
    const base = vectors.map((vector) => ({ ...vector, value: forDimension(vector.value, dimension) }));
    if (!result.vector) return base;
    return [...base, { id: "calculation-result", label: "Result", value: result.vector, color: "#bae6fd", result: true }];
  }, [dimension, result.vector, vectors]);

  const selectedVector = displayVectors.find((vector) => vector.id === selectedVectorId) ?? null;

  const updateVector = (id: string, value: WorkbenchVector) => {
    setVectors((current) => current.map((vector) => vector.id === id ? { ...vector, value } : vector));
  };

  const removeVector = (id: string) => {
    setVectors((current) => {
      if (current.length <= 2) return current;
      const remaining = current.filter((vector) => vector.id !== id);
      const fallbackFirst = remaining[0].id;
      const fallbackSecond = remaining[Math.min(1, remaining.length - 1)].id;
      const fallbackThird = remaining[Math.min(2, remaining.length - 1)].id;
      setFirstId((currentId) => currentId === id ? fallbackFirst : currentId);
      setSecondId((currentId) => currentId === id ? fallbackSecond : currentId);
      setThirdId((currentId) => currentId === id ? fallbackThird : currentId);
      setActiveVectorId((currentId) => currentId === id ? fallbackFirst : currentId);
      setSelectedVectorId((currentId) => currentId === id ? fallbackFirst : currentId);
      return remaining;
    });
  };

  const addVector = () => {
    if (vectors.length >= vectorLabels.length) return;
    const index = vectorLabels.findIndex((label) => !vectors.some((vector) => vector.label === label));
    if (index < 0) return;
    const next: VectorEntry = {
      id: `vector-${vectorLabels[index].toLowerCase()}`,
      label: vectorLabels[index],
      value: dimension === 2 ? [1, 1, 0] : [1, 1, 1],
      color: vectorColors[index],
    };
    setVectors((current) => [...current, next]);
    setActiveVectorId(next.id);
    setSelectedVectorId(next.id);
  };

  const applyPreset = (preset: (typeof presets)[number]) => {
    const next = preset.values.map((value, index) => ({
      id: `vector-${vectorLabels[index].toLowerCase()}`,
      label: vectorLabels[index],
      value,
      color: vectorColors[index],
    }));
    setVectors(next);
    setDimension(preset.dimension);
    setFirstId(next[0].id);
    setSecondId(next[1].id);
    setThirdId(next[2].id);
    setActiveVectorId(next[0].id);
    setSelectedVectorId(next[0].id);
    setOperationId("add");
    setEditOnGrid(false);
    setZoom2D(1);
    setReflection(preset.dimension === 2 ? "x-axis" : "xy");
  };

  const changeDimension = (nextDimension: VectorDimension) => {
    setDimension(nextDimension);
    setEditOnGrid(false);
    setZoom2D(1);
    if (nextDimension === 3 && (reflection === "x-axis" || reflection === "y-axis")) setReflection("xy");
    if (nextDimension === 2 && (reflection === "xy" || reflection === "xz" || reflection === "yz")) setReflection("x-axis");
    if (nextDimension === 2 && threeDimensionalOperations.has(operationId)) setOperationId("add");
  };

  const reset = () => {
    setDimension(2);
    setVectors(initialVectors);
    setFirstId(initialVectors[0].id);
    setSecondId(initialVectors[1].id);
    setThirdId(initialVectors[2].id);
    setActiveVectorId(initialVectors[0].id);
    setSelectedVectorId(initialVectors[0].id);
    setOperationId("add");
    setActivePanel("vectors");
    setShowGrid(true);
    setShowNumbers(true);
    setShowLabels(true);
    setEditOnGrid(false);
    setZoom2D(1);
    setCameraView("isometric");
    setScalar(2);
    setAlpha(1);
    setBeta(1);
    setRotationAngle(45);
    setRotationAxis("z");
    setReflection("x-axis");
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === workspaceRef.current) await document.exitFullscreen();
      else await workspaceRef.current?.requestFullscreen();
    } catch {
      setCopyStatus("Full screen is unavailable");
    }
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(`${result.title}: ${result.value}`);
      setCopyStatus("Result copied");
    } catch {
      setCopyStatus("Copy is unavailable");
    }
  };

  const selectVector = (id: string) => {
    setSelectedVectorId(id);
    if (id !== "calculation-result") setActiveVectorId(id);
  };

  const placeActiveVector = (value: WorkbenchVector) => {
    updateVector(activeVectorId, value);
    setSelectedVectorId(activeVectorId);
  };

  return (
    <div ref={workspaceRef} className="visualizer-workspace flex h-[calc(100dvh-4rem)] flex-col overflow-hidden bg-[#0a0a0a] sm:h-[calc(100dvh-4.5rem)]">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#0d0d0d] px-3 py-2 sm:px-5">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-zinc-100 sm:text-base">Vector Workbench</h1>
          <p className="hidden truncate text-[11px] text-zinc-400 sm:block" role="status">{copyStatus || result.title}</p>
        </div>
        <div className="hidden min-w-0 items-center gap-1 border border-white/10 bg-[#090909] p-1 md:flex" role="group" aria-label="Calculator section">
          <button type="button" onClick={() => setWorkspaceMode("vectors")} aria-pressed={workspaceMode === "vectors"} className={`min-h-8 px-3 text-[11px] font-semibold ${workspaceMode === "vectors" ? "bg-sky-400/12 text-sky-200" : "text-zinc-400 hover:text-zinc-100"}`}>Vector operations</button>
          <button type="button" onClick={() => setWorkspaceMode("geometry")} aria-pressed={workspaceMode === "geometry"} className={`min-h-8 px-3 text-[11px] font-semibold ${workspaceMode === "geometry" ? "bg-sky-400/12 text-sky-200" : "text-zinc-400 hover:text-zinc-100"}`}>Lines and planes</button>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {workspaceMode === "vectors" && <button type="button" onClick={reset} className="visualizer-toolbar-button">Reset</button>}
          <button type="button" onClick={() => void toggleFullscreen()} className="visualizer-toolbar-button">{isFullscreen ? "Exit full screen" : "Full screen"}</button>
          {workspaceMode === "vectors" && (
            <button type="button" onClick={() => setControlsOpen((current) => !current)} className="visualizer-toolbar-button border-sky-400/30 text-sky-200" aria-expanded={controlsOpen} aria-controls="vector-workbench-controls">
              {controlsOpen ? "Hide panel" : "Show panel"}
            </button>
          )}
        </div>
      </header>

      <div className="grid shrink-0 grid-cols-2 border-b border-white/10 bg-[#0b0b0b] md:hidden" role="group" aria-label="Calculator section">
        <button type="button" onClick={() => setWorkspaceMode("vectors")} aria-pressed={workspaceMode === "vectors"} className={`min-h-10 text-xs font-semibold ${workspaceMode === "vectors" ? "bg-sky-400/[0.09] text-sky-200" : "text-zinc-400"}`}>Vector operations</button>
        <button type="button" onClick={() => setWorkspaceMode("geometry")} aria-pressed={workspaceMode === "geometry"} className={`min-h-10 border-l border-white/10 text-xs font-semibold ${workspaceMode === "geometry" ? "bg-sky-400/[0.09] text-sky-200" : "text-zinc-400"}`}>Lines and planes</button>
      </div>

      {workspaceMode === "geometry" ? (
        <div className="visualizer-control-scroll min-h-0 flex-1 overflow-y-auto bg-[#0a0a0a] p-3 sm:p-6">
          <div className="mx-auto max-w-6xl"><VectorCalculator /></div>
        </div>
      ) : (
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <AnimatePresence initial={false}>
            {controlsOpen && (
              <>
                <motion.button type="button" aria-label="Close vector controls" onClick={() => setControlsOpen(false)} className="absolute inset-0 z-20 bg-black/55 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                <motion.aside
                  id="vector-workbench-controls"
                  className="visualizer-control-scroll absolute inset-y-0 left-0 z-30 w-[min(94vw,430px)] shrink-0 overflow-y-auto border-r border-white/10 bg-[#101010] shadow-[24px_0_70px_rgba(0,0,0,0.55)] lg:static lg:shadow-none"
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -24, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  aria-label="Vector workbench controls"
                >
                  <div className="sticky top-0 z-10 border-b border-white/10 bg-[#101010]/95 backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-100">Controls</p>
                        <p className="text-[11px] text-zinc-500">{panels.find((panel) => panel.id === activePanel)?.label}</p>
                      </div>
                      <button type="button" onClick={() => setControlsOpen(false)} className="visualizer-toolbar-button lg:hidden">Close panel</button>
                    </div>
                    <div className="grid grid-cols-4" role="tablist" aria-label="Vector control sections">
                      {panels.map((panel) => (
                        <button key={panel.id} id={`vector-tab-${panel.id}`} type="button" role="tab" aria-selected={activePanel === panel.id} aria-controls={`vector-panel-${panel.id}`} onClick={() => setActivePanel(panel.id)} className={`min-h-11 border-t px-1 text-[10px] font-semibold transition sm:px-2 sm:text-[11px] ${activePanel === panel.id ? "border-sky-400/50 bg-sky-400/[0.08] text-sky-200" : "border-white/10 text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200"}`}>
                          {panel.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.div key={activePanel} id={`vector-panel-${activePanel}`} role="tabpanel" aria-labelledby={`vector-tab-${activePanel}`} className="p-4 sm:p-5" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                    {activePanel === "vectors" && (
                      <div className="space-y-6">
                        <section>
                          <h2 className="text-sm font-semibold text-zinc-100">Examples</h2>
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            {presets.map((preset) => (
                              <button key={preset.name} type="button" onClick={() => applyPreset(preset)} className="min-h-12 border border-white/10 bg-[#0b0b0b] px-2 py-2 text-[10px] font-semibold text-zinc-300 hover:border-sky-400/35 hover:text-sky-100">
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </section>
                        <section className="border-t border-white/10 pt-5">
                          <div className="flex items-center justify-between gap-3">
                            <h2 className="text-sm font-semibold text-zinc-100">Vector values</h2>
                            <span className="font-mono text-[10px] text-zinc-500">{vectors.length} of 6</span>
                          </div>
                          <div className="mt-3 space-y-2">
                            {vectors.map((vector) => (
                              <VectorEditor key={vector.id} vector={vector} dimension={dimension} active={activeVectorId === vector.id} canRemove={vectors.length > 2} onActivate={() => { setActiveVectorId(vector.id); setSelectedVectorId(vector.id); }} onChange={(value) => updateVector(vector.id, value)} onRemove={() => removeVector(vector.id)} />
                            ))}
                          </div>
                          <button type="button" onClick={addVector} disabled={vectors.length >= 6} className="secondary-action mt-3 w-full text-xs disabled:cursor-not-allowed disabled:opacity-35">Add vector</button>
                        </section>
                        <section className="border-t border-white/10 pt-5">
                          <h2 className="text-sm font-semibold text-zinc-100">Display</h2>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <Toggle label="Grid" checked={showGrid} onChange={setShowGrid} />
                            <Toggle label="Grid numbers" checked={showNumbers} onChange={setShowNumbers} />
                            <Toggle label="Vector labels" checked={showLabels} onChange={setShowLabels} />
                            {dimension === 2 && <Toggle label="Place on grid" checked={editOnGrid} onChange={setEditOnGrid} />}
                          </div>
                          {dimension === 3 && (
                            <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="3D camera view">
                              {cameraViews.map((view) => <button key={view.id} type="button" onClick={() => setCameraView(view.id)} aria-pressed={cameraView === view.id} className={`min-h-10 border px-2 text-[11px] font-semibold ${cameraView === view.id ? "border-sky-400/45 bg-sky-400/[0.09] text-sky-200" : "border-white/10 bg-[#0b0b0b] text-zinc-400 hover:border-white/25"}`}>{view.label}</button>)}
                            </div>
                          )}
                        </section>
                      </div>
                    )}

                    {activePanel === "operations" && (
                      <div className="space-y-6">
                        <OperandSelectors vectors={vectors} firstId={firstId} secondId={secondId} onFirstChange={setFirstId} onSecondChange={setSecondId} />
                        {operationGroups.map((group) => (
                          <section key={group.title} className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
                            <h2 className="text-xs font-semibold text-zinc-200">{group.title}</h2>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              {group.operations.map((operation) => <OperationButton key={operation.id} {...operation} activeId={operationId} onSelect={setOperationId} />)}
                            </div>
                          </section>
                        ))}
                      </div>
                    )}

                    {activePanel === "transform" && (
                      <div className="space-y-6">
                        <OperandSelectors vectors={vectors} firstId={firstId} secondId={secondId} onFirstChange={setFirstId} onSecondChange={setSecondId} />
                        <section className="border-t border-white/10 pt-5">
                          <h2 className="text-xs font-semibold text-zinc-200">Scale and combine</h2>
                          <div className="mt-3 space-y-4">
                            <NumberStepper label="Scalar k" value={scalar} step={0.5} onChange={setScalar} />
                            <OperationButton id="scalar-multiple" label="Scale first vector" activeId={operationId} onSelect={setOperationId} />
                            <div className="grid grid-cols-2 gap-2">
                              <NumberStepper compact label="Alpha" value={alpha} step={0.5} onChange={setAlpha} />
                              <NumberStepper compact label="Beta" value={beta} step={0.5} onChange={setBeta} />
                            </div>
                            <OperationButton id="linear-combination" label="Linear combination" activeId={operationId} onSelect={setOperationId} />
                          </div>
                        </section>
                        <section className="border-t border-white/10 pt-5">
                          <h2 className="text-xs font-semibold text-zinc-200">Rotation</h2>
                          <div className="mt-3 space-y-3">
                            <NumberStepper label="Angle in degrees" value={rotationAngle} step={5} onChange={setRotationAngle} />
                            {dimension === 3 && (
                              <label>
                                <span className="mb-1.5 block text-[11px] font-semibold text-zinc-400">Rotation axis</span>
                                <select value={rotationAxis} onChange={(event) => setRotationAxis(event.target.value as RotationAxis)} className="field-control min-h-10 py-2 text-xs">
                                  <option value="x">X axis</option><option value="y">Y axis</option><option value="z">Z axis</option>
                                </select>
                              </label>
                            )}
                            <OperationButton id="rotate" label="Rotate first vector" activeId={operationId} onSelect={setOperationId} />
                          </div>
                        </section>
                        <section className="border-t border-white/10 pt-5">
                          <h2 className="text-xs font-semibold text-zinc-200">Reflection</h2>
                          <div className="mt-3 space-y-3">
                            <label>
                              <span className="mb-1.5 block text-[11px] font-semibold text-zinc-400">Reflect across</span>
                              <select value={reflection} onChange={(event) => setReflection(event.target.value as typeof reflection)} className="field-control min-h-10 py-2 text-xs">
                                {dimension === 2 ? <><option value="x-axis">X axis</option><option value="y-axis">Y axis</option></> : <><option value="xy">XY plane</option><option value="xz">XZ plane</option><option value="yz">YZ plane</option></>}
                              </select>
                            </label>
                            <OperationButton id="reflect" label="Reflect first vector" activeId={operationId} onSelect={setOperationId} />
                          </div>
                        </section>
                      </div>
                    )}

                    {activePanel === "analysis" && (
                      <div className="space-y-6">
                        <section>
                          <h2 className="text-sm font-semibold text-zinc-100">Vector summary</h2>
                          <div className="mt-3 overflow-x-auto">
                            <table className="w-full border-collapse text-left text-[11px]">
                              <thead className="text-zinc-500"><tr><th className="border-b border-white/10 py-2">Vector</th><th className="border-b border-white/10 py-2">Value</th><th className="border-b border-white/10 py-2 text-right">Magnitude</th></tr></thead>
                              <tbody>{vectors.map((vector) => <tr key={vector.id}><td className="border-b border-white/10 py-2 font-semibold text-zinc-200">{vector.label}</td><td className="border-b border-white/10 py-2 font-mono text-zinc-400">{formatWorkbenchVector(vector.value, dimension)}</td><td className="border-b border-white/10 py-2 text-right font-mono text-sky-200">{formatNumber(vectorMagnitude(vector.value, dimension))}</td></tr>)}</tbody>
                            </table>
                          </div>
                        </section>
                        <section className="border-t border-white/10 pt-5">
                          <h2 className="text-xs font-semibold text-zinc-200">Three-vector calculations</h2>
                          {dimension === 2 ? (
                            <button type="button" onClick={() => changeDimension(3)} className="secondary-action mt-3 w-full text-xs">Switch to 3D</button>
                          ) : (
                            <>
                              <div className="mt-3 grid grid-cols-3 gap-2">
                                {[{ label: "First", value: firstId, set: setFirstId }, { label: "Second", value: secondId, set: setSecondId }, { label: "Third", value: thirdId, set: setThirdId }].map((field) => (
                                  <label key={field.label}><span className="mb-1 block text-[10px] text-zinc-500">{field.label}</span><select value={field.value} onChange={(event) => field.set(event.target.value)} className="field-control min-h-9 px-2 py-1 text-[11px]">{vectors.map((vector) => <option key={vector.id} value={vector.id}>{vector.label}</option>)}</select></label>
                                ))}
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <OperationButton id="scalar-triple" label="Scalar triple product" activeId={operationId} onSelect={setOperationId} />
                                <OperationButton id="vector-triple" label="Vector triple product" activeId={operationId} onSelect={setOperationId} />
                                <OperationButton id="coplanarity" label="Coplanarity test" activeId={operationId} onSelect={setOperationId} />
                                <OperationButton id="direction-angles" label="Direction angles" activeId={operationId} onSelect={setOperationId} />
                              </div>
                            </>
                          )}
                        </section>
                      </div>
                    )}
                  </motion.div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-1.5">
              <div className="flex border border-white/12 bg-black/90 p-1 backdrop-blur" role="group" aria-label="Vector dimension">
                {([2, 3] as VectorDimension[]).map((item) => <button key={item} type="button" onClick={() => changeDimension(item)} aria-pressed={dimension === item} className={`min-h-8 px-3 text-[11px] font-semibold ${dimension === item ? "bg-sky-400/15 text-sky-200" : "text-zinc-400 hover:text-zinc-100"}`}>{item}D</button>)}
              </div>
              {dimension === 2 && <button type="button" onClick={() => setEditOnGrid((current) => !current)} aria-pressed={editOnGrid} className={`visualizer-toolbar-button ${editOnGrid ? "border-sky-400/50 bg-sky-400/[0.1] text-sky-100" : ""}`}>{editOnGrid ? "Stop grid editing" : `Place Vector ${vectors.find((vector) => vector.id === activeVectorId)?.label ?? "A"}`}</button>}
              {dimension === 2 && <div className="flex border border-white/12 bg-black/90 p-1 backdrop-blur" role="group" aria-label="2D zoom"><button type="button" onClick={() => setZoom2D((current) => Math.max(0.5, Number((current - 0.25).toFixed(2))))} className="min-h-8 px-2 text-[10px] font-semibold text-zinc-300 hover:text-sky-200">Zoom out</button><span className="grid min-w-12 place-items-center border-x border-white/10 px-2 font-mono text-[10px] text-zinc-400">{Math.round(zoom2D * 100)}%</span><button type="button" onClick={() => setZoom2D((current) => Math.min(3, Number((current + 0.25).toFixed(2))))} className="min-h-8 px-2 text-[10px] font-semibold text-zinc-300 hover:text-sky-200">Zoom in</button><button type="button" onClick={() => setZoom2D(1)} className="min-h-8 border-l border-white/10 px-2 text-[10px] font-semibold text-zinc-300 hover:text-sky-200">Fit</button></div>}
              {dimension === 3 && <div className="hidden border border-white/12 bg-black/90 p-1 backdrop-blur sm:flex" role="group" aria-label="3D camera view">{cameraViews.map((view) => <button key={view.id} type="button" onClick={() => setCameraView(view.id)} aria-pressed={cameraView === view.id} className={`min-h-8 px-2.5 text-[10px] font-semibold ${cameraView === view.id ? "bg-sky-400/15 text-sky-200" : "text-zinc-400 hover:text-zinc-100"}`}>{view.label}</button>)}</div>}
            </div>

            {dimension === 2 ? (
              <VectorCanvas2D vectors={displayVectors} selectedId={selectedVectorId} showGrid={showGrid} showNumbers={showNumbers} showLabels={showLabels} editMode={editOnGrid} zoom={zoom2D} onPlaceVector={placeActiveVector} onSelectVector={selectVector} />
            ) : (
              <VectorCanvas3D vectors={displayVectors} selectedId={selectedVectorId} cameraView={cameraView} showGrid={showGrid} showNumbers={showNumbers} showLabels={showLabels} onSelectVector={selectVector} />
            )}

            {selectedVector && (
              <div className="absolute right-3 top-24 z-10 max-w-[260px] border border-sky-400/25 bg-black/90 px-3 py-2.5 shadow-xl backdrop-blur sm:top-3">
                <div className="flex items-start justify-between gap-5">
                  <div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-300">Selected vector</p><p className="mt-1 text-xs font-semibold text-zinc-100">{selectedVector.label}</p><p className="mt-1 font-mono text-[11px] text-sky-200">{formatWorkbenchVector(selectedVector.value, dimension)}</p></div>
                  <button type="button" onClick={() => setSelectedVectorId(null)} className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-100">Clear</button>
                </div>
              </div>
            )}

            <div className="absolute bottom-3 left-3 z-10 max-w-[calc(100%-1.5rem)] border border-sky-400/25 bg-black/92 px-4 py-3 shadow-2xl backdrop-blur sm:max-w-lg" aria-live="polite">
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-300">{result.title}</p><p className={`mt-1 break-words font-mono text-sm font-semibold ${result.invalid ? "text-zinc-400" : "text-zinc-100"}`}>{result.value}</p>{result.detail && <p className="mt-1 text-[11px] text-zinc-400">{result.detail}</p>}</div>
                <button type="button" onClick={() => void copyResult()} className="shrink-0 text-[10px] font-semibold text-zinc-500 hover:text-sky-200">Copy result</button>
              </div>
              <MathJaxRenderer math={result.formula} className="mt-2 max-h-16 overflow-x-auto text-xs text-sky-200" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
