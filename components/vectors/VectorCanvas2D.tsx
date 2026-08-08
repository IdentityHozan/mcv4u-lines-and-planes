"use client";

import { motion } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { WorkbenchVector } from "./vectorMath";
import { formatNumber, vectorMagnitude } from "./vectorMath";

export type DisplayVector = {
  id: string;
  label: string;
  value: WorkbenchVector;
  color: string;
  result?: boolean;
};

type VectorCanvas2DProps = {
  vectors: DisplayVector[];
  selectedId?: string | null;
  showGrid: boolean;
  showNumbers: boolean;
  showLabels: boolean;
  editMode: boolean;
  zoom: number;
  onPlaceVector: (value: WorkbenchVector) => void;
  onSelectVector: (id: string) => void;
};

const MIN_EXTENT = 5;

function safeMarkerId(prefix: string, id: string) {
  return `${prefix}-${id}`.replace(/[^a-zA-Z0-9_-]/g, "");
}

function niceTickInterval(extent: number) {
  const rough = extent / 8;
  const power = 10 ** Math.floor(Math.log10(Math.max(rough, 0.1)));
  const normalized = rough / power;
  if (normalized <= 1) return power;
  if (normalized <= 2) return 2 * power;
  if (normalized <= 5) return 5 * power;
  return 10 * power;
}

export function VectorCanvas2D({
  vectors,
  selectedId,
  showGrid,
  showNumbers,
  showLabels,
  editMode,
  zoom,
  onPlaceVector,
  onSelectVector,
}: VectorCanvas2DProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const markerPrefix = useId().replace(/:/g, "");
  const [size, setSize] = useState({ width: 900, height: 620 });

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const updateSize = () => {
      const bounds = node.getBoundingClientRect();
      if (bounds.width > 0 && bounds.height > 0) {
        setSize({ width: Math.round(bounds.width), height: Math.round(bounds.height) });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const extent = useMemo(() => {
    const largest = vectors.reduce((maximum, vector) => {
      return Math.max(maximum, Math.abs(vector.value[0]), Math.abs(vector.value[1]));
    }, MIN_EXTENT - 1);
    return Math.max(MIN_EXTENT, Math.ceil(largest * 1.25));
  }, [vectors]);

  const padding = Math.min(52, Math.max(32, size.width * 0.055));
  const scale = Math.max(0.0001, Math.min(
    (size.width - padding * 2) / (extent * 2),
    (size.height - padding * 2) / (extent * 2),
  ) * zoom);
  const origin = { x: size.width / 2, y: size.height / 2 };
  const xMin = Math.floor((0 - origin.x) / scale);
  const xMax = Math.ceil((size.width - origin.x) / scale);
  const yMin = Math.floor((origin.y - size.height) / scale);
  const yMax = Math.ceil(origin.y / scale);
  const tickInterval = niceTickInterval(extent);

  const xTicks = useMemo(() => {
    const values: number[] = [];
    for (let value = Math.ceil(xMin / tickInterval) * tickInterval; value <= xMax; value += tickInterval) values.push(value);
    return values;
  }, [tickInterval, xMax, xMin]);
  const yTicks = useMemo(() => {
    const values: number[] = [];
    for (let value = Math.ceil(yMin / tickInterval) * tickInterval; value <= yMax; value += tickInterval) values.push(value);
    return values;
  }, [tickInterval, yMax, yMin]);

  const placeVector = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!editMode) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const svgX = (event.clientX - bounds.left) * (size.width / bounds.width);
    const svgY = (event.clientY - bounds.top) * (size.height / bounds.height);
    const x = Math.round(((svgX - origin.x) / scale) * 2) / 2;
    const y = Math.round(((origin.y - svgY) / scale) * 2) / 2;
    onPlaceVector([x, y, 0]);
  };

  return (
    <div ref={wrapperRef} className="h-full min-h-[360px] w-full bg-[#0b0b0b]">
      <svg
        viewBox={`0 0 ${size.width} ${size.height}`}
        className={`h-full w-full touch-none ${editMode ? "cursor-crosshair" : "cursor-default"}`}
        role="img"
        aria-label="Two-dimensional coordinate grid showing the current vectors from the origin"
        onClick={placeVector}
      >
        <title>2D vector grid</title>
        <desc>Vectors begin at the origin. Select an endpoint to edit that vector.</desc>
        <defs>
          {vectors.map((vector) => (
            <marker
              key={vector.id}
              id={safeMarkerId(markerPrefix, vector.id)}
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
              viewBox="0 0 10 6"
            >
              <path d="M 0 0 L 10 3 L 0 6 z" fill={vector.color} />
            </marker>
          ))}
        </defs>

        {showGrid && (
          <g aria-hidden="true">
            {xTicks.map((value) => {
              const x = origin.x + value * scale;
              return <line key={`gx-${value}`} x1={x} y1="0" x2={x} y2={size.height} stroke={value === 0 ? "#71717a" : "#242424"} strokeWidth={value === 0 ? 1.4 : 1} />;
            })}
            {yTicks.map((value) => {
              const y = origin.y - value * scale;
              return <line key={`gy-${value}`} x1="0" y1={y} x2={size.width} y2={y} stroke={value === 0 ? "#71717a" : "#242424"} strokeWidth={value === 0 ? 1.4 : 1} />;
            })}
          </g>
        )}

        {!showGrid && (
          <g aria-hidden="true">
            <line x1="0" y1={origin.y} x2={size.width} y2={origin.y} stroke="#71717a" strokeWidth="1.4" />
            <line x1={origin.x} y1="0" x2={origin.x} y2={size.height} stroke="#71717a" strokeWidth="1.4" />
          </g>
        )}

        {showNumbers && (
          <g fill="#8b8b91" fontFamily="var(--font-geist-mono), monospace" fontSize="10" aria-hidden="true">
            {xTicks.filter((value) => value !== 0).map((value) => (
              <text key={`tx-${value}`} x={origin.x + value * scale} y={Math.min(size.height - 8, origin.y + 17)} textAnchor="middle">{value}</text>
            ))}
            {yTicks.filter((value) => value !== 0).map((value) => (
              <text key={`ty-${value}`} x={Math.max(12, origin.x - 10)} y={origin.y - value * scale + 3} textAnchor="end">{value}</text>
            ))}
            <text x={origin.x + 7} y={origin.y + 16}>0</text>
            <text x={size.width - 18} y={origin.y - 10} fill="#d4d4d8">x</text>
            <text x={origin.x + 10} y="18" fill="#7dd3fc">y</text>
          </g>
        )}

        <circle cx={origin.x} cy={origin.y} r="4" fill="#f5f5f5" />

        {vectors.map((vector) => {
          const endX = origin.x + vector.value[0] * scale;
          const endY = origin.y - vector.value[1] * scale;
          const isZero = vectorMagnitude(vector.value, 2) < 1e-9;
          const selected = selectedId === vector.id;
          const labelText = `${vector.label} (${formatNumber(vector.value[0])}, ${formatNumber(vector.value[1])})`;
          const labelWidth = Math.max(76, labelText.length * 6.2 + 14);
          const labelX = endX + labelWidth + 20 > size.width ? endX - labelWidth - 11 : endX + 11;
          const labelY = Math.min(size.height - 12, Math.max(20, endY - 10));
          return (
            <g
              key={vector.id}
              role="button"
              tabIndex={0}
              aria-label={`${vector.label}, ${formatNumber(vector.value[0])}, ${formatNumber(vector.value[1])}`}
              onClick={(event) => {
                event.stopPropagation();
                onSelectVector(vector.id);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectVector(vector.id);
                }
              }}
              className="cursor-pointer outline-none"
            >
              {!isZero && (
                <motion.line
                  initial={false}
                  animate={{ x2: endX, y2: endY }}
                  x1={origin.x}
                  y1={origin.y}
                  stroke={vector.color}
                  strokeWidth={vector.result ? 3 : selected ? 3.4 : 2.5}
                  strokeDasharray={vector.result ? "7 5" : undefined}
                  markerEnd={`url(#${safeMarkerId(markerPrefix, vector.id)})`}
                />
              )}
              <motion.circle
                initial={false}
                animate={{ cx: endX, cy: endY, r: selected ? 7 : vector.result ? 6 : 5 }}
                fill="#0b0b0b"
                stroke={vector.color}
                strokeWidth={selected ? 3 : 2}
              />
              {showLabels && (
                <motion.g initial={false} animate={{ x: labelX, y: labelY }}>
                  <rect x="0" y="-14" width={labelWidth} height="24" fill="#090909" fillOpacity="0.9" stroke={selected ? "#38bdf8" : "#3f3f46"} />
                  <text x="7" y="2" fill="#f5f5f5" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fontWeight="600">
                    {labelText}
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
