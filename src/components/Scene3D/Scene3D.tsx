"use client";

// Places one 3D scene over a static fallback of the same size. The fallback (an image, a glow,
// or nothing) is server-rendered and always there; the WebGL layer is loaded with next/dynamic
// (ssr: false) only when useSceneGate allows it, fades in after its first frame, and unmounts
// again when the visitor is far away. Three.js is never in the first-load bundle.

import dynamic from "next/dynamic";
import { useCallback, useRef, useState, type ReactNode } from "react";
import type { ParticleShape } from "@/webgl/ParticleMorph";
import styles from "./Scene3D.module.scss";
import { useSceneGate } from "./useSceneGate";

const PortraitChrome = dynamic(() => import("@/webgl/PortraitChrome"), { ssr: false });
const ParticleMorph = dynamic(() => import("@/webgl/ParticleMorph"), { ssr: false });

type Props = { className?: string; children?: ReactNode } & (
  | { kind: "portrait"; src: string }
  | { kind: "particles"; shape: ParticleShape }
);

export function Scene3D(props: Props) {
  const box = useRef<HTMLDivElement>(null);
  const mounted = useSceneGate(box);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <div ref={box} className={[styles.box, props.className].filter(Boolean).join(" ")} data-ready={ready || undefined}>
      {props.children}
      {mounted && (
        <div className={styles.layer}>
          {props.kind === "portrait" && <PortraitChrome src={props.src} onReady={onReady} />}
          {props.kind === "particles" && <ParticleMorph shape={props.shape} />}
        </div>
      )}
    </div>
  );
}
