export type VectorDimension = 2 | 3;
export type WorkbenchVector = [number, number, number];
export type RotationAxis = "x" | "y" | "z";

export const VECTOR_EPSILON = 1e-9;

export function forDimension(vector: WorkbenchVector, dimension: VectorDimension): WorkbenchVector {
  return dimension === 2 ? [vector[0], vector[1], 0] : [...vector];
}

export function addVectors(first: WorkbenchVector, second: WorkbenchVector): WorkbenchVector {
  return [first[0] + second[0], first[1] + second[1], first[2] + second[2]];
}

export function subtractVectors(first: WorkbenchVector, second: WorkbenchVector): WorkbenchVector {
  return [first[0] - second[0], first[1] - second[1], first[2] - second[2]];
}

export function scaleVector(vector: WorkbenchVector, scalar: number): WorkbenchVector {
  return [vector[0] * scalar, vector[1] * scalar, vector[2] * scalar];
}

export function dotVectors(first: WorkbenchVector, second: WorkbenchVector, dimension: VectorDimension) {
  const a = forDimension(first, dimension);
  const b = forDimension(second, dimension);
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function crossVectors(first: WorkbenchVector, second: WorkbenchVector): WorkbenchVector {
  return [
    first[1] * second[2] - first[2] * second[1],
    first[2] * second[0] - first[0] * second[2],
    first[0] * second[1] - first[1] * second[0],
  ];
}

export function cross2D(first: WorkbenchVector, second: WorkbenchVector) {
  return first[0] * second[1] - first[1] * second[0];
}

export function vectorMagnitude(vector: WorkbenchVector, dimension: VectorDimension) {
  return Math.sqrt(dotVectors(vector, vector, dimension));
}

export function squaredMagnitude(vector: WorkbenchVector, dimension: VectorDimension) {
  return dotVectors(vector, vector, dimension);
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

function squareFreeParts(value: number) {
  let outside = 1;
  let inside = Math.max(0, Math.round(value));
  for (let factor = 2; factor * factor <= inside; factor += 1) {
    const square = factor * factor;
    while (inside % square === 0) {
      outside *= factor;
      inside /= square;
    }
  }
  return { outside, inside };
}

function approximateFraction(value: number, maxDenominator = 400) {
  if (!Number.isFinite(value)) return null;
  for (let denominator = 1; denominator <= maxDenominator; denominator += 1) {
    const numerator = Math.round(value * denominator);
    if (Math.abs(value - numerator / denominator) < 1e-9) {
      const divisor = greatestCommonDivisor(numerator, denominator);
      return { numerator: numerator / divisor, denominator: denominator / divisor };
    }
  }
  return null;
}

export function exactMagnitudeLatex(vector: WorkbenchVector, dimension: VectorDimension) {
  const squared = squaredMagnitude(vector, dimension);
  if (squared < VECTOR_EPSILON) return "0";

  const fraction = approximateFraction(squared);
  if (!fraction) return `\\sqrt{${formatNumber(squared)}}`;

  if (fraction.denominator !== 1) {
    return `\\sqrt{\\frac{${fraction.numerator}}{${fraction.denominator}}}`;
  }

  const { outside, inside } = squareFreeParts(fraction.numerator);
  if (inside === 1) return String(outside);
  return outside === 1 ? `\\sqrt{${inside}}` : `${outside}\\sqrt{${inside}}`;
}

export function normalizeVector(vector: WorkbenchVector, dimension: VectorDimension) {
  const magnitude = vectorMagnitude(vector, dimension);
  if (magnitude < VECTOR_EPSILON) return null;
  return forDimension(scaleVector(vector, 1 / magnitude), dimension);
}

export function angleBetween(first: WorkbenchVector, second: WorkbenchVector, dimension: VectorDimension) {
  const denominator = vectorMagnitude(first, dimension) * vectorMagnitude(second, dimension);
  if (denominator < VECTOR_EPSILON) return null;
  const cosine = Math.min(1, Math.max(-1, dotVectors(first, second, dimension) / denominator));
  return Math.acos(cosine) * 180 / Math.PI;
}

export function projectVector(first: WorkbenchVector, onto: WorkbenchVector, dimension: VectorDimension) {
  const denominator = dotVectors(onto, onto, dimension);
  if (denominator < VECTOR_EPSILON) return null;
  return forDimension(scaleVector(onto, dotVectors(first, onto, dimension) / denominator), dimension);
}

export function rejectVector(first: WorkbenchVector, from: WorkbenchVector, dimension: VectorDimension) {
  const projection = projectVector(first, from, dimension);
  return projection ? forDimension(subtractVectors(first, projection), dimension) : null;
}

export function componentProduct(first: WorkbenchVector, second: WorkbenchVector, dimension: VectorDimension): WorkbenchVector {
  return forDimension([first[0] * second[0], first[1] * second[1], first[2] * second[2]], dimension);
}

export function componentQuotient(first: WorkbenchVector, second: WorkbenchVector, dimension: VectorDimension) {
  const limit = dimension === 2 ? 2 : 3;
  for (let index = 0; index < limit; index += 1) {
    if (Math.abs(second[index]) < VECTOR_EPSILON) return null;
  }
  return forDimension([first[0] / second[0], first[1] / second[1], first[2] / second[2]], dimension);
}

export function rotate2D(vector: WorkbenchVector, degrees: number): WorkbenchVector {
  const radians = degrees * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return [vector[0] * cosine - vector[1] * sine, vector[0] * sine + vector[1] * cosine, 0];
}

export function rotate3D(vector: WorkbenchVector, degrees: number, axis: RotationAxis): WorkbenchVector {
  const radians = degrees * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  if (axis === "x") return [vector[0], vector[1] * cosine - vector[2] * sine, vector[1] * sine + vector[2] * cosine];
  if (axis === "y") return [vector[0] * cosine + vector[2] * sine, vector[1], -vector[0] * sine + vector[2] * cosine];
  return [vector[0] * cosine - vector[1] * sine, vector[0] * sine + vector[1] * cosine, vector[2]];
}

export function reflectVector(vector: WorkbenchVector, plane: "x-axis" | "y-axis" | "xy" | "xz" | "yz"): WorkbenchVector {
  if (plane === "x-axis") return [vector[0], -vector[1], 0];
  if (plane === "y-axis") return [-vector[0], vector[1], 0];
  if (plane === "xy") return [vector[0], vector[1], -vector[2]];
  if (plane === "xz") return [vector[0], -vector[1], vector[2]];
  return [-vector[0], vector[1], vector[2]];
}

export function relationship(first: WorkbenchVector, second: WorkbenchVector, dimension: VectorDimension) {
  const firstMagnitude = vectorMagnitude(first, dimension);
  const secondMagnitude = vectorMagnitude(second, dimension);
  if (firstMagnitude < VECTOR_EPSILON || secondMagnitude < VECTOR_EPSILON) return "A relationship requires two non-zero vectors.";
  const parallelMeasure = dimension === 2 ? Math.abs(cross2D(first, second)) : vectorMagnitude(crossVectors(first, second), 3);
  if (parallelMeasure < VECTOR_EPSILON) return "The vectors are parallel or anti-parallel.";
  if (Math.abs(dotVectors(first, second, dimension)) < VECTOR_EPSILON) return "The vectors are perpendicular.";
  return "The vectors are neither parallel nor perpendicular.";
}

export function directionAngles(vector: WorkbenchVector) {
  const magnitude = vectorMagnitude(vector, 3);
  if (magnitude < VECTOR_EPSILON) return null;
  return vector.map((component) => Math.acos(Math.min(1, Math.max(-1, component / magnitude))) * 180 / Math.PI) as WorkbenchVector;
}

export function formatNumber(value: number) {
  if (Math.abs(value) < VECTOR_EPSILON) return "0";
  if (Number.isInteger(value)) return String(value);
  return Number(value.toFixed(4)).toString();
}

export function formatWorkbenchVector(vector: WorkbenchVector, dimension: VectorDimension) {
  const values = dimension === 2 ? vector.slice(0, 2) : vector;
  return `(${values.map(formatNumber).join(", ")})`;
}
