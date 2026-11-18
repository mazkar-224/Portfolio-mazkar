// Run work after first paint, when the browser is idle (or after 2s at the latest).
// Animation code loads this way so it never competes with LCP or adds to TBT.

export function whenIdle(callback: () => void) {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(callback, 200);
  return () => clearTimeout(id);
}
