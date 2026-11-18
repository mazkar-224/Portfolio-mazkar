import type { Metadata } from "next";
import { Services } from "@/components/Services/Services";
import { services } from "@/content";

export const metadata: Metadata = {
  title: services.metaTitle,
  description: services.intro,
  alternates: { canonical: "/services" },
  openGraph: { type: "website", url: "/services", title: services.metaTitle, description: services.intro },
  twitter: { card: "summary_large_image", title: services.metaTitle, description: services.intro },
};

export default function ServicesPage() {
  return <Services />;
}
