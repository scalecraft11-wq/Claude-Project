"use client";

import { useFrame } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";

export interface HeroParticlesProps {
  /** Desktop/tier1 defaults to 500; pass a lower count for tier2. */
  count?: number;
  radius?: number;
  color?: string;
}

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  attribute vec3 aRandom; // x: phase, y: speed, z: scale
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Cheap, GPU-only pseudo-curl drift — layered sine waves rather than a
    // full curl-noise function, evaluated entirely in the vertex shader so
    // cost stays flat regardless of particle count (ANIMATION_BLUEPRINT.md §9).
    float t = uTime * aRandom.y + aRandom.x * 6.2831853;
    pos.x += sin(t + pos.y * 0.6) * 0.35;
    pos.y += cos(t * 0.8 + pos.x * 0.6) * 0.35 + sin(uTime * 0.15 + aRandom.x * 10.0) * 0.4;
    pos.z += sin(t * 0.6 + pos.z * 0.4) * 0.35;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (140.0 * aRandom.z) / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;

    vAlpha = 0.35 + 0.35 * sin(uTime * aRandom.y + aRandom.x * 6.2831853);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    float falloff = smoothstep(0.5, 0.0, dist);
    if (falloff <= 0.001) discard;
    gl_FragColor = vec4(uColor, falloff * vAlpha);
  }
`;

/**
 * Ambient mist/dust field behind the hero product — ANIMATION_BLUEPRINT.md
 * §9. GPU-instanced points, additive blending, drift computed entirely in
 * the vertex shader (no per-particle JavaScript).
 */
export function HeroParticles({
  count = 500,
  radius = 4.5,
  color = "#c9a15c",
}: HeroParticlesProps) {
  const materialRef = React.useRef<THREE.ShaderMaterial>(null);

  const [positions, randoms] = React.useMemo(() => {
    const positionArray = new Float32Array(count * 3);
    const randomArray = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positionArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positionArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positionArray[i * 3 + 2] = r * Math.cos(phi) * 0.6;

      randomArray[i * 3] = Math.random();
      randomArray[i * 3 + 1] = 0.1 + Math.random() * 0.2;
      randomArray[i * 3 + 2] = 0.4 + Math.random() * 1.1;
    }

    return [positionArray, randomArray];
  }, [count, radius]);

  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color],
  );

  useFrame((_, delta) => {
    // Mutate the original `uniforms` object directly (concrete literal
    // type) rather than through `material.uniforms.uTime`, which is typed
    // via THREE's generic index signature and would otherwise report as
    // possibly-undefined under `noUncheckedIndexedAccess`.
    if (materialRef.current) {
      uniforms.uTime.value += delta;
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
