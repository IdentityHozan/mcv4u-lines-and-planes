"use client";

import { Calculator } from "lucide-react";
import { useMemo, useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import type { Vector3Value } from "./Interactive3DPlane";

type CalculatorMode = "intersection" | "distance";

function dot(a: Vector3Value, b: Vector3Value) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a: Vector3Value, b: Vector3Value): Vector3Value {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function magnitude(vector: Vector3Value) {
  return Math.sqrt(dot(vector, vector));
}

function format(value: number) {
  if (Math.abs(value) < 1e-10) return "0";
  if (Number.isInteger(value)) return String(value);
  return Number(value.toFixed(4)).toString();
}

function VectorFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Vector3Value;
  onChange: (next: Vector3Value) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.13em] text-zinc-500">{label}</legend>
      <div className="grid grid-cols-3 gap-2">
        {(["x", "y", "z"] as const).map((axis, index) => (
          <label key={axis} className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase text-zinc-600">{axis}</span>
            <input
              type="number"
              value={value[index]}
              step="1"
              onChange={(event) => {
                const next = [...value] as Vector3Value;
                next[index] = Number(event.target.value);
                onChange(next);
              }}
              className="h-11 w-full border border-white/10 bg-[#0b0b0b] pl-6 pr-2 text-right font-mono text-xs text-zinc-200 focus:border-sky-400/50 focus:outline-none"
              aria-label={`${label} ${axis}-component`}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function VectorCalculator() {
  const [mode, setMode] = useState<CalculatorMode>("intersection");
  const [linePoint, setLinePoint] = useState<Vector3Value>([1, 0, 2]);
  const [direction, setDirection] = useState<Vector3Value>([1, 2, -1]);
  const [normal, setNormal] = useState<Vector3Value>([1, 1, 1]);
  const [constant, setConstant] = useState(5);
  const [externalPoint, setExternalPoint] = useState<Vector3Value>([3, 2, 0]);

  const intersection = useMemo(() => {
    const denominator = dot(normal, direction);
    const numerator = constant - dot(normal, linePoint);
    if (Math.abs(denominator) < 1e-10) {
      return Math.abs(numerator) < 1e-10
        ? { type: "contained" as const, denominator, numerator }
        : { type: "parallel" as const, denominator, numerator };
    }
    const t = numerator / denominator;
    const point: Vector3Value = [
      linePoint[0] + t * direction[0],
      linePoint[1] + t * direction[1],
      linePoint[2] + t * direction[2],
    ];
    return { type: "point" as const, denominator, numerator, t, point };
  }, [constant, direction, linePoint, normal]);

  const distance = useMemo(() => {
    const ap: Vector3Value = [
      externalPoint[0] - linePoint[0],
      externalPoint[1] - linePoint[1],
      externalPoint[2] - linePoint[2],
    ];
    const directionMagnitude = magnitude(direction);
    const crossProduct = cross(ap, direction);
    return {
      ap,
      crossProduct,
      directionMagnitude,
      value: directionMagnitude === 0 ? null : magnitude(crossProduct) / directionMagnitude,
    };
  }, [direction, externalPoint, linePoint]);

  const reset = () => {
    setLinePoint([1, 0, 2]);
    setDirection([1, 2, -1]);
    setNormal([1, 1, 1]);
    setConstant(5);
    setExternalPoint([3, 2, 0]);
  };

  return (
    <div className="overflow-hidden border border-white/10 bg-[#111]">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-sky-400/30 bg-sky-400/[0.06] text-sky-300">
            <Calculator size={18} />
          </span>
          <div>
            <p className="micro-label text-sky-300">Exact relationship solver</p>
            <h3 className="mt-1 text-lg font-semibold">Vector calculator</h3>
          </div>
        </div>
        <button type="button" onClick={reset} className="secondary-action min-h-10 px-3 text-xs">
          Reset values
        </button>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr]">
        <div className="border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="grid grid-cols-2 gap-1" role="group" aria-label="Calculator mode">
            <button
              type="button"
              onClick={() => setMode("intersection")}
              className={`border px-3 py-3 text-xs font-semibold transition ${mode === "intersection" ? "border-sky-400/40 bg-sky-400/[0.07] text-sky-300" : "border-white/10 text-zinc-500"}`}
            >
              Line ∩ plane
            </button>
            <button
              type="button"
              onClick={() => setMode("distance")}
              className={`border px-3 py-3 text-xs font-semibold transition ${mode === "distance" ? "border-sky-400/40 bg-sky-400/[0.07] text-sky-300" : "border-white/10 text-zinc-500"}`}
            >
              Point to line
            </button>
          </div>

          <div className="mt-6 space-y-5">
            <VectorFields label="Line anchor r₀" value={linePoint} onChange={setLinePoint} />
            <VectorFields label="Line direction d" value={direction} onChange={setDirection} />
            {mode === "intersection" ? (
              <>
                <VectorFields label="Plane normal n" value={normal} onChange={setNormal} />
                <label className="block">
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.13em] text-zinc-500">Plane constant k in n · r = k</span>
                  <input
                    type="number"
                    value={constant}
                    onChange={(event) => setConstant(Number(event.target.value))}
                    className="h-11 w-full border border-white/10 bg-[#0b0b0b] px-3 text-right font-mono text-xs text-zinc-200 focus:border-sky-400/50 focus:outline-none"
                  />
                </label>
              </>
            ) : (
              <VectorFields label="External point P" value={externalPoint} onChange={setExternalPoint} />
            )}
          </div>
        </div>

        <div className="industrial-grid flex min-h-[450px] flex-col justify-between p-6 sm:p-10">
          <div>
            <p className="micro-label text-zinc-500">Computed result</p>
            {mode === "intersection" ? (
              <div className="mt-8">
                {intersection.type === "point" && (
                  <>
                    <p className="text-3xl font-semibold tracking-tight text-zinc-100">One intersection</p>
                    <p className="mt-3 text-sm leading-6 text-zinc-500">The line crosses the plane at one exact parameter value.</p>
                    <MathJaxRenderer
                      math={`\\[t=\\frac{${format(intersection.numerator)}}{${format(intersection.denominator)}}=${format(intersection.t)}\\]`}
                      className="mt-8 text-xl text-sky-300"
                    />
                    <MathJaxRenderer
                      math={`\\[P=(${intersection.point.map(format).join(",")})\\]`}
                      className="mt-4 text-2xl text-zinc-100"
                    />
                  </>
                )}
                {intersection.type === "contained" && (
                  <>
                    <p className="text-3xl font-semibold tracking-tight">Line contained in plane</p>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-zinc-500">Both the directional and anchor tests vanish, so every parameter value satisfies the plane.</p>
                    <MathJaxRenderer math={String.raw`\[\vec n\cdot\vec d=0,\qquad k-\vec n\cdot\vec r_0=0\]`} className="mt-8 text-xl text-sky-300" />
                  </>
                )}
                {intersection.type === "parallel" && (
                  <>
                    <p className="text-3xl font-semibold tracking-tight">Parallel and disjoint</p>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-zinc-500">The direction lies parallel to the plane, but the line anchor is outside it.</p>
                    <MathJaxRenderer math={String.raw`\[\vec n\cdot\vec d=0,\qquad k-\vec n\cdot\vec r_0\ne0\]`} className="mt-8 text-xl text-sky-300" />
                  </>
                )}
              </div>
            ) : (
              <div className="mt-8">
                {distance.value === null ? (
                  <>
                    <p className="text-3xl font-semibold tracking-tight">Direction required</p>
                    <p className="mt-3 text-sm text-zinc-500">A zero vector cannot define a line direction.</p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-semibold tracking-tight">{format(distance.value)} units</p>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-zinc-500">The cross product isolates the parallelogram area; dividing by the direction length leaves the perpendicular height.</p>
                    <MathJaxRenderer
                      math={`\\[\\overrightarrow{AP}=(${distance.ap.join(",")}),\\qquad \\overrightarrow{AP}\\times\\vec d=(${distance.crossProduct.join(",")})\\]`}
                      className="mt-8 text-base text-zinc-200"
                    />
                    <MathJaxRenderer
                      math={`\\[d=\\frac{\\|\\overrightarrow{AP}\\times\\vec d\\|}{\\|\\vec d\\|}=${format(distance.value)}\\]`}
                      className="mt-5 text-xl text-sky-300"
                    />
                  </>
                )}
              </div>
            )}
          </div>
          <div className="mt-10 border-t border-white/10 pt-5 text-xs leading-5 text-zinc-600">
            Results update instantly. Keep exact values in written work when radicals or fractions appear.
          </div>
        </div>
      </div>
    </div>
  );
}
