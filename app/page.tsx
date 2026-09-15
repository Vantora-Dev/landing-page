import { Hero } from "@/components/hero/Hero";
import { Cost } from "@/components/sections/Cost";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Fit } from "@/components/sections/Fit";
import { Footer } from "@/components/sections/Footer";
import { Problem } from "@/components/sections/Problem";
import { Process } from "@/components/sections/Process";
import { Streams } from "@/components/sections/Streams";
import { System } from "@/components/sections/System";
import { Header } from "@/components/ui/Header";
import { MotionProvider } from "@/components/ui/MotionProvider";

export default function Page() {
  return (
    <MotionProvider>
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <Problem />
        <System />
        <Streams />
        <Process />
        <Cost />
        <Fit />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </MotionProvider>
  );
}
