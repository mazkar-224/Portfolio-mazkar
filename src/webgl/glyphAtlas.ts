import { CanvasTexture, LinearFilter } from "three";

/** Characters from darkest to brightest. Mono glyphs read as the HUD's own language. */
export const GLYPHS = " .:-=+*#%@";

/**
 * Draws the glyphs side by side on a 2D canvas (white on transparent) and wraps it as a
 * texture. Uses JetBrains Mono when the page has loaded it, else the system monospace.
 * The caller owns the texture and must dispose() it.
 */
export function createGlyphAtlas(cellPx: number) {
  const size = Math.max(16, Math.round(cellPx * 2)); // draw at 2x for crisp edges
  const canvas = document.createElement("canvas");
  canvas.width = size * GLYPHS.length;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");

  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains-mono").trim();
  ctx.font = `500 ${Math.round(size * 0.82)}px ${family || "ui-monospace"}, monospace`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  [...GLYPHS].forEach((char, i) => ctx.fillText(char, i * size + size / 2, size / 2 + size * 0.04));

  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}
