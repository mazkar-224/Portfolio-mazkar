import Image from "next/image";
import { Chapter } from "@/components/Chapter/Chapter";
import { homeIds, work } from "@/content";
import styles from "./Work.module.scss";

/** A browser-window frame around a screenshot (reference site). */
function Browser({ src, width, height, alt, domain, sizes }: { src: string; width: number; height: number; alt: string; domain: string; sizes: string }) {
  return (
    <div className={styles.browser} data-anim="frame">
      <div className={styles.chrome} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.domain}>{domain}</span>
      </div>
      <div className={styles.shot} data-anim-clip>
        <Image src={src} width={width} height={height} alt={alt} sizes={sizes} />
      </div>
    </div>
  );
}

export function Work() {
  const f = work.featured;
  return (
    <Chapter
      id={homeIds.work}
      index={work.index}
      label={work.label}
      aside={work.aside}
      title={work.title}
      side={
        <div className={styles.headSide}>
          <p>{work.intro}</p>
        </div>
      }
    >
      <article className={styles.featured}>
        <Browser src={f.shot.src} width={f.shot.width} height={f.shot.height} alt={f.shot.alt} domain={f.domain} sizes="(min-width: 64rem) 55vw, 100vw" />
        <div className={styles.featuredText} data-anim="fade">
          <p className={styles.tag}>
            <span className={styles.num}>01</span> {f.tag}
          </p>
          <h3 className={styles.name}>{f.name}</h3>
          <p className={styles.descriptor}>{f.descriptor}</p>
          <p className={styles.body}>{f.body}</p>
          <dl className={styles.meta}>
            {f.meta.slice(1, 4).map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
          <ul className={styles.links} role="list">
            {f.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} rel="noopener" className={styles.textLink}>
                  {l.label}
                  {l.context && <span className="visually-hidden">: {l.context}</span>} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          <p className={styles.note}>{f.offline}</p>
        </div>
      </article>

      <div className={styles.cards}>
        {work.cards.map((c) => (
          <article key={c.name} className={styles.card}>
            <Browser src={c.image.src} width={c.image.width} height={c.image.height} alt={c.image.alt} domain="n8n · workflow" sizes="(min-width: 64rem) 44vw, 100vw" />
            <div className={styles.cardText} data-anim="fade">
              <p className={styles.tag}>
                <span className={styles.num}>{c.index}</span> {c.tag}
              </p>
              <h3 className={styles.cardName}>
                <a href={c.href} rel="noopener" className={styles.cardLink}>
                  {c.name}
                </a>
              </h3>
              <p className={styles.body}>{c.body}</p>
              <span className={styles.round} aria-hidden="true">
                ↗
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.more}>
        <p className={styles.moreLabel}>{work.moreLabel}</p>
        <ul className={styles.rows} role="list" data-anim="stagger">
          {work.more.map((m, i) => (
            <li key={m.href}>
              <a href={m.href} rel="noopener" className={styles.row}>
                <span className={styles.rowTag}>
                  {String(i + 4).padStart(2, "0")} / {m.tag}
                </span>
                <span className={styles.rowName}>{m.name}</span>
                <span className={styles.rowArrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a href={work.allWork.href} rel="noopener" className={styles.textLink}>
          {work.allWork.label} <span aria-hidden="true">→</span>
        </a>
      </div>
    </Chapter>
  );
}
