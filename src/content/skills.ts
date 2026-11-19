// Section 6, skills, in the four evidence groups. Copy: landing-page-copy.md "6. Skills".
// No bars, percentages, ratings or logos. Never listed (hard rule 4): LangChain, LangGraph,
// FAISS, Redis, Node.js, Express, Celery. Kubernetes moved from "Learning now" to "Familiar" on
// 19 Nov 2026 at his request (he says he knows it; no shipped project uses it yet).
// "AWS VPC, load balancers and auto scaling" stays off the site (brief 4.3).

export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
};

// New string (listed for Muhammad): the mono label "Stack", reused from the CloudCostGuard
// metadata grid, because the copy names this section but gives it no label.
export const skills = {
  sectionLabel: "Stack",
  heading: "Skills",
  groups: [
    {
      id: "shipped",
      label: "Used in shipped projects",
      items: [
        "AWS (EC2, IAM, STS, CloudWatch, Cost Explorer)",
        "boto3",
        "AWS CLI",
        "Docker",
        "Docker Compose",
        "Caddy",
        "nginx",
        "Apache",
        "Linux (Ubuntu, Red Hat)",
        "Bash",
        "Python",
        "FastAPI",
        "SQLAlchemy",
        "Alembic",
        "PostgreSQL",
        "GitHub Actions",
        "Pytest",
        "moto",
        "n8n",
        "Gemini",
        "Groq",
        "OpenRouter",
        "Pinecone",
        "Gmail, Google Sheets, Google Drive and LinkedIn APIs",
        "Airtop",
        "Tavily",
        "JavaScript",
        "React",
        "React Router",
        "TanStack Query",
        "Recharts",
        "Tailwind CSS",
        "Vite",
      ],
    },
    {
      id: "professional",
      label: "Used in professional work",
      items: [
        "Prometheus",
        "testcontainers",
        "SQLite",
        "SQL Server",
        "JWT and bcrypt",
        "structured LLM output validation",
        "LLM evaluation sets",
        "Claude API",
        "Model Context Protocol (MCP)",
      ],
    },
    {
      id: "familiar",
      label: "Familiar",
      items: ["Make.com", "S3 and Lambda (through the AWS CLI)", "Kubernetes"],
    },
  ] satisfies SkillGroup[],
} as const;
