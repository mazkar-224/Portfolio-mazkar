"use client";
/* eslint-disable react-hooks/immutability -- Three.js shader uniforms are mutated every frame
   inside useFrame, outside React rendering; that is how React Three Fiber is meant to be used. */

// The one WebGL effect on the site (CLAUDE.md "WebGL / Three.js"). Loaded only through
// next/dynamic (ssr: false) by SignalShot, so Three.js is never in the initial bundle.
//
// Limits it keeps:
// - device pixel ratio capped at 1.75
// - renders only while something moves (the resolve, or the pointer effect easing in or out),
//   and never while off-screen or while the tab is hidden: frameloop switches to "never"
// - one WebGL context on the page
// - the textures it creates are disposed on unmount (R3F disposes the geometry, material
//   and renderer)

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { TextureLoader, type ShaderMaterial, type Texture } from "three";
import { createGlyphAtlas, GLYPHS } from "./glyphAtlas";
import { signalFragmentShader, signalVertexShader } from "./signalShader";

/** How long the image takes to resolve out of the noise. Within CLAUDE.md's 1.2s limit. */
const RESOLVE_SECONDS = 1.2;
/** One character cell, in CSS pixels. */
const CELL_CSS_PX = 8;

type Props = {
  /** The optimised image URL the <img> underneath already loaded (img.currentSrc). */
  src: string;
  /** Play the resolve from noise (false when the image was already on screen). */
  reveal: boolean;
  /** Pointer effect: only with a real mouse. */
  pointer: boolean;
  /** The frame element: watched for visibility and pointer movement. */
  host: HTMLElement;
  /** Called once the first frame is drawn, so the canvas can be shown over the <img>. */
  onReady: () => void;
};

// Theme tokens (src/styles/_tokens.scss) as raw sRGB values, like the texture.
const VOID = [10 / 255, 11 / 255, 13 / 255];
const BONE = [236 / 255, 236 / 255, 234 / 255];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function SignalPlane({ image, reveal, pointer, host, inView, onActiveChange, onFirstFrame }: {
  image: Texture;
  reveal: boolean;
  pointer: boolean;
  host: HTMLElement;
  inView: boolean;
  onActiveChange: (active: boolean) => void;
  onFirstFrame: () => void;
}) {
  const material = useRef<ShaderMaterial>(null);
  const dpr = useThree((s) => s.viewport.dpr);
  const size = useThree((s) => s.size);

  const glyphs = useMemo(() => createGlyphAtlas(CELL_CSS_PX * dpr), [dpr]);
  useEffect(() => () => glyphs.dispose(), [glyphs]);

  const uniforms = useMemo(
    () => ({
      uImage: { value: image },
      uGlyphs: { value: glyphs },
      uGlyphCount: { value: GLYPHS.length },
      uResolution: { value: [1, 1] },
      uCell: { value: CELL_CSS_PX },
      uProgress: { value: reveal ? 0 : 1 },
      uTime: { value: 0 },
      uPointer: { value: [0.5, 0.5] },
      uPointerStrength: { value: 0 },
      uVoid: { value: VOID },
      uBone: { value: BONE },
    }),
    // Built once per image and atlas; later changes go through material.current.uniforms.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [image, glyphs],
  );

  // Resolve timing and pointer state live in refs: they change every frame.
  const state = useRef({ start: -1, progress: reveal ? 0 : 1, pointerTarget: 0, pointerNow: 0, first: true });

  useEffect(() => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uResolution.value = [size.width * dpr, size.height * dpr];
    u.uCell.value = CELL_CSS_PX * dpr;
  }, [size, dpr]);

  useEffect(() => {
    if (!pointer) return;
    const move = (e: PointerEvent) => {
      const box = host.getBoundingClientRect();
      const u = material.current?.uniforms;
      if (u) u.uPointer.value = [(e.clientX - box.left) / box.width, 1 - (e.clientY - box.top) / box.height];
      state.current.pointerTarget = 1;
      onActiveChange(true);
    };
    const leave = () => {
      state.current.pointerTarget = 0;
      onActiveChange(true);
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [pointer, host, onActiveChange]);

  useFrame(({ clock }) => {
    const u = material.current?.uniforms;
    if (!u) return;
    const s = state.current;
    const t = clock.getElapsedTime();

    // The resolve starts the first time the frame is in view.
    if (s.progress < 1 && inView) {
      if (s.start < 0) s.start = t;
      s.progress = Math.min(1, (t - s.start) / RESOLVE_SECONDS);
    }
    // Pointer strength eases towards its target (in about 0.3s).
    s.pointerNow += (s.pointerTarget - s.pointerNow) * 0.15;
    if (Math.abs(s.pointerTarget - s.pointerNow) < 0.002) s.pointerNow = s.pointerTarget;

    u.uTime.value = t;
    u.uProgress.value = easeOut(s.progress);
    u.uPointerStrength.value = s.pointerNow;

    if (s.first) {
      s.first = false;
      // Never turn an image the visitor can already see back into noise: if it's on screen
      // by the time everything is ready, skip straight to the clean state.
      if (s.progress < 1 && host.getBoundingClientRect().top < window.innerHeight) {
        s.progress = 1;
        u.uProgress.value = 1;
      }
      onFirstFrame();
    }
    // Nothing left to move: stop rendering until the pointer comes back.
    const moving = (s.progress < 1 && inView) || s.pointerNow !== s.pointerTarget || s.pointerNow > 0;
    if (!moving) onActiveChange(false);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={signalVertexShader}
        fragmentShader={signalFragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function SignalImage({ src, reveal, pointer, host, onReady }: Props) {
  const [image, setImage] = useState<Texture | null>(null);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [active, setActive] = useState(true);

  // The texture: the same URL as the <img> underneath, so it comes from the HTTP cache.
  useEffect(() => {
    let texture: Texture | null = null;
    let cancelled = false;
    new TextureLoader().load(src, (loaded) => {
      if (cancelled) return loaded.dispose();
      // No colour-space conversion anywhere (flat + linear on the Canvas, raw texture): the
      // shader passes the file's colours straight through, so the clean state matches the
      // <img> underneath pixel for pixel.
      texture = loaded;
      setImage(loaded);
    });
    return () => {
      cancelled = true;
      texture?.dispose();
    };
  }, [src]);

  // Pause off-screen and while the tab is hidden.
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        // Coming into view wakes the render loop (the resolve may still be waiting to play).
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.15 },
    );
    io.observe(host);
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [host]);

  // The first frame is drawn even off-screen, so the noise state is in place before the
  // frame scrolls in; after that it renders only while visible and moving.
  const [drawn, setDrawn] = useState(false);
  const handleReady = () => {
    setDrawn(true);
    onReady();
  };
  const running = Boolean(image) && tabVisible && (!drawn || (inView && active));

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: false, powerPreference: "low-power", preserveDrawingBuffer: false }}
      frameloop={running ? "always" : "never"}
      flat
      linear
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      {image && (
        <SignalPlane
          image={image}
          reveal={reveal}
          pointer={pointer}
          host={host}
          inView={inView}
          onActiveChange={setActive}
          onFirstFrame={handleReady}
        />
      )}
    </Canvas>
  );
}
