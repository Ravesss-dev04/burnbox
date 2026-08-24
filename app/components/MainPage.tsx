import React, { useState, useEffect, useCallback } from "react";
import { ComprehensiveServices, Maps } from "../components";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import WhyChooseBurnboxPage from "../components/WhyChooseBurnBox";
// import GalleryPhotos from "../components/GalleryPhotos";
import BrandPage from "../components/BrandPage";
// import WelcomeScreen from './WelcomeScreen';
import BurnboxIdeal from "./BurnboxIdeal";
import SeamlessProcess from "./SeamlessProcess";
import QuotationPage from "./QuotationPage";
import QuestionAsk from "./QuestionAsk";
import ScrollReveal, { ScrollScale } from "./ScrollReveal";
import { useHeaderContext } from "../context/HeaderContext";
import { FaFacebookMessenger } from "react-icons/fa";

import GlobalElementsRenderer from "./GlobalElementsRenderer";

const MESSENGER_URL = "https://www.facebook.com/burnboxprinting";

const MainPage = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const { setIsHeaderVisible } = useHeaderContext();

  useEffect(() => {
    if (showWelcome) {
      setIsHeaderVisible(false);
    } else {
      setIsHeaderVisible(true);
    }
    return () => setIsHeaderVisible(true);
  }, [showWelcome, setIsHeaderVisible]);

  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
    // Smooth scroll to top after welcome screen
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen w-full bg-[var(--paper,#F7F1EA)] relative overflow-x-hidden text-[var(--ink,#231F20)] selection:bg-[rgba(255,0,96,0.25)]">
      <GlobalElementsRenderer />

      <div className="relative z-10 flex flex-col gap-0">
        {/* Welcome Screen - Shows first */}
        {/* {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />} */}

        {!showWelcome && (
          <motion.a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit us on Facebook"
            className="fixed bottom-8 right-8 z-50 p-4 shadow-[0_0_20px_rgba(255,0,96,0.25)] bg-[#FF0060] border-[1.5px] border-[#FF0060] hover:bg-[#231F20] hover:border-[#231F20] transition-colors duration-300 group rounded-full text-white"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaFacebookMessenger className="h-6 w-6 opacity-90 group-hover:opacity-100" />
          </motion.a>
        )}

        {/* Main Content - Static Layout */}

        <ScrollReveal direction="up" delay={0.1} duration={0.8}>
          <BrandPage />
        </ScrollReveal>
        {/* <ScrollReveal direction="zoom" delay={0.1} duration={1.2}>
          <CardCarousel />
        </ScrollReveal> */}

        <ScrollReveal direction="up" delay={0.1} duration={0.8}>
          <ComprehensiveServices />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1} duration={0.8}>
          <BurnboxIdeal />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1} duration={0.8}>
          <SeamlessProcess />
        </ScrollReveal>

        <ScrollReveal direction="blur" delay={0.2} distance={80} duration={1}>
          <div id="why-choose-burnbox" className="relative">
            {/* Section specific glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent pointer-events-none" />
            <WhyChooseBurnboxPage />
          </div>
        </ScrollReveal>

        {/* <ScrollScale scaleRange={[0.95, 1]}>
          <section id='gallery' className="w-full flex flex-col relative">
              <GalleryPhotos/>
          </section>
        </ScrollScale> */}
        <ScrollReveal direction="up" delay={0.1} duration={0.8}>
          <Maps />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.1}>
          <QuotationPage />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.1}>
          <QuestionAsk />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <Footer />
        </ScrollReveal>
      </div>
    </div>
  );
};

export default MainPage;
