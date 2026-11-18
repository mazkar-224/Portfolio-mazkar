import { Frame } from "@/components/Frame/Frame";
import { cloudCostGuard } from "@/content";
import styles from "./ArchitectureDiagram.module.scss";

// The only drawn graphic on the site (CLAUDE.md). Thin-line SVG built from the nodes in
// src/content/cloudcostguard.ts, which come from the repo's docs/ARCHITECTURE.md.
// Two fixed layouts: horizontal from 768px, vertical on phones. Paths carry
// data-draw so the Phase 6 DrawSVG pass can find them.

const { diagram } = cloudCostGuard;
const node = (id: string) => {
  const found = diagram.nodes.find((n) => n.id === id);
  if (!found) throw new Error(`Unknown diagram node: ${id}`);
  return found;
};

type Box = { id: string; x: number; y: number; w: number; h: number };

function NodeBox({ id, x, y, w, h, small }: Box & { small?: boolean }) {
  const n = node(id);
  const cx = x + w / 2;
  const hasDetail = "detail" in n && Boolean(n.detail);
  return (
    <g className={styles.node}>
      <rect x={x} y={y} width={w} height={h} className={styles.box} data-draw />
      <text
        x={cx}
        y={hasDetail ? y + h / 2 - 4 : y + h / 2 + 5}
        className={small ? styles.labelSmall : styles.label}
        textAnchor="middle"
      >
        {n.label}
      </text>
      {hasDetail && (
        <text x={cx} y={y + h / 2 + 16} className={styles.detail} textAnchor="middle">
          {"detail" in n ? n.detail : null}
        </text>
      )}
    </g>
  );
}

function Edge({ d, accent }: { d: string; accent?: boolean }) {
  return (
    <path
      d={d}
      className={accent ? styles.edgeAccent : styles.edge}
      markerEnd={accent ? "url(#arrow-accent)" : "url(#arrow)"}
      data-draw
    />
  );
}

function Markers() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path d="M0 0 L8 4 L0 8" className={styles.arrowHead} />
      </marker>
      <marker id="arrow-accent" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path d="M0 0 L8 4 L0 8" className={styles.arrowHeadAccent} />
      </marker>
    </defs>
  );
}

function Horizontal() {
  return (
    <svg viewBox="0 0 1200 540" className={styles.horizontal} aria-hidden="true" focusable="false">
      <Markers />
      {/* EC2 instance */}
      <rect x={220} y={40} width={560} height={460} className={styles.group} data-draw />
      <text x={240} y={72} className={styles.caption}>{diagram.containerCaption}</text>
      {/* AWS APIs */}
      <rect x={860} y={40} width={320} height={330} className={styles.group} data-draw />
      <text x={880} y={72} className={styles.caption}>{diagram.awsCaption}</text>

      <NodeBox id="browser" x={20} y={120} w={150} h={64} />
      <NodeBox id="caddy" x={250} y={110} w={220} h={84} />
      <NodeBox id="frontend" x={530} y={110} w={220} h={84} />
      <NodeBox id="backend" x={530} y={330} w={220} h={84} />
      <NodeBox id="db" x={250} y={330} w={220} h={84} />
      <NodeBox id="costExplorer" x={885} y={94} w={270} h={52} small />
      <NodeBox id="sts" x={885} y={160} w={270} h={52} small />
      <NodeBox id="ec2Api" x={885} y={226} w={270} h={52} small />
      <NodeBox id="cloudwatch" x={885} y={292} w={270} h={52} small />
      <NodeBox id="sendgrid" x={860} y={420} w={320} h={80} />

      <Edge d="M170 152 H248" accent />
      <text x={210} y={140} className={styles.edgeLabelAccent} textAnchor="middle">HTTPS</text>
      <Edge d="M470 152 H528" />
      <Edge d="M640 194 V328" />
      <text x={652} y={266} className={styles.edgeLabel}>/api</text>
      <Edge d="M530 372 H472" />
      <Edge d="M750 360 H800 V205 H858" />
      <text x={829} y={195} className={styles.edgeLabel} textAnchor="middle">boto3</text>
      <Edge d="M750 392 H820 V460 H858" />
    </svg>
  );
}

function Vertical() {
  return (
    <svg viewBox="0 0 360 950" className={styles.vertical} aria-hidden="true" focusable="false">
      <Markers />
      <NodeBox id="browser" x={105} y={10} w={150} h={56} />
      <Edge d="M180 66 V164" accent />
      <text x={190} y={100} className={styles.edgeLabelAccent}>HTTPS</text>

      <rect x={10} y={120} width={340} height={470} className={styles.group} data-draw />
      <text x={24} y={580} className={styles.captionSmall}>{diagram.containerCaption}</text>
      <NodeBox id="caddy" x={60} y={166} w={240} h={72} />
      <Edge d="M180 238 V268" />
      <NodeBox id="frontend" x={60} y={270} w={240} h={72} />
      <Edge d="M180 342 V378" />
      <text x={190} y={365} className={styles.edgeLabel}>/api</text>
      <NodeBox id="backend" x={60} y={380} w={240} h={72} />
      <Edge d="M180 452 V488" />
      <NodeBox id="db" x={60} y={490} w={240} h={72} />

      <Edge d="M60 416 H32 V638" />
      <NodeBox id="sendgrid" x={10} y={640} w={300} h={64} />

      <Edge d="M300 416 H330 V748" />
      <text x={322} y={735} className={styles.edgeLabel} textAnchor="end">boto3</text>
      <rect x={10} y={750} width={340} height={182} className={styles.group} data-draw />
      <text x={24} y={776} className={styles.captionSmall}>{diagram.awsCaption}</text>
      <NodeBox id="costExplorer" x={24} y={792} w={150} h={52} small />
      <NodeBox id="sts" x={186} y={792} w={150} h={52} small />
      <NodeBox id="ec2Api" x={24} y={858} w={150} h={52} small />
      <NodeBox id="cloudwatch" x={186} y={858} w={150} h={52} small />
    </svg>
  );
}

export function ArchitectureDiagram() {
  return (
    <figure className={styles.figure} data-anim="diagram">
      <figcaption className={styles.figcaption}>{diagram.title}</figcaption>
      <p className="visually-hidden">{diagram.description}</p>
      <Frame className={styles.frame} reveal={false}>
        <Horizontal />
        <Vertical />
      </Frame>
    </figure>
  );
}
