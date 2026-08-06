"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, PresentationControls } from "@react-three/drei";
import { ShoeModel } from "@/components/three/ShoeModel";

export function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 6.2], fov: 32 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 3]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[0, -1, 3]} intensity={0.6} color="#d7ff3f" />

      <Suspense fallback={null}>
        <PresentationControls
          global
          snap
          speed={1.2}
          rotation={[0, 0, 0]}
          polar={[-0.3, 0.3]}
          azimuth={[-1.1, 1.1]}
          damping={0.3}
        >
          <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.7}>
            <ShoeModel />
          </Float>
        </PresentationControls>
        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.55}
          scale={10}
          blur={2.4}
          far={2.5}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}
