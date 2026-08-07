"use client";

/**
 * Velocity Nova X — the brand's original flagship silhouette.
 * Entirely procedural geometry; not modeled on any existing shoe.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, MeshDistortMaterial } from "@react-three/drei";
import type { Group } from "three";

export function ShoeModel({
  upperColor = "#141414",
  soleColor = "#c2a878",
  accentColor = "#c2a878",
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

        {/* outsole tread grooves */}
        {[-1.3, -0.75, -0.2, 0.4, 1.0, 1.5].map((x, i) => (
          <mesh key={i} position={[x, -0.08, 0]}>
            <boxGeometry args={[0.06, 0.05, 0.92]} />
            <meshStandardMaterial color="#000000" roughness={0.9} />
          </mesh>
        ))}

        {/* midsole */}
        <RoundedBox args={[3.35, 0.3, 0.96]} radius={0.14} smoothness={4} position={[0, 0.26, 0]}>
          <meshPhysicalMaterial color="#f4f3ec" roughness={0.45} clearcoat={0.5} />
        </RoundedBox>

        {/* sole accent pop of color along midsole edge */}
        <RoundedBox args={[3.35, 0.09, 0.98]} radius={0.045} smoothness={4} position={[0, 0.11, 0]}>
          <meshStandardMaterial color={soleColor} roughness={0.3} metalness={0.55} />
        </RoundedBox>

        {/* main upper shell - single smooth tapered pill (leather layer) */}
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

        {/* mesh overlay panel - translucent layered material on the vamp */}
        <mesh position={[0.55, 0.75, 0.44]} rotation={[0, 0, -0.08]}>
          <planeGeometry args={[1.05, 0.62]} />
          <meshPhysicalMaterial
            color={upperColor}
            roughness={0.6}
            transmission={0.35}
            thickness={0.2}
            transparent
            opacity={0.55}
          />
        </mesh>
        <mesh position={[0.55, 0.75, -0.44]} rotation={[0, 0, -0.08]}>
          <planeGeometry args={[1.05, 0.62]} />
          <meshPhysicalMaterial
            color={upperColor}
            roughness={0.6}
            transmission={0.35}
            thickness={0.2}
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* heel counter */}
        <RoundedBox args={[0.34, 0.4, 0.62]} radius={0.15} smoothness={4} position={[-1.42, 1.0, 0]}>
          <meshStandardMaterial color={upperColor} roughness={0.4} metalness={0.15} />
        </RoundedBox>

        {/* brand chevron mark on the heel, metallic gold */}
        <group position={[-1.42, 1.0, 0.32]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[-0.08, 0, 0]} rotation={[0, 0, 0.62]}>
            <boxGeometry args={[0.24, 0.05, 0.02]} />
            <meshStandardMaterial color={accentColor} metalness={0.85} roughness={0.2} emissive={accentColor} emissiveIntensity={0.1} />
          </mesh>
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, -0.62]}>
            <boxGeometry args={[0.24, 0.05, 0.02]} />
            <meshStandardMaterial color={accentColor} metalness={0.85} roughness={0.2} emissive={accentColor} emissiveIntensity={0.1} />
          </mesh>
        </group>

        {/* collar opening rim with metallic trim */}
        <RoundedBox args={[1.15, 0.16, 0.72]} radius={0.07} smoothness={4} position={[-0.55, 1.18, 0]} rotation={[0, 0, 0.05]}>
          <meshStandardMaterial color="#f4f3ec" roughness={0.6} />
        </RoundedBox>
        <RoundedBox args={[1.17, 0.045, 0.74]} radius={0.02} smoothness={4} position={[-0.55, 1.1, 0]} rotation={[0, 0, 0.05]}>
          <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.25} />
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
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.1} roughness={0.25} metalness={0.6} />
        </mesh>
        <mesh position={[0.15, 0.68, -0.435]} rotation={[0, 0, 0.16]}>
          <boxGeometry args={[1.7, 0.26, 0.035]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.1} roughness={0.25} metalness={0.6} />
        </mesh>

        {/* toe cap taper */}
        <RoundedBox args={[0.62, 0.7, 0.78]} radius={0.32} smoothness={5} position={[1.62, 0.58, 0]}>
          <meshPhysicalMaterial color={upperColor} roughness={0.4} metalness={0.1} clearcoat={0.6} />
        </RoundedBox>
      </group>
    </group>
  );
}
