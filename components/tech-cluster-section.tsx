"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { TechItem } from "@/lib/portfolio-data";

type TechClusterSectionProps = {
  techItems: TechItem[];
};

function ClusterScene({
  techItems,
  activeName,
  onHover,
}: {
  techItems: TechItem[];
  activeName: string;
  onHover: (item: TechItem) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(
    () =>
      techItems.map((_, index) => {
        const offset = index + 0.5;
        const phi = Math.acos(1 - (2 * offset) / techItems.length);
        const theta = Math.PI * (1 + Math.sqrt(5)) * offset;
        const radius = 2.15;

        return [
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.cos(phi),
          radius * Math.sin(theta) * Math.sin(phi),
        ] as [number, number, number];
      }),
    [techItems],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      state.pointer.y * 0.2,
      0.04,
    );
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.25,
      0.04,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.22,
      0.04,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <group ref={groupRef}>
        {techItems.map((tech, index) => {
          const isActive = tech.name === activeName;

          return (
            <Float
              key={tech.name}
              speed={1.2 + index * 0.03}
              floatIntensity={0.55}
              rotationIntensity={0.35}
              position={positions[index]}
            >
              <mesh
                scale={isActive ? 1.28 : 1}
                onPointerOver={() => onHover(tech)}
                onClick={() => onHover(tech)}
              >
                <icosahedronGeometry args={[0.35, 1]} />
                <meshStandardMaterial
                  color={tech.color}
                  emissive={tech.color}
                  emissiveIntensity={isActive ? 0.45 : 0.16}
                  roughness={0.2}
                  metalness={0.4}
                />
              </mesh>
              <Html center distanceFactor={10}>
                <div
                  className={`pointer-events-none whitespace-nowrap rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.26em] backdrop-blur-md transition-all ${
                    isActive
                      ? "border-white/18 bg-white/12 text-white"
                      : "border-white/10 bg-slate-950/70 text-slate-300"
                  }`}
                >
                  {tech.name}
                </div>
              </Html>
            </Float>
          );
        })}
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]}>
        <ringGeometry args={[2.5, 2.7, 64]} />
        <meshBasicMaterial color="#1e293b" transparent opacity={0.7} />
      </mesh>
      <Sparkles count={70} scale={[6, 6, 6]} size={2.4} speed={0.35} color="#60a5fa" />
    </>
  );
}

export function TechClusterSection({ techItems }: TechClusterSectionProps) {
  const [activeTech, setActiveTech] = useState<TechItem>(techItems[0]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-center">
      <div className="glass-panel relative h-[420px] overflow-hidden p-0 sm:h-[520px]">
        <div className="absolute left-6 top-6 z-10 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-300 backdrop-blur-md">
          Hover to inspect the stack
        </div>
        <Canvas camera={{ position: [0, 0, 7], fov: 42 }}>
          <color attach="background" args={["#030712"]} />
          <fog attach="fog" args={["#030712", 5, 10]} />
          <ambientLight intensity={0.95} />
          <directionalLight position={[3, 4, 5]} intensity={2} color="#dbeafe" />
          <pointLight position={[-4, 0, 2]} intensity={18} color="#38bdf8" />
          <pointLight position={[4, 2, -2]} intensity={15} color="#22d3ee" />
          <ClusterScene
            techItems={techItems}
            activeName={activeTech.name}
            onHover={setActiveTech}
          />
        </Canvas>
      </div>

      <div className="space-y-5">
        <div className="glass-panel p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                {activeTech.category}
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                {activeTech.name}
              </h3>
            </div>
            <span
              className="h-4 w-4 rounded-full border border-white/20 shadow-[0_0_24px_rgba(96,165,250,0.3)]"
              style={{ backgroundColor: activeTech.color }}
            />
          </div>
          <p className="mt-5 text-base leading-7 text-slate-300">
            {activeTech.description}
          </p>
          <p className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-400">
            {activeTech.detail}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {techItems.map((tech) => (
            <button
              key={tech.name}
              type="button"
              onMouseEnter={() => setActiveTech(tech)}
              onFocus={() => setActiveTech(tech)}
              onClick={() => setActiveTech(tech)}
              className={`rounded-full border px-4 py-2 text-sm transition-all ${
                tech.name === activeTech.name
                  ? "border-sky-300/30 bg-sky-300/10 text-sky-100"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white"
              }`}
            >
              {tech.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
