import { About } from "@/components/About/About";
import { Approach } from "@/components/Approach/Approach";
import { Close } from "@/components/Close/Close";
import { ExperienceV2 } from "@/components/ExperienceV2/ExperienceV2";
import { Hero } from "@/components/Hero/Hero";
import { Journey } from "@/components/Journey/Journey";
import { PhotoBand } from "@/components/PhotoBand/PhotoBand";
import { Stats } from "@/components/Stats/Stats";
import { StructuredData } from "@/components/StructuredData/StructuredData";
import { Work } from "@/components/Work/Work";

// The redesigned home page (18 Nov 2026): the reference site's structure, in pitch black and red,
// with his photos and the chrome 3D objects from his reference images.
export default function Home() {
  return (
    <>
      <StructuredData />
      <Hero />
      <Stats />
      <About />
      <Work />
      <Approach />
      <ExperienceV2 />
      <PhotoBand />
      <Journey />
      <Close />
    </>
  );
}
