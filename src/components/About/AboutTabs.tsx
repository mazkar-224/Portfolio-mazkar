"use client";

// The particle panel and its three tabs (reference site): picking a tab morphs the particle
// field (grid, vortex, sphere) and swaps the short text below. Real buttons with aria-pressed;
// arrow keys move between them. Without WebGL the text and tabs still work.

import { useState } from "react";
import { Scene3D } from "@/components/Scene3D/Scene3D";
import type { about } from "@/content";
import styles from "./About.module.scss";

type Tab = (typeof about)["tabs"][number];

export function AboutTabs({ tabs }: { tabs: readonly Tab[] }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <div className={styles.panel}>
      <div className={styles.fieldHead}>
        <span>Three disciplines. One way of working.</span>
        <span>
          {String(active + 1).padStart(2, "0")} / {String(tabs.length).padStart(2, "0")}
        </span>
      </div>
      <Scene3D kind="particles" shape={tab.shape} className={styles.field}>
        <div className={styles.fieldGlow} aria-hidden="true" />
      </Scene3D>
      <p className={styles.caption}>{tab.caption}</p>
      <div className={styles.tabs} role="group" aria-label="Disciplines">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            type="button"
            className={styles.tab}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") setActive((active + 1) % tabs.length);
              if (e.key === "ArrowLeft") setActive((active - 1 + tabs.length) % tabs.length);
            }}
          >
            {t.label}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div className={styles.tabBody} aria-live="polite">
        <h3 className={styles.tabTitle}>{tab.title}</h3>
        <p className={styles.tabText}>{tab.body}</p>
        <a href={tab.link.href} className={styles.textLink}>
          {tab.link.label} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
