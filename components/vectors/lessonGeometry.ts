import type { Vector3Value } from "./Interactive3DPlane";

export type LessonExperiment = "line" | "plane" | "line-plane" | "two-planes" | "three-planes" | "distance";
export type GeometryPreset = {
  section: string; title: string; instruction: string; experiment: LessonExperiment;
  linePoint: Vector3Value; direction: Vector3Value; normal: Vector3Value; constant: number;
  secondNormal: Vector3Value; secondConstant: number; point: Vector3Value;
  spanA: Vector3Value; spanB: Vector3Value; planePoint: Vector3Value;
  distanceMode: "point-line" | "point-plane"; traces?: boolean; plotPoint?: boolean;
};
const base = { linePoint: [1, 0, 2] as Vector3Value, direction: [1, 2, -1] as Vector3Value, normal: [1, -1, 1] as Vector3Value, constant: 3, secondNormal: [1, 1, 1] as Vector3Value, secondConstant: 3, point: [2, -1, 3] as Vector3Value, spanA: [1, 1, 0] as Vector3Value, spanB: [0, 1, 1] as Vector3Value, planePoint: [1, 0, 2] as Vector3Value, distanceMode: "point-line" as const };
export const geometryPresets: GeometryPreset[] = [
  { ...base, section: "8.1", title: "Vector and parametric lines in R²", instruction: "Start at A(1,4). Vary t to move along direction [2,−3]. One value of t controls both coordinates. The z-coordinate remains zero.", experiment: "line", linePoint: [1,4,0], direction: [2,-3,0] },
  { ...base, section: "8.2", title: "Cartesian and vector forms in R²", instruction: "The direction [3,2] is perpendicular to normal [2,−3]. The same line has Cartesian equation 2x−3y+6=0. Keep z=0 when exploring this two-dimensional lesson.", experiment: "line", linePoint: [0,2,0], direction: [3,2,0] },
  { ...base, section: "8.3", title: "Lines in R³", instruction: "Vary t and watch x stay at −2 while y and z change. In symmetric form, keep x=−2 separately and equate (y−3)/1 with (z−5)/(−6).", experiment: "line", linePoint: [-2,3,5], direction: [0,1,-6] },
  { ...base, section: "8.4", title: "Vector and parametric planes", instruction: "Use A(1,0,2) and independent spans [1,1,0], [0,1,1]. Vary s and t independently. Their cross product supplies the normal.", experiment: "plane" },
  { ...base, section: "8.5", title: "Cartesian equations and plane properties", instruction: "Read normal [1,−1,1] from x−y+z=3. Change the normal to rotate the plane or change the constant to move it. Compare two planes using the experiment selector.", experiment: "plane" },
  { ...base, section: "8.6", title: "Sketching points and planes", instruction: "Inspect P(2,−1,3) and its coordinate guides. The plane 2x+3y+6z=6 meets the axes at (3,0,0), (0,2,0), (0,0,1). The coloured traces lie in the coordinate planes.", experiment: "plane", normal: [2,3,6], constant: 6, traces: true, plotPoint: true },
  { ...base, section: "9.1", title: "Line and plane intersections", instruction: "Substitute one shared t into the plane. A nonzero normal-direction dot product gives one intersection; zero requires a separate anchor check.", experiment: "line-plane", normal: [1,1,1], constant: 5 },
  { ...base, section: "9.2", title: "Systems of equations", instruction: "Each plane equation is one simultaneous constraint. Compare the two-plane and three-plane experiments and interpret a point, line, plane or empty common set.", experiment: "three-planes", normal: [1,1,1], constant: 6, secondNormal: [1,-1,0], secondConstant: -1 },
  { ...base, section: "9.3", title: "Intersection of two planes", instruction: "The intersection direction is the cross product of the normals. Verify both a point on the line and its direction in both plane equations.", experiment: "two-planes", normal: [1,1,1], constant: 3, secondNormal: [1,-1,1], secondConstant: 1 },
  { ...base, section: "9.4", title: "Intersection of three planes", instruction: "Solve all three equations together. The default planes share (1,2,3). Changing the third constraint can leave a point, a line, a plane, or no common points.", experiment: "three-planes", normal: [1,1,1], constant: 6, secondNormal: [1,-1,0], secondConstant: -1 },
  { ...base, section: "9.5", title: "Point to line distance", instruction: "The closest point H lies on the line and PH is perpendicular to its direction. Compare the exact radical with the decimal approximation.", experiment: "distance", linePoint: [0,0,0], direction: [1,1,0], point: [1,0,2], distanceMode: "point-line" },
  { ...base, section: "9.6", title: "Point to plane distance", instruction: "The shortest connector follows the normal. Verify that H satisfies the plane equation and that P−H is parallel to its normal.", experiment: "distance", normal: [2,-1,2], constant: 3, point: [3,1,2], distanceMode: "point-plane" },
];
export function getGeometryPreset(section?: string) { return geometryPresets.find(preset => preset.section === section); }
export function solveThreePlanes(normals: Vector3Value[], constants: number[]) {
  const rows = normals.map((normal, index) => [...normal, constants[index]]);
  const pivots: number[] = []; let row = 0;
  for (let column = 0; column < 3 && row < rows.length; column++) {
    let best = row; for (let candidate = row + 1; candidate < rows.length; candidate++) if (Math.abs(rows[candidate][column]) > Math.abs(rows[best][column])) best = candidate;
    if (Math.abs(rows[best][column]) < 1e-9) continue;
    [rows[row], rows[best]] = [rows[best], rows[row]];
    const pivot = rows[row][column]; rows[row] = rows[row].map(value => value / pivot);
    for (let other = 0; other < rows.length; other++) if (other !== row) { const factor = rows[other][column]; rows[other] = rows[other].map((value, index) => value - factor * rows[row][index]); }
    pivots.push(column); row++;
  }
  if (rows.some(values => values.slice(0,3).every(value => Math.abs(value) < 1e-9) && Math.abs(values[3]) > 1e-9)) return { type: "none" as const, rank: pivots.length, point: null, direction: null, rows };
  const point: Vector3Value = [0,0,0]; pivots.forEach((column,index) => { point[column] = rows[index][3]; });
  let direction:Vector3Value|null=null;
  if(pivots.length===2){const free=[0,1,2].find(column=>!pivots.includes(column))!;direction=[0,0,0];direction[free]=1;pivots.forEach((column,index)=>{direction![column]=-rows[index][free];});}
  return { direction, type: pivots.length === 3 ? "point" as const : pivots.length === 2 ? "line" as const : "plane" as const, rank: pivots.length, point, rows };
}
export function radical(value: number) {
  if (Math.abs(value) < 1e-10) return "0";
  if (!Number.isInteger(value)) return `\\sqrt{${Number(value.toFixed(8))}}`;
  let outside = 1, inside = Math.round(value);
  for (let factor = 2; factor * factor <= inside; factor++) while (inside % (factor * factor) === 0) { outside *= factor; inside /= factor * factor; }
  return inside === 1 ? String(outside) : `${outside === 1 ? "" : outside}\\sqrt{${inside}}`;
}
