import {
  GraphFrame, GraphPatch, GraphPoint, GraphSegment, SpaceAxes,
  axisSpecs, ink, origin, orthographic,
  type Label, type XYZ,
} from "@/components/graphs/CourseGraph";

type Sketch = {
  title: string;
  caption: string;
  vertices?: XYZ[];
  construction?: XYZ[];
  labels: Label[];
};

const coordinates = ([x,y,z]: XYZ) => `(${x}, ${y}, ${z})`.replaceAll("-", "−");

function intercepts(x: number, y: number, z: number): Sketch {
  const points: XYZ[] = [[x,0,0], [0,y,0], [0,0,z]];
  return {
    title: "Join the three axis intercepts",
    caption: "The triangle shows the orientation of the plane. The plane extends beyond its edges.",
    vertices: points,
    labels: points.map((at, i) => ({
      at,
      text: `${"ABC"[i]} ${coordinates(at)}`,
      ...(i === 0 ? { offset: [10,-11] } : i === 1 ? { offset: [-9,-8], anchor: "end" } : { offset: [-11,-7], anchor: "end" }),
    })),
  };
}

function projectedPoint(point: XYZ, name: string): Sketch {
  const [x,y,z] = point;
  const foot: XYZ = [x,y,0];
  return {
    title: "Plot the point and its projection",
    caption: `${name} lies ${Math.abs(z)} units ${z > 0 ? "above" : "below"} the xy-plane. The dashed path takes you along x, then parallel to y, then parallel to z. H is the point you reach before the last step.`,
    construction: [origin, [x,0,0], foot, point],
    labels: [
      {at:point, text:`${name} ${coordinates(point)}`, color:ink.amber},
      {at:foot, text:`H ${coordinates(foot)}`, offset:z<0 ? [-11,-10] : [12,21], anchor:z<0 ? "end" : "start"},
    ],
  };
}

const sketches: Record<string, Sketch> = {
  "hw-8-6-p1": projectedPoint([2,-1,3], "P"),
  "hw-8-6-p2": projectedPoint([-1,2,-2], "R"),
  "hw-8-6-p3": intercepts(3,2,1),
  "hw-8-6-p5": {
    title: "Use two trace directions through the origin",
    caption: "This is a patch of x + y + z = 0. The two dashed segments connect the origin to points on different traces, so their directions determine the plane.",
    vertices: [[2,-1,-1], [0,1,-1], [-2,1,1], [0,-1,1]],
    construction: [[1,-1,0], origin, [1,0,-1]],
    labels: [
      {at:[1,-1,0], text:"(1, −1, 0)", offset:[9,-9]},
      {at:[1,0,-1], text:"(1, 0, −1)", offset:[10,16]},
    ],
  },
  "q-82-w4": intercepts(6,4,2),
  "t-82-w4": intercepts(12,8,4),
  "fx-20": {
    title: "Extend the plane parallel to the y-axis",
    caption: "The patch meets the x- and z-axes. Its edges show how the plane extends parallel to y. It does not meet the y-axis.",
    vertices: [[3,-1,0], [3,2,0], [0,2,2], [0,-1,2]],
    construction: [[3,0,0], [0,0,2]],
    labels: [
      {at:[3,0,0], text:"(3, 0, 0)", offset:[10,-10]},
      {at:[0,0,2], text:"(0, 0, 2)", offset:[-11,-10], anchor:"end"},
      {at:[3,1,0], text:"(3, 1, 0)", offset:[10,21]},
    ],
  },
};

export function WorkedSketch({ questionId }: { questionId: string }) {
  const sketch = sketches[questionId];
  if (!sketch) return null;
  const {vertices = [], construction = [], labels, title, caption} = sketch;
  const points = [...vertices, ...construction, ...labels.map(({at}) => at)];
  const end = Math.max(2.5,...points.flat().map(Math.abs))*1.15;
  const axes = axisSpecs(-end*.75,end);
  const to = orthographic([...points,...axes.flatMap(([,a,b]) => [a,b])],{padX:105,padY:34,pitch:.58});
  return <GraphFrame title={title} caption={caption} className="max-w-2xl">
    {vertices.length > 0 && <GraphPatch to={to} vertices={vertices} />}
    <SpaceAxes to={to} axes={axes} />
    {construction.slice(1).map((point,i) => <GraphSegment key={i} to={to} a={construction[i]} b={point} color={ink.amber} stroke={2.6} dashed />)}
    {labels.map((label) => <GraphPoint key={label.text} to={to} label={label} />)}
  </GraphFrame>;
}
