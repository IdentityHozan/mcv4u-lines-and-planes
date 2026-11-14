import type { ReactNode } from "react";

export type XY = readonly [number, number];
export type XYZ = readonly [number, number, number];
export type Project = (point: XYZ) => XY;
export type Label = { text: string; at: XYZ; color?: string; offset?: XY; anchor?: "start" | "middle" | "end" };

export const ink = {
  plot: "#11181e",
  grid: "#303a45",
  axis: "#8b9bad",
  paper: "#f0f5fa",
  blue: "#65d2ff",
  amber: "#ffcf78",
  violet: "#d8b6ff",
  green: "#8fe6b0",
};

export const origin: XYZ = [0, 0, 0];
export const add = (a: XYZ, b: XYZ): XYZ => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const subtract = (a: XYZ, b: XYZ): XYZ => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a: XYZ, t: number): XYZ => [t * a[0], t * a[1], t * a[2]];
export const dot = (a: XYZ, b: XYZ) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const along = (p: XYZ, d: XYZ, t: number): XYZ => add(p, scale(d, t));
export const patch = (p: XYZ, u: XYZ, v: XYZ, lo = -1, hi = 1): XYZ[] =>
  ([[lo,lo], [hi,lo], [hi,hi], [lo,hi]] as const).map(([s,t]) => add(along(p,u,s),scale(v,t)));
export const footOnPlane = (p: XYZ, n: XYZ, d: number) => along(p, n, -(dot(p,n)+d)/dot(n,n));

const width = 560;
const height = 326;
const svgNum = (n: number) => Number(n.toFixed(3));

export function GraphFrame({ title, caption, children, className = "" }: {
  title: string; caption: string; children: ReactNode; className?: string;
}) {
  return (
    <figure className={`my-6 overflow-hidden rounded-xl border border-slate-600/70 bg-[#11181e] ${className}`}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title} className="block h-auto w-full">
        <title>{title}</title>
        <desc>{caption}</desc>
        <rect width={width} height={height} fill={ink.plot} />
        {children}
      </svg>
      <figcaption className="border-t border-slate-600/70 px-4 py-3 text-sm leading-6 text-slate-200 sm:px-5">
        <strong className="block text-slate-50">{title}</strong>
        {caption}
      </figcaption>
    </figure>
  );
}

export function GraphSegment({ to, a, b, color = ink.paper, stroke = 3, dashed = false, arrow = false, opacity = 1 }: {
  to: Project; a: XYZ; b: XYZ; color?: string; stroke?: number; dashed?: boolean; arrow?: boolean; opacity?: number;
}) {
  const [x1,y1] = to(a).map(svgNum);
  const [x2,y2] = to(b).map(svgNum);
  const distance = Math.hypot(x2-x1,y2-y1);
  const n = Math.min(distance / 2.3, stroke > 2 ? 14 : 10);
  const ux = distance ? (x2-x1)/distance : 0;
  const uy = distance ? (y2-y1)/distance : 0;
  const bx = x2-n*ux;
  const by = y2-n*uy;
  const w = n*.38;
  const edge = (sign: number) => `${svgNum(bx+sign*uy*w)},${svgNum(by-sign*ux*w)}`;
  return <g opacity={opacity}>
    <line x1={x1} y1={y1} x2={arrow ? svgNum(bx+ux) : x2} y2={arrow ? svgNum(by+uy) : y2}
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={dashed ? "7 6" : undefined} />
    {arrow && distance > 1 && <polygon points={`${x2},${y2} ${edge(1)} ${edge(-1)}`} fill={color} />}
  </g>;
}

export function GraphPatch({ to, vertices, color = ink.blue, opacity = .16 }: {
  to: Project; vertices: XYZ[]; color?: string; opacity?: number;
}) {
  return <polygon points={vertices.map((p) => to(p).map(svgNum).join(",")).join(" ")}
    fill={color} fillOpacity={opacity} stroke={color} strokeOpacity=".78" strokeWidth="2" strokeLinejoin="round" />;
}

export function GraphLabel({ to, label, size = 20 }: { to: Project; label: Label; size?: number }) {
  const [x,y] = to(label.at);
  const [dx,dy] = label.offset ?? [10,-10];
  return <text x={svgNum(x+dx)} y={svgNum(y+dy)} fill={label.color ?? ink.paper} fontSize={size}
    fontFamily="system-ui, sans-serif" fontWeight="600" textAnchor={label.anchor ?? "start"}
    stroke={ink.plot} strokeWidth="4" strokeLinejoin="round" paintOrder="stroke">
    {label.text}
  </text>;
}

export function GraphPoint({ to, label, mark = true }: { to: Project; label: Label; mark?: boolean }) {
  const [x,y] = to(label.at).map(svgNum);
  return <g>
    {mark && <circle cx={x} cy={y} r="5.3" fill={label.color ?? ink.paper} stroke={ink.plot} strokeWidth="2" />}
    <GraphLabel to={to} label={label} />
  </g>;
}

export function RightAngle({ to, at, u, v, size }: { to: Project; at: XYZ; u: XYZ; v: XYZ; size: number }) {
  const a = scale(u,size/Math.hypot(...u));
  const b = scale(v,size/Math.hypot(...v));
  const corners = [add(at,a), add(add(at,a),b), add(at,b)];
  return <polyline points={corners.map((p) => to(p).map(svgNum).join(",")).join(" ")}
    fill="none" stroke={ink.amber} strokeWidth="2" />;
}

type Bounds = readonly [xMin: number, xMax: number, yMin: number, yMax: number];

export function cartesian(bounds: Bounds): Project {
  const [xmin,xmax,ymin,ymax] = bounds;
  const pixelsPerUnit = Math.min((width-84)/(xmax-xmin),(height-60)/(ymax-ymin));
  return ([x,y]) => [width/2+(x-(xmin+xmax)/2)*pixelsPerUnit,height/2-(y-(ymin+ymax)/2)*pixelsPerUnit];
}

export function CartesianGrid({ to, bounds }: { to: Project; bounds: Bounds }) {
  const [xmin,xmax,ymin,ymax] = bounds;
  const ints = (a: number,b: number) => Array.from({length: Math.floor(b)-Math.ceil(a)+1}, (_,i) => i+Math.ceil(a)).filter(Boolean);
  const xs = ints(xmin,xmax);
  const ys = ints(ymin,ymax);
  const tickLabel = (n: number) => String(n).replace("-", "−");
  return <>
    {xs.map((x) => <GraphSegment key={`grid-x-${x}`} to={to} a={[x,ymin,0]} b={[x,ymax,0]} color={ink.grid} stroke={1} />)}
    {ys.map((y) => <GraphSegment key={`grid-y-${y}`} to={to} a={[xmin,y,0]} b={[xmax,y,0]} color={ink.grid} stroke={1} />)}
    <GraphSegment to={to} a={[xmin,0,0]} b={[xmax+.24,0,0]} color={ink.axis} stroke={1.8} arrow />
    <GraphSegment to={to} a={[0,ymin,0]} b={[0,ymax+.26,0]} color={ink.axis} stroke={1.8} arrow />
    {xs.filter((x) => x%2===0 && x<xmax).map((x) => <GraphLabel key={x} to={to} size={15} label={{text:tickLabel(x), at:[x,0,0], anchor:"middle", offset:[0,18], color:ink.axis}} />)}
    {ys.filter((y) => y%2===0 && y<ymax).map((y) => <GraphLabel key={y} to={to} size={15} label={{text:tickLabel(y), at:[0,y,0], anchor:"end", offset:[-8,5], color:ink.axis}} />)}
    <GraphLabel to={to} size={17} label={{text:"0", at:origin, anchor:"end", offset:[-7,18], color:ink.axis}} />
    <GraphLabel to={to} label={{text:"x", at:[xmax+.2,0,0], offset:[10,6]}} />
    <GraphLabel to={to} label={{text:"y", at:[0,ymax+.2,0], offset:[-10,-8]}} />
  </>;
}

export function clippedLine(p: XYZ, d: XYZ, [xmin,xmax,ymin,ymax]: Bounds): [XYZ, XYZ] {
  const limits = [[xmin,xmax],[ymin,ymax]].flatMap(([low,high],i) => d[i] === 0 ? [] : [[(low-p[i])/d[i],(high-p[i])/d[i]].sort((a,b) => a-b)]);
  return [along(p,d,Math.max(...limits.map(([a]) => a))),along(p,d,Math.min(...limits.map(([,b]) => b)))];
}

export const axisSpecs = (lo: number, hi: number): [string, XYZ, XYZ][] => [
  ["x", [lo,0,0], [hi,0,0]], ["y", [0,lo,0], [0,hi,0]], ["z", [0,0,lo], [0,0,hi]],
];

export function orthographic(points: XYZ[], { yaw = Math.PI/4, pitch = .46, padX = 74, padY = 35 }: {
  yaw?: number; pitch?: number; padX?: number; padY?: number;
} = {}): Project {
  const cosY = Math.cos(yaw), sinY = Math.sin(yaw), sinP = Math.sin(pitch), cosP = Math.cos(pitch);
  const raw = ([x,y,z]: XYZ): XY => [x*cosY-y*sinY, (x*sinY+y*cosY)*sinP-z*cosP];
  const projected = points.map(raw);
  const minX = Math.min(...projected.map((p) => p[0]));
  const maxX = Math.max(...projected.map((p) => p[0]));
  const minY = Math.min(...projected.map((p) => p[1]));
  const maxY = Math.max(...projected.map((p) => p[1]));
  const factor = Math.min((width-2*padX)/Math.max(.01,maxX-minX),(height-2*padY)/Math.max(.01,maxY-minY));
  return (p) => {
    const [x,y] = raw(p);
    return [width/2+(x-(minX+maxX)/2)*factor,height/2+(y-(minY+maxY)/2)*factor];
  };
}

export function SpaceAxes({ to, axes }: { to: Project; axes: ReturnType<typeof axisSpecs> }) {
  return <>
    {axes.map(([name,a,b]) => <g key={name}>
      <GraphSegment to={to} a={a} b={origin} color={ink.axis} stroke={1.4} dashed opacity={.65} />
      <GraphSegment to={to} a={origin} b={b} color={ink.axis} stroke={1.7} arrow />
      <GraphLabel to={to} label={{text:name, at:b, color:ink.axis, offset:name==="z" ? [10,5] : [name==="x" ? 8 : -21,19]}} />
    </g>)}
    <GraphLabel to={to} size={16} label={{text:"O", at:origin, color:ink.axis, offset:[-16,-6]}} />
  </>;
}
