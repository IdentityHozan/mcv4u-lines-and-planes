"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { NumberStepper } from "@/components/ui/NumberStepper";
import {
  Interactive3DPlane,
  type CameraView,
  type DistanceMode,
  type PlaneDefinitionMode,
  type ScenePointSelection,
  type Vector3Value,
} from "./Interactive3DPlane";

type Mode = "line" | "plane" | "both";
type ControlPanel = "scene" | "line" | "planes" | "distance" | "motion" | "analysis";
type AnimationMode = "point" | "plane-shift" | "line-rotate" | "normal-rotate";

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

const controlPanels: Array<{ id: ControlPanel; label: string }> = [
  { id: "scene", label: "Scene" },
  { id: "line", label: "Line" },
  { id: "planes", label: "Planes" },
  { id: "distance", label: "Distance" },
  { id: "motion", label: "Motion" },
  { id: "analysis", label: "Analysis" },
];

const animationModes: Array<{ id: AnimationMode; label: string; value: string }> = [
  { id: "point", label: "Move point", value: "Parameter t" },
  { id: "plane-shift", label: "Shift Plane 1", value: "Plane constant k₁" },
  { id: "line-rotate", label: "Rotate line", value: "Direction vector d" },
  { id: "normal-rotate", label: "Rotate normal", value: "Normal vector n₁" },
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
  externalPoint: [3, 2, 0] as Vector3Value,
  distanceMode: "none" as DistanceMode,
  planeDefinitionMode: "normal" as PlaneDefinitionMode,
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

function add(first: Vector3Value, second: Vector3Value): Vector3Value {
  return [first[0] + second[0], first[1] + second[1], first[2] + second[2]];
}

function subtract(first: Vector3Value, second: Vector3Value): Vector3Value {
  return [first[0] - second[0], first[1] - second[1], first[2] - second[2]];
}

function scale(vector: Vector3Value, factor: number): Vector3Value {
  return [vector[0] * factor, vector[1] * factor, vector[2] * factor];
}

function planeSpanningVectors(normal: Vector3Value) {
  if (magnitude(normal) < EPSILON) return null;
  const first: Vector3Value = Math.abs(normal[0]) + Math.abs(normal[1]) > EPSILON
    ? [-normal[1], normal[0], 0]
    : [1, 0, 0];
  return { first, second: cross(normal, first) };
}

function rotateAroundY(vector: Vector3Value, angle: number): Vector3Value {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return [
    Number((vector[0] * cosine + vector[2] * sine).toFixed(4)),
    vector[1],
    Number((-vector[0] * sine + vector[2] * cosine).toFixed(4)),
  ];
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

function coordinateDifference(variable: string, value: number) {
  if (Math.abs(value) < EPSILON) return variable;
  return value > 0 ? `${variable}-${formatNumber(value)}` : `${variable}+${formatNumber(Math.abs(value))}`;
}

function affineExpression(base: number, terms: Array<{ coefficient: number; parameter: string }>) {
  let output = Math.abs(base) < EPSILON ? "" : formatNumber(base);
  terms.forEach(({ coefficient, parameter }) => {
    if (Math.abs(coefficient) < EPSILON) return;
    const magnitudeValue = Math.abs(coefficient);
    const body = `${Math.abs(magnitudeValue - 1) < EPSILON ? "" : formatNumber(magnitudeValue)}${parameter}`;
    if (!output) output = coefficient < 0 ? `-${body}` : body;
    else output += coefficient < 0 ? `-${body}` : `+${body}`;
  });
  return output || "0";
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

export function VectorLab({ embedded = false }: { embedded?: boolean }) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const parameterTravelDirectionRef = useRef(1);
  const planeTravelDirectionRef = useRef(1);
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
  const [externalPoint, setExternalPoint] = useState<Vector3Value>(defaults.externalPoint);
  const [distanceMode, setDistanceMode] = useState<DistanceMode>(defaults.distanceMode);
  const [planeDefinitionMode, setPlaneDefinitionMode] = useState<PlaneDefinitionMode>(defaults.planeDefinitionMode);
  const [animating, setAnimating] = useState(false);
  const [animationMode, setAnimationMode] = useState<AnimationMode>("point");
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState<ScenePointSelection | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [controlsOpen, setControlsOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<ControlPanel>("scene");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!animating) return;
    let frame = 0;
    let previous = performance.now();
    const animate = (time: number) => {
      const elapsed = Math.min(0.05, (time - previous) / 1000);
      previous = time;
      const step = elapsed * animationSpeed;

      if (animationMode === "point") {
        setParameter((current) => {
          let next = current + step * 1.4 * parameterTravelDirectionRef.current;
          if (next >= 3) {
            next = 3;
            parameterTravelDirectionRef.current = -1;
          } else if (next <= -3) {
            next = -3;
            parameterTravelDirectionRef.current = 1;
          }
          return Number(next.toFixed(3));
        });
      }

      if (animationMode === "plane-shift") {
        setPlaneConstant((current) => {
          let next = current + step * 1.8 * planeTravelDirectionRef.current;
          if (next >= 6) {
            next = 6;
            planeTravelDirectionRef.current = -1;
          } else if (next <= -6) {
            next = -6;
            planeTravelDirectionRef.current = 1;
          }
          return Number(next.toFixed(3));
        });
      }

      if (animationMode === "line-rotate") {
        setLineDirection((current) => rotateAroundY(current, step * 0.75));
      }

      if (animationMode === "normal-rotate") {
        setPlaneNormal((current) => rotateAroundY(current, step * 0.65));
      }

      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [animating, animationMode, animationSpeed]);

  useEffect(() => {
    if (!copyStatus) return;
    const timer = window.setTimeout(() => setCopyStatus(""), 1800);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === workspaceRef.current);
    };
    document.addEventListener("fullscreenchange", updateFullscreenState);
    return () => document.removeEventListener("fullscreenchange", updateFullscreenState);
  }, []);

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

  const lineEquationForms = useMemo(() => {
    if (magnitude(lineDirection) < EPSILON) return null;
    const variables = ["x", "y", "z"];
    const parametric = variables.map((variable, index) => `${variable}=${affineExpression(linePoint[index], [{ coefficient: lineDirection[index], parameter: "t" }])}`).join(",\\quad ");
    const symmetricTerms = variables.flatMap((variable, index) => Math.abs(lineDirection[index]) < EPSILON
      ? []
      : [`\\frac{${coordinateDifference(variable, linePoint[index])}}{${formatNumber(lineDirection[index])}}`]);
    const fixedCoordinates = variables.flatMap((variable, index) => Math.abs(lineDirection[index]) < EPSILON
      ? [`${variable}=${formatNumber(linePoint[index])}`]
      : []);
    const symmetric = symmetricTerms.length >= 2
      ? `${symmetricTerms.join("=")}${fixedCoordinates.length ? `,\\quad ${fixedCoordinates.join(",\\quad ")}` : ""}`
      : fixedCoordinates.join(",\\quad ");
    return {
      vector: `\\[\\vec r=(${linePoint.map(formatNumber).join(",")})+t(${lineDirection.map(formatNumber).join(",")})\\]`,
      parametric: `\\[${parametric}\\]`,
      symmetric: `\\[${symmetric || "\\vec d=\\vec 0"}\\]`,
      cartesian: `\\[(\\vec r-(${linePoint.map(formatNumber).join(",")}))\\times(${lineDirection.map(formatNumber).join(",")})=\\vec 0\\]`,
    };
  }, [lineDirection, linePoint]);

  const planeEquationForms = useMemo(() => {
    const normalSquared = dot(planeNormal, planeNormal);
    const spans = planeSpanningVectors(planeNormal);
    if (normalSquared < EPSILON || !spans) return null;
    const anchor = scale(planeNormal, planeConstant / normalSquared);
    const variables = ["x", "y", "z"];
    const parametric = variables.map((variable, index) => `${variable}=${affineExpression(anchor[index], [
      { coefficient: spans.first[index], parameter: "s" },
      { coefficient: spans.second[index], parameter: "t" },
    ])}`).join(",\\quad ");
    return {
      anchor,
      firstSpan: spans.first,
      secondSpan: spans.second,
      vector: `\\[\\vec r=(${anchor.map(formatNumber).join(",")})+s(${spans.first.map(formatNumber).join(",")})+t(${spans.second.map(formatNumber).join(",")})\\]`,
      parametric: `\\[${parametric}\\]`,
      scalar: `\\[${formatPlaneEquation(planeNormal, planeConstant)}\\]`,
    };
  }, [planeConstant, planeNormal]);

  const pointLineDistance = useMemo(() => {
    const directionSquared = dot(lineDirection, lineDirection);
    if (directionSquared < EPSILON) return null;
    const displacement = subtract(externalPoint, linePoint);
    const parameterValue = dot(displacement, lineDirection) / directionSquared;
    const foot = add(linePoint, scale(lineDirection, parameterValue));
    return {
      distance: magnitude(cross(displacement, lineDirection)) / Math.sqrt(directionSquared),
      foot,
      parameter: parameterValue,
    };
  }, [externalPoint, lineDirection, linePoint]);

  const pointPlaneDistance = useMemo(() => {
    const normalSquared = dot(planeNormal, planeNormal);
    if (normalSquared < EPSILON) return null;
    const signedNumerator = dot(planeNormal, externalPoint) - planeConstant;
    return {
      distance: Math.abs(signedNumerator) / Math.sqrt(normalSquared),
      foot: subtract(externalPoint, scale(planeNormal, signedNumerator / normalSquared)),
    };
  }, [externalPoint, planeConstant, planeNormal]);

  const linePlaneAngle = useMemo(() => {
    const denominator = magnitude(lineDirection) * magnitude(planeNormal);
    if (denominator < EPSILON) return null;
    const sine = Math.min(1, Math.max(0, Math.abs(dot(lineDirection, planeNormal)) / denominator));
    return Math.asin(sine) * 180 / Math.PI;
  }, [lineDirection, planeNormal]);

  const planePlaneAngle = useMemo(() => {
    if (!secondPlaneEnabled) return null;
    const denominator = magnitude(planeNormal) * magnitude(secondPlaneNormal);
    if (denominator < EPSILON) return null;
    const cosine = Math.min(1, Math.max(0, Math.abs(dot(planeNormal, secondPlaneNormal)) / denominator));
    return Math.acos(cosine) * 180 / Math.PI;
  }, [planeNormal, secondPlaneEnabled, secondPlaneNormal]);

  const trackedPoint: Vector3Value = [
    linePoint[0] + parameter * lineDirection[0],
    linePoint[1] + parameter * lineDirection[1],
    linePoint[2] + parameter * lineDirection[2],
  ];

  const animationReadout = {
    point: `t = ${formatNumber(parameter)}`,
    "plane-shift": `k₁ = ${formatNumber(planeConstant)}`,
    "line-rotate": `d = (${lineDirection.map(formatNumber).join(", ")})`,
    "normal-rotate": `n₁ = (${planeNormal.map(formatNumber).join(", ")})`,
  }[animationMode];

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
    setAnimationMode("point");
    setSelectedPoint(null);
    parameterTravelDirectionRef.current = 1;
    planeTravelDirectionRef.current = 1;
  };

  const reset = () => {
    applyPreset(presets[0]);
    setGridSize(defaults.gridSize);
    setShowNumberLabels(true);
    setShowAxes(true);
    setShowNormalVectors(true);
    setShowObjectLabels(true);
    setCameraView("isometric");
    setExternalPoint(defaults.externalPoint);
    setDistanceMode(defaults.distanceMode);
    setPlaneDefinitionMode(defaults.planeDefinitionMode);
    setAnimationSpeed(1);
  };

  const chooseDistanceMode = (nextMode: DistanceMode) => {
    setDistanceMode(nextMode);
    if (nextMode === "point-line") setMode((current) => current === "plane" ? "both" : current);
    if (nextMode === "point-plane") setMode((current) => current === "line" ? "both" : current);
  };

  const resetAnimationValue = () => {
    setAnimating(false);
    parameterTravelDirectionRef.current = 1;
    planeTravelDirectionRef.current = 1;
    if (animationMode === "point") setParameter(0);
    if (animationMode === "plane-shift") setPlaneConstant(defaults.planeConstant);
    if (animationMode === "line-rotate") setLineDirection(defaults.lineDirection);
    if (animationMode === "normal-rotate") setPlaneNormal(defaults.planeNormal);
  };

  const chooseAnimationMode = (nextMode: AnimationMode) => {
    setAnimationMode(nextMode);
    if (nextMode === "point" || nextMode === "line-rotate") {
      setMode((current) => current === "plane" ? "both" : current);
    }
    if (nextMode === "plane-shift" || nextMode === "normal-rotate") {
      setMode((current) => current === "line" ? "both" : current);
    }
    if (nextMode === "normal-rotate") setShowNormalVectors(true);
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

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === workspaceRef.current) {
        await document.exitFullscreen();
      } else {
        await workspaceRef.current?.requestFullscreen();
      }
    } catch {
      setCopyStatus("Full screen is unavailable in this browser");
    }
  };

  return (
    <div
      ref={workspaceRef}
      className={`visualizer-workspace flex flex-col overflow-hidden bg-[#0a0a0a] ${embedded ? "h-full" : "h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-4.5rem)]"}`}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#0d0d0d] px-3 py-2 sm:px-5">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-zinc-100 sm:text-base">3D Lines and Planes</h1>
          <p className="hidden truncate text-[11px] text-zinc-400 sm:block" role="status">
            {copyStatus || lineRelationship.title}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={reset} className="visualizer-toolbar-button">
            Reset
          </button>
          <button type="button" onClick={() => void toggleFullscreen()} className="visualizer-toolbar-button">
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </button>
          <button
            type="button"
            onClick={() => setControlsOpen((current) => !current)}
            className="visualizer-toolbar-button border-sky-400/30 text-sky-200"
            aria-expanded={controlsOpen}
            aria-controls="visualizer-controls"
          >
            {controlsOpen ? "Hide panel" : "Show panel"}
          </button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <div className="relative min-w-0 flex-1">
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
            distanceMode={distanceMode}
            externalPoint={externalPoint}
            planeDefinitionMode={planeDefinitionMode}
            selectedPoint={selectedPoint}
            onSelectPoint={setSelectedPoint}
          />

          <div className="pointer-events-none absolute left-3 top-3 hidden border border-white/15 bg-black/85 px-3 py-2 text-[11px] text-zinc-300 backdrop-blur sm:block">
            Select points and planes. Drag to rotate. Scroll or pinch to zoom.
          </div>

          {selectedPoint && (
            <div className="absolute right-3 top-3 border border-sky-400/30 bg-black/90 px-3 py-2.5 shadow-xl backdrop-blur">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-300">Selected point</p>
                  <p className="mt-1 text-xs font-semibold text-zinc-100">{selectedPoint.label}</p>
                  <p className="mt-1 font-mono text-[11px] text-sky-200">({selectedPoint.position.map(formatNumber).join(", ")})</p>
                </div>
                <button type="button" onClick={() => setSelectedPoint(null)} className="text-[11px] font-semibold text-zinc-400 hover:text-zinc-100">
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] border border-sky-400/25 bg-black/90 px-4 py-3 shadow-2xl backdrop-blur sm:max-w-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-300">Line and Plane 1</p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">{lineRelationship.title}</p>
            <p className="mt-0.5 text-xs text-zinc-400">{lineRelationship.detail}</p>
            {planeRelationship && (
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Plane 1 and Plane 2</p>
                <p className="mt-1 text-xs font-semibold text-zinc-200">{planeRelationship.title}</p>
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute bottom-3 right-3 hidden flex-col items-end gap-1 text-[10px] sm:flex">
            <span className="border border-sky-400/25 bg-black/85 px-2.5 py-1.5 text-sky-200">Blue: Plane 1 and vectors</span>
            <span className="border border-white/15 bg-black/85 px-2.5 py-1.5 text-zinc-200">White: line and Plane 2</span>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {controlsOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close controls"
                onClick={() => setControlsOpen(false)}
                className="absolute inset-0 z-20 bg-black/55 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.aside
                id="visualizer-controls"
                className="visualizer-control-scroll absolute inset-y-0 right-0 z-30 w-[min(92vw,440px)] shrink-0 overflow-y-auto border-l border-white/10 bg-[#101010] shadow-[-24px_0_70px_rgba(0,0,0,0.55)] lg:static lg:shadow-none"
                initial={{ x: 24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 24, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                aria-label="Visualizer controls"
              >
                <div className="sticky top-0 z-10 border-b border-white/10 bg-[#101010]/95 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">Controls</p>
                      <p className="text-[11px] text-zinc-500">{controlPanels.find((panel) => panel.id === activePanel)?.label}</p>
                    </div>
                    <button type="button" onClick={() => setControlsOpen(false)} className="visualizer-toolbar-button lg:hidden">
                      Close panel
                    </button>
                  </div>
                  <div className="grid grid-cols-6" role="tablist" aria-label="Visualizer control sections">
                    {controlPanels.map((panel) => (
                      <button
                        key={panel.id}
                        id={`visualizer-tab-${panel.id}`}
                        type="button"
                        role="tab"
                        aria-selected={activePanel === panel.id}
                        aria-controls={`visualizer-panel-${panel.id}`}
                        onClick={() => setActivePanel(panel.id)}
                        className={`min-h-11 border-t px-2 text-[11px] font-semibold transition ${
                          activePanel === panel.id
                            ? "border-sky-400/50 bg-sky-400/[0.08] text-sky-200"
                            : "border-white/10 text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200"
                        }`}
                      >
                        {panel.label}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.div
                  key={activePanel}
                  id={`visualizer-panel-${activePanel}`}
                  role="tabpanel"
                  aria-labelledby={`visualizer-tab-${activePanel}`}
                  className="p-4 sm:p-5"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {activePanel === "scene" && (
                    <div className="space-y-7">
                      <section>
                        <h2 className="text-sm font-semibold text-zinc-100">Starting configuration</h2>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {presets.map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => applyPreset(preset)}
                              className="min-h-[76px] border border-white/12 bg-[#0b0b0b] p-3 text-left transition hover:border-sky-400/40 hover:bg-sky-400/[0.05]"
                            >
                              <span className="block text-xs font-semibold text-zinc-100">{preset.name}</span>
                              <span className="mt-1 block text-[10px] leading-4 text-zinc-500">{preset.description}</span>
                            </button>
                          ))}
                        </div>
                      </section>

                      <section className="border-t border-white/10 pt-6">
                        <h2 className="text-sm font-semibold text-zinc-100">Camera</h2>
                        <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Camera view">
                          {cameraViews.map((view) => (
                            <button
                              key={view.id}
                              type="button"
                              onClick={() => setCameraView(view.id)}
                              aria-pressed={cameraView === view.id}
                              className={`min-h-10 border px-3 text-xs font-semibold ${
                                cameraView === view.id
                                  ? "border-sky-400/45 bg-sky-400/[0.09] text-sky-200"
                                  : "border-white/12 bg-[#0b0b0b] text-zinc-400 hover:border-white/25"
                              }`}
                            >
                              {view.label}
                            </button>
                          ))}
                        </div>
                      </section>

                      <section className="border-t border-white/10 pt-6">
                        <h2 className="text-sm font-semibold text-zinc-100">Objects</h2>
                        <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Visible objects">
                          {(["line", "plane", "both"] as Mode[]).map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setMode(item)}
                              aria-pressed={mode === item}
                              className={`min-h-10 border px-2 text-xs font-semibold capitalize ${
                                mode === item
                                  ? "border-sky-400/45 bg-sky-400/[0.09] text-sky-200"
                                  : "border-white/12 bg-[#0b0b0b] text-zinc-400 hover:border-white/25"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <Toggle label="Grid numbers" checked={showNumberLabels} onChange={setShowNumberLabels} />
                          <Toggle label="Axes" checked={showAxes} onChange={setShowAxes} />
                          <Toggle label="Vectors" checked={showNormalVectors} onChange={setShowNormalVectors} />
                          <Toggle label="Object labels" checked={showObjectLabels} onChange={setShowObjectLabels} />
                          <Toggle label="Plane 2" checked={secondPlaneEnabled} onChange={setSecondPlaneEnabled} />
                        </div>
                        <label className="mt-5 block">
                          <span className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-300">
                            Grid extent
                            <b className="font-mono font-normal text-sky-300">{gridSize}</b>
                          </span>
                          <input
                            className="range-input w-full"
                            type="range"
                            min="12"
                            max="28"
                            step="2"
                            value={gridSize}
                            onChange={(event) => setGridSize(Number(event.target.value))}
                          />
                        </label>
                      </section>
                    </div>
                  )}

                  {activePanel === "line" && (
                    <div className="space-y-7">
                      <NumericVectorInput label="Anchor point r₀" value={linePoint} onChange={setLinePoint} />
                      <NumericVectorInput label="Direction vector d" value={lineDirection} onChange={setLineDirection} />
                      <section className="border-t border-white/10 pt-6">
                        <h2 className="text-sm font-semibold text-zinc-100">Line equation forms</h2>
                        {lineEquationForms ? (
                          <div className="mt-3 space-y-3 border border-white/10 bg-[#0b0b0b] p-4">
                            <div><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">Vector</p><MathJaxRenderer math={lineEquationForms.vector} className="mt-1 text-xs text-zinc-100" /></div>
                            <div><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">Parametric</p><MathJaxRenderer math={lineEquationForms.parametric} className="mt-1 text-xs text-sky-200" /></div>
                            <div><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">Symmetric</p><MathJaxRenderer math={lineEquationForms.symmetric} className="mt-1 text-xs text-zinc-100" /></div>
                            <div><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">Cartesian vector constraint</p><MathJaxRenderer math={lineEquationForms.cartesian} className="mt-1 text-xs text-zinc-100" /></div>
                          </div>
                        ) : <p className="mt-3 border border-white/10 bg-[#0b0b0b] p-4 text-xs text-zinc-400">Enter a non-zero direction vector.</p>}
                      </section>
                      <section className="border-t border-white/10 pt-6">
                        <h2 className="text-sm font-semibold text-zinc-100">Tracked point</h2>
                        <div className="mt-4">
                          <NumberStepper label="Parameter t" value={parameter} step={0.1} min={-3} max={3} onChange={setParameter} />
                          <input
                            className="range-input mt-4 w-full"
                            type="range"
                            min="-3"
                            max="3"
                            step="0.1"
                            value={parameter}
                            onChange={(event) => setParameter(Number(event.target.value))}
                            aria-label="Parameter t slider"
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3 border border-sky-400/20 bg-sky-400/[0.045] px-3 py-3 text-xs">
                          <span className="text-zinc-400">Point at t = {formatNumber(parameter)}</span>
                          <span className="font-mono font-semibold text-sky-200">({trackedPoint.map(formatNumber).join(", ")})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (animating && animationMode === "point") {
                              setAnimating(false);
                            } else {
                              chooseAnimationMode("point");
                              setAnimating(true);
                            }
                          }}
                          className={`mt-4 w-full ${animating && animationMode === "point" ? "primary-action" : "secondary-action"}`}
                          aria-pressed={animating && animationMode === "point"}
                        >
                          {animating && animationMode === "point" ? "Stop point animation" : "Animate point"}
                        </button>
                      </section>
                    </div>
                  )}

                  {activePanel === "planes" && (
                    <div className="space-y-7">
                      <section className="space-y-5">
                        <div>
                          <h2 className="text-sm font-semibold text-zinc-100">Plane 1</h2>
                          <MathJaxRenderer math={`\\(${formatPlaneEquation(planeNormal, planeConstant)}\\)`} className="mt-2 text-sm text-sky-200" />
                        </div>
                        <NumericVectorInput label="Normal vector n₁" value={planeNormal} onChange={setPlaneNormal} />
                        <NumberStepper label="Plane constant k₁" value={planeConstant} step={0.1} min={-6} max={6} onChange={setPlaneConstant} />
                        <input
                          className="range-input w-full"
                          type="range"
                          min="-6"
                          max="6"
                          step="0.1"
                          value={planeConstant}
                          onChange={(event) => setPlaneConstant(Number(event.target.value))}
                          aria-label="Plane 1 constant slider"
                        />
                        <div className="border border-white/10 bg-[#0b0b0b] p-4">
                          <h3 className="text-xs font-semibold text-zinc-200">Plane equation forms</h3>
                          {planeEquationForms ? (
                            <div className="mt-3 space-y-3">
                              <div><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">Vector</p><MathJaxRenderer math={planeEquationForms.vector} className="mt-1 text-xs text-zinc-100" /></div>
                              <div><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">Parametric</p><MathJaxRenderer math={planeEquationForms.parametric} className="mt-1 text-xs text-sky-200" /></div>
                              <div><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">Cartesian</p><MathJaxRenderer math={planeEquationForms.scalar} className="mt-1 text-xs text-zinc-100" /></div>
                            </div>
                          ) : <p className="mt-3 text-xs text-zinc-400">Enter a non-zero normal vector.</p>}
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold text-zinc-200">Plane construction</h3>
                          <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Plane construction method">
                            {([
                              { id: "normal" as PlaneDefinitionMode, label: "Normal and point" },
                              { id: "three-points" as PlaneDefinitionMode, label: "Three points" },
                              { id: "two-lines" as PlaneDefinitionMode, label: "Two intersecting lines" },
                              { id: "point-line" as PlaneDefinitionMode, label: "Point and line" },
                            ]).map((item) => (
                              <button key={item.id} type="button" onClick={() => { setPlaneDefinitionMode(item.id); setMode((current) => current === "line" ? "both" : current); setShowObjectLabels(true); }} aria-pressed={planeDefinitionMode === item.id} className={`min-h-11 border px-3 py-2 text-left text-[11px] font-semibold ${planeDefinitionMode === item.id ? "border-sky-400/45 bg-sky-400/[0.09] text-sky-200" : "border-white/10 bg-[#090909] text-zinc-400 hover:border-white/25"}`}>
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </section>

                      <section className="space-y-5 border-t border-white/10 pt-6">
                        <Toggle label="Show Plane 2" checked={secondPlaneEnabled} onChange={setSecondPlaneEnabled} />
                        {secondPlaneEnabled && (
                          <>
                            <div>
                              <h2 className="text-sm font-semibold text-zinc-100">Plane 2</h2>
                              <MathJaxRenderer math={`\\(${formatPlaneEquation(secondPlaneNormal, secondPlaneConstant)}\\)`} className="mt-2 text-sm text-zinc-200" />
                            </div>
                            <NumericVectorInput label="Normal vector n₂" value={secondPlaneNormal} onChange={setSecondPlaneNormal} />
                            <NumberStepper label="Plane constant k₂" value={secondPlaneConstant} step={0.1} min={-6} max={6} onChange={setSecondPlaneConstant} />
                            <input
                              className="range-input w-full"
                              type="range"
                              min="-6"
                              max="6"
                              step="0.1"
                              value={secondPlaneConstant}
                              onChange={(event) => setSecondPlaneConstant(Number(event.target.value))}
                              aria-label="Plane 2 constant slider"
                            />
                          </>
                        )}
                      </section>
                    </div>
                  )}

                  {activePanel === "distance" && (
                    <div className="space-y-7">
                      <section>
                        <h2 className="text-sm font-semibold text-zinc-100">Distance measurement</h2>
                        <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Distance measurement">
                          {([
                            { id: "none" as DistanceMode, label: "Hide" },
                            { id: "point-line" as DistanceMode, label: "Point to line" },
                            { id: "point-plane" as DistanceMode, label: "Point to plane" },
                          ]).map((item) => (
                            <button key={item.id} type="button" onClick={() => chooseDistanceMode(item.id)} aria-pressed={distanceMode === item.id} className={`min-h-11 border px-2 text-[11px] font-semibold ${distanceMode === item.id ? "border-sky-400/45 bg-sky-400/[0.09] text-sky-200" : "border-white/10 bg-[#0b0b0b] text-zinc-400 hover:border-white/25"}`}>
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </section>

                      <NumericVectorInput label="External point P" value={externalPoint} onChange={setExternalPoint} />

                      {distanceMode === "point-line" && (
                        <section className="border border-sky-400/20 bg-sky-400/[0.045] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-300">Point to line</p>
                          {pointLineDistance ? (
                            <>
                              <p className="mt-2 font-mono text-lg font-semibold text-zinc-100">{formatNumber(pointLineDistance.distance)} units</p>
                              <MathJaxRenderer math={`\\[d=\\frac{\\|(${externalPoint.map(formatNumber).join(",")}-(${linePoint.map(formatNumber).join(",")}))\\times(${lineDirection.map(formatNumber).join(",")})\\|}{\\|(${lineDirection.map(formatNumber).join(",")})\\|}=${formatNumber(pointLineDistance.distance)}\\]`} className="mt-3 text-xs text-sky-200" />
                              <p className="mt-3 text-[11px] text-zinc-400">Closest point</p>
                              <p className="mt-1 font-mono text-xs text-zinc-100">({pointLineDistance.foot.map(formatNumber).join(", ")})</p>
                            </>
                          ) : <p className="mt-3 text-xs text-zinc-400">Enter a non-zero line direction.</p>}
                        </section>
                      )}

                      {distanceMode === "point-plane" && (
                        <section className="border border-sky-400/20 bg-sky-400/[0.045] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-300">Point to plane</p>
                          {pointPlaneDistance ? (
                            <>
                              <p className="mt-2 font-mono text-lg font-semibold text-zinc-100">{formatNumber(pointPlaneDistance.distance)} units</p>
                              <MathJaxRenderer math={`\\[d=\\frac{|\\vec n\\cdot P-k|}{\\|\\vec n\\|}=${formatNumber(pointPlaneDistance.distance)}\\]`} className="mt-3 text-sm text-sky-200" />
                              <p className="mt-3 text-[11px] text-zinc-400">Closest point</p>
                              <p className="mt-1 font-mono text-xs text-zinc-100">({pointPlaneDistance.foot.map(formatNumber).join(", ")})</p>
                            </>
                          ) : <p className="mt-3 text-xs text-zinc-400">Enter a non-zero plane normal.</p>}
                        </section>
                      )}

                      <section className="border-t border-white/10 pt-6">
                        <h2 className="text-sm font-semibold text-zinc-100">Angles</h2>
                        <div className="mt-3 space-y-2 border border-white/10 bg-[#0b0b0b] p-4 text-xs">
                          <div className="flex items-center justify-between gap-4"><span className="text-zinc-400">Line and Plane 1</span><span className="font-mono font-semibold text-sky-200">{linePlaneAngle === null ? "Not defined" : `${formatNumber(linePlaneAngle)}°`}</span></div>
                          {secondPlaneEnabled && <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-2"><span className="text-zinc-400">Plane 1 and Plane 2</span><span className="font-mono font-semibold text-sky-200">{planePlaneAngle === null ? "Not defined" : `${formatNumber(planePlaneAngle)}°`}</span></div>}
                        </div>
                      </section>
                    </div>
                  )}

                  {activePanel === "motion" && (
                    <div className="space-y-7">
                      <section>
                        <h2 className="text-sm font-semibold text-zinc-100">Animation</h2>
                        <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Animation mode">
                          {animationModes.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => chooseAnimationMode(item.id)}
                              aria-pressed={animationMode === item.id}
                              className={`min-h-[68px] border p-3 text-left transition ${
                                animationMode === item.id
                                  ? "border-sky-400/45 bg-sky-400/[0.09] text-sky-100"
                                  : "border-white/12 bg-[#0b0b0b] text-zinc-300 hover:border-white/25"
                              }`}
                            >
                              <span className="block text-xs font-semibold">{item.label}</span>
                              <span className="mt-1 block text-[10px] text-zinc-500">{item.value}</span>
                            </button>
                          ))}
                        </div>
                      </section>

                      <section className="border-t border-white/10 pt-6">
                        <div className="border border-sky-400/20 bg-sky-400/[0.045] px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-300">
                            {animationModes.find((item) => item.id === animationMode)?.label}
                          </p>
                          <p className="mt-2 break-words font-mono text-xs text-zinc-100">{animationReadout}</p>
                        </div>

                        <div className="mt-5">
                          <NumberStepper
                            label="Animation speed"
                            value={animationSpeed}
                            step={0.25}
                            min={0.25}
                            max={2.5}
                            onChange={setAnimationSpeed}
                          />
                          <input
                            className="range-input mt-4 w-full"
                            type="range"
                            min="0.25"
                            max="2.5"
                            step="0.25"
                            value={animationSpeed}
                            onChange={(event) => setAnimationSpeed(Number(event.target.value))}
                            aria-label="Animation speed slider"
                          />
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setAnimating((current) => !current)}
                            className={animating ? "primary-action" : "secondary-action"}
                            aria-pressed={animating}
                          >
                            {animating ? "Stop animation" : "Start animation"}
                          </button>
                          <button type="button" onClick={resetAnimationValue} className="secondary-action">
                            Reset motion
                          </button>
                        </div>
                      </section>

                      <section className="border-t border-white/10 pt-6">
                        <h2 className="text-sm font-semibold text-zinc-100">Current vectors</h2>
                        <div className="mt-3 space-y-2 border border-white/10 bg-[#0b0b0b] p-4 font-mono text-xs">
                          <p className="text-zinc-200">d = ({lineDirection.map(formatNumber).join(", ")})</p>
                          <p className="text-sky-200">n₁ = ({planeNormal.map(formatNumber).join(", ")})</p>
                        </div>
                      </section>
                    </div>
                  )}

                  {activePanel === "analysis" && (
                    <div className="space-y-7">
                      <section>
                        <div className="flex items-center justify-between gap-4">
                          <h2 className="text-sm font-semibold text-zinc-100">Selected coordinate</h2>
                          {selectedPoint && (
                            <button type="button" onClick={() => setSelectedPoint(null)} className="visualizer-toolbar-button">
                              Clear selection
                            </button>
                          )}
                        </div>
                        <div className="mt-3 border border-sky-400/20 bg-sky-400/[0.045] p-4">
                          {selectedPoint ? (
                            <>
                              <p className="text-xs font-semibold text-zinc-100">{selectedPoint.label}</p>
                              <p className="mt-2 font-mono text-sm text-sky-200">({selectedPoint.position.map(formatNumber).join(", ")})</p>
                            </>
                          ) : (
                            <p className="text-xs leading-5 text-zinc-400">Select the anchor, tracked point, intersection, or a position on either plane.</p>
                          )}
                        </div>
                      </section>

                      <section>
                        <div className="flex items-center justify-between gap-4">
                          <h2 className="text-sm font-semibold text-zinc-100">Equations</h2>
                          <button type="button" onClick={() => void copyEquations()} className="visualizer-toolbar-button">
                            Copy equations
                          </button>
                        </div>
                        <div className="mt-3 space-y-3 border border-white/10 bg-[#0b0b0b] p-4">
                          <MathJaxRenderer math={`\\(\\vec r=(${linePoint.join(",")})+t(${lineDirection.join(",")})\\)`} className="text-sm text-zinc-100" />
                          <MathJaxRenderer math={`\\(${formatPlaneEquation(planeNormal, planeConstant)}\\)`} className="text-sm text-sky-200" />
                          {secondPlaneEnabled && (
                            <MathJaxRenderer math={`\\(${formatPlaneEquation(secondPlaneNormal, secondPlaneConstant)}\\)`} className="text-sm text-zinc-100" />
                          )}
                        </div>
                        {copyStatus && <p className="mt-2 text-right text-xs text-sky-300" role="status">{copyStatus}</p>}
                      </section>

                      <section className="border border-sky-400/20 bg-sky-400/[0.045] p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-300">Line and Plane 1</p>
                        <h2 className="mt-2 text-base font-semibold text-zinc-100">{lineRelationship.title}</h2>
                        <p className="mt-1 text-xs leading-5 text-zinc-400">{lineRelationship.detail}</p>
                        <MathJaxRenderer math={lineRelationship.math} className="mt-4 text-sm text-zinc-100" />
                      </section>

                      {planeRelationship && (
                        <section className="border border-white/12 bg-[#0b0b0b] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Plane 1 and Plane 2</p>
                          <h2 className="mt-2 text-base font-semibold text-zinc-100">{planeRelationship.title}</h2>
                          <p className="mt-1 text-xs leading-5 text-zinc-400">{planeRelationship.detail}</p>
                          <MathJaxRenderer math={planeRelationship.math} className="mt-4 text-sm text-zinc-100" />
                        </section>
                      )}

                      <section className="flex items-center justify-between gap-3 border border-white/10 bg-[#0b0b0b] px-4 py-3 text-xs">
                        <span className="text-zinc-400">Point at t = {formatNumber(parameter)}</span>
                        <span className="font-mono font-semibold text-sky-200">({trackedPoint.map(formatNumber).join(", ")})</span>
                      </section>
                    </div>
                  )}
                </motion.div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
