import { useEffect, useState } from "react";

/**
 * True only after the component has mounted on the client. Use this to
 * gate anything that must not render (or must render differently) during
 * SSR — e.g. a value read from `localStorage`, or a WebGL canvas that
 * needs `window` to exist before it can even check device capability.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
