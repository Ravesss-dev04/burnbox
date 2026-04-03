"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiCalculator } from "react-icons/bi";

type ProductInfo = {
  unit: string;
  price: number;
};

const products: Record<string, ProductInfo> = {
  "Canvas Print only": { unit: "sqin", price: 3 },
  "Canvas Print with Wooden Frame": { unit: "sqin", price: 3.5 },
  "Acrylic Buildup Lighted Double Face": { unit: "sqft", price: 2500 },
  "Acrylic Buildup Lighted Single Face": { unit: "sqft", price: 2000 },
  "Acrylic Buildup None-Lighted Double Face": { unit: "sqft", price: 2000 },
  "Acrylic Buildup None-Lighted Single Face": { unit: "sqft", price: 1500 },
  "Acrylic Cutout 3mm": { unit: "sqft", price: 600 },
  "Acrylic Cutout 5mm": { unit: "sqft", price: 900 },
  "Acrylic LightBox": { unit: "sqft", price: 1500 },
  "Acrylic Sandwhich 3mm": { unit: "sqfin", price: 1300 },
  "Decal Sticker printed": { unit: "sqft", price: 150 },
  "Decal Sticker cut-out": { unit: "sqin", price: 4 },
  "Glass Frosted/Sticker": { unit: "sqft", price: 150 },
  "Label Sticker": { unit: "sqin", price: 0.9 },
  "Neon Lights (max. 3 colors)": { unit: "sqft", price: 1000 },
  "Panaflex Signage Lighted Double Face": { unit: "sqft", price: 800 },
  "Panaflex Signage NoNe-Lighted Double Face": { unit: "sqft", price: 700 },
  "Panaflex Signage Lighted One Face": { unit: "sqft", price: 700 },
  "Panaflex Signage NoNe-Lighted One Face": { unit: "sqft", price: 600 },
  "Photoprint / Poster": { unit: "sqin", price: 0.75 },
  "Sticker on Sintra 1.5mm": { unit: "sqin", price: 1.2 },
  "Sticker on Sintra 3mm": { unit: "sqin", price: 1.5 },
  "Sticker on Sintra 5mm": { unit: "sqin", price: 2 },
  "Tarpaulin 10 oz": { unit: "sqft", price: 25 },
  "Tarpaulin 13 oz": { unit: "sqft", price: 30 },
  "Tarpaulin 18 oz": { unit: "sqft", price: 35 },
  "Tarpaulin w/ Wooden Frame": { unit: "sqft", price: 150 },
  "Tarpaulin w/ Metal Frame": { unit: "sqft", price: 300 },
  "Vehicle Wrap": { unit: "sqft", price: 180 },
  "Wall Mural": { unit: "sqft", price: 150 },
};

const conversionFactors: Record<string, number> = {
  sqm: 1,
  sqft: 0.092903,
  sqin: 0.00064516,
  sqyd: 0.836127,
  sqcm: 0.0001,
  sqmm: 0.000001,
};

const CalculatorBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [product, setProduct] = useState("");
  const [inputUnit, setInputUnit] = useState("sqm");
  const [length, setLength] = useState<number | "">("");
  const [width, setWidth] = useState<number | "">("");
  const [convertedArea, setConvertedArea] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 8000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    compute();
  }, [product, inputUnit, length, width]);

  const compute = () => {
    const selected = products[product];
    if (!selected || !length || !width) {
      setConvertedArea(0);
      setTotalPrice(0);
      return;
    }

    
    const inputToSqm = Number(length) * Number(width) * conversionFactors[inputUnit];
    const converted = inputToSqm / conversionFactors[selected.unit];
    const total = converted * selected.price;

    setConvertedArea(converted);
    setTotalPrice(total);
  };


  const unitName = (code: string) => code;


  return (
    <>
      {/* Floating Calculator Icon */}
      <motion.div
        className="fixed bottom-6 right-6 z-[9999] cursor-pointer"
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={animate ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.8 }}
          className="bg-gray-900 rounded-full text-white shadow-lg p-3"
        >
          <BiCalculator size={28} />
        </motion.div>
      </motion.div>

      {/* Floating Calculator Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 z-[9998] bg-[#2b2b2b] border-t-8 border-pink-600 rounded-lg shadow-2xl w-[440px] p-8 text-white"
          >
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://github.com/ravenprevendido/updatedbbsitesversion4/raw/master/public/bblogo.png"
                alt="logo"
                className="w-20 mb-2"
              />
              <h2 className="text-center text-lg font-semibold text-gray-300 tracking-wide">
                PRODUCT AREA PRICE CALCULATOR (AUTO)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product */}
              <div>
                <label className="block text-sm text-white/80 font-medium mb-1">
                  Product / Service:
                </label>
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full bg-[#3a3a3a] border border-transparent focus:border-pink-600 rounded-md px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Select Product</option>
                  {Object.keys(products).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Unit */}
              <div>
                <label className="block text-sm font-medium mb-1 text-white/80">
                  Input Unit:
                </label>
                <select
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value)}
                  className="w-full bg-[#3a3a3a] border border-transparent focus:border-pink-600 rounded-md px-3 py-2 text-sm focus:outline-none"
                >
                  {Object.keys(conversionFactors).map((u) => (
                    <option key={u} value={u}>
                      {u === "sqm"
                        ? "Square Meter"
                        : u === "sqft"
                        ? "Square Feet"
                        : u === "sqin"
                        ? "Square Inch"
                        : u === "sqyd"
                        ? "Square Yard"
                        : u === "sqcm"
                        ? "Square Centimeter"
                        : "Square Millimeter"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Length and Width */}
              <div>
                <label className="block text-sm font-medium mb-1 text-white/80">
                  Length:
                </label>
                <input
                  type="number"
                 
                  placeholder="Enter length"
                  value={length === "" ? "" : length}
                  onChange={(e) =>
                        setLength(e.target.value === "" ? "" : Number(e.target.value))
                    }
                  className="w-full bg-[#3a3a3a] border border-transparent focus:border-pink-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white/80">
                  Width:
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Enter width"
                  value={width}
                  onChange={(e) => setWidth((e.target.value === ""? "" : Number(e.target.value)))}
                  className="w-full bg-[#3a3a3a] border border-transparent focus:border-pink-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              {/* Output Unit */}
              <div>
                <label className="block text-sm font-medium mb-1 text-white/80">
                  Output Unit (from product):
                </label>
                <input
                  type="text"
                  readOnly
                  value={product ? unitName(products[product].unit) : ""}
                  className="w-full bg-[#3a3a3a] rounded-md px-3 py-2 text-sm border border-transparent focus:outline-none"
                />
              </div>

              {/* Price per Unit */}
              <div>
                <label className="block text-sm font-medium mb-1 text-white/80">
                  Price per Unit:
                </label>
                <input
                  type="text"
                  readOnly
                  value={product ? products[product].price : ""}
                  className="w-full bg-[#3a3a3a] rounded-md px-3 py-2 text-sm border border-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Result Section */}
            <div className="mt-8 bg-[#1e1e1e] border-l-4 border-pink-600 rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">
                Converted Area:
              </h3>
              <div className="flex justify-between bg-[#3a3a3a] rounded-md px-3 py-2 mb-2">
                <span>{convertedArea.toFixed(2)}</span>{" "}
                <span>
                  {product ? unitName(products[product].unit) : ""}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">
                Total Price:
              </h3>
              <div className="flex bg-pink-500 rounded-md px-3 py-2 font-semibold">
                ₱ <span className="ml-2">{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <footer className="text-center text-gray-500 text-xs mt-6">
              © 2025 <span className="text-pink-500">BumBox</span> Product calculator (auto)
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CalculatorBox;
