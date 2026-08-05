"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as React from "react";
import * as THREE from "three";

import { HeroParticles } from "@/components/lumora/hero/hero-particles";
import { SerumBottle } from "@/components/lumora/hero/serum-bottle";

import type { DeviceTier } from "@/lib/three/device-tier";
import { getCanvasProps } from "@/lib/three/canvas-defaults";

export interface HeroSceneProps {
  tier: DeviceTier;
  /** A plain mutable ref (not React state) updated by a GSAP ScrollTrigger
   * outside the canvas — ANIMATION_BLUEPRINT.md §25: continuous,
   * high-frequency values stay off React's render cycle. 0 = hero just
   * entered view, 1 = fully scrolled through the pinned sequence. */
  scrollProgressRef: React.RefObject<{ value: number }>;
  interactive?: boolean;
}

/**
 * Camera dolly/tilt driven by scroll progress (GSAP-authored, read here
 * every frame) plus a subtle pointer-parallax layer on desktop —
 * ANIMATION_BLUEPRINT.md §7 (Camera Movement). Both are damped with a
 * manual per-frame lerp rather than a spring, since this needs to track a
 * *continuously updating* external value (scroll), not settle toward a
 * single changed target.
 */
function CameraRig({
  scrollProgressRef,
  interactive,
}: Pick<HeroSceneProps, "scrollProgressRef" | "interactive">) {
  useFrame((state, delta) => {
    const progress = scrollProgressRef.current.value;

    const targetZ = THREE.MathUtils.lerp(6.4, 4.1, progress);
    const targetY = THREE.MathUtils.lerp(0.5, 0.05, progress);
    const parallaxX = interactive ? state.pointer.x * 0.3 : 0;

    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      targetZ,
      4,
      delta,
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      targetY,
      4,
      delta,
    );
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      parallaxX,
      4,
      delta,
    );

    state.camera.lookAt(0, 0.55, 0);
  });

  return null;
}

/**
 * The gradient studio lighting rig — DESIGN_SYSTEM.md §7/§24: a warm key
 * light, a cool rim light, and a `Lightformer`-built environment for
 * reflections. No external HDRI file is fetched — the environment is
 * constructed procedurally from colored panels, which is also what gives
 * the glass its gradient-lit reflections (ANIMATION_BLUEPRINT.md §7/§8).
 */
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[3.5, 4, 2]}
        intensity={1.4}
        color="#fff4e0"
        castShadow
      />
      <pointLight position={[-3, 1.5, -2]} intensity={6} color="#c9a15c" />

      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={2}
          color="#f6ead3"
          scale={[6, 3, 1]}
          position={[0, 3, -4]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#6b7a5e"
          scale={[4, 2, 1]}
          position={[-4, 1, 2]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={3}
          color="#c9a15c"
          scale={3}
          position={[3, 2, 3]}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  );
}

/**
 * The hero's 3D scene — ANIMATION_BLUEPRINT.md's centerpiece. Mounted only
 * on tier1/tier2 devices (ANIMATION_BLUEPRINT.md §26); tier3 renders
 * `<HeroFallback>` instead and never reaches this component at all.
 */
export function HeroScene({
  tier,
  scrollProgressRef,
  interactive = true,
}: HeroSceneProps) {
  const canvasProps = React.useMemo(() => getCanvasProps(tier), [tier]);

  return (
    <Canvas
      {...canvasProps}
      camera={{ position: [0, 0.5, 6.4], fov: 32 }}
      // R3F's wrapper div defaults to `position: relative` via inline
      // style; overriding through `style` (merged last by Canvas itself)
      // rather than a Tailwind class, since a class can't out-specificity
      // an inline style.
      style={{ position: "absolute", inset: 0 }}
    >
      <StudioLighting />
      <CameraRig
        scrollProgressRef={scrollProgressRef}
        interactive={interactive}
      />
      <SerumBottle
        simplifiedMaterial={tier === "tier2"}
        interactive={interactive}
      />
      <ContactShadows
        position={[0, -0.85, 0]}
        opacity={0.5}
        scale={6}
        blur={2.4}
        far={2}
        resolution={256}
        color="#1c1712"
      />
      {tier === "tier1" && <HeroParticles count={500} />}
      {tier === "tier2" && <HeroParticles count={150} />}
    </Canvas>
  );
}
