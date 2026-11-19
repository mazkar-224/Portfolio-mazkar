// All site content. Components import from "@/content" and never hold copy themselves.

export * from "./shared";
export * from "./site";
export { hero, type HudItem } from "./hero";
export { cloudCostGuard, type CaseStudyBlock, type DiagramEdge, type DiagramNode } from "./cloudcostguard";
export { experience, type Role } from "./experience";
export { automation, type Workflow } from "./automation";
export { awsWork, type SmallProject } from "./aws";
export { skills, type SkillGroup } from "./skills";
export { education } from "./education";
export { contact } from "./contact";
export { services, type Service } from "./services";
export { ui } from "./ui";
export * from "./home";

/** Home page section order, from the brief's <landing_page>. */
export const homeSectionOrder = [
  "hero",
  "cloudCostGuard",
  "experience",
  "automation",
  "aws",
  "skills",
  "education",
  "contact",
] as const;
