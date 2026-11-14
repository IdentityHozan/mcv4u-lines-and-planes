import type { ComponentProps, ReactNode } from "react";
import {
  GraphFrame, GraphLabel, GraphPatch, GraphPoint, GraphSegment, CartesianGrid, SpaceAxes, RightAngle,
  ink, add, subtract, along, patch, footOnPlane, axisSpecs, orthographic, cartesian, clippedLine,
  type XYZ, type Label, type Project,
} from "@/components/graphs/CourseGraph";

type LessonDiagramProps = { lessonId: string; className?: string };

type Segment = Omit<ComponentProps<typeof GraphSegment>, "to">;
type Plane = Omit<ComponentProps<typeof GraphPatch>, "to">;
type Corner = Omit<ComponentProps<typeof RightAngle>, "to">;
type Scene = {
  title: string;
  caption: string;
  segments: Segment[];
  labels: Label[];
  planes?: Plane[];
  text?: Label[];
  corner?: Corner;
};

function Plot({ scene, to, children, className }: { scene: Scene; to: Project; children?: ReactNode; className?: string }) {
  return (
    <GraphFrame title={scene.title} caption={scene.caption} className={className}>
      {scene.planes?.map((plane,i) => <GraphPatch key={i} to={to} {...plane} />)}
      {children}
      {scene.segments.map((segment,i) => <GraphSegment key={i} to={to} {...segment} />)}
      {scene.corner && <RightAngle to={to} {...scene.corner} />}
      {scene.labels.map((label) => <GraphPoint key={label.text} to={to} label={label} />)}
      {scene.text?.map((label) => <GraphLabel key={label.text} to={to} label={label} />)}
    </GraphFrame>
  );
}

type PlanarScene = Scene & { bounds: Parameters<typeof cartesian>[0]; };
type SpaceScene = Scene & {
  extent?: [number,number] | false;
  camera?: Parameters<typeof orthographic>[1];
};

const lineThrough = (point: XYZ, direction: XYZ, bounds: PlanarScene["bounds"]): Segment => {
  const [a,b] = clippedLine(point,direction,bounds);
  return {a,b,stroke:2.8};
};

const planarScenes: Record<string, PlanarScene> = {
  "line-equations": (() => {
    const a: XYZ = [1,4,0], d: XYZ = [2,-3,0];
    const b = along(a,d,1), p = along(a,d,2);
    const bounds: PlanarScene["bounds"] = [-1,7,-4,6];
    return {
      title: "Follow the same direction along the line",
      caption: "Start at A(1, 4). The arrow shows one copy of the direction [2, −3]: move 2 units right and 3 down to B(3, 1). A second copy reaches P(5, −2). Each grid square is one unit.",
      bounds,
      segments: [
        lineThrough(a,d,bounds),
        {a,b,color:ink.blue,stroke:4,arrow:true},
        {a:b,b:p,color:ink.blue,stroke:3,dashed:true,arrow:true},
      ],
      labels: [
        {text:"A (1, 4)",at:a,offset:[-12,-11],anchor:"end"},
        {text:"B (3, 1)",at:b,offset:[13,0]},
        {text:"P (5, −2)",at:p,offset:[13,0]},
      ],
      text: [{text:"[2, −3]",at:along(a,d,.47),color:ink.blue,offset:[12,-10]}],
    };
  })(),
  "cartesian-lines-r2": (() => {
    const a: XYZ = [0,2,0], d: XYZ = [3,2,0], n: XYZ = [2,-3,0];
    const bounds: PlanarScene["bounds"] = [-4,6,-3,6];
    return {
      title: "The direction and normal form a right angle",
      caption: "On 2x − 3y + 6 = 0, use A(0, 2) as the starting point. The direction [3, 2] stays on the line. The normal [2, −3] leaves it at 90°. The axes use the same scale.",
      bounds,
      segments: [lineThrough(a,d,bounds), {a,b:add(a,d),color:ink.blue,stroke:4,arrow:true},
        {a,b:add(a,n),color:ink.amber,stroke:4,arrow:true}],
      labels: [{text:"A (0, 2)",at:a,offset:[-13,-12],anchor:"end"}],
      text: [
        {text:"[3, 2]",at:add(a,d),offset:[10,-9],color:ink.blue},
        {text:"[2, −3]",at:add(a,n),offset:[11,11],color:ink.amber},
      ],
      corner: {at:a,u:d,v:n,size:.58},
    };
  })(),
  "point-line-distance": (() => {
    const p: XYZ = [-6,4,0], n: XYZ = [5,-3,0], d: XYZ = [3,5,0];
    const h = footOnPlane(p,n,15), bounds: PlanarScene["bounds"] = [-8,2,-6,6];
    return {
      title: "Measure the perpendicular segment, not a slanted one",
      caption: "The amber segment from P(−6, 4) to H meets 5x − 3y + 15 = 0 at a right angle. H = (−69/34, 55/34) is the closest point. The length of PH is 27/√34 units.",
      bounds,
      segments: [lineThrough(h,d,bounds), {a:p,b:h,color:ink.amber,stroke:4,dashed:true}],
      labels: [{text:"P (−6, 4)",at:p,offset:[-9,-11],anchor:"end"}, {text:"H",at:h,offset:[12,1],color:ink.amber}],
      text: [{text:"L",at:along(h,d,.72),offset:[11,-6]}],
      corner: {at:h,u:d,v:subtract(p,h),size:.68},
    };
  })(),
};

const spaceScenes: Record<string, SpaceScene> = {
  "lines-r3": (() => {
    const a: XYZ = [1,3,6], d: XYZ = [2,-5,4], b = add(a,d);
    return {
      title: "One parameter moves all three coordinates",
      caption: "The line starts at A(1, 3, 6) when t = 0. At t = 1, adding [2, −5, 4] lands at P(3, −2, 10). This is an orthographic view of the exact 3D coordinates.",
      extent: [-4,5], camera: {yaw:1,pitch:.62},
      segments: [{a:along(a,d,-.88),b:along(a,d,1.57)}, {a,b,color:ink.blue,stroke:4,arrow:true}],
      labels: [{text:"A (1, 3, 6)",at:a,anchor:"end",offset:[-10,-13]}, {text:"P (3, −2, 10)",at:b,offset:[12,-8]}],
    };
  })(),
  "defining-a-plane": (() => {
    const a: XYZ = [1,0,2], u: XYZ = [1,1,0], v: XYZ = [0,1,1], b = add(a,u), c = add(a,v);
    const q = along(along(a,u,2),v,-1);
    const span = (s: number,t: number) => along(along(a,u,s),v,t);
    return {
      title: "Two directions give two independent moves",
      caption: "A is the starting point. The blue arrow takes you to B when s = 1, t = 0. The violet arrow takes you to C when s = 0, t = 1. The tinted patch is part of the same plane, which continues beyond its edges.",
      extent: false, camera: {yaw:2.38,pitch:.56,padX:75,padY:49},
      planes: [{vertices:[span(-.76,-1.4),span(2.35,-1.4),span(2.35,2.1),span(-.76,2.1)]}],
      segments: [{a,b,color:ink.blue,stroke:4,arrow:true}, {a,b:c,color:ink.violet,stroke:4,arrow:true}],
      labels: [
        {text:"A (1, 0, 2)",at:a,offset:[13,18]}, {text:"B (2, 1, 2)",at:b,offset:[-9,28],anchor:"end"},
        {text:"C (1, 1, 3)",at:c,offset:[-10,-9],anchor:"end"}, {text:"Q (3, 1, 1)",at:q,offset:[9,22]},
      ],
    };
  })(),
  "plane-equations": (() => {
    const a: XYZ = [2,-1,3], n: XYZ = [1,2,-1], u: XYZ = [1,0,1], v: XYZ = [-1,1,1];
    const end = add(a,n);
    return {
      title: "A normal fixes the plane’s orientation",
      caption: "The shaded patch belongs to x + 2y − z + 3 = 0. The amber arrow starts at P₀(2, −1, 3) and points along [1, 2, −1]. Its perpendicularity is in three dimensions; the projected angle can look different.",
      extent: [-2,3.3], camera: {yaw:.87,pitch:.53},
      planes: [{vertices:patch(a,u,v,-1.05,1.05)}],
      segments: [{a,b:end,color:ink.amber,stroke:4,arrow:true}],
      labels: [{text:"P₀ (2, −1, 3)",at:a,offset:[-10,-12],anchor:"end"}],
      text: [{text:"n = [1, 2, −1]",at:end,offset:[12,10],color:ink.amber}],
      corner: {at:a,u,v:n,size:.47},
    };
  })(),
  "sketching-r3": {
    title: "Read the intercepts on the three axes",
    caption: "For 2x − y + z = 4, the intercepts are A(2, 0, 0), B(0, −4, 0), and C(0, 0, 4). B is on the dashed, negative side of the y-axis. The triangle shows the plane’s orientation; the plane extends beyond it.",
    extent: [-5.2,5.2], camera: {yaw:.87,pitch:.51,padX:94},
    planes: [{vertices:[[2,0,0],[0,-4,0],[0,0,4]]}],
    segments: [],
    labels: [
      {text:"A (2, 0, 0)",at:[2,0,0],offset:[10,24]},
      {text:"B (0, −4, 0)",at:[0,-4,0],offset:[6,-9],color:ink.amber},
      {text:"C (0, 0, 4)",at:[0,0,4],offset:[-12,-7],anchor:"end"},
    ],
  },
  "line-plane-intersections": (() => {
    const a: XYZ = [1,0,2], d: XYZ = [1,2,-1], p = add(a,d);
    return {
      title: "The line crosses the plane at one point",
      caption: "At t = 1, the line reaches P(2, 2, 1), where the three coordinates add to 5. The solid and dashed parts show the same line on opposite sides of the plane.",
      extent: [-1.5,4.5], camera: {yaw:.87,pitch:.6},
      planes: [{vertices:patch(p,[1,-1,0],[1,1,-2],-1.23,1.23)}],
      segments: [
        {a:along(p,d,1.28),b:p,dashed:true,color:ink.paper,opacity:.75},
        {a:p,b:along(p,d,-1.64),color:ink.paper},
      ],
      labels: [{text:"P (2, 2, 1)",at:p,offset:[-13,21],anchor:"end",color:ink.amber}],
      text: [{text:"x + y + z = 5",at:[3.8,1.65,-.45],offset:[8,9],color:ink.blue}],
    };
  })(),
  "two-plane-intersections": (() => {
    const a: XYZ = [2,1,0], d: XYZ = [-1,0,1], u: XYZ = [0,1,-1], v: XYZ = [0,1,1];
    const onPlane = (s: number,t: number,basis: XYZ) => along(along(a,d,s),basis,t);
    const plane = (basis: XYZ) => [[-1,-1.3],[2.3,-1.3],[2.3,1.3],[-1,1.3]].map(([s,t]) => onPlane(s,t,basis));
    return {
      title: "Both planes contain the highlighted line",
      caption: "The blue plane is x + y + z = 3 and the violet plane is x − y + z = 1. Their common line passes through A(2, 1, 0) in direction [−1, 0, 1]. Every point on it has y = 1.",
      extent: [-1.6,3.5], camera: {yaw:.86,pitch:.46,padX:78},
      planes: [{vertices:plane(u)},{vertices:plane(v),color:ink.violet,opacity:.14}],
      segments: [{a:along(a,d,-1),b:along(a,d,2.3),color:ink.amber,stroke:4}],
      labels: [{text:"A (2, 1, 0)",at:a,offset:[-15,20],anchor:"end",color:ink.amber}],
      text: [
        {text:"Π₁",at:onPlane(-.8,-1.3,u),offset:[8,-2],color:ink.blue},
        {text:"Π₂",at:onPlane(-.8,1.3,v),offset:[7,17],color:ink.violet},
      ],
    };
  })(),
  "consistent-systems": {
    title: "One point satisfies all three equations",
    caption: "The patches represent x + y + z = 6, 2x − y + z = 3, and x + 2y − z = 2. Their common point is (1, 2, 3). Each plane alone has infinitely many points.",
    extent: [-1,4], camera: {yaw:.73,pitch:.56},
    planes: [
      {vertices:patch([1,2,3],[1,-1,0],[0,1,-1],-1.2,1.2)},
      {vertices:patch([1,2,3],[1,2,0],[0,1,1],-.82,.82),color:ink.violet,opacity:.14},
      {vertices:patch([1,2,3],[1,0,1],[0,1,2],-1,1),color:ink.green,opacity:.12},
    ],
    segments: [],
    labels: [{text:"(1, 2, 3)",at:[1,2,3],offset:[12,-12],color:ink.amber}],
  },
  "three-plane-intersections": {
    title: "Three plane equations can pin down one point",
    caption: "In the worked example the three planes meet at (1, 2, 3). The pairwise intersection lines all pass through this point, but no full line lies in all three planes.",
    extent: [-1.4,4.1], camera: {yaw:.73,pitch:.57},
    planes: [
      {vertices:patch([1,2,3],[1,-1,0],[0,1,-1],-1.4,1.4)},
      {vertices:patch([1,2,3],[1,1,0],[0,1,1],-1.35,1.35),color:ink.violet,opacity:.14},
      {vertices:patch([1,2,3],[1,0,1],[0,1,1],-1.22,1.22),color:ink.green,opacity:.12},
    ],
    segments: ([[1,0,-1],[1,-1,0],[0,1,1]] as XYZ[]).map((d) => ({
      a:along([1,2,3],d,-1.04), b:along([1,2,3],d,1.04), color:ink.paper, stroke:2.1, opacity:.85,
    })),
    labels: [{text:"(1, 2, 3)",at:[1,2,3],offset:[12,-11],color:ink.amber}],
  },
  "point-plane-distance": (() => {
    const p: XYZ = [-1,2,-4], n: XYZ = [8,-4,8], d = 3, h = footOnPlane(p,n,d);
    return {
      title: "The shortest path follows the plane normal",
      caption: "The segment from P(−1, 2, −4) to H(3/2, 3/4, −3/2) follows the normal of 8x − 4y + 8z + 3 = 0. Its length is 15/4 units. The square marks a right angle in space.",
      extent: [-3.5,3], camera: {yaw:.73,pitch:.31,padX:92},
      planes: [{vertices:patch(h,[1,0,-1],[0,2,1],-1.15,1.15)}],
      segments: [{a:p,b:h,color:ink.amber,stroke:3.7,dashed:true}],
      labels: [{text:"P (−1, 2, −4)",at:p,offset:[-13,5],anchor:"end"}, {text:"H",at:h,offset:[12,0],color:ink.amber}],
      corner: {at:h,u:[1,0,-1],v:subtract(p,h),size:.62},
    };
  })(),
};

export function LessonDiagram({ lessonId, className }: LessonDiagramProps) {
  const plane = planarScenes[lessonId];
  if (plane) {
    const to = cartesian(plane.bounds);
    return <Plot scene={plane} to={to} className={className}><CartesianGrid to={to} bounds={plane.bounds} /></Plot>;
  }
  const space = spaceScenes[lessonId];
  if (!space) return null;
  const axes = space.extent === false ? [] : axisSpecs(...(space.extent ?? [-3,4]));
  const to = orthographic([
    ...axes.flatMap(([,a,b]) => [a,b]),
    ...(space.planes?.flatMap((plane) => plane.vertices) ?? []),
    ...space.segments.flatMap(({a,b}) => [a,b]),
    ...space.labels.map(({at}) => at),
    ...(space.text?.map(({at}) => at) ?? []),
  ],space.camera);
  return <Plot scene={space} to={to} className={className}>{axes.length > 0 && <SpaceAxes to={to} axes={axes} />}</Plot>;
}
