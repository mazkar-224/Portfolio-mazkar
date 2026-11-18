import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero, person } from "@/content";

// The social share image (Open Graph and X), generated at build time, 1200x630.
// Only real facts from src/content: his name, title, location, status and the HUD values.
// No photo (none exists yet), no logo, no initials. Theme tokens only.

// New string (listed for Muhammad): the image's alt text.
export const alt = `${person.name}, ${person.jobTitle}, ${person.location.city}, ${person.location.country}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const VOID = "#0A0B0D";
const LINE = "#262A30";
const BONE = "#ECECEA";
const ASH = "#8B9099";
const SIGNAL = "#FF5A1F";
const LIVE = "#3DD68C";

// Static instances of the site's own fonts (see src/app/og-assets/README.md). Read inside a
// cached function (as base64, which can be cached) so the route has no uncached I/O and is
// prerendered at build time as a static PNG.
async function fontBase64(file: string) {
  "use cache";
  return (await readFile(join(process.cwd(), "src/app/og-assets", file))).toString("base64");
}
const font = async (file: string) => Buffer.from(await fontBase64(file), "base64");

/** A "+" crosshair mark, centred on a frame corner. */
function Cross({ x, y }: { x: number; y: number }) {
  return (
    <div style={{ position: "absolute", left: x - 6, top: y - 6, width: 13, height: 13, display: "flex" }}>
      <div style={{ position: "absolute", left: 6, top: 0, width: 1, height: 13, background: ASH }} />
      <div style={{ position: "absolute", left: 0, top: 6, width: 13, height: 1, background: ASH }} />
    </div>
  );
}

export default async function OpengraphImage() {
  const [display, mono] = await Promise.all([font("archivo-display-800.ttf"), font("jetbrains-mono-500.ttf")]);
  const [cloud, automation] = hero.hud.slice(2);
  const label = { fontFamily: "Mono", fontSize: 20, letterSpacing: 1.6, textTransform: "uppercase" as const };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: VOID,
          color: BONE,
          // The one atmosphere allowed: a faint --teal-deep glow.
          backgroundImage: "radial-gradient(circle at 85% 10%, rgba(15,61,69,0.55), rgba(10,11,13,0) 55%)",
        }}
      >
        {/* Hairline frame with crosshair corners */}
        <div style={{ position: "absolute", left: 48, top: 48, right: 48, bottom: 48, border: `1px solid ${LINE}`, display: "flex" }} />
        <Cross x={48} y={48} />
        <Cross x={1152} y={48} />
        <Cross x={48} y={582} />
        <Cross x={1152} y={582} />

        <div style={{ position: "absolute", left: 88, top: 84, right: 88, bottom: 80, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: ASH, ...label }}>
            <span>{hero.location}</span>
            <span style={{ display: "flex", alignItems: "center", color: BONE }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: LIVE, marginRight: 12 }} />
              {hero.hud[1].value}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", fontFamily: "Display", fontSize: 122, lineHeight: 0.9, letterSpacing: -2.4, textTransform: "uppercase" }}>
              <span>{person.givenName}</span>
              <span>{person.familyName}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 34 }}>
              <div style={{ width: 72, height: 3, background: SIGNAL, marginRight: 22 }} />
              <span style={{ ...label, fontSize: 28, letterSpacing: 2, color: BONE }}>{person.jobTitle}</span>
            </div>
          </div>

          <div style={{ display: "flex", borderTop: `1px solid ${LINE}`, paddingTop: 22 }}>
            {[cloud, automation].map((item) => (
              <div key={item.label} style={{ display: "flex", flexDirection: "column", width: 420 }}>
                <span style={{ ...label, color: ASH, fontSize: 18 }}>{item.label}</span>
                <span style={{ ...label, color: BONE, marginTop: 8 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: display, weight: 800, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
