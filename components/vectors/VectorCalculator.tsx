"use client";

import { useMemo, useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { NumberStepper } from "@/components/ui/NumberStepper";
import type { Vector3Value } from "./Interactive3DPlane";

type CalculatorMode = "line-plane" | "point-line-r2" | "point-line" | "point-plane" | "plane-plane";

const EPSILON = 1e-10;

const modes: Array<{ id: CalculatorMode; label: string }> = [
  { id: "line-plane", label: "Line and plane" },
  { id: "point-line-r2", label: "Point to line in 2D" },
  { id: "point-line", label: "Point to line in 3D" },
  { id: "point-plane", label: "Point to plane" },
  { id: "plane-plane", label: "Two planes" },
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

function magnitude(vector: Vector3Value) {
  return Math.sqrt(dot(vector, vector));
}

function scale(vector: Vector3Value, factor: number): Vector3Value {
  return [vector[0] * factor, vector[1] * factor, vector[2] * factor];
}

function add(first: Vector3Value, second: Vector3Value): Vector3Value {
  return [first[0] + second[0], first[1] + second[1], first[2] + second[2]];
}

function subtract(first: Vector3Value, second: Vector3Value): Vector3Value {
  return [first[0] - second[0], first[1] - second[1], first[2] - second[2]];
}

function format(value: number) {
  if (Math.abs(value) < EPSILON) return "0";
  if (Number.isInteger(value)) return String(value);
  return Number(value.toFixed(4)).toString();
}

function formatVector(vector: Vector3Value) {
  return vector.map(format).join(",");
}

function substitutedLine2D([a, b, c]: [number, number, number], [x, y]: [number, number]) {
  const first = `${a < 0 ? "-" : ""}${format(Math.abs(a))}(${format(x)})`;
  const second = `${b < 0 ? "-" : "+"}${format(Math.abs(b))}(${format(y)})`;
  const constant = `${c < 0 ? "-" : "+"}${format(Math.abs(c))}`;
  return `${first}${second}${constant}`;
}

function greatestCommonDivisor(first: number, second: number) {
  let a = Math.abs(Math.round(first));
  let b = Math.abs(Math.round(second));
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a || 1;
}

function rootLatex(value: number) {
  if (value < EPSILON) return "0";
  if (!Number.isInteger(value)) return `\\sqrt{${format(value)}}`;
  let outside = 1;
  let inside = Math.round(value);
  for (let factor = 2; factor * factor <= inside; factor += 1) {
    const square = factor * factor;
    while (inside % square === 0) {
      outside *= factor;
      inside /= square;
    }
  }
  if (inside === 1) return String(outside);
  return outside === 1 ? `\\sqrt{${inside}}` : `${outside}\\sqrt{${inside}}`;
}

function rootRatioLatex(numerator: number, denominator: number) {
  if (Number.isInteger(numerator) && Number.isInteger(denominator)) {
    const divisor = greatestCommonDivisor(numerator, denominator);
    const reducedNumerator = numerator / divisor;
    const reducedDenominator = denominator / divisor;
    if (reducedDenominator === 1) return rootLatex(reducedNumerator);
    return `\\sqrt{\\frac{${reducedNumerator}}{${reducedDenominator}}}`;
  }
  return `\\sqrt{\\frac{${format(numerator)}}{${format(denominator)}}}`;
}

function VectorFields({ label, value, onChange }: { label: string; value: Vector3Value; onChange: (next: Vector3Value) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-zinc-200">{label}</legend>
      <div className="grid grid-cols-3 gap-2">
        {(["x", "y", "z"] as const).map((axis, index) => (
          <NumberStepper
            key={axis}
            compact
            label={axis.toUpperCase()}
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

function ResultHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <p className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">{title}</p>
      {description && <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">{description}</p>}
    </div>
  );
}

export function VectorCalculator() {
  const [mode, setMode] = useState<CalculatorMode>("line-plane");
  const [linePoint, setLinePoint] = useState<Vector3Value>([1, 0, 2]);
  const [direction, setDirection] = useState<Vector3Value>([1, 2, -1]);
  const [normal, setNormal] = useState<Vector3Value>([1, 1, 1]);
  const [constant, setConstant] = useState(5);
  const [externalPoint, setExternalPoint] = useState<Vector3Value>([3, 2, 0]);
  const [secondNormal, setSecondNormal] = useState<Vector3Value>([1, -1, 2]);
  const [secondConstant, setSecondConstant] = useState(1);
  const [line2D, setLine2D] = useState<[number, number, number]>([3, -4, 2]);
  const [point2D, setPoint2D] = useState<[number, number]>([4, 1]);

  const linePlane = useMemo(() => {
    if (magnitude(normal) < EPSILON) return { type: "invalid-plane" as const };
    if (magnitude(direction) < EPSILON) return { type: "invalid-line" as const };
    const denominator = dot(normal, direction);
    const numerator = constant - dot(normal, linePoint);
    if (Math.abs(denominator) < EPSILON) {
      return Math.abs(numerator) < EPSILON
        ? { type: "contained" as const }
        : { type: "parallel" as const };
    }
    const t = numerator / denominator;
    const point = add(linePoint, scale(direction, t));
    const angle = Math.asin(Math.min(1, Math.abs(denominator) / (magnitude(normal) * magnitude(direction)))) * 180 / Math.PI;
    return { type: "point" as const, denominator, numerator, t, point, angle };
  }, [constant, direction, linePoint, normal]);

  const pointLine2D = useMemo(() => {
    const [a, b, c] = line2D;
    const denominatorSquared = a * a + b * b;
    if (denominatorSquared < EPSILON) return null;
    const numerator = Math.abs(a * point2D[0] + b * point2D[1] + c);
    return {
      numerator,
      denominatorSquared,
      distance: numerator / Math.sqrt(denominatorSquared),
    };
  }, [line2D, point2D]);

  const pointLine = useMemo(() => {
    const directionSquared = dot(direction, direction);
    if (directionSquared < EPSILON) return null;
    const displacement = subtract(externalPoint, linePoint);
    const crossProduct = cross(displacement, direction);
    const parameter = dot(displacement, direction) / directionSquared;
    const closestPoint = add(linePoint, scale(direction, parameter));
    return {
      displacement,
      crossProduct,
      crossSquared: dot(crossProduct, crossProduct),
      directionSquared,
      parameter,
      closestPoint,
      distance: magnitude(crossProduct) / Math.sqrt(directionSquared),
    };
  }, [direction, externalPoint, linePoint]);

  const pointPlane = useMemo(() => {
    const normalSquared = dot(normal, normal);
    if (normalSquared < EPSILON) return null;
    const signedNumerator = dot(normal, externalPoint) - constant;
    const foot = subtract(externalPoint, scale(normal, signedNumerator / normalSquared));
    return {
      signedNumerator,
      foot,
      distance: Math.abs(signedNumerator) / Math.sqrt(normalSquared),
    };
  }, [constant, externalPoint, normal]);

  const planePlane = useMemo(() => {
    const firstMagnitude = magnitude(normal);
    const secondMagnitude = magnitude(secondNormal);
    if (firstMagnitude < EPSILON || secondMagnitude < EPSILON) return { type: "invalid" as const };

    const intersectionDirection = cross(normal, secondNormal);
    const directionSquared = dot(intersectionDirection, intersectionDirection);
    const cosine = Math.min(1, Math.max(0, Math.abs(dot(normal, secondNormal)) / (firstMagnitude * secondMagnitude)));
    const angle = Math.acos(cosine) * 180 / Math.PI;

    if (directionSquared >= EPSILON) {
      const firstTerm = scale(cross(secondNormal, intersectionDirection), constant);
      const secondTerm = scale(cross(intersectionDirection, normal), secondConstant);
      const point = scale(add(firstTerm, secondTerm), 1 / directionSquared);
      return { type: "line" as const, direction: intersectionDirection, point, angle };
    }

    const index = normal.findIndex((component) => Math.abs(component) >= EPSILON);
    const ratio = secondNormal[index] / normal[index];
    const coincident = Math.abs(secondConstant - ratio * constant) < EPSILON;
    if (coincident) return { type: "coincident" as const, angle: 0, distance: 0 };

    const pointOnFirst = scale(normal, constant / dot(normal, normal));
    const distanceNumerator = Math.abs(dot(secondNormal, pointOnFirst) - secondConstant);
    const distance = distanceNumerator / secondMagnitude;
    return { type: "parallel" as const, angle: 0, distance, distanceNumerator, normalSquared: dot(secondNormal, secondNormal) };
  }, [constant, normal, secondConstant, secondNormal]);

  const reset = () => {
    setLinePoint([1, 0, 2]);
    setDirection([1, 2, -1]);
    setNormal([1, 1, 1]);
    setConstant(5);
    setExternalPoint([3, 2, 0]);
    setSecondNormal([1, -1, 2]);
    setSecondConstant(1);
    setLine2D([3, -4, 2]);
    setPoint2D([4, 1]);
  };

  return (
    <div className="overflow-hidden border border-white/10 bg-[#101010]">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="micro-label text-sky-300">Lines and planes solver</p>
          <h2 className="mt-2 text-xl font-semibold text-zinc-100">Choose one geometry problem</h2>
        </div>
        <button type="button" onClick={reset} className="secondary-action min-h-10 px-4 text-xs">Reset values</button>
      </div>

      <div className="grid gap-2 border-b border-white/10 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-5" role="group" aria-label="Calculator mode">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            aria-pressed={mode === item.id}
            className={`min-h-12 border px-4 text-sm font-semibold transition ${
              mode === item.id
                ? "border-sky-400/50 bg-sky-400/[0.09] text-sky-200"
                : "border-white/10 bg-[#0b0b0b] text-zinc-400 hover:border-white/25 hover:text-zinc-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[420px_1fr]">
        <section className="border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r" aria-label="Calculator inputs">
          <div className="space-y-7">
            {(mode === "line-plane" || mode === "point-line") && (
              <>
                <VectorFields label="Line anchor point" value={linePoint} onChange={setLinePoint} />
                <VectorFields label="Line direction vector" value={direction} onChange={setDirection} />
              </>
            )}

            {mode === "point-line-r2" && (
              <>
                <fieldset>
                  <legend className="mb-3 text-sm font-semibold text-zinc-200">Line Ax + By + C = 0</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {(["A", "B", "C"] as const).map((label, index) => <NumberStepper key={label} compact label={label} value={line2D[index]} onChange={(value) => { const next = [...line2D] as [number, number, number]; next[index] = value; setLine2D(next); }} />)}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-3 text-sm font-semibold text-zinc-200">Point P</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(["X", "Y"] as const).map((label, index) => <NumberStepper key={label} compact label={label} value={point2D[index]} onChange={(value) => { const next = [...point2D] as [number, number]; next[index] = value; setPoint2D(next); }} />)}
                  </div>
                </fieldset>
              </>
            )}

            {(mode === "point-line" || mode === "point-plane") && (
              <VectorFields label="External point" value={externalPoint} onChange={setExternalPoint} />
            )}

            {(mode === "line-plane" || mode === "point-plane" || mode === "plane-plane") && (
              <>
                <VectorFields label={mode === "plane-plane" ? "First plane normal" : "Plane normal"} value={normal} onChange={setNormal} />
                <NumberStepper label={mode === "plane-plane" ? "First plane constant" : "Plane constant"} value={constant} onChange={setConstant} />
              </>
            )}

            {mode === "plane-plane" && (
              <>
                <VectorFields label="Second plane normal" value={secondNormal} onChange={setSecondNormal} />
                <NumberStepper label="Second plane constant" value={secondConstant} onChange={setSecondConstant} />
              </>
            )}
          </div>
        </section>

        <section className="industrial-grid min-h-[470px] p-6 sm:p-10" aria-live="polite">
          <p className="micro-label text-sky-300">Result</p>

          {mode === "line-plane" && (
            <div className="mt-8">
              {linePlane.type === "point" && (
                <>
                  <ResultHeading title="One intersection point" description={`The acute angle between the line and plane is ${format(linePlane.angle)}°.`} />
                  <MathJaxRenderer math={`\\[t=\\frac{${format(linePlane.numerator)}}{${format(linePlane.denominator)}}=${format(linePlane.t)}\\]`} className="mt-8 text-xl text-sky-300" />
                  <MathJaxRenderer math={`\\[P=(${formatVector(linePlane.point)})\\]`} className="mt-4 text-2xl text-zinc-100" />
                </>
              )}
              {linePlane.type === "contained" && (
                <><ResultHeading title="The line lies in the plane" /><MathJaxRenderer math={String.raw`\[\vec n\cdot\vec d=0,\qquad \vec n\cdot\vec r_0=k\]`} className="mt-8 text-xl text-sky-300" /></>
              )}
              {linePlane.type === "parallel" && (
                <><ResultHeading title="The line and plane are parallel" /><MathJaxRenderer math={String.raw`\[\vec n\cdot\vec d=0,\qquad \vec n\cdot\vec r_0\ne k\]`} className="mt-8 text-xl text-sky-300" /></>
              )}
              {linePlane.type === "invalid-line" && <ResultHeading title="Enter a non-zero line direction" />}
              {linePlane.type === "invalid-plane" && <ResultHeading title="Enter a non-zero plane normal" />}
            </div>
          )}

          {mode === "point-line-r2" && (
            <div className="mt-8">
              {pointLine2D ? (
                <>
                  <ResultHeading title="Point to line distance" />
                  <MathJaxRenderer math={`\\[d=\\frac{|${substitutedLine2D(line2D, point2D)}|}{\\sqrt{${format(pointLine2D.denominatorSquared)}}}=\\frac{${format(pointLine2D.numerator)}}{${rootLatex(pointLine2D.denominatorSquared)}}\\]`} className="mt-8 text-xl text-sky-300" />
                  <p className="mt-4 text-sm text-zinc-400">Approximate value: {format(pointLine2D.distance)} units</p>
                </>
              ) : <ResultHeading title="A and B cannot both be zero" />}
            </div>
          )}

          {mode === "point-line" && (
            <div className="mt-8">
              {pointLine ? (
                <>
                  <ResultHeading title="Point to line distance" description={`Approximate value: ${format(pointLine.distance)} units`} />
                  <MathJaxRenderer math={`\\[t_{\\min}=${format(pointLine.parameter)},\\qquad Q=(${formatVector(pointLine.closestPoint)})\\]`} className="mt-8 text-lg text-zinc-100" />
                  <MathJaxRenderer math={`\\[d=\\frac{\\|(${formatVector(pointLine.displacement)})\\times(${formatVector(direction)})\\|}{\\|(${formatVector(direction)})\\|}=${rootRatioLatex(pointLine.crossSquared, pointLine.directionSquared)}\\]`} className="mt-5 text-lg text-sky-300" />
                </>
              ) : <ResultHeading title="Enter a non-zero line direction" />}
            </div>
          )}

          {mode === "point-plane" && (
            <div className="mt-8">
              {pointPlane ? (
                <>
                  <ResultHeading title="Point to plane distance" description={`Approximate value: ${format(pointPlane.distance)} units`} />
                  <MathJaxRenderer math={`\\[d=\\frac{|\\vec n\\cdot P-k|}{\\|\\vec n\\|}=\\frac{${format(Math.abs(pointPlane.signedNumerator))}}{${rootLatex(dot(normal, normal))}}\\]`} className="mt-8 text-xl text-sky-300" />
                  <MathJaxRenderer math={`\\[H=(${formatVector(pointPlane.foot)})\\]`} className="mt-5 text-xl text-zinc-100" />
                  <p className="mt-3 text-sm text-zinc-400">H is the closest point on the plane.</p>
                </>
              ) : <ResultHeading title="Enter a non-zero plane normal" />}
            </div>
          )}

          {mode === "plane-plane" && (
            <div className="mt-8">
              {planePlane.type === "line" && (
                <>
                  <ResultHeading title="The planes intersect in a line" description={`Acute angle between the planes: ${format(planePlane.angle)}°`} />
                  <MathJaxRenderer math={`\\[\\vec r=(${formatVector(planePlane.point)})+t(${formatVector(planePlane.direction)})\\]`} className="mt-8 text-xl text-sky-300" />
                  <MathJaxRenderer math={`\\[\\vec d=\\vec n_1\\times\\vec n_2=(${formatVector(planePlane.direction)})\\]`} className="mt-5 text-base text-zinc-100" />
                </>
              )}
              {planePlane.type === "parallel" && (
                <>
                  <ResultHeading title="The planes are parallel" description={`Approximate separation: ${format(planePlane.distance)} units`} />
                  <MathJaxRenderer math={`\\[d=\\frac{${format(planePlane.distanceNumerator)}}{${rootLatex(planePlane.normalSquared)}}\\]`} className="mt-8 text-xl text-sky-300" />
                </>
              )}
              {planePlane.type === "coincident" && (
                <><ResultHeading title="The equations describe the same plane" /><MathJaxRenderer math={String.raw`\[\Pi_1=\Pi_2\]`} className="mt-8 text-xl text-sky-300" /></>
              )}
              {planePlane.type === "invalid" && <ResultHeading title="Enter two non-zero plane normals" />}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
