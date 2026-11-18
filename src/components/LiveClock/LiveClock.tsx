"use client";

// The current time in Islamabad (Asia/Karachi), as real data for the HUD and footer.
// The server can't know the visitor's "now", so the server HTML reserves the space
// and the time appears after hydration. Updates every 10 seconds; cheap for INP.

import { useSyncExternalStore } from "react";
import { person } from "@/content/site";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: person.location.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const subscribe = (onTick: () => void) => {
  const id = window.setInterval(onTick, 10_000);
  return () => window.clearInterval(id);
};

// Rounded to the minute so the snapshot only changes when the display does.
const getSnapshot = () => Math.floor(Date.now() / 60_000) * 60_000;
const getServerSnapshot = () => null;

export function LiveClock({ className }: { className?: string }) {
  const minute = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (minute === null) {
    // Same box as the real time, so nothing moves when it appears after hydration.
    return (
      <span className={className} aria-hidden="true" style={{ visibility: "hidden" }}>
        00:00
      </span>
    );
  }

  const date = new Date(minute);
  return (
    <time className={className} dateTime={date.toISOString()}>
      {format.format(date)}
    </time>
  );
}
