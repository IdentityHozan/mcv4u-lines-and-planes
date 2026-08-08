"use client";

import { Html, Line, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type Vector3Value = [number, number, number];
export type CameraView = "isometric" | "front" | "side" | "top";
export type ScenePointSelection = {
  label: string;
  position: Vector3Value;
};

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
  showObjectLabels: boolean;
  cameraView: CameraView;
  selectedPoint: ScenePointSelection | null;
  onSelectPoint: (selection: ScenePointSelection) => void;
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

function roundedPoint(point: THREE.Vector3): Vector3Value {
  return point.toArray().map((value) => Number(value.toFixed(2))) as Vector3Value;
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
      <span className={`border border-white/10 bg-black/85 px-1.5 py-0.5 font-mono text-[10px] ${accent ? "text-sky-200" : "text-zinc-300"}`}>{children}</span>
    </Html>
  );
}

function ObjectLabel({ position, children, accent = false }: { position: Vector3Value; children: React.ReactNode; accent?: boolean }) {
  return (
    <Html position={position} center distanceFactor={10} style={{ pointerEvents: "none", userSelect: "none" }}>
      <span className={`whitespace-nowrap border px-2 py-1 font-mono text-[10px] font-semibold shadow-lg backdrop-blur ${
        accent ? "border-sky-400/40 bg-sky-950/90 text-sky-100" : "border-white/20 bg-black/90 text-zinc-100"
      }`}>{children}</span>
    </Html>
  );
}

function SelectablePoint({
  position,
  label,
  color,
  size,
  onSelect,
}: {
  position: Vector3Value;
  label: string;
  color: string;
  size: number;
  onSelect: (selection: ScenePointSelection) => void;
}) {
  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect({
      label,
      position: position.map((value) => Number(value.toFixed(2))) as Vector3Value,
    });
  };

  return (
    <mesh
      position={position}
      onClick={select}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <sphereGeometry args={[size, 28, 28]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.75} />
    </mesh>
  );
}

function SelectedPointMarker({ selection }: { selection: ScenePointSelection }) {
  const markerRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!markerRef.current) return;
    const scale = 1 + Math.sin(clock.elapsedTime * 4) * 0.16;
    markerRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={markerRef} position={selection.position}>
      <mesh>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.32} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.07, 18, 18]} />
        <meshBasicMaterial color="#f5f5f5" />
      </mesh>
      <ObjectLabel position={[0, 0.55, 0]} accent>{selection.label}</ObjectLabel>
    </group>
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
    showObjectLabels,
    selectedPoint,
    onSelectPoint,
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

  const selectPlanePoint = (label: string) => (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelectPoint({ label, position: roundedPoint(event.point) });
  };

  const showPointer = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "crosshair";
  };

  return (
    <>
      <color attach="background" args={["#0c0c0c"]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[6, 9, 4]} intensity={1.7} color="#dff5ff" />

      <gridHelper args={[gridSize, gridSize, "#343434", "#1d1d1d"]} />
      <NumberedAxes gridSize={gridSize} showNumbers={showNumberLabels} showAxes={showAxes} />

      {planeVisible && (
        <group
          position={primaryPlane.point}
          quaternion={primaryPlane.quaternion}
          onClick={selectPlanePoint("Point on Plane 1")}
          onPointerOver={showPointer}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
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
        <group
          position={secondaryPlane.point}
          quaternion={secondaryPlane.quaternion}
          onClick={selectPlanePoint("Point on Plane 2")}
          onPointerOver={showPointer}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
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
          <SelectablePoint position={linePoint} label="Line anchor" color="#f5f5f5" size={0.16} onSelect={onSelectPoint} />
          <SelectablePoint position={trackedPoint.toArray() as Vector3Value} label="Tracked point" color="#38bdf8" size={0.2} onSelect={onSelectPoint} />
          <Arrow direction={safeDirection} origin={linePoint} color="#7dd3fc" />
          {showObjectLabels && (
            <>
              <ObjectLabel position={[linePoint[0], linePoint[1] + 0.55, linePoint[2]]}>r₀ ({linePoint.join(", ")})</ObjectLabel>
              <ObjectLabel position={[trackedPoint.x, trackedPoint.y - 0.55, trackedPoint.z]} accent>r(t) ({trackedPoint.toArray().map((value) => Number(value.toFixed(2))).join(", ")})</ObjectLabel>
            </>
          )}
        </>
      )}

      {lineVisible && planeVisible && linePlaneIntersection && (
        <>
          <SelectablePoint
            position={linePlaneIntersection.toArray() as Vector3Value}
            label="Line-plane intersection"
            color="#f5f5f5"
            size={0.24}
            onSelect={onSelectPoint}
          />
          {showObjectLabels && <ObjectLabel position={[linePlaneIntersection.x, linePlaneIntersection.y + 0.65, linePlaneIntersection.z]}>Intersection</ObjectLabel>}
        </>
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

      {planeVisible && showObjectLabels && (
        <ObjectLabel position={[primaryPlane.point.x + 1, primaryPlane.point.y + 0.6, primaryPlane.point.z + 1]} accent>Plane 1</ObjectLabel>
      )}
      {planeVisible && secondPlaneEnabled && showObjectLabels && (
        <ObjectLabel position={[secondaryPlane.point.x - 1, secondaryPlane.point.y + 0.6, secondaryPlane.point.z - 1]}>Plane 2</ObjectLabel>
      )}

      {selectedPoint && <SelectedPointMarker selection={selectedPoint} />}

      <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={4} maxDistance={Math.max(28, gridSize * 1.8)} target={[0, 0.6, 0]} />
    </>
  );
}

export function Interactive3DPlane(props: Interactive3DPlaneProps) {
  const camera = {
    isometric: { position: [9, 7, 10] as Vector3Value, up: [0, 1, 0] as Vector3Value },
    front: { position: [0, 2, 16] as Vector3Value, up: [0, 1, 0] as Vector3Value },
    side: { position: [16, 2, 0] as Vector3Value, up: [0, 1, 0] as Vector3Value },
    top: { position: [0, 16, 0.01] as Vector3Value, up: [0, 0, -1] as Vector3Value },
  }[props.cameraView];

  return (
    <Canvas key={props.cameraView} camera={{ position: camera.position, up: camera.up, fov: 48 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
      <Scene {...props} />
    </Canvas>
  );
}
