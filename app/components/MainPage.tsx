import React, { useState, useEffect, useCallback } from "react";
import { ComprehensiveServices, EmailPopup, Maps } from "../components";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Footer from "../components/Footer";
import WhyChooseBurnboxPage from "../components/WhyChooseBurnBox";
// import GalleryPhotos from "../components/GalleryPhotos";
import BrandPage from "../components/BrandPage";
// import WelcomeScreen from './WelcomeScreen';
import CreativePage from "./CreativePage";
import BurnboxIdeal from "./BurnboxIdeal";
import SeamlessProcess from "./SeamlessProcess";
import QuotationPage from "./QuotationPage";
import ContactBurnbox from "./ContactBurnbox";
import QuestionAsk from "./QuestionAsk";
import ScrollReveal, { ScrollScale } from "./ScrollReveal";
import { useHeaderContext } from "../context/HeaderContext";

import GlobalElementsRenderer from "./GlobalElementsRenderer";

const MainPage = () => {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
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
    <div className="min-h-screen w-full bg-zinc-950 relative overflow-x-hidden text-white selection:bg-pink-500/30">
      <GlobalElementsRenderer />
      {/* Global Background Effects - Matches the "Levitating Aura" theme */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Radial Gradient for depth - "Less Dark" center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black opacity-80"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>

        {/* Ambient Pink Glows */}
        <div
          className="absolute top-[-10%] left
        
        -[-10%] w-[40%] h-[40%] bg-pink-500/5 blur-[120px] rounded-full animate-pulse"
        ></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Content Wrapper with z-index to sit above background */}

      <div className="relative z-10 flex flex-col gap-12 sm:gap-20">
        {/* Welcome Screen - Shows first */}
        {/* {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />} */}

        <AnimatePresence mode="wait">
          {showEmailPopup && (
            <EmailPopup setShowEmailPopup={setShowEmailPopup} />
          )}
        </AnimatePresence>
        {/* Email Button */}
        <AnimatePresence mode="wait">
          {!showEmailPopup && !showWelcome && (
            <motion.button
              type="button"
              className="fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.3)] bg-white/10 backdrop-blur-md border border-white/20 hover:bg-pink-500 hover:border-pink-500 transition-colors duration-300 group"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEmailPopup(true)}
            >
              <Image
                height={500}
                width={500}
                alt="gmail icon"
                src={"/gmail.png"}
                className="h-6 w-6 object-contain opacity-80 group-hover:opacity-100"
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Main Content - Static Layout */}

        <ScrollReveal direction="up" delay={0.1} duration={0.8}>
          <BrandPage />
        </ScrollReveal>
        {/* <ScrollReveal direction="zoom" delay={0.1} duration={1.2}>
          <CardCarousel />
        </ScrollReveal> */}

        <ScrollReveal direction="up" delay={0.1} duration={0.8}>
          <CreativePage />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1} duration={0.8}>
          <BurnboxIdeal />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1} duration={0.8}>
          <ComprehensiveServices />
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
        <ScrollReveal direction="flipUp" delay={0.1} duration={0.8}>
          <div className="relative border-t border-white/5 bg-black/40 backdrop-blur-sm">
            <Maps />
          </div>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.1}>
          <QuotationPage />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.1}>
          <QuestionAsk />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.1}>
          <ContactBurnbox />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <Footer />
        </ScrollReveal>
      </div>
    </div>
  );
};

export default MainPage;
