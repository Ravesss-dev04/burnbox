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
    <div className="relative w-full md:w-full h-full bg-black/50 rounded-md overflow-hidden">
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
              i === currentIndex ? "bg-pink-500" : "bg-gray-400/50"
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
                ? "border-pink-500 bg-pink-500/20 shadow-lg shadow-pink-500/50"
                : "border-gray-400/50 bg-gray-400/20 hover:border-pink-400/70"
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
        className="relative w-full min-h-screen flex flex-col items-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#030303] overflow-hidden"
      >
        {/* Professional Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Radial Gradient Overlay for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#1a1a1a,transparent)] opacity-40" />

          {/* Animated Ambient Glows */}
          <motion.div
            animate={{
              opacity: [0.15, 0.25, 0.15],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] -translate-y-1/2"
          />
          <motion.div
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-900/10 rounded-full blur-[120px] translate-y-1/2"
          />
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
              className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => handleProductSelect(item)}
              whileHover={{ y: -5 }}
            >
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Card Content */}
              <div className="relative h-full flex flex-col bg-[#0a0a0a]/90 backdrop-blur-xl m-[1px] rounded-2xl overflow-hidden">
                {/* Image Container */}
                <div className="relative w-full h-64 overflow-hidden bg-[#111] p-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                <div className="p-5 flex flex-col gap-3 border-t border-white/5">
                  <h3 className="font-bold text-gray-200 text-lg truncate group-hover:text-pink-400 transition-colors duration-300">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-gray-500 font-medium group-hover:text-gray-300 transition-colors">
                      View Details
                    </span>
                    <motion.div
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-pink-500 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
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
              className="fixed inset-0 pt-16 sm:pt-20 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
              onClick={handleBackdropClick}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
                className="bg-gradient-to-br from-[#211F1F] via-[#1a1a1a] to-[#211F1F] h-full sm:h-[95vh] lg:h-[90vh] px-4 sm:px-6 md:px-8 text-white rounded-lg sm:rounded-xl lg:rounded-2xl w-full lg:w-4/5 md:w-5/6 relative overflow-y-auto shadow-2xl border border-pink-500/20"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  onClick={handleCloseModal}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-2 bg-black/50 hover:bg-black/70 px-3 py-2 rounded-lg transition-colors duration-200 z-10"
                >
                  <span className="font-medium text-sm sm:text-base">
                    Go back
                  </span>
                  <ArrowRight className="text-pink hover:text-pink-300 cursor-pointer w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full p-4 sm:p-6 lg:p-8 pt-12 sm:pt-16">
                  {/* Image Section */}
                  <motion.div
                    className="col-span-1 flex flex-col items-center justify-start gap-4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center shadow-xl">
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
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center md:text-left bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-gray-300 text-sm sm:text-base mt-2 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                    <motion.p
                      className="text-pink/70 text-3xl sm:text-4xl font-bold mt-3 pb-4"
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
                        className="bg-gradient-to-r from-pink/60 to-pink/70 hover:from-pink/70 hover:to-pink/80 lg:w-full text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Inquire Now
                      </motion.button>
                      <div className="relative c">
                        <button
                          className="border border-pink/60 text-pink/60 hover:bg-pink/10 w-full hover:text-white rounded transition py-2  cursor-not-allowed opacity-50"
                          title="Not allowed"
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
                        >
                          Customize this item
                        </button>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="bg-red-500 w-full opacity-30 text-white py-3 text-center rounded text-xs font-bold">
                            not applicable
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  {/* Feedback Section */}
                  <motion.div
                    className="col-span-1 flex flex-col justify-between bg-gradient-to-br from-[#1a1a1a] via-[#151515] to-[#1a1a1a] rounded-lg p-3 sm:p-4 w-full max-w-md h-full border border-pink-500/20 shadow-xl"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-pink-400 font-bold text-base sm:text-lg">
                        Feedback
                      </h3>
                      <span className="relative">
                        <motion.button
                          onClick={handleButtonClick}
                          className="bg-gradient-to-r from-black/30 via-pink/60 to-pink/70 border border-pink/70 text-pink-200 font-bold text-xs px-3 py-1.5 rounded-lg shadow-md"
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
                              className="absolute text-center justify-center top-full left-0 mt-2 bg-gradient-to-r from-black/30 via-pink/60 to-pink/70 border border-pink/70 text-pink-200 font-bold text-xs px-3 py-1.5 rounded-lg shadow-lg cursor-pointer z-20"
                            >
                              {isOld ? "Latest" : "Old"}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-3 overflow-y-auto max-h-[250px] sm:max-h-[300px] bg-[#121212] p-2 sm:p-3 rounded-lg scrollbar-thin">
                      {loadingFeedbacks ? (
                        <motion.div
                          className="text-center text-gray-400 py-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"
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
                          className="text-center text-gray-400 py-6"
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
                              className="bg-[#181818] p-2 sm:p-3 rounded-lg text-gray-300 text-sm flex flex-col gap-1 border border-gray-800/50 hover:border-pink-500/30 transition-colors duration-300"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                            >
                              <div className="flex items-start gap-2 sm:gap-3">
                                {/* Avatar with Gravatar fallback to initials */}
                                <motion.div
                                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white font-semibold text-xs flex-shrink-0 overflow-hidden relative shadow-lg"
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
                                    <span className="font-semibold text-pink-200 text-xs sm:text-sm">
                                      {feedback.name}
                                    </span>
                                  </div>
                                  <p className="text-gray-300 text-xs sm:text-sm break-words leading-relaxed">
                                    {feedback.message}
                                  </p>
                                  <span className="text-xs text-gray-500 mt-1.5 block">
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
                  className="relative mt-8 lg:absolute bottom-0 left-0 w-full flex flex-col items-center bg-gradient-to-r from-black/50 via-black/70 to-black/50 backdrop-blur-sm border-t border-pink-500/20 pt-6 pb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.h3
                    className="text-lg sm:text-xl md:text-2xl uppercase font-bold text-pink-400 mb-4 sm:mb-6"
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
                            className="relative w-32 h-40 sm:w-40 sm:h-48 md:w-48 md:h-56 lg:w-56 lg:h-64 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300"
                          >
                            <img
                              src={item.image[0]}
                              alt={item.name}
                              className="object-contain w-full h-full items-center justify-center transition-transform duration-500 group-hover:scale-110"
                              draggable="false"
                            />
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-3"
                              initial={false}
                            >
                              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1">
                                {item.name}
                              </h3>
                              <p className="text-pink-400 text-sm sm:text-base md:text-lg font-bold">
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
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              onClick={() => setShowInquiry(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
                className="bg-gradient-to-br from-[#1a1a1a] via-[#151515] to-[#1a1a1a] flex flex-col text-white p-4 sm:p-6 rounded-xl w-full max-h-[75vh] overflow-x-hidden max-w-md relative mt-12 sm:mt-16 shadow-2xl border border-pink-500/20"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  onClick={() => setShowInquiry(false)}
                  className="absolute top-3 right-4 sm:right-6 text-gray-400 hover:text-pink transition-colors duration-200 bg-black/30 hover:bg-black/50 p-2 rounded-lg"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowBigRightDash className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>

                <h2 className="text-[22px] items-center justify-center text-center font-extrabold mt-4 text-pink-500 mb-4">
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
                    <h3 className="text-lg font-medium">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-400">
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
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                page === 1
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-[#0a0a0a] border border-pink-500/30 text-pink-500 hover:bg-pink-500 hover:text-white shadow-lg hover:shadow-pink-500/20"
              }`}
              whileHover={page !== 1 ? { scale: 1.05, x: -3 } : {}}
              whileTap={page !== 1 ? { scale: 0.95 } : {}}
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline font-medium">Previous</span>
            </motion.button>

            <div className="flex gap-2 bg-[#0a0a0a] p-1 rounded-lg border border-white/5">
              {[...Array(totalPages)].map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    page === i + 1
                      ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
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
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                page === totalPages
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-[#0a0a0a] border border-pink-500/30 text-pink-500 hover:bg-pink-500 hover:text-white shadow-lg hover:shadow-pink-500/20"
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
