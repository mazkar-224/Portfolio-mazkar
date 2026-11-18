import { Automation } from "@/components/Automation/Automation";
import { AwsWork } from "@/components/AwsWork/AwsWork";
import { CloudCostGuard } from "@/components/CloudCostGuard/CloudCostGuard";
import { Contact } from "@/components/Contact/Contact";
import { Education } from "@/components/Education/Education";
import { Experience } from "@/components/Experience/Experience";
import { Hero } from "@/components/Hero/Hero";
import { Skills } from "@/components/Skills/Skills";
import { StructuredData } from "@/components/StructuredData/StructuredData";

// Home, in the brief's section order.
export default function Home() {
  return (
    <>
      <StructuredData />
      <Hero />
      <CloudCostGuard />
      <Experience />
      <Automation />
      <AwsWork />
      <Skills />
      <Education />
      <Contact />
    </>
  );
}
