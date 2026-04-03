"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  HiMenu,
  HiOutlineSearch,
  HiOutlineShoppingCart,
  HiX,
} from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";
import { RiMenu4Line } from "react-icons/ri";
import ToolTip from "./ToolTip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TooltipServices from "./TooltipServices";
import AboutTooltip from "./AboutTooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useHeaderContext } from "../context/HeaderContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import Editable from "./Editable";

const Header: React.FC = () => {
  const { config } = useSiteConfig();
  const {
    searchValue,
    setSearchValue,
    filteredProducts,
    selectProductById,
    setSelectedServiceFromHeader,
    selectProductByName, // Add this from your context
  } = useHeaderContext();

  const pathname = usePathname();
  const router = useRouter();

  // Updated handleTooltipServiceClick to prevent URL changes
  const handleTooltipServiceClick = (serviceName: string) => {
    // Prevent URL changes - just use context to open modal
    setSelectedServiceFromHeader(serviceName);
    selectProductByName(serviceName);
    // If not on services page, navigate there first
    if (pathname !== "/services") {
      router.push("/services");
    }

    // Scroll to products section
    setTimeout(() => {
      const productsSection = document.getElementById("products-section");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  // Handle mobile service click - NEW FUNCTION
  const handleMobileServiceClick = (serviceName: string) => {
    selectProductByName(serviceName);
    setMobileMenuOpen(false);
    setShowServicesTooltip(false);

    // Navigate to services page if not already there
    if (pathname !== "/services") {
      router.push("/services");
    }

    // Scroll to products section after navigation
    setTimeout(() => {
      const productsSection = document.getElementById("products-section");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleNavClick = (sectionId: string) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      sessionStorage.setItem("scrollToSection", sectionId);
      router.push("/", { scroll: false });
    }
  };

  const searchParams = useSearchParams();
  useEffect(() => {
    const scrollTo = searchParams?.get("scrollTo");
    if (scrollTo) {
      const section = document.getElementById(scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchParams]);

  const [list, setList] = useState<string[]>([
    "A4 Paper",
    "about",
    "services",
    "PCV ID/Lanyard",
    "Photo canvas",
    "Wall Mural",
    "gallery",
    "burnbox",
    "home",
    "contact",
  ]);

  const aboutList = [
    "About Us",
    "Mission and Vission",
    "Why Choose Burnbox Printing?",
  ];

  const servicesList = [
    { id: 1, name: "Digital & Offset Printing" },
    { id: 2, name: "Forms & Receipts" }, // Fixed typo: "Reciepts" to "Receipts"
    { id: 3, name: "Panaflex-Signage" },
    { id: 4, name: "Large format Services" },
    { id: 5, name: "Sticker & Labels" },
    { id: 6, name: "Acrylic Build-up" },
    { id: 7, name: "Standee Signage" },
    { id: 8, name: "Wall Mural" },
    { id: 9, name: "Glass Frosted Sticker" },
    { id: 10, name: "Sticker On Sintra" },
    { id: 11, name: "Graphic Design" },
    { id: 12, name: "Logo design" },
    { id: 13, name: "Flyer Design" },
    {
      id: 14,
      name: "Other services",
      nestedTooltip: ["Receipt types", "Forms customization", "Bulk orders"],
    },
  ];

  const buttons = ["wallmural", "labelsticker", "photocanvas", "pvclanyard"];
  const [showToolTip, setToolTip] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSubmenu, setShowMobileSubmenu] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [showServicesTooltip, setShowServicesTooltip] = useState(false);
  const [showAboutTooltip, setShowAboutTooltip] = useState(false);
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const hideTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredList = list.filter((item) => {
    return item.toLowerCase().includes(searchValue.toLowerCase());
  });

  const handleSearch = () => {
    if (filteredList.length === 1) {
      const sectionId = filteredList[0].toLowerCase().replace(/\s+/g, "-");
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (searchValue) {
      handleSearch();
    }
  }, [searchValue]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setShowMobileSubmenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMobileNavClick = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
    setShowMobileSubmenu(false);
  };

  const handleMouseLeaveLeaveAbout = () => {
    if (!isHoveringTooltip) {
      hideTooltipTimeout.current = setTimeout(() => {
        setShowAboutTooltip(false);
      }, 200);
    }
  };

  const handleMouseLeaveServices = () => {
    if (!isHoveringTooltip) {
      hideTooltipTimeout.current = setTimeout(() => {
        setShowServicesTooltip(false);
      }, 200);
    }
  };

  const handleMouseEnterTooltip = () => {
    if (hideTooltipTimeout.current) {
      clearTimeout(hideTooltipTimeout.current);
    }
    setIsHoveringTooltip(true);
    setShowServicesTooltip(true);
  };

  const handleMouseLeaveTooltip = () => {
    setIsHoveringTooltip(false);
    hideTooltipTimeout.current = setTimeout(() => {
      setShowServicesTooltip(false);
    }, 200);
  };

  const handleMouseEnterTooltipAbout = () => {
    if (hideTooltipTimeout.current) {
      clearTimeout(hideTooltipTimeout.current);
    }
    setIsHoveringTooltip(true);
    setShowAboutTooltip(true);
  };
  const handleMouseLeaveTooltipAbout = () => {
    setIsHoveringTooltip(false);
    hideTooltipTimeout.current = setTimeout(() => {
      setShowAboutTooltip(false);
    }, 200);
  };
  return (
    <div className="h-20 w-full flex items-center justify-between px-5 py-3 text-white font-extralight text-lg z-100 bg-zinc-950/90 backdrop-blur-md fixed border-b border-white/5">
      {/* Logo */}
      <a href="#home" className="h-20 py-3 px-1 block relative w-auto">
        <Editable
            name="headerLogo"
            type="image"
            defaultValue="/burnboxlogo.png"
            className="h-full w-auto object-contain object-left"
        />
      </a>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-end flex-1 ">
        {!isSearchActive ? (
          <>
            <a href="#home">
              <button
                onClick={() => handleNavClick("home")}
                type="button"
                className="px-5 h-full hover:text-pink transition ease-in duration-200"
              >
                <Editable name="navHome" as="span" defaultValue="Home" />
              </button>
            </a>
            <span
              className="relative"
              onMouseEnter={() => setShowAboutTooltip(true)}
              onMouseLeave={handleMouseLeaveLeaveAbout}
            >
              <a href="/about">
                <button
                  onClick={() => handleNavClick("about")}
                  type="button"
                  className="px-5 h-full hover:text-pink transition ease-in duration-200"
                >
                  <Editable name="navAbout" as="span" defaultValue="About" />
                </button>
              </a>
              {showAboutTooltip && (
                <div
                  ref={tooltipRef}
                  onMouseEnter={handleMouseEnterTooltipAbout}
                  onMouseLeave={handleMouseLeaveTooltipAbout}
                >
                  <AboutTooltip aboutus={aboutList} />
                </div>
              )}
            </span>
            <span
              className="relative"
              onMouseEnter={() => setShowServicesTooltip(true)}
              onMouseLeave={handleMouseLeaveServices}
            >
              <a href="/services">
                <button
                  onClick={() => handleNavClick("product")}
                  type="button"
                  className="px-5 h-full flex gap-2 items-center hover:text-pink transition ease-in duration-200"
                >
                  <Editable name="navServices" as="span" defaultValue="Services" />
                </button>
              </a>
              {showServicesTooltip && (
                <div
                  ref={tooltipRef}
                  onMouseEnter={handleMouseEnterTooltip}
                  onMouseLeave={handleMouseLeaveTooltip}
                >
                  <TooltipServices
                    services={servicesList}
                    onServiceClick={(serviceName) =>
                      handleTooltipServiceClick(serviceName)
                    }
                  />
                </div>
              )}
            </span>
            <a href="/contact">
              <button
                onClick={() => handleNavClick("contact")}
                type="button"
                className="px-5 h-full hover:text-[#ff0060] transition ease-in duration-200"
              >
                <Editable name="navContact" as="span" defaultValue="Contact" />
              </button>
            </a>
            <button type="button" onClick={() => setIsSearchActive(true)} className="hover:text-[#ff0060] transition ease-in duration-200">
              <HiOutlineSearch />
            </button>
          </>
        ) : (
          // Search bar for desktop
          <div className="transition-all duration-300 relative">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="bg-zinc-900 border border-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:border-[#ff0060] transition-all duration-300 w-64 placeholder:text-gray-500"
              />
              <button
                type="button"
                className="text-2xl p-2 mr-3"
                onClick={() => {
                  setIsSearchActive(false);
                  setSearchValue("");
                }}
              >
                <HiX className="text-[#ff0060]" />
              </button>
            </div>

            <AnimatePresence>
              {searchValue.trim() === "" ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute mt-3 w-[260px] bg-zinc-900 text-gray-300 rounded-xl shadow-lg border border-white/10 p-4 flex flex-col items-center gap-3 z-50"
                >
                  <img
                    src="/bblogo.png"
                    alt="Burnbox Logo"
                    width={50}
                    height={40}
                    className="object-contain"
                  />
                  <div className="text-center text-sm">
                    <p className="text-white font-semibold">
                      Looking for something?
                    </p>
                    <p className="text-xs text-gray-400">
                      Search Burnbox Printing for posts, photos, and other
                      visible activity.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute mt-3 w-[265px] bg-zinc-900 border border-white/10 rounded-xl shadow-lg p-2 z-50 max-h-[320px] overflow-y-auto"
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          selectProductById(product.id);
                          setSearchValue("");
                          setIsSearchActive(false);
                          if (pathname !== "/services") {
                            router.push("/services");
                          }
                          setTimeout(() => {
                            const productsSection = document.getElementById("products-section");
                            if (productsSection) {
                              productsSection.scrollIntoView({ behavior: "smooth" });
                            }
                          }, 300);
                        }}
                        className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition"
                      >
                        <div className="w-14 h-14 relative flex-shrink-0 rounded overflow-hidden bg-zinc-800">
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#ff0060]">
                            {" "}
                            {product.price === 0
                              ? ""
                              : `₱ ${product.price.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-3">
                      No products found.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Cart for Desktop */}
      <div className="hidden md:flex ml-4">
        <button className="text-2xl p-3 rounded-full bg-pink hover:scale-110 ease-in-out duration-200">
          <HiOutlineShoppingCart />
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="text-3xl text-white relative z-50"
          onClick={() => {
            setMobileMenuOpen(!isMobileMenuOpen);
            setShowMobileSubmenu(false);
          }}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <RiMenu4Line className="text-pink-500" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiMenu />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="absolute top-full left-0 w-full bg-gradient-to-b from-black via-black to-black/95 backdrop-blur-md text-white px-7 py-6 space-y-4 shadow-2xl border-t border-pink-500/20"
          >
            {["Home", "About", "Services", "Contact"].map((item, index) => {
              const isAbout = item === "About";
              const isServices = item === "Services";
              const isHome = item === "Home";
              const isContact = item === "Contact";

              return (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.6, -0.05, 0.01, 0.99],
                  }}
                  className="w-full"
                >
                  {/* Top-level Menu Item */}
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      onClick={() => {
                        if (isAbout) {
                          if (isMobile) {
                            router.push("/about");
                            setMobileMenuOpen(false);
                          } else {
                            setShowAboutTooltip((prev) => !prev);
                            setShowServicesTooltip(false);
                          }
                        } else if (isServices) {
                          if (isMobile) {
                            // UPDATED: Use the new function for mobile services
                            setShowServicesTooltip((prev) => !prev);
                            setShowAboutTooltip(false);
                          } else {
                            setShowServicesTooltip((prev) => !prev);
                            setShowAboutTooltip(false);
                          }
                        } else if (isHome) {
                          router.push("/#home");
                          setMobileMenuOpen(false);
                        } else if (isContact) {
                          router.push("/contact#contact");
                          setMobileMenuOpen(false);
                        }
                      }}
                      className="flex items-center gap-2 text-left hover:text-pink transition-colors duration-200 text-lg font-medium"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Editable 
                        name={`navMobile${item}`} 
                        as="span" 
                        defaultValue={item} 
                      />
                    </motion.button>

                    {(isAbout || isServices) && (
                      <motion.button
                        onClick={() => {
                          if (isAbout) {
                            setShowAboutTooltip((prev) => !prev);
                            setShowServicesTooltip(false);
                          } else if (isServices) {
                            setShowServicesTooltip((prev) => !prev);
                            setShowAboutTooltip(false);
                          }
                        }}
                        className="flex items-center"
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.div
                          animate={{
                            rotate:
                              (isAbout && showAboutTooltip) ||
                              (isServices && showServicesTooltip)
                                ? 180
                                : 0,
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <HiChevronDown className="text-pink-500" size={18} />
                        </motion.div>
                      </motion.button>
                    )}
                  </motion.div>
                  {/* About Submenu */}
                  <AnimatePresence>
                    {isAbout && showAboutTooltip && (
                      <motion.div
                        key="about-tooltip-overlay"
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.6, -0.05, 0.01, 0.99],
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          className="ml-4 mt-3 space-y-2 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-lg p-4 w-[280px] border border-pink-500/20 shadow-xl"
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {aboutList.map((label, idx) => {
                            const handleAboutNavigation = (label: string) => {
                              const routeMap: Record<string, string> = {
                                "About Us": "/about#about-us",
                                "Mission and Vission":
                                  "/about#mission-and-vision",
                                "Why Choose Burnbox Printing?":
                                  "#why-choose-burnbox",
                              };
                              const target = routeMap[label];
                              if (!target) return;
                              if (label === "Why Choose Burnbox Printing?") {
                                if (pathname === "/") {
                                  const section =
                                    document.querySelector(target);
                                  section?.scrollIntoView({
                                    behavior: "smooth",
                                  });
                                } else {
                                  router.push("/#why-choose-burnbox");
                                }
                              } else {
                                router.push(target);
                              }
                              setMobileMenuOpen(false);
                              setShowAboutTooltip(false);
                            };
                            return (
                              <motion.button
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 + 0.15 }}
                                whileHover={{ x: 5, color: "#ec4899" }}
                                whileTap={{ scale: 0.95 }}
                                className="block text-sm text-left hover:text-pink transition-colors duration-200 py-2 px-2 rounded-md hover:bg-pink/10 w-full"
                                onClick={() => handleAboutNavigation(label)}
                              >
                                {label}
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Services Submenu - UPDATED */}
                  <AnimatePresence>
                    {isServices && showServicesTooltip && (
                      <motion.div
                        key="services-tooltip-overlay"
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.6, -0.05, 0.01, 0.99],
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          className="ml-4 mt-3 space-y-2 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-lg p-4 w-[280px] border border-pink-500/20 shadow-xl max-h-[400px] overflow-y-auto"
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {servicesList.map((service, idx) => (
                            <motion.button
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 + 0.15 }}
                              whileHover={{ x: 5, color: "#ec4899" }}
                              whileTap={{ scale: 0.95 }}
                              className="block text-sm hover:text-pink transition-colors duration-200 w-full text-left py-2 px-2 rounded-md hover:bg-pink/10"
                              onClick={() =>
                                handleMobileServiceClick(service.name)
                              } // UPDATED: Use new function
                            >
                              {service.name}
                            </motion.button>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
            {/* Mobile Search and Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="relative flex items-center gap-4 mt-6 py-4 overflow-visible z-[9999]"
            >
              {/* Cart Icon */}
              <motion.div
                className="p-2 rounded-full bg-pink cursor-pointer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <HiOutlineShoppingCart className="text-xl" />
              </motion.div>
              {/* Search Input Field */}
              <AnimatePresence>
                {isMobileSearchActive && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent border border-pink-300 text-white px-4 py-2 rounded-md focus:outline-none focus:border-pink-500 placeholder:text-gray-400"
                    autoFocus
                  />
                )}
              </AnimatePresence>

              <motion.button
                onClick={() => {
                  setIsMobileSearchActive((prev) => !prev);
                  setSearchValue("");
                }}
                className="relative w-8 h-8"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileSearchActive ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0, scale: 0 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <HiX className="w-8 h-8 text-pink-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="search"
                      initial={{ rotate: 90, opacity: 0, scale: 0 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <HiOutlineSearch className="w-8 h-8 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile Search Results */}
              <AnimatePresence>
                {isMobileSearchActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-[-150px] left-12 w-52 bg-gradient-to-br from-zinc-900/95 via-zinc-800/95 to-zinc-900/95 text-gray-300 rounded-xl shadow-2xl border border-pink-500/30 p-4 flex flex-col items-center gap-3 z-[10000] backdrop-blur-md"
                  >
                    {searchValue.trim() === "" ? (
                      <>
                        <motion.img
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          src="/bblogo.png"
                          alt="Burnbox Logo"
                          className="h-12 object-contain"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-center text-sm"
                        >
                          <p className="text-white font-semibold">
                            Looking for something?
                          </p>
                          <p className="text-xs text-gray-400">
                            Search Burnbox Printing for posts, photos, and other
                            visible activity.
                          </p>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        {searchValue.length < 2 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center w-full py-4"
                          >
                            <motion.div
                              className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full mb-2"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            <p className="text-xs text-gray-400">
                              Searching...
                            </p>
                          </motion.div>
                        ) : (
                          
                          <>
                            <div className="w-full flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
                              {filteredProducts.length > 0 ? (
                                filteredProducts.map((product, index) => (
                                  <motion.button
                                    key={product.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      selectProductById(product.id);
                                      setSearchValue("");
                                      setIsMobileSearchActive(false);
                                      setMobileMenuOpen(false);
                                      
                                      if (pathname !== "/services") {
                                        router.push("/services");
                                      }
                                      
                                      setTimeout(() => {
                                        const productsSection = document.getElementById("products-section");
                                        if (productsSection) {
                                          productsSection.scrollIntoView({ behavior: "smooth" });
                                        }
                                      }, 300);
                                    }}
                                    className="w-full flex items-center gap-3 p-2 rounded-md transition-all duration-200 text-left group"
                                  >
                                    <div className="w-10 h-10 relative flex-shrink-0 rounded overflow-hidden bg-zinc-800 border border-white/10">
                                      <img
                                        src={product.image[0]}
                                        alt={product.name}
                                        className="object-contain w-full h-full"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-white truncate group-hover:text-pink-500 transition-colors">
                                        {product.name}
                                      </p>
                                      <p className="text-xs text-[#ff0060]">
                                        {product.price === 0
                                          ? ""
                                          : `₱ ${product.price.toLocaleString("en-US", {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })}`}
                                      </p>
                                    </div>
                                  </motion.button>
                                ))
                              ) : (
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-center py-4 text-xs text-gray-400"
                                >
                                  No products found.
                                </motion.p>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
