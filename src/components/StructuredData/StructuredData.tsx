import { education, hero, mailto, person, profiles, siteUrl } from "@/content";

/**
 * JSON-LD for the home page: a ProfilePage whose main entity is the Person (CLAUDE.md
 * "SEO and AI discoverability"). Only real data from src/content: no photo (none exists),
 * no employer (the internship has ended), no ratings or invented facts.
 */
export function StructuredData() {
  const url = siteUrl();
  const personNode = {
    "@type": "Person",
    "@id": `${url}/#person`,
    name: person.name,
    alternateName: person.displayName,
    givenName: person.givenName,
    familyName: person.familyName,
    jobTitle: person.jobTitle,
    description: hero.description,
    url: `${url}/`,
    email: mailto,
    address: {
      "@type": "PostalAddress",
      addressLocality: person.location.city,
      addressCountry: person.location.countryCode,
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: education.degree.school },
    sameAs: [profiles.github.href, profiles.linkedin.href],
  };

  const data = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}/#profile`,
    url: `${url}/`,
    name: `${person.name} | ${person.jobTitle}`,
    mainEntity: personNode,
  };

  // "<" escaped so the JSON can never close the script tag early.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
