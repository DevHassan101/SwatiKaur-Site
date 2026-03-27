import WelcomePopup from "./components/WelcomePopup";
import HeroSection from "./components/HeroSection";
import AboutUs from "./components/AboutUs";
import ModelCards from "./components/ModelCards";
import BlogCards from "./components/BlogCards";

export default async function Home() {

  return (
    <>
      <WelcomePopup />
      <HeroSection />
      <AboutUs />
      <ModelCards />
      <BlogCards limit={4} />
    </>
  );
}
