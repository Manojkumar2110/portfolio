import HeroSection from "@/components/HeroSection";
import IntroPreviews from "@/components/intro/IntroPreviews";
import PortfolioSections from "@/components/portfolio/PortfolioSections";
export default function Home() {
  const contactEnabled = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM && process.env.CONTACT_TO && process.env.CONTACT_ORIGIN && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  return <main id="top" className="w-full bg-black"><IntroPreviews /><HeroSection /><PortfolioSections contactEnabled={contactEnabled} /></main>;
}
