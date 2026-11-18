import { Button } from "@/components/Button/Button";
import { LinkList } from "@/components/LinkList/LinkList";
import { services } from "@/content";
import styles from "./Services.module.scss";

// The /services page: the services table from the copy, each row linked to the project
// that proves it, then Email me. Copy from src/content/services.ts, word for word.
// He has no past clients, so there are no testimonials, prices or ratings here.
//
// The table keeps explicit ARIA roles because on phones its rows are restyled as stacked
// blocks, and Safari drops native table semantics once display changes.
export function Services() {
  return (
    <section className={styles.page} aria-labelledby="services-title" data-anim-section="services">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.label} data-anim="label">
            {services.pageLabel}
          </p>
          <h1 id="services-title" className={styles.title} data-anim="heading">
            {services.heading}
          </h1>
          <p className={styles.intro} data-anim="fade">
            {services.intro}
          </p>
        </header>

        <table className={styles.table} role="table">
          <thead className={styles.thead} role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader" className={styles.th}>
                {services.columns.service}
              </th>
              <th scope="col" role="columnheader" className={styles.th}>
                {services.columns.proof}
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup" data-anim="stagger">
            {services.rows.map((row) => (
              <tr key={row.service} role="row" className={styles.row}>
                <td role="cell" className={styles.service}>
                  {row.service}
                </td>
                <td role="cell" className={styles.proof}>
                  {/* On phones the column header is hidden, so its words sit above the links. */}
                  <span className={styles.proofLabel} aria-hidden="true">
                    {services.columns.proof}
                  </span>
                  <LinkList links={row.proof} className={styles.links} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.closing} data-anim="fade">
          <p className={styles.closingText}>{services.closing}</p>
          <Button variant="primary" href={services.primaryAction.href}>
            {services.primaryAction.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
