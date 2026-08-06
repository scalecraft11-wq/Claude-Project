"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, MeshDistortMaterial } from "@react-three/drei";
import type { Group } from "three";

export function ShoeModel({
  upperColor = "#101012",
  soleColor = "#d7ff3f",
  accentColor = "#d7ff3f",
}: {
  upperColor?: string;
  soleColor?: string;
  accentColor?: string;
}) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.22;
    }
  });

  return (
    <group ref={group} rotation={[0.1, 0.55, 0]}>
      <group position={[0, -0.25, 0]}>
        {/* outsole - flat wide slab */}
        <RoundedBox args={[3.7, 0.22, 1.05]} radius={0.11} smoothness={4} position={[0, 0, 0]}>
          <meshPhysicalMaterial color="#141414" roughness={0.6} clearcoat={0.2} />
        </RoundedBox>

        {/* midsole */}
        <RoundedBox args={[3.35, 0.3, 0.96]} radius={0.14} smoothness={4} position={[0, 0.26, 0]}>
          <meshPhysicalMaterial color="#f4f3ec" roughness={0.45} clearcoat={0.5} />
        </RoundedBox>

        {/* sole accent pop of color along midsole edge */}
        <RoundedBox args={[3.35, 0.09, 0.98]} radius={0.045} smoothness={4} position={[0, 0.11, 0]}>
          <meshStandardMaterial color={soleColor} roughness={0.5} />
        </RoundedBox>

        {/* main upper shell - single smooth tapered pill */}
        <RoundedBox args={[3.0, 0.98, 0.86]} radius={0.43} smoothness={6} position={[0, 0.72, 0]}>
          <MeshDistortMaterial
            color={upperColor}
            roughness={0.4}
            metalness={0.1}
            distort={0.045}
            speed={1.1}
            clearcoat={0.6}
          />
        </RoundedBox>

        {/* heel pull tab */}
        <RoundedBox args={[0.34, 0.4, 0.62]} radius={0.15} smoothness={4} position={[-1.42, 1.0, 0]}>
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.35} roughness={0.4} />
        </RoundedBox>

        {/* collar opening rim */}
        <RoundedBox args={[1.15, 0.16, 0.72]} radius={0.07} smoothness={4} position={[-0.55, 1.18, 0]} rotation={[0, 0, 0.05]}>
          <meshStandardMaterial color="#f4f3ec" roughness={0.6} />
        </RoundedBox>

        {/* laces - short bars laid across the top */}
        {[-0.55, -0.2, 0.15, 0.5].map((x, i) => (
          <mesh key={i} position={[x, 1.16 - i * 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, 0.62, 12]} />
            <meshStandardMaterial color="#f4f3ec" roughness={0.7} />
          </mesh>
        ))}

        {/* side speed-stripe accent, flush on both faces */}
        <mesh position={[0.15, 0.68, 0.435]} rotation={[0, 0, 0.16]}>
          <boxGeometry args={[1.7, 0.26, 0.035]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.45} roughness={0.35} />
        </mesh>
        <mesh position={[0.15, 0.68, -0.435]} rotation={[0, 0, 0.16]}>
          <boxGeometry args={[1.7, 0.26, 0.035]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.45} roughness={0.35} />
        </mesh>

        {/* toe cap taper */}
        <RoundedBox args={[0.62, 0.7, 0.78]} radius={0.32} smoothness={5} position={[1.62, 0.58, 0]}>
          <meshPhysicalMaterial color={upperColor} roughness={0.4} metalness={0.1} clearcoat={0.6} />
        </RoundedBox>
      </group>
    </group>
  );
}
