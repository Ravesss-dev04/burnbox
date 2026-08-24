"use client";

import React, { useEffect, useState, useRef } from "react";
import Footer from "./Footer";
import Image from "next/image";
import {
  ArrowBigRightDash,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronDownIcon,
  User2Icon,
  XCircleIcon,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion, useInView, Variants } from "framer-motion";
import { EnvelopeIcon } from "@heroicons/react/16/solid";
import FakeInquiryForm from "./FakeInquiryForm";
import { useHeaderContext } from "../context/HeaderContext";

const ProductImageSlider = ({
  images,
  name,
}: {
  images: string[];
  name: string;
}) => {
  const filledImages =
    images.length >= 3
      ? images
      : [
          ...images,
          ...Array.from({ length: 3 - images.length }, (_, i) => images[0]),
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  // auto slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filledImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [filledImages.length]);
  return (
    <div className="relative w-full md:w-full h-full bg-[#EFE6DB] rounded-sm overflow-hidden">
      {/* main image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={filledImages[currentIndex]}
          alt="product"
          className="object-contain w-full h-full items-center justify-center"
          draggable="false"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </AnimatePresence>
      {/* progress bar / indicator */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-4 md:gap-6 lg:gap-8 z-10">
        {filledImages.map((_, i) => (
          <motion.div
            key={i}
            className={`h-1 rounded-full ${
              i === currentIndex ? "bg-[#FF0060]" : "bg-[#231F20]/20"
            }`}
            initial={{ width: i === currentIndex ? 20 : 8 }}
            animate={{ width: i === currentIndex ? 20 : 8 }}
            transition={{ duration: 0.3 }}
            style={{ minWidth: i === currentIndex ? "20px" : "8px" }}
          />
        ))}
      </div>
      {/* thumbnail preview below */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 z-10">
        {filledImages.map((img, i) => (
          <motion.div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`relative h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-300 ${
              i === currentIndex
                ? "border-[#FF0060] bg-[#FF0060]/15 shadow-lg shadow-[#FF0060]/25"
                : "border-[#231F20]/20 bg-[#F7F1EA] hover:border-[#FF0060]/50"
            }`}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={img}
              alt={`thumb-${i}`}
              className="object-contain w-full h-full items-center justify-center"
              draggable="false"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ServicesProduct = () => {
  const { searchValue, selectedProduct, setSelectedProduct, products } =
    useHeaderContext();
  // Use products from context
  const allProducts = products;
  // Filter products based on search
  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const [showRelated, setShowRelated] = useState(true);
  // Randomize related products (except current one)
  const getRandomRelated = (excludeId: number) => {
    const others = allProducts.filter((p) => p.id !== excludeId);
    return [...others].sort(() => 0.5 - Math.random()).slice(0, 6);
  };
  const [showInquiry, setShowInquiry] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isOld, setIsOld] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  // Generate Gravatar URL from email (requires proper MD5 hash)
  const getGravatarUrl = (email: string, size: number = 64) => {
    if (!email) return null;
    // Use a simple approach: create MD5 hash using crypto API or fallback
    // For Gravatar, we need MD5 hash of lowercase email
    const emailLower = email.trim().toLowerCase();
    // Simple hash function (not true MD5, but works for basic use)
    // For production, consider using crypto-js library: npm install crypto-js
    const simpleHash = (str: string): string => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      // Convert to hex and pad to 32 chars (MD5-like length)
      return Math.abs(hash).toString(16).padStart(32, "0").substring(0, 32);
    };
    // Try to use Web Crypto API for proper MD5 if available (async)
    // For now, use simple hash - Gravatar will handle invalid hashes gracefully
    const emailHash = simpleHash(emailLower);
    // Gravatar URL format: https://www.gravatar.com/avatar/{hash}?d=404&s={size}
    // d=404 means return 404 if no image exists (so we can fallback to initials)
    return `https://www.gravatar.com/avatar/${emailHash}?d=404&s=${size}`;
  };


  // Get initials from email address (uses the part before @)
  const getInitials = (email: string) => {
    if (!email) return "U";
    // Extract the part before @ from email
    const emailPrefix = email.split("@")[0];
    if (!emailPrefix) return "U";


    // Split by common separators (dots, underscores, hyphens) to get parts
    const parts = emailPrefix.split(/[._-]/).filter((part) => part.length > 0);

    // If email prefix has 2 or more parts (e.g., "john.doe" or "john_doe"), use first letter of first and last part
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    // If single part (e.g., "animateevi"), use only first letter

    return emailPrefix.charAt(0).toUpperCase();
  };
  // Fetch feedback from API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoadingFeedbacks(true);
      try {
        const response = await fetch("/api/feedback");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.feedbacks) {
            setFeedbacks(data.feedbacks);
          }
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoadingFeedbacks(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handlePopupClick = () => {
    setIsOld(!isOld);
    setShowModal(false);
  };


  
  // Sort feedbacks based on Latest/Old
  const sortedFeedbacks = isOld
    ? [...feedbacks].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    : [...feedbacks].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

  // Limit to 10 most recent/oldest
  const displayedFeedbacks = sortedFeedbacks.slice(0, 10);

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedProduct(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setPage(1);
    // Ensure products section is visible after closing modal
    setHasAnimated(true);
    // Scroll to products section if needed
    setTimeout(() => {
      const productsSection = document.getElementById("products-section");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Handle product selection with related products
  const handleProductSelect = (item: any) => {
    setSelectedProduct({
      ...item,
      related: getRandomRelated(item.id),
    });
  };

  React.useEffect(() => {
    if (selectedProduct && !(selectedProduct as any).related) {
      // If selectedProduct doesn't have related products, add them
      setSelectedProduct({
        ...selectedProduct,
        related: getRandomRelated(selectedProduct.id),
      });
    }
  }, [selectedProduct]);
  React.useEffect(() => {
    setPage(1);
  }, [searchValue]);

  // Animation variants for product cards
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };
  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Ensure products are visible after mount (fixes Vercel hydration issue)
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        id="products-section"
        ref={sectionRef}
        className="relative w-full min-h-screen flex flex-col items-center py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F7F1EA] text-[#231F20] overflow-hidden"
      >
        {/* Paper-theme depth */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(35,31,32,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(35,31,32,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-[#FF0060]/[0.07] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#231F20]/[0.05] rounded-full blur-[120px] translate-y-1/3" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <span className="block uppercase tracking-[0.12em] text-xs text-[#FF0060] mb-3.5 font-medium">
              01 / Services
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-black uppercase leading-[1.05] tracking-tight text-[#231F20]">
              Products &amp; services
            </h2>
          </div>
          <p className="text-[#7A736D] text-[15px] md:text-base max-w-sm leading-relaxed md:text-right">
            Browse our catalog — tap a product for details, pricing, and a quick inquiry.
          </p>
        </div>

        <motion.div
          className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl"
          variants={containerVariants}
          initial="hidden"
          animate={isInView || hasAnimated ? "visible" : "hidden"}
        >
          {currentProducts.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="group relative bg-[#F7F1EA] border-[1.5px] border-[#231F20]/15 rounded-sm overflow-hidden cursor-pointer hover:border-[#FF0060]/50 hover:bg-[#F0E6DA] transition-colors duration-300"
              onClick={() => handleProductSelect(item)}
              whileHover={{ y: -5 }}
            >
              {/* Hover wash */}
              <div className="absolute inset-0 bg-[#FF0060]/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Card Content */}
              <div className="relative h-full flex flex-col bg-transparent m-0 rounded-sm overflow-hidden">
                {/* Image Container */}
                <div className="relative w-full h-64 overflow-hidden bg-[#EFE6DB] p-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FF0060]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.img
                    src={item.image[0]}
                    alt={item.name}
                    className="object-contain w-full h-full relative z-10 drop-shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    draggable="false"
                  />
                </div>

                {/* Text Content */}
                <div className="p-5 flex flex-col gap-3 border-t border-[#231F20]/10">
                  <h3 className="font-bold text-[#231F20] text-lg truncate group-hover:text-[#FF0060] transition-colors duration-300">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-[#7A736D] font-medium group-hover:text-[#231F20] transition-colors">
                      View Details
                    </span>
                    <motion.div
                      className="w-8 h-8 rounded-full bg-[#231F20]/5 flex items-center justify-center group-hover:bg-[#FF0060] transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ArrowRight className="w-4 h-4 text-[#7A736D] group-hover:text-white" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Product Modal */}
        <AnimatePresence mode="wait">
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 pt-16 sm:pt-20 bg-[#171414]/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
              onClick={handleBackdropClick}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
                className="bg-[#F7F1EA] h-full sm:h-[95vh] lg:h-[90vh] px-4 sm:px-6 md:px-8 text-[#231F20] rounded-sm sm:rounded-md w-full lg:w-4/5 md:w-5/6 relative overflow-y-auto shadow-[0_20px_60px_rgba(35,31,32,0.25)] border-[1.5px] border-[#231F20]/15"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  onClick={handleCloseModal}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-2 bg-[#EFE6DB] hover:bg-[#231F20] hover:text-[#F7F1EA] text-[#231F20] px-3 py-2 rounded-sm border-[1.5px] border-[#231F20]/15 transition-colors duration-200 z-10"
                >
                  <span className="font-medium text-sm sm:text-base">
                    Go back
                  </span>
                  <ArrowRight className="text-[#FF0060] group-hover:text-[#FF0060] cursor-pointer w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full p-4 sm:p-6 lg:p-8 pt-12 sm:pt-16">
                  {/* Image Section */}
                  <motion.div
                    className="col-span-1 flex flex-col items-center justify-start gap-4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 bg-[#EFE6DB] rounded-sm overflow-hidden flex items-center justify-center border-[1.5px] border-[#231F20]/10">
                      <ProductImageSlider
                        images={selectedProduct.image}
                        name={selectedProduct.name}
                      />
                    </div>
                  </motion.div>

                  {/* Info Section */}
                  <motion.div
                    className="col-span-1 flex flex-col justify-start gap-4 w-full max-w-md mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 text-center md:text-left text-[#231F20]">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-[#7A736D] text-sm sm:text-base mt-2 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                    <motion.p
                      className="text-[#FF0060] text-3xl sm:text-4xl font-black mt-3 pb-4"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {selectedProduct.price === 0
                        ? " "
                        : ` ₱ ${selectedProduct.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`}
                    </motion.p>
                    <div className="flex flex-col gap-3">
                      <motion.button
                        onClick={() => setShowInquiry(true)}
                        className="bg-[#FF0060] hover:bg-[#231F20] lg:w-full text-white py-[13px] px-[22px] rounded-sm font-bold uppercase tracking-[0.06em] text-xs border-[1.5px] border-[#FF0060] hover:border-[#231F20] transition-colors duration-200"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Inquire Now
                      </motion.button>
                      <div className="relative c">
                        <button
                          className="border-[1.5px] border-[#231F20]/25 text-[#7A736D] w-full rounded-sm py-2 cursor-not-allowed opacity-50"
                          title="Not allowed"
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
                        >
                          Customize this item
                        </button>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="bg-[#FF0060]/15 w-full text-[#FF0060] py-3 text-center rounded-sm text-xs font-bold uppercase tracking-wider">
                            not applicable
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  {/* Feedback Section */}
                  <motion.div
                    className="col-span-1 flex flex-col justify-between bg-[#EFE6DB] rounded-sm p-3 sm:p-4 w-full max-w-md h-full border-[1.5px] border-[#231F20]/15"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-[#FF0060] font-black uppercase tracking-tight text-base sm:text-lg">
                        Feedback
                      </h3>
                      <span className="relative">
                        <motion.button
                          onClick={handleButtonClick}
                          className="bg-[#F7F1EA] border-[1.5px] border-[#FF0060]/40 text-[#FF0060] font-bold uppercase tracking-wider text-xs px-3 py-1.5 rounded-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isOld ? "Old" : "Latest"}
                        </motion.button>
                        <AnimatePresence>
                          {showModal && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.9 }}
                              onClick={handlePopupClick}
                              className="absolute text-center justify-center top-full left-0 mt-2 bg-[#F7F1EA] border-[1.5px] border-[#231F20] text-[#231F20] font-bold uppercase tracking-wider text-xs px-3 py-1.5 rounded-sm shadow-[3px_3px_0_0_#231F20] cursor-pointer z-20"
                            >
                              {isOld ? "Latest" : "Old"}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-3 overflow-y-auto max-h-[250px] sm:max-h-[300px] bg-[#F7F1EA] p-2 sm:p-3 rounded-sm scrollbar-thin border border-[#231F20]/10">
                      {loadingFeedbacks ? (
                        <motion.div
                          className="text-center text-[#7A736D] py-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF0060] mx-auto"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          <p className="mt-2 text-xs">Loading feedback...</p>
                        </motion.div>
                      ) : displayedFeedbacks.length === 0 ? (
                        <motion.div
                          className="text-center text-[#7A736D] py-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p className="text-sm">
                            No feedback yet. Be the first to share!
                          </p>
                        </motion.div>
                      ) : (
                        displayedFeedbacks.map((feedback, idx) => {
                          const feedbackDate = new Date(
                            feedback.createdAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                          // Get initials from email address (not the input name)
                          const initials = getInitials(feedback.email);
                          const gravatarUrl = getGravatarUrl(
                            feedback.email,
                            64
                          );

                          return (
                            <motion.div
                              key={feedback.id}
                              className="bg-[#EFE6DB] p-2 sm:p-3 rounded-sm text-[#231F20] text-sm flex flex-col gap-1 border border-[#231F20]/10 hover:border-[#FF0060]/40 transition-colors duration-300"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                            >
                              <div className="flex items-start gap-2 sm:gap-3">
                                {/* Avatar with Gravatar fallback to initials */}
                                <motion.div
                                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#FF0060] text-white font-semibold text-xs flex-shrink-0 overflow-hidden relative"
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {gravatarUrl ? (
                                    <img
                                      src={gravatarUrl}
                                      alt={feedback.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        // If Gravatar image fails to load, hide img and show initials
                                        e.currentTarget.style.display = "none";
                                        const parent =
                                          e.currentTarget.parentElement;
                                        if (parent) {
                                          parent.innerHTML = initials;
                                          parent.style.display = "flex";
                                          parent.style.alignItems = "center";
                                          parent.style.justifyContent =
                                            "center";
                                        }
                                      }}
                                    />
                                  ) : (
                                    initials
                                  )}
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-[#231F20] text-xs sm:text-sm">
                                      {feedback.name}
                                    </span>
                                  </div>
                                  <p className="text-[#7A736D] text-xs sm:text-sm break-words leading-relaxed">
                                    {feedback.message}
                                  </p>
                                  <span className="text-xs text-[#7A736D]/80 mt-1.5 block">
                                    {feedbackDate}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                </div>
                {/* Related Products Section */}
                <motion.div
                  className="relative mt-8 lg:absolute bottom-0 left-0 w-full flex flex-col items-center bg-[#EFE6DB] border-t-[1.5px] border-[#231F20]/15 pt-6 pb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.h3
                    className="text-lg sm:text-xl md:text-2xl uppercase font-black tracking-tight text-[#231F20] mb-4 sm:mb-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    You Might Also Like
                  </motion.h3>
                  <div className="w-full overflow-x-auto px-4 sm:px-6 pb-2 scrollbar-hide">
                    <div className="flex gap-3 sm:gap-4 pb-4">
                      {/* Use type assertion for related products since we added them dynamically */}
                      {(selectedProduct as any)?.related?.map(
                        (item: any, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleProductSelect(item)}
                            className="relative w-32 h-40 sm:w-40 sm:h-48 md:w-48 md:h-56 lg:w-56 lg:h-64 bg-[#F7F1EA] border-[1.5px] border-[#231F20]/15 rounded-sm flex-shrink-0 overflow-hidden cursor-pointer group hover:border-[#FF0060]/50 transition-all duration-300"
                          >
                            <img
                              src={item.image[0]}
                              alt={item.name}
                              className="object-contain w-full h-full items-center justify-center transition-transform duration-500 group-hover:scale-110"
                              draggable="false"
                            />
                            <motion.div
                              className="absolute inset-0 bg-[#171414]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-3"
                              initial={false}
                            >
                              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#F7F1EA] mb-1">
                                {item.name}
                              </h3>
                              <p className="text-[#FF0060] text-sm sm:text-base md:text-lg font-bold">
                                {item.price === 0
                                  ? ""
                                  : `₱ ${item.price.toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}`}
                              </p>
                            </motion.div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Inquiry Form Modal */}
        <AnimatePresence>
          {showInquiry && selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#171414]/70 flex items-center justify-center z-50"
              onClick={() => setShowInquiry(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
                className="bg-[#F7F1EA] flex flex-col text-[#231F20] p-4 sm:p-6 rounded-sm w-full max-h-[75vh] overflow-x-hidden max-w-md relative mt-12 sm:mt-16 shadow-[0_20px_60px_rgba(35,31,32,0.25)] border-[1.5px] border-[#231F20]/15"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  onClick={() => setShowInquiry(false)}
                  className="absolute top-3 right-4 sm:right-6 text-[#7A736D] hover:text-[#FF0060] transition-colors duration-200 bg-[#EFE6DB] hover:bg-[#231F20]/10 p-2 rounded-sm"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowBigRightDash className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>

                <h2 className="text-[22px] items-center justify-center text-center font-black uppercase tracking-tight mt-4 text-[#FF0060] mb-4">
                  Inquire Now
                </h2>
                <div>
                  <img
                    src={selectedProduct.image[0]}
                    alt={selectedProduct.name}
                    width={300}
                    height={60}
                    className="rounded-md object-contain ml-12 aspect-square max-h-40"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-[#231F20]">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-sm text-[#7A736D]">
                      {selectedProduct.price === 0
                        ? ""
                        : `₱ ${selectedProduct.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`}
                    </p>
                  </div>
                </div>

                {/* Convert price to string for FakeInquiryForm */}
                <FakeInquiryForm
                  product={{
                    name: selectedProduct.name,
                    price: selectedProduct.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }),
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="relative z-10 flex items-center justify-center gap-2 sm:gap-4 md:gap-6 mt-12 sm:mt-16 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-sm flex items-center gap-2 transition-all duration-300 ${
                page === 1
                  ? "bg-[#231F20]/5 text-[#7A736D]/60 cursor-not-allowed"
                  : "bg-[#F7F1EA] border-[1.5px] border-[#FF0060]/40 text-[#FF0060] hover:bg-[#FF0060] hover:text-white"
              }`}
              whileHover={page !== 1 ? { scale: 1.05, x: -3 } : {}}
              whileTap={page !== 1 ? { scale: 0.95 } : {}}
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline font-medium">Previous</span>
            </motion.button>

            <div className="flex gap-2 bg-[#EFE6DB] p-1 rounded-sm border-[1.5px] border-[#231F20]/10">
              {[...Array(totalPages)].map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    page === i + 1
                      ? "bg-[#FF0060] text-white"
                      : "text-[#7A736D] hover:text-[#231F20] hover:bg-[#231F20]/5"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-sm flex items-center gap-2 transition-all duration-300 ${
                page === totalPages
                  ? "bg-[#231F20]/5 text-[#7A736D]/60 cursor-not-allowed"
                  : "bg-[#F7F1EA] border-[1.5px] border-[#FF0060]/40 text-[#FF0060] hover:bg-[#FF0060] hover:text-white"
              }`}
              whileHover={page !== totalPages ? { scale: 1.05, x: 3 } : {}}
              whileTap={page !== totalPages ? { scale: 0.95 } : {}}
            >
              <span className="hidden sm:inline font-medium">Next</span>
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ServicesProduct;
