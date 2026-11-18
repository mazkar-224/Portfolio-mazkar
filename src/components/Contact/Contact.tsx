import { LinkList } from "@/components/LinkList/LinkList";
import { Section } from "@/components/Section/Section";
import { contact, sectionIds } from "@/content";
import styles from "./Contact.module.scss";

// Section 8: a huge "Email me" (mailto), the address, LinkedIn and GitHub.
// Copy from src/content/contact.ts (landing-page-copy.md, word for word). The time zone is
// in the body sentence; the footer right below repeats the live clock.
export function Contact() {
  return (
    <Section id={sectionIds.contact} label={contact.sectionLabel} title={contact.heading}>
      <p className={styles.body} data-anim="fade">
        {contact.body}
      </p>

      <div className={styles.actions} data-anim="fade">
        <a href={contact.primaryAction.href} className={styles.email}>
          <span className={styles.emailText}>{contact.primaryAction.label}</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </a>
        {/* The address in plain text too, for people who copy it instead of clicking. */}
        <p className={styles.address}>{contact.email}</p>
      </div>

      <div data-anim="fade">
        <LinkList links={contact.links} />
      </div>
    </Section>
  );
}
