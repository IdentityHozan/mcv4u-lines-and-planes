"use client";

import { Html, Line, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

export type Vector3Value = [number, number, number];

type Interactive3DPlaneProps = {
  linePoint: Vector3Value;
  lineDirection: Vector3Value;
  planeNormal: Vector3Value;
  planeConstant: number;
  secondPlaneEnabled: boolean;
  secondPlaneNormal: Vector3Value;
  secondPlaneConstant: number;
  parameter: number;
  mode: "line" | "plane" | "both";
  gridSize: number;
  showNumberLabels: boolean;
  showAxes: boolean;
  showNormalVectors: boolean;
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

function Arrow({ direction, origin, color, length = 2.5 }: { direction: Vector3Value; origin: Vector3Value; color: string; length?: number }) {
  const helper = useMemo(() => {
    const vector = new THREE.Vector3(...direction);
    if (vector.lengthSq() === 0) vector.set(1, 0, 0);
    return new THREE.ArrowHelper(vector.normalize(), new THREE.Vector3(...origin), length, color, 0.32, 0.16);
  }, [color, direction, length, origin]);

  return <primitive object={helper} />;
}

function makePlane(normal: Vector3Value, constant: number) {
  const vector = new THREE.Vector3(...normal);
  if (vector.lengthSq() < EPSILON) vector.set(0, 1, 0);
  const point = vector.clone().multiplyScalar(constant / vector.lengthSq());
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), vector.clone().normalize());
  return { point, quaternion, safeNormal: vector.toArray() as Vector3Value };
}

function CoordinateLabel({ position, children, accent = false }: { position: Vector3Value; children: React.ReactNode; accent?: boolean }) {
  return (
    <Html position={position} center distanceFactor={13} style={{ pointerEvents: "none", userSelect: "none" }}>
      <span className={`rounded-sm bg-black/80 px-1 py-0.5 font-mono text-[9px] ${accent ? "text-sky-300" : "text-zinc-400"}`}>{children}</span>
    </Html>
  );
}

function NumberedAxes({ gridSize, showNumbers, showAxes }: { gridSize: number; showNumbers: boolean; showAxes: boolean }) {
  const limit = gridSize / 2;
  const values = useMemo(() => {
    const interval = gridSize >= 24 ? 4 : 2;
    const result: number[] = [];
    for (let value = -Math.floor(limit / interval) * interval; value <= limit; value += interval) {
      if (value !== 0) result.push(value);
    }
    return result;
  }, [gridSize, limit]);

  return (
    <>
      {showAxes && (
        <>
          <Line points={[[-limit, 0, 0], [limit, 0, 0]]} color="#f5f5f5" lineWidth={1.2} />
          <Line points={[[0, -limit, 0], [0, limit, 0]]} color="#38bdf8" lineWidth={1.2} />
          <Line points={[[0, 0, -limit], [0, 0, limit]]} color="#888888" lineWidth={1.2} />
          <CoordinateLabel position={[limit, 0, 0]}>x</CoordinateLabel>
          <CoordinateLabel position={[0, limit, 0]} accent>y</CoordinateLabel>
          <CoordinateLabel position={[0, 0, limit]}>z</CoordinateLabel>
          <CoordinateLabel position={[0, 0, 0]} accent>0</CoordinateLabel>
        </>
      )}
      {showNumbers && values.map((value) => (
        <group key={value}>
          <CoordinateLabel position={[value, 0, 0]}>{value}</CoordinateLabel>
          <CoordinateLabel position={[0, value, 0]} accent>{value}</CoordinateLabel>
          <CoordinateLabel position={[0, 0, value]}>{value}</CoordinateLabel>
        </group>
      ))}
    </>
  );
}

function Scene(props: Interactive3DPlaneProps) {
  const {
    linePoint,
    lineDirection,
    planeNormal,
    planeConstant,
    secondPlaneEnabled,
    secondPlaneNormal,
    secondPlaneConstant,
    parameter,
    mode,
    gridSize,
    showNumberLabels,
    showAxes,
    showNormalVectors,
  } = props;

  const safeDirection = useMemo<Vector3Value>(() => {
    const direction = new THREE.Vector3(...lineDirection);
    return direction.lengthSq() < EPSILON ? [1, 0, 0] : lineDirection;
  }, [lineDirection]);
  const primaryPlane = useMemo(() => makePlane(planeNormal, planeConstant), [planeConstant, planeNormal]);
  const secondaryPlane = useMemo(() => makePlane(secondPlaneNormal, secondPlaneConstant), [secondPlaneConstant, secondPlaneNormal]);
  const planeSize = gridSize * 0.66;

  const lineEndpoints = useMemo(() => {
    const point = new THREE.Vector3(...linePoint);
    const direction = new THREE.Vector3(...safeDirection).normalize();
    return [point.clone().addScaledVector(direction, -gridSize), point.clone().addScaledVector(direction, gridSize)] as const;
  }, [gridSize, linePoint, safeDirection]);

  const trackedPoint = useMemo(() => {
    return new THREE.Vector3(...linePoint).addScaledVector(new THREE.Vector3(...safeDirection), parameter);
  }, [linePoint, parameter, safeDirection]);

  const linePlaneIntersection = useMemo(() => {
    const denominator = dot(primaryPlane.safeNormal, safeDirection);
    if (Math.abs(denominator) < EPSILON) return null;
    const t = (planeConstant - dot(primaryPlane.safeNormal, linePoint)) / denominator;
    return new THREE.Vector3(...linePoint).addScaledVector(new THREE.Vector3(...safeDirection), t);
  }, [linePoint, planeConstant, primaryPlane.safeNormal, safeDirection]);

  const planeIntersectionLine = useMemo(() => {
    if (!secondPlaneEnabled) return null;
    const directionArray = cross(primaryPlane.safeNormal, secondaryPlane.safeNormal);
    const direction = new THREE.Vector3(...directionArray);
    const denominator = direction.lengthSq();
    if (denominator < EPSILON) return null;
    const firstNormal = new THREE.Vector3(...primaryPlane.safeNormal);
    const secondNormal = new THREE.Vector3(...secondaryPlane.safeNormal);
    const point = secondNormal.clone().cross(direction).multiplyScalar(planeConstant)
      .add(direction.clone().cross(firstNormal).multiplyScalar(secondPlaneConstant))
      .divideScalar(denominator);
    const unitDirection = direction.normalize();
    return [point.clone().addScaledVector(unitDirection, -gridSize), point.clone().addScaledVector(unitDirection, gridSize)] as const;
  }, [gridSize, planeConstant, primaryPlane.safeNormal, secondPlaneConstant, secondPlaneEnabled, secondaryPlane.safeNormal]);

  const planeVisible = mode === "plane" || mode === "both";
  const lineVisible = mode === "line" || mode === "both";

  return (
    <>
      <color attach="background" args={["#0c0c0c"]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[6, 9, 4]} intensity={1.7} color="#dff5ff" />

      <gridHelper args={[gridSize, gridSize, "#343434", "#1d1d1d"]} />
      <NumberedAxes gridSize={gridSize} showNumbers={showNumberLabels} showAxes={showAxes} />

      {planeVisible && (
        <group position={primaryPlane.point} quaternion={primaryPlane.quaternion}>
          <mesh>
            <planeGeometry args={[planeSize, planeSize]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.13} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[planeSize, planeSize, 12, 12]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} side={THREE.DoubleSide} wireframe />
          </mesh>
        </group>
      )}

      {planeVisible && secondPlaneEnabled && (
        <group position={secondaryPlane.point} quaternion={secondaryPlane.quaternion}>
          <mesh>
            <planeGeometry args={[planeSize, planeSize]} />
            <meshStandardMaterial color="#f5f5f5" transparent opacity={0.085} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[planeSize, planeSize, 10, 10]} />
            <meshBasicMaterial color="#a1a1aa" transparent opacity={0.16} side={THREE.DoubleSide} wireframe />
          </mesh>
        </group>
      )}

      {lineVisible && (
        <>
          <Line points={lineEndpoints} color="#f5f5f5" lineWidth={2.2} />
          <mesh position={linePoint}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial color="#f5f5f5" emissive="#555555" />
          </mesh>
          <mesh position={trackedPoint}>
            <sphereGeometry args={[0.17, 24, 24]} />
            <meshStandardMaterial color="#38bdf8" emissive="#1688b8" emissiveIntensity={1.2} />
          </mesh>
          <Arrow direction={safeDirection} origin={linePoint} color="#7dd3fc" />
        </>
      )}

      {lineVisible && planeVisible && linePlaneIntersection && (
        <mesh position={linePlaneIntersection}>
          <sphereGeometry args={[0.22, 28, 28]} />
          <meshStandardMaterial color="#f5f5f5" emissive="#38bdf8" emissiveIntensity={0.9} />
        </mesh>
      )}

      {planeVisible && showNormalVectors && (
        <Arrow direction={primaryPlane.safeNormal} origin={primaryPlane.point.toArray() as Vector3Value} color="#38bdf8" length={2.8} />
      )}
      {planeVisible && secondPlaneEnabled && showNormalVectors && (
        <Arrow direction={secondaryPlane.safeNormal} origin={secondaryPlane.point.toArray() as Vector3Value} color="#f5f5f5" length={2.5} />
      )}
      {planeVisible && secondPlaneEnabled && planeIntersectionLine && (
        <Line points={planeIntersectionLine} color="#f5f5f5" lineWidth={3} />
      )}

      <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={4} maxDistance={Math.max(28, gridSize * 1.8)} target={[0, 0.6, 0]} />
    </>
  );
}

export function Interactive3DPlane(props: Interactive3DPlaneProps) {
  return (
    <Canvas camera={{ position: [9, 7, 10], fov: 48 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
      <Scene {...props} />
    </Canvas>
  );
}
