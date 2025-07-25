import { generateMetadata } from "@/seo/HomeSEO";
import HomeContent from "@/components/HomeContent";

export const metadata = await generateMetadata();

export default function HomePage() {
  return <HomeContent />;
}
