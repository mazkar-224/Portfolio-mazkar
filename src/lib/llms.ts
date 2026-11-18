// Builds /llms.txt and /llms-full.txt (llmstxt.org format) from src/content, so AI assistants
// get the same facts as the pages, word for word, and the files can never drift from the site.
// Section headings reuse the site's own section labels; nothing here is new copy except the
// three structural headings marked below (listed for Muhammad).

import {
  automation,
  awsWork,
  cloudCostGuard as ccg,
  contact,
  cv,
  education,
  experience,
  hero,
  isNeeds,
  person,
  profiles,
  services,
  site,
  siteUrl,
  skills,
  type Link,
} from "@/content";

const abs = (href: string) => (href.startsWith("/") ? `${siteUrl()}${href}` : href);
const link = (l: Link, note?: string) => `- [${l.label}](${abs(l.href)})${note ? `: ${note}` : ""}`;
const strip = (text: string) => text.replace(/`/g, "");

function header() {
  return [
    `# ${person.name}`,
    "",
    `> ${person.jobTitle}. ${hero.description}`,
    "",
    hero.availability,
    "",
    `${hero.location}. Email: ${person.email}`,
  ].join("\n");
}

/** /llms.txt: a short map of the site with links. */
export function llmsTxt() {
  const [role] = experience.roles;
  return [
    header(),
    "",
    "## Pages", // structural heading (new string)
    link({ label: person.name, href: "/" }, site.description),
    link({ label: services.heading, href: "/services" }, services.intro),
    link({ label: cv.label, href: cv.href }),
    link({ label: "Full text for language models", href: "/llms-full.txt" }), // new string
    "",
    `## ${ccg.name}`,
    `${ccg.headingParts.descriptor}. ${ccg.context}.`,
    ...ccg.links.map((l) => link(l)),
    "",
    `## ${experience.sectionLabel}`,
    link({ label: role.heading, href: role.links[0].href }, `${role.where}, ${role.period}.`),
    "",
    `## ${automation.sectionLabel}`,
    ...automation.workflows.map((w) => link({ label: w.name, href: w.href }, w.description)),
    "",
    `## ${awsWork.heading}`,
    ...awsWork.projects.map((p) => link({ label: p.name, href: p.link.href }, strip(p.description))),
    "",
    `## ${contact.sectionLabel}`,
    link({ label: contact.primaryAction.label, href: contact.primaryAction.href }),
    ...contact.links.map((l) => link(l)),
    "",
  ].join("\n");
}

/** /llms-full.txt: every section's text in reading order. */
export function llmsFullTxt() {
  const [role] = experience.roles;
  const block = (b: { heading: string; body: string }) => `### ${b.heading}\n\n${b.body}`;
  return [
    header(),
    "",
    `## ${ccg.heading}`,
    "",
    ccg.context,
    "",
    ...ccg.meta.map((m) => `- ${m.label}: ${m.value}`),
    "",
    ccg.intro,
    "",
    block(ccg.built),
    "",
    block(ccg.shipped),
    "",
    block(ccg.fixed),
    "",
    block(ccg.next),
    "",
    `### ${ccg.diagram.title}`, // the diagram's own title
    "",
    ccg.diagram.description,
    "",
    ccg.offlineNote,
    "",
    ...ccg.links.map((l) => link(l)),
    isNeeds(ccg.video) ? "" : `- Walkthrough video: ${ccg.video}`,
    "",
    `## ${experience.sectionLabel}`,
    "",
    `### ${role.heading}`,
    "",
    `${role.where}. ${role.period}.`,
    "",
    ...role.highlights.map((h) => `- ${h}`),
    "",
    ...role.links.map((l) => link(l)),
    "",
    `## ${automation.sectionLabel}: ${automation.heading}`,
    "",
    automation.intro,
    "",
    ...automation.workflows.map((w) => link({ label: w.name, href: w.href }, w.description)),
    "",
    `${automation.cta.lead} ${link(automation.cta.link).slice(2)}`,
    "",
    `## ${awsWork.heading}`,
    "",
    ...awsWork.projects.map((p) => link({ label: p.name, href: p.link.href }, strip(p.description))),
    "",
    `## ${skills.heading}`,
    "",
    ...skills.groups.map((g) => `- ${g.label}: ${g.items.join(", ")}`),
    "",
    `## ${education.sectionLabel}`,
    "",
    `${education.degree.name}, ${education.degree.school}. ${education.degree.period}. ${education.degree.grade}.`,
    "",
    ...education.degree.activities.map((a) => `- ${a}`),
    "",
    `${education.certificationsLabel}: ${education.certifications.join("; ")}.`,
    "",
    `## ${services.heading}`,
    "",
    services.intro,
    "",
    ...services.rows.map((r) => `- ${r.service}. ${services.columns.proof}: ${r.proof.map((p) => `[${p.label}](${abs(p.href)})`).join(", ")}`),
    "",
    services.closing,
    "",
    `## ${contact.heading}`,
    "",
    contact.body,
    "",
    link({ label: `${contact.primaryAction.label} (${contact.email})`, href: contact.primaryAction.href }),
    link(profiles.linkedin),
    link(profiles.github),
    "",
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}
