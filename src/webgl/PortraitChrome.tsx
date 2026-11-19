"use client";

// The hero portrait effect (after his reference portrait): the black-and-white headshot drawn
// as a fine dot screen, brighter areas as bigger dots, with the warm rim light baked into the
// image. Near the pointer the photo ripples and the dots open up to the plain photo.
// The plain graded photo underneath (with a CSS dot layer) is the fallback.

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { TextureLoader, type ShaderMaterial, type Texture } from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  // The graded cutout (transparent background, warm rim light baked in).
  uniform sampler2D uTex;
  // Canvas size in device pixels.
  uniform vec2 uRes;
  // Device pixel ratio (keeps the dot spacing constant across screens).
  uniform float uDpr;
  // Seconds, for the ripple.
  uniform float uTime;
  // Pointer position in UV space, and how present it is (0..1, eased in and out).
  uniform vec2 uPointer;
  uniform float uHover;
  // Dot texture strength (0 = plain photo, 1 = full dot screen).
  uniform float uDots;

  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / uRes.y;

    // Liquid ripple around the pointer.
    vec2 d = uv - uPointer; d.x *= aspect;
    float dist = length(d);
    float near = exp(-dist * dist * 38.0) * uHover;
    uv += normalize(d + 1e-5) * sin(dist * 70.0 - uTime * 5.0) * 0.005 * near;

    vec4 tex = texture2D(uTex, uv);
    float l = luma(tex.rgb);

    // Dot screen (the reference portrait): a fine grid of round dots every 2.6 CSS px, every
    // other row offset by half a dot. Brighter areas get bigger dots, so the photo stays clear
    // and the light parts read as glowing points.
    vec2 px = vUv * uRes / uDpr;
    float cell = 2.6;
    vec2 g = px / cell;
    g.x += step(1.0, mod(floor(g.y), 2.0)) * 0.5;
    vec2 f = fract(g) - 0.5;
    float r = 0.22 + 0.3 * sqrt(l);
    float dotMask = smoothstep(r, r - 0.14, length(f));
    vec3 screened = tex.rgb * mix(0.34, 1.45, dotMask);
    // Near the pointer the dots open up to the plain photo.
    vec3 col = mix(tex.rgb, screened, uDots * (1.0 - near * 0.8));

    gl_FragColor = vec4(col * tex.a, tex.a);
  }
`;

function Portrait({ texture, host, onFirstFrame }: { texture: Texture; host: HTMLElement; onFirstFrame: () => void }) {
  const material = useRef<ShaderMaterial>(null);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const live = useRef({ x: 0.5, y: 0.5, target: 0, hover: 0, first: true });
  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uRes: { value: [1, 1] },
      uDpr: { value: 1 },
      uTime: { value: 0 },
      uPointer: { value: [0.5, 0.5] },
      uHover: { value: 0 },
      uDots: { value: 1 },
    }),
    [texture],
  );

  useEffect(() => {
    // Listen on the window: the hero's name and buttons sit over the portrait, so pointer
    // events over them never reach the portrait's own box.
    const move = (e: PointerEvent) => {
      const b = host.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      live.current.x = x;
      live.current.y = 1 - y;
      live.current.target = inside ? 1 : 0;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [host]);

  useFrame(({ clock }) => {
    const u = material.current?.uniforms;
    if (!u) return;
    const s = live.current;
    s.hover += (s.target - s.hover) * 0.08;
    const p = u.uPointer.value as number[];
    p[0] += (s.x - p[0]) * 0.18;
    p[1] += (s.y - p[1]) * 0.18;
    u.uHover.value = s.hover;
    u.uTime.value = clock.getElapsedTime();
    u.uRes.value = [size.width * dpr, size.height * dpr];
    u.uDpr.value = dpr;
    if (s.first) {
      s.first = false;
      onFirstFrame();
    }
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} transparent premultipliedAlpha depthWrite={false} />
    </mesh>
  );
}

export default function PortraitChrome({ src, onReady }: { src: string; onReady?: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [texture, setTexture] = useState<Texture | null>(null);
  const [visible, setVisible] = useState(true);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let t: Texture | null = null;
    let cancelled = false;
    new TextureLoader().load(src, (loaded) => {
      if (cancelled) return loaded.dispose();
      t = loaded;
      setTexture(loaded);
    });
    return () => {
      cancelled = true;
      t?.dispose();
    };
  }, [src]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    setHost(el.parentElement);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        flat
        linear
        orthographic
        gl={{ alpha: true, antialias: false, premultipliedAlpha: true }}
        frameloop={visible && texture ? "always" : "never"}
      >
        {texture && host && <Portrait texture={texture} host={host} onFirstFrame={() => onReady?.()} />}
      </Canvas>
    </div>
  );
}
