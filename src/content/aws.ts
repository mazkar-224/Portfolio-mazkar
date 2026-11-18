// Section 5, smaller AWS work. Copy: landing-page-copy.md "5. Smaller AWS work".
// The multi-tier VPC design stays on the CV only (brief 4.3).
// Backticks in a description mark inline code; the component renders them as <code>.

import { repos } from "./site";
import type { Link } from "./shared";

export type SmallProject = {
  id: string;
  name: string;
  description: string;
  link: Link;
};

// New string (listed for Muhammad): the mono label "Cloud", reused from the hero HUD,
// because the copy gives this section a title but no label.
export const awsWork = {
  sectionLabel: "Cloud",
  heading: "Smaller AWS work",
  projects: [
    {
      id: "aws-resource-tracker",
      name: "AWS resource tracker",
      description:
        "A Bash script on the AWS CLI that reports S3, EC2, Lambda and IAM resources with the account and region. It checks credentials first, fails safely with `set -euo pipefail`, needs only read-only permissions, and is ready to run from cron.",
      link: { label: "Code on GitHub", context: "AWS resource tracker", href: repos.awsResourceTracker, external: true },
    },
    {
      id: "static-site-ec2",
      name: "Static website on EC2",
      description:
        "Red Hat Linux, Apache, security groups and SSH key pairs, documented step by step.",
      link: { label: "Code on GitHub", context: "Static website on EC2", href: repos.staticSiteEc2, external: true },
    },
  ] satisfies SmallProject[],
} as const;
