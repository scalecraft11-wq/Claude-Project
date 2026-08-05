"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as React from "react";
import type { Group } from "three";

import { HeroParticles } from "@/components/lumora/hero/hero-particles";

import type { DeviceTier } from "@/lib/three/device-tier";
import { getCanvasProps } from "@/lib/three/canvas-defaults";

/** A near-imperceptible autonomous drift — the scene should read as
 * "alive," never as obviously animating (ANIMATION_BLUEPRINT.md §7). */
function AmbientDrift({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.15;
  });

  return <group ref={ref}>{children}</group>;
}

/**
 * The Agency site's own 3D signature — deliberately abstract, not
 * literal, per DESIGN_SYSTEM.md's 3D style guide: "if a 3D element
 * appears on the agency's own site, it is abstract, not literal... never
 * a literal 3D object, to keep the agency site's restraint intact." No
 * product mesh, no studio lighting rig — just the ambient particle field
 * already built for the Lumora hero, reused here in monochrome/copper.
 */
export function HomeHeroScene({ tier }: { tier: DeviceTier }) {
  const canvasProps = React.useMemo(() => getCanvasProps(tier), [tier]);

  return (
    <Canvas
      {...canvasProps}
      camera={{ position: [0, 0, 6], fov: 40 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <AmbientDrift>
        <HeroParticles
          count={tier === "tier1" ? 400 : 140}
          radius={5}
          color="#a8632b"
        />
      </AmbientDrift>
    </Canvas>
  );
}
