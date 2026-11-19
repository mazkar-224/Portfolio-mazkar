"use client";

// The About section's particle field (from the reference site): about 5,000 red points that
// morph between three shapes when the visitor switches tabs: a rippling grid (Cloud), a vortex
// (Automate) and a sphere (Build). Always alive: points gather in from a scattered cloud when the
// field appears, cloth-like waves roll across it, points twinkle and drift, the field sways,
// and points under the pointer lift, grow and brighten. One draw call; all in the vertex shader.

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, type ShaderMaterial, type Points } from "three";

export type ParticleShape = "grid" | "vortex" | "sphere";
const SHAPES: ParticleShape[] = ["grid", "vortex", "sphere"];
const SIDE = 72; // grid is SIDE x SIDE points
const COUNT = SIDE * SIDE;

function buildGeometry() {
  const grid = new Float32Array(COUNT * 3);
  const vortex = new Float32Array(COUNT * 3);
  const sphere = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const gx = (i % SIDE) / (SIDE - 1) - 0.5, gy = Math.floor(i / SIDE) / (SIDE - 1) - 0.5;
    grid.set([gx * 3.2, gy * 3.2, 0], i * 3);
    // Vortex: points on a funnel spiral.
    const t = i / COUNT, a = t * Math.PI * 2 * 22, r = 0.15 + Math.pow(t, 0.7) * 1.7;
    vortex.set([Math.cos(a) * r, Math.sin(a) * r * 0.62, (t - 0.5) * -1.4 + Math.sin(a * 0.5) * 0.08], i * 3);
    // Sphere: Fibonacci lattice.
    const y = 1 - (i / (COUNT - 1)) * 2, rr = Math.sqrt(1 - y * y), phi = i * Math.PI * (3 - Math.sqrt(5));
    sphere.set([Math.cos(phi) * rr * 1.45, y * 1.45, Math.sin(phi) * rr * 1.45], i * 3);
    seed[i] = Math.random();
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(grid.slice(), 3));
  g.setAttribute("aGrid", new BufferAttribute(grid, 3));
  g.setAttribute("aVortex", new BufferAttribute(vortex, 3));
  g.setAttribute("aSphere", new BufferAttribute(sphere, 3));
  g.setAttribute("aSeed", new BufferAttribute(seed, 1));
  return g;
}

const vertex = /* glsl */ `
  attribute vec3 aGrid;
  attribute vec3 aVortex;
  attribute vec3 aSphere;
  attribute float aSeed;
  // Index of the shape the field is leaving and the one it is forming (0 grid, 1 vortex, 2 sphere).
  uniform float uFrom;
  uniform float uTo;
  // 0..1 progress of the morph from uFrom to uTo.
  uniform float uMix;
  // Seconds, for the waves, drift and twinkle.
  uniform float uTime;
  // Device pixel ratio, so points keep their size on high-density screens.
  uniform float uDpr;
  // 0..1: the points gather from a wide scattered cloud when the field first appears.
  uniform float uIntro;
  // Pointer in clip space (-1..1) and how present it is (0..1, eased).
  uniform vec2 uPointer;
  uniform float uHover;
  varying float vAlpha;

  vec3 shapeAt(float i) { return i < 0.5 ? aGrid : (i < 1.5 ? aVortex : aSphere); }

  void main() {
    // Each point starts its move at a slightly different moment, so the morph ripples.
    float m = smoothstep(aSeed * 0.35, aSeed * 0.35 + 0.65, uMix);
    vec3 p = mix(shapeAt(uFrom), shapeAt(uTo), m);

    // Cloth-like waves travelling across the field (two crossing waves plus a slow swell).
    p.z += sin(p.x * 1.7 + uTime * 1.3) * 0.2
         + cos(p.y * 1.4 - uTime * 1.0) * 0.16
         + sin((p.x + p.y) * 2.6 + uTime * 2.1) * 0.05;
    // Each point drifts a little on its own.
    p += 0.025 * vec3(sin(uTime * 0.9 + aSeed * 40.0), cos(uTime * 0.7 + aSeed * 30.0), sin(uTime * 0.6 + aSeed * 20.0));

    // Intro: gather in from a scattered cloud.
    float intro = smoothstep(aSeed * 0.4, aSeed * 0.4 + 0.6, uIntro);
    vec3 scatter = aSphere * (2.8 + aSeed * 1.5) + vec3(0.0, 0.0, 1.5);
    p = mix(scatter, p, intro);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;

    // Pointer: points under the cursor lift towards the viewer and grow, in a soft circle.
    vec2 ndc = clip.xy / clip.w;
    float near = exp(-dot(ndc - uPointer, ndc - uPointer) * 14.0) * uHover;
    mv.z += near * 0.6;
    clip = projectionMatrix * mv;

    gl_Position = clip;
    gl_PointSize = (2.2 + aSeed * 1.6) * (1.0 + near * 1.4) * uDpr * (3.2 / -mv.z);
    // Depth fade, a gentle twinkle, and brighter under the pointer.
    float twinkle = 0.75 + 0.25 * sin(uTime * (1.5 + aSeed * 2.5) + aSeed * 60.0);
    vAlpha = (0.3 + 0.7 * smoothstep(-1.6, 1.2, p.z)) * twinkle * intro + near * 0.6;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying float vAlpha;
  // Point colour: the accent red (--signal), blending to warm white at the brightest points.
  uniform vec3 uColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(mix(uColor, vec3(0.96, 0.93, 0.88), glow * 0.5), glow * vAlpha);
  }
`;

function Field({ shape, host }: { shape: ParticleShape; host: HTMLElement | null }) {
  const points = useRef<Points>(null);
  const material = useRef<ShaderMaterial>(null);
  const geometry = useMemo(() => buildGeometry(), []);
  const state = useRef({ from: 0, to: 0, mix: 1 });
  const uniforms = useMemo(
    () => ({ uFrom: { value: 0 }, uTo: { value: 0 }, uMix: { value: 1 }, uTime: { value: 0 }, uDpr: { value: 1 }, uColor: { value: [0.85, 0.2, 0.14] }, uIntro: { value: 0 }, uPointer: { value: [0, 0] }, uHover: { value: 0 } }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  // Pointer over the field, in clip space. Tracked on the window so text over the canvas
  // doesn't block it; outside the field the effect eases away.
  const pointer = useRef({ x: 0, y: 0, target: 0, hover: 0 });
  useEffect(() => {
    if (!host) return;
    const move = (e: PointerEvent) => {
      const b = host.getBoundingClientRect();
      const x = ((e.clientX - b.left) / b.width) * 2 - 1, y = -(((e.clientY - b.top) / b.height) * 2 - 1);
      pointer.current.x = x;
      pointer.current.y = y;
      pointer.current.target = Math.abs(x) <= 1 && Math.abs(y) <= 1 ? 1 : 0;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [host]);

  // A new tab: start a morph from wherever the field is now.
  useEffect(() => {
    const s = state.current;
    const next = SHAPES.indexOf(shape);
    if (next === s.to) return;
    s.from = s.to;
    s.to = next;
    s.mix = 0;
  }, [shape]);

  useFrame(({ clock, viewport }, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    const s = state.current;
    s.mix = Math.min(1, s.mix + delta / 1.4);
    u.uFrom.value = s.from;
    u.uTo.value = s.to;
    u.uMix.value = s.mix;
    const t = clock.getElapsedTime();
    u.uTime.value = t;
    u.uDpr.value = viewport.dpr;
    u.uIntro.value = Math.min(1, u.uIntro.value + delta / 2.2);
    const pt = pointer.current;
    pt.hover += (pt.target - pt.hover) * 0.08;
    const pv = u.uPointer.value as number[];
    pv[0] += (pt.x - pv[0]) * 0.15;
    pv[1] += (pt.y - pv[1]) * 0.15;
    u.uHover.value = pt.hover;
    if (points.current) {
      // A slow sway, and a slight lean towards the pointer.
      points.current.rotation.y = Math.sin(t * 0.22) * 0.45 + pv[0] * 0.12 * pt.hover;
      points.current.rotation.x = -0.35 + Math.sin(t * 0.17) * 0.08 - pv[1] * 0.08 * pt.hover;
    }
  });

  return (
    <points ref={points} geometry={geometry}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleMorph({ shape }: { shape: ParticleShape }) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    setHost(el);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
      <Canvas dpr={[1, 1.75]} gl={{ alpha: true, antialias: false }} camera={{ position: [0, 0, 4.2], fov: 45 }} frameloop={visible ? "always" : "never"}>
        <Field shape={shape} host={host} />
      </Canvas>
    </div>
  );
}
