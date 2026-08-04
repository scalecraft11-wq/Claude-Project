/**
 * Ambient augmentations for browser APIs not yet in `lib.dom.d.ts` that the
 * device-capability detection in `lib/three/device-tier.ts` relies on.
 */
export {};

declare global {
  interface NetworkInformation extends EventTarget {
    readonly saveData?: boolean;
    readonly effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  }

  interface Navigator {
    readonly connection?: NetworkInformation;
    readonly deviceMemory?: number;
  }
}
