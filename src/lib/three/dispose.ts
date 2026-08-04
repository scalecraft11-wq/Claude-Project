import type { Object3D } from "three";

interface Disposable {
  dispose: () => void;
}

function isDisposable(value: unknown): value is Disposable {
  return (
    typeof value === "object" &&
    value !== null &&
    "dispose" in value &&
    typeof (value as Disposable).dispose === "function"
  );
}

/**
 * Recursively disposes geometries, materials, and textures under a
 * Three.js object graph. React Three Fiber removes objects from the scene
 * on unmount but does **not** free their GPU resources — every scene that
 * loads a model/texture (the product viewer, any future hero scene) must
 * call this in a cleanup function, or repeated mounts (e.g. route changes
 * during development, or a variant swap) leak VRAM — ANIMATION_BLUEPRINT.md
 * §25 (GPU Optimization).
 */
export function disposeObject3D(root: Object3D): void {
  root.traverse((node) => {
    const mesh = node as unknown as {
      geometry?: Disposable;
      material?: unknown;
    };

    if (mesh.geometry && isDisposable(mesh.geometry)) {
      mesh.geometry.dispose();
    }

    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : mesh.material
        ? [mesh.material]
        : [];

    for (const material of materials) {
      if (material && typeof material === "object") {
        for (const value of Object.values(material)) {
          if (isDisposable(value)) {
            value.dispose();
          }
        }
        if (isDisposable(material)) {
          material.dispose();
        }
      }
    }
  });
}
