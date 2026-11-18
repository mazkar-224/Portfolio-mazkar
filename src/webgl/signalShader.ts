// "Signal from noise" (WebGL option A, chosen 18 Nov 2026): the real CloudCostGuard dashboard
// screenshot arrives as ASCII characters and grain, then resolves cell by cell into the clean
// image. Near the pointer (desktop only) it briefly breaks back into characters.
// Never used on a photo of a person (CLAUDE.md: no WebGL or distortion on his face).

/** Full-screen plane in clip space: the canvas exactly covers the screenshot underneath. */
export const signalVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const signalFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  // The screenshot itself (the same optimised file the <img> underneath already loaded).
  uniform sampler2D uImage;
  // Glyph atlas: uGlyphCount characters side by side, white on transparent, sparsest first.
  uniform sampler2D uGlyphs;
  // Number of glyphs in the atlas.
  uniform float uGlyphCount;
  // Canvas size in device pixels.
  uniform vec2 uResolution;
  // Size of one character cell, in device pixels.
  uniform float uCell;
  // 0 = all ASCII and grain, 1 = clean image. Each cell resolves at its own moment around this.
  uniform float uProgress;
  // Seconds since start: animates the grain so the noise looks live while it resolves.
  uniform float uTime;
  // Pointer position in UV space (0..1, origin bottom left).
  uniform vec2 uPointer;
  // 0..1: how strongly the area around the pointer breaks back into characters (eased in JS).
  uniform float uPointerStrength;
  // Background colour for the ASCII state: --void (#0A0B0D).
  uniform vec3 uVoid;
  // Character colour for ink: --bone (#ECECEA). Coloured areas keep their own hue.
  uniform vec3 uBone;

  // Cheap hash: a stable pseudo-random value per cell.
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 px = vUv * uResolution;
    vec2 cell = floor(px / uCell);
    vec2 cellUv = (cell + 0.5) * uCell / uResolution;
    vec2 inCell = fract(px / uCell);

    vec3 image = texture2D(uImage, vUv).rgb;
    vec3 cellColour = texture2D(uImage, cellUv).rgb;
    float luma = dot(cellColour, vec3(0.299, 0.587, 0.114));
    float maxC = max(cellColour.r, max(cellColour.g, cellColour.b));
    float sat = maxC - min(cellColour.r, min(cellColour.g, cellColour.b));

    // "Signal" is what stands out from the page: dark ink on the light dashboard, and colour
    // (the charts). Empty background becomes void, so the state reads as signal on --void.
    float signal = clamp(max(1.0 - luma, sat * 1.6), 0.0, 1.0);

    // Pick a glyph by signal strength; add a little flicker while the noise is live.
    float flicker = (hash(cell + floor(uTime * 12.0)) - 0.5) * 0.12 * (1.0 - uProgress);
    float index = clamp(floor((signal + flicker) * uGlyphCount), 0.0, uGlyphCount - 1.0);
    vec2 glyphUv = vec2((index + inCell.x) / uGlyphCount, inCell.y);
    float glyph = texture2D(uGlyphs, glyphUv).a;

    // Ink in --bone; coloured areas keep their own hue at full brightness.
    vec3 hue = cellColour / max(maxC, 0.001);
    vec3 tint = mix(uBone, hue, clamp(sat * 2.5, 0.0, 1.0));
    vec3 ascii = mix(uVoid, tint * (0.45 + 0.55 * signal), glyph);
    float grain = (hash(px + uTime * 60.0) - 0.5) * 0.08;
    ascii += grain;

    // Each cell resolves at its own threshold, so the image condenses out of the noise.
    float threshold = hash(cell) * 0.75;
    float resolved = smoothstep(threshold, threshold + 0.25, uProgress);

    // Pointer: within ~6 cells the image breaks back into characters, strongest at the centre.
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    float dist = distance(vUv * aspect, uPointer * aspect);
    float radius = 6.0 * uCell / uResolution.y;
    float near = (1.0 - smoothstep(radius * 0.4, radius, dist)) * uPointerStrength;
    resolved = min(resolved, 1.0 - near);

    gl_FragColor = vec4(mix(ascii, image, resolved), 1.0);
  }
`;
