import { AccordionComponent } from "@/components/homepage/accordion-component";
import Hero from "../components/homePage_V1/Hero";
import Features from "../components/homePage_V1/Features";
import HowItWorks from "../components/homePage_V1/HowItWorks";
import Insights from "../components/homePage_V1/Insights";
import GoalTracking from "../components/homePage_V1/GoalTracking";
import Testimonials from "../components/homePage_V1/Testimonials";
// import Pricing from "../components/homePage_V1/Pricing";
import Faq from "../components/homePage_V1/Faq";
import Contact from "../components/homePage_V1/Contact";

import BlogSample from "@/components/homepage/blog-samples";
import MarketingCards from "@/components/homepage/marketing-cards";
import SideBySide from "@/components/homepage/side-by-side";
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";
import Pricing from "@/components/homepage/pricing";

export default function Home() {
  return (
    <PageWrapper>
        <Hero />
        <Features />
        <HowItWorks />
        <Insights />
        <GoalTracking />
        <Testimonials />
        {/* <Pricing /> */}
        {/* TODO: styling to match rest of the theme */}
        <Pricing />
        <Faq />
        <Contact />
    </PageWrapper>
  );
}
