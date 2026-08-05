"use client";

import { animated, useSpring } from "@react-spring/three";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as React from "react";
import type * as THREE from "three";

import { springPresets } from "@/lib/animation/springs";

export interface SerumBottleProps {
  /** Disables real-time transmission sampling for mid-tier devices —
   * ANIMATION_BLUEPRINT.md §26 (Tier 2: "simplified materials"). */
  simplifiedMaterial?: boolean;
  /** Disables pointer-follow lean and idle float — used when the scene is
   * driven purely by scroll (rare) or for a static first paint. */
  interactive?: boolean;
}

const GOLD = "#c9a15c";
const GOLD_DARK = "#8f6935";
const LIQUID = "#b8842f";

/**
 * A procedurally modeled luxury serum bottle — no external `.glb` asset,
 * built entirely from primitive geometry + physically-based materials so
 * the hero has zero external asset dependencies (ARCHITECTURE.md's
 * self-contained-foundation principle, applied to 3D). Glass body uses
 * real transmission/refraction (Drei's `MeshTransmissionMaterial`), the
 * cap is a brushed-metal PBR material, and the liquid is a separate,
 * slightly emissive mesh nested inside the glass — matching
 * ANIMATION_BLUEPRINT.md §24 ("3D Style").
 */
export function SerumBottle({
  simplifiedMaterial = false,
  interactive = true,
}: SerumBottleProps) {
  const leanRef = React.useRef<THREE.Group>(null);

  const [{ rotX, rotY }, api] = useSpring(() => ({
    rotX: 0,
    rotY: 0,
    config: springPresets.organicCamera,
  }));

  useFrame((state) => {
    if (!interactive) return;
    api.start({
      rotX: state.pointer.y * 0.12,
      rotY: state.pointer.x * 0.22,
    });
  });

  const bottle = (
    <animated.group ref={leanRef} rotation-x={rotX} rotation-y={rotY}>
      {/* Cap */}
      <mesh position={[0, 1.72, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.46, 0.5, 48]} />
        <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.42, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.42, 0.16, 48]} />
        <meshStandardMaterial
          color={GOLD_DARK}
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>

      {/* Glass body */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.62, 1.3, 8, 32]} />
        {simplifiedMaterial ? (
          <meshPhysicalMaterial
            color="#f6ead3"
            transparent
            opacity={0.35}
            roughness={0.1}
            metalness={0}
            transmission={0.6}
            ior={1.4}
          />
        ) : (
          <MeshTransmissionMaterial
            samples={6}
            resolution={256}
            thickness={0.4}
            roughness={0.05}
            chromaticAberration={0.02}
            anisotropy={0.1}
            distortion={0.05}
            distortionScale={0.2}
            temporalDistortion={0.02}
            ior={1.45}
            color="#f6ead3"
          />
        )}
      </mesh>

      {/* Liquid */}
      <mesh position={[0, 0.25, 0]}>
        <capsuleGeometry args={[0.52, 0.75, 8, 32]} />
        <meshPhysicalMaterial
          color={LIQUID}
          roughness={0.2}
          transmission={0.4}
          thickness={0.6}
          ior={1.33}
          emissive={LIQUID}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Label band */}
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[0.635, 0.03, 16, 64]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.35} />
      </mesh>
    </animated.group>
  );

  if (!interactive) return bottle;

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      {bottle}
    </Float>
  );
}
