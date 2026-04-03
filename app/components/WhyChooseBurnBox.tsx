"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Editable from "./Editable";
import { Printer, Gem, PenTool, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

interface AboutSectionProps {
  editable?: boolean;
}

const features = [
  {
    icon: <Printer className="w-6 h-6" />,
    title: "One-Stop Printing Partner",
    description: "From ID laces to large-format murals, we handle all your printing needs under one roof.",
  },
  {
    icon: <Gem className="w-6 h-6" />,
    title: "Quality Meets Affordability",
    description: "State of the arts machines and skilled artists deliver premium output everytime.",
  },
  {
    icon: <PenTool className="w-6 h-6" />,
    title: "Tailored Solutions",
    description: "We don't just print, we design strategize to fit your exact brand goals.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Proven Trust",
    description: "Proudly serving SMEs, big brands, and government clients with repeat partnership since 2015.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Hassle-Free Service",
    description: "fast turnaround, expert installation, and after  sales-support.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const WhyChooseBurnBox: React.FC<AboutSectionProps> = ({ editable = false }) => {
  return (
    <section className="relative py-24 bg-[#0a0a0a] overflow-hidden text-white" id="why-choose-burnbox">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900/50 backdrop-blur-sm">

              <Editable
                name="whyChooseImage"
                type="image"
                defaultValue="/onefive.jpg"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-106"
              />

              {/* Floating Badge */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg max-w-[200px]"
              >

                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="text-green-400 w-5 h-5" />
                  <span className="font-bold text-sm">100% Satisfaction</span>
                </div>
                <p className="text-xs text-gray-400">Guaranteed quality on every print order.</p>
              </motion.div>
            </div>
          </motion.div>
          {/* Right Column: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Editable 
                name="whyChooseTitle" 
                as="h2" 
                type="text"
                defaultValue="Why Choose BurnBox?"
                className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
              />
              <Editable
                name="whyChooseSubtitle"
                as="p"
                type="text"
                defaultValue="We combine cutting-edge technology with creative passion to deliver printing solutions that make your brand stand out."
                className="text-lg text-gray-400 max-w-lg"
              />
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/15"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/20 flex items-center justify-center text-purple-400/90 border border-purple-500/15">
                    {feature.icon}
                  </div>
                  <div>
                    <Editable
                        name={`featureTitle_${index}`}
                        as="h3"
                        type="text"
                        defaultValue={feature.title}
                        className="text-xl font-semibold text-white mb-1"
                    />
                    <Editable
                        name={`featureDesc_${index}`}
                        as="p"
                        type="text"
                        defaultValue={feature.description}
                        className="text-gray-400 text-sm leading-relaxed"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseBurnBox;

