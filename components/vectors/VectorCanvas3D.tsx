"use client";

import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { DisplayVector } from "./VectorCanvas2D";
import { formatNumber, vectorMagnitude } from "./vectorMath";

export type VectorCameraView = "isometric" | "front" | "side" | "top";

type VectorCanvas3DProps = {
  vectors: DisplayVector[];
  selectedId?: string | null;
  cameraView: VectorCameraView;
  showGrid: boolean;
  showNumbers: boolean;
  showLabels: boolean;
  onSelectVector: (id: string) => void;
};

function CoordinateLabel({ position, children, accent = false }: { position: [number, number, number]; children: React.ReactNode; accent?: boolean }) {
  return (
    <Html position={position} center distanceFactor={13} style={{ pointerEvents: "none", userSelect: "none" }}>
      <span className={`border border-white/10 bg-black/85 px-1.5 py-0.5 font-mono text-[10px] ${accent ? "text-sky-200" : "text-zinc-300"}`}>
        {children}
      </span>
    </Html>
  );
}

function NumberedAxes({ extent, showNumbers }: { extent: number; showNumbers: boolean }) {
  const rough = extent / 10;
  const power = 10 ** Math.floor(Math.log10(Math.max(rough, 0.1)));
  const normalized = rough / power;
  const interval = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * power;
  const values = useMemo(() => {
    const output: number[] = [];
    const limit = Math.floor((extent / 2) / interval) * interval;
    for (let value = -limit; value <= limit; value += interval) {
      if (value !== 0) output.push(value);
    }
    return output;
  }, [extent, interval]);
  const half = extent / 2;

  return (
    <>
      <Line points={[[-half, 0, 0], [half, 0, 0]]} color="#f5f5f5" lineWidth={1.2} />
      <Line points={[[0, -half, 0], [0, half, 0]]} color="#38bdf8" lineWidth={1.2} />
      <Line points={[[0, 0, -half], [0, 0, half]]} color="#8b8b91" lineWidth={1.2} />
      <CoordinateLabel position={[half, 0, 0]}>x</CoordinateLabel>
      <CoordinateLabel position={[0, half, 0]} accent>y</CoordinateLabel>
      <CoordinateLabel position={[0, 0, half]}>z</CoordinateLabel>
      <CoordinateLabel position={[0, 0, 0]} accent>0</CoordinateLabel>
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

function CameraRig({ view, extent }: { view: VectorCameraView; extent: number }) {
  const { camera } = useThree();

  useEffect(() => {
    const distance = Math.max(12, extent * 0.82);
    const settings = {
      isometric: { position: [distance, distance * 0.72, distance] as [number, number, number], up: [0, 1, 0] as [number, number, number] },
      front: { position: [0, distance * 0.12, distance * 1.35] as [number, number, number], up: [0, 1, 0] as [number, number, number] },
      side: { position: [distance * 1.35, distance * 0.12, 0] as [number, number, number], up: [0, 1, 0] as [number, number, number] },
      top: { position: [0, distance * 1.4, 0.01] as [number, number, number], up: [0, 0, -1] as [number, number, number] },
    }[view];
    camera.position.set(...settings.position);
    camera.up.set(...settings.up);
    camera.lookAt(0, 0.5, 0);
    camera.updateProjectionMatrix();
  }, [camera, extent, view]);

  return null;
}

function AnimatedVector({
  vector,
  selected,
  showLabel,
  onSelect,
}: {
  vector: DisplayVector;
  selected: boolean;
  showLabel: boolean;
  onSelect: () => void;
}) {
  const arrow = useMemo(() => new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, vector.color, 0.32, 0.18), [vector.color]);
  const endpointRef = useRef<THREE.Mesh>(null);
  const selectionRef = useRef<THREE.Mesh>(null);
  const current = useRef(new THREE.Vector3(...vector.value));
  const target = useRef(new THREE.Vector3(...vector.value));

  useEffect(() => {
    target.current.set(...vector.value);
  }, [vector.value]);

  useFrame(({ clock }) => {
    current.current.lerp(target.current, 0.14);
    const length = current.current.length();
    const direction = length > 1e-8 ? current.current.clone().normalize() : new THREE.Vector3(1, 0, 0);
    arrow.setDirection(direction);
    arrow.setLength(Math.max(length, 0.001), Math.min(0.42, Math.max(0.18, length * 0.12)), Math.min(0.26, Math.max(0.1, length * 0.06)));
    if (endpointRef.current) endpointRef.current.position.copy(current.current);
    if (selectionRef.current) {
      selectionRef.current.position.copy(current.current);
      const pulse = selected ? 1 + Math.sin(clock.elapsedTime * 4) * 0.13 : 1;
      selectionRef.current.scale.setScalar(pulse);
    }
  });

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect();
  };

  return (
    <group>
      <primitive object={arrow} />
      <mesh
        ref={endpointRef}
        onClick={select}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[selected ? 0.18 : 0.14, 24, 24]} />
        <meshStandardMaterial color={vector.color} emissive={vector.color} emissiveIntensity={0.5} />
      </mesh>
      {selected && (
        <mesh ref={selectionRef}>
          <sphereGeometry args={[0.31, 24, 24]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.28} wireframe />
        </mesh>
      )}
      {showLabel && (
        <Html position={vector.value} center distanceFactor={10} style={{ pointerEvents: "none", userSelect: "none" }}>
          <span className={`whitespace-nowrap border bg-black/90 px-2 py-1 font-mono text-[10px] font-semibold ${selected ? "border-sky-400/50 text-sky-100" : "border-white/15 text-zinc-100"}`}>
            {vector.label} ({vector.value.map(formatNumber).join(", ")})
          </span>
        </Html>
      )}
    </group>
  );
}

function Scene({
  vectors,
  selectedId,
  cameraView,
  extent,
  showGrid,
  showNumbers,
  showLabels,
  onSelectVector,
}: VectorCanvas3DProps & { extent: number }) {
  return (
    <>
      <color attach="background" args={["#0b0b0b"]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[8, 10, 6]} intensity={1.6} color="#dff5ff" />
      <CameraRig view={cameraView} extent={extent} />
      {showGrid && <gridHelper args={[extent, Math.min(60, Math.max(12, Math.round(extent))), "#3f3f46", "#202020"]} />}
      <NumberedAxes extent={extent} showNumbers={showNumbers} />
      {vectors.map((vector) => (
        <AnimatedVector
          key={vector.id}
          vector={vector}
          selected={selectedId === vector.id}
          showLabel={showLabels}
          onSelect={() => onSelectVector(vector.id)}
        />
      ))}
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={3} maxDistance={Math.max(36, extent * 2)} target={[0, 0.5, 0]} />
    </>
  );
}

export function VectorCanvas3D(props: VectorCanvas3DProps) {
  const largestMagnitude = props.vectors.reduce((maximum, vector) => Math.max(maximum, vectorMagnitude(vector.value, 3)), 0);
  const extent = Math.max(14, Math.ceil(largestMagnitude * 2.8));

  return (
    <div className="h-full min-h-[360px] w-full" role="img" aria-label="Three-dimensional coordinate grid showing the current vectors from the origin">
      <Canvas camera={{ position: [12, 9, 12], fov: 48 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <Scene {...props} extent={extent} />
      </Canvas>
    </div>
  );
}
