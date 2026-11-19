import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero, person } from "@/content";

// The social share image (Open Graph and X), generated at build time, 1200x630.
// Redesign 2: pitch black and red, with his black-and-white headshot on the right. Only real facts.

// New string (listed for Muhammad): the image's alt text.
export const alt = `${person.name}, ${person.jobTitle}, ${person.location.city}, ${person.location.country}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const VOID = "#000000";
const LINE = "#232323";
const BONE = "#F1EEE8";
const ASH = "#A39E96";
const SIGNAL = "#FF3D2E";

// Static instances of the site's own fonts (see src/app/og-assets/README.md). Read inside a
// cached function (as base64, which can be cached) so the route has no uncached I/O and is
// prerendered at build time as a static PNG.
async function fontBase64(file: string) {
  "use cache";
  return (await readFile(join(process.cwd(), "src/app/og-assets", file))).toString("base64");
}
const font = async (file: string) => Buffer.from(await fontBase64(file), "base64");

/** His black-and-white headshot, as a data URL (read in a cached function, like the fonts). */
async function portraitDataUrl() {
  "use cache";
  const png = await readFile(join(process.cwd(), "public/images/me/azkar-headshot-bw.png"));
  return `data:image/png;base64,${png.toString("base64")}`;
}

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
  const [display, mono, portrait] = await Promise.all([font("archivo-display-800.ttf"), font("jetbrains-mono-500.ttf"), portraitDataUrl()]);
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
        }}
      >
        {/* His headshot on the right, fading into the black */}
        <img src={portrait} width={600} height={498} style={{ position: "absolute", left: 640, top: 84 }} alt="" />
        {/* Hairline frame with crosshair corners */}
        <div style={{ position: "absolute", left: 48, top: 48, right: 48, bottom: 48, border: `1px solid ${LINE}`, display: "flex" }} />
        <Cross x={48} y={48} />
        <Cross x={1152} y={48} />
        <Cross x={48} y={582} />
        <Cross x={1152} y={582} />

        <div style={{ position: "absolute", left: 88, top: 84, right: 440, bottom: 80, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: ASH, ...label }}>
            <span>{hero.location}</span>
            <span style={{ display: "flex", alignItems: "center", color: BONE }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: SIGNAL, marginRight: 12 }} />
              {hero.hud[1].value}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", fontFamily: "Display", fontSize: 96, lineHeight: 0.92, letterSpacing: -1.8, textTransform: "uppercase" }}>
              <span>{person.givenName}</span>
              <span>{person.familyName}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 34 }}>
              <div style={{ width: 72, height: 3, background: SIGNAL, marginRight: 22 }} />
              <span style={{ ...label, fontSize: 22, letterSpacing: 1.6, color: BONE }}>{person.jobTitle}</span>
            </div>
          </div>

          <div style={{ display: "flex", borderTop: `1px solid ${LINE}`, paddingTop: 22 }}>
            {[cloud, automation].map((item) => (
              <div key={item.label} style={{ display: "flex", flexDirection: "column", marginRight: 56 }}>
                <span style={{ ...label, color: ASH, fontSize: 18 }}>{item.label}</span>
                <span style={{ ...label, fontSize: 17, color: BONE, marginTop: 8 }}>{item.value}</span>
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
