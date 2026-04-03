// "use client";

// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// interface WelcomeScreenProps {
//   onComplete: () => void;
//   onStartExit?: () => void;
// }

// const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete, onStartExit }) => {
//   const [stage, setStage] = useState<"initial" | "opening" | "open" | "closing" | "rotating" | "finished">("initial");
//   const [exitProps, setExitProps] = useState({ x: 0, y: 0, scale: 1 });

//   useEffect(() => {
//     const calculateExit = () => {
//       const width = window.innerWidth;
//       const height = window.innerHeight;
      
//       // Current Logo Size (approximate based on classes)
//       let currentSize = 288; // w-72
//       if (width >= 768) currentSize = 384; // w-96
//       if (width >= 1024) currentSize = 512; // w-[32rem]

//       // Target Logo Size (Header logo height is approx 56px)
//       // We want the box part to match the header logo box size.
//       // Header logo is ~56px high.
//       const targetSize = 56; 
//       const scale = targetSize / currentSize;

//       // Target Position (Top Left)
//       // Header logo is roughly at x: 24px, y: 12px (padding) relative to viewport
//       // But we need to center our logo at that position.
//       // Center of header logo box is approx x: 24 + (56/2) = 52px, y: 12 + (56/2) = 40px.
//       const targetX = 52; 
//       const targetY = 40;

//       setExitProps({
//         x: targetX - (width / 2),
//         y: targetY - (height / 2),
//         scale: scale
//       });
//     };
    
//     calculateExit();
//     window.addEventListener('resize', calculateExit);
//     return () => window.removeEventListener('resize', calculateExit);
//   }, []);

//   useEffect(() => {
//     // Prevent restarting if already in progress
//     if (stage !== "initial") return;

//     const sequence = async () => {
//       // Initial delay before starting
//       await new Promise(r => setTimeout(r, 500));
//       setStage("opening");
      
//       // Allow time for the opening animation
//       await new Promise(r => setTimeout(r, 1200));
//       setStage("open");

//       // Hold the text visible for a moment
//       await new Promise(r => setTimeout(r, 2000));
//       setStage("closing");

//       // Allow time for the closing animation
//       await new Promise(r => setTimeout(r, 1200));
      
//       // Start Exit Phase
//       if (onStartExit) onStartExit();
//       setStage("rotating");
      
//       // Wait for animation to complete via onAnimationComplete callback
//     };

//     sequence();
//   }, [onComplete, onStartExit]); // Dependencies kept for linter, but logic prevents re-run

//   if (stage === "finished") return null;

//   return (
//     <AnimatePresence>
//       <motion.div
//         className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden"
//         initial={{ opacity: 1 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//       >
//         {/* Background - Remains opaque until the component exits */}
//         <motion.div 
//             className="absolute inset-0 bg-black"
//             initial={{ opacity: 1 }}
//             animate={{ opacity: 1 }}
//         />
        
//         {/* Gradient - Remains opaque until the component exits */}
//         <motion.div 
//             className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-black to-purple-900/20" 
//             initial={{ opacity: 1 }}
//             animate={{ opacity: 1 }}
//         />

//         <div className="relative flex items-center justify-center w-full h-full" style={{ perspective: "1000px" }}>
          
//           {/* Text Container - Appears in the center when logo opens */}
//           <motion.div
//             className="absolute z-10 flex flex-col items-center justify-center text-center w-full px-4"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ 
//               opacity: (stage === "opening" || stage === "open") ? 1 : 0,
//               scale: (stage === "opening" || stage === "open") ? 1 : 0.9,
//               filter: (stage === "opening" || stage === "open") ? "blur(0px)" : "blur(70px)"
//             }}
//             transition={{ duration: 0.8 }}
//           >
//             <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-wider whitespace-nowrap">
//               <span className="text-pink-500">BURN</span>BOX
//             </h2>
//             <p className="text-white/80 text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.5em] mt-2 md:mt-4 uppercase">
//               Printing
//             </p>
//           </motion.div>
//           {/* Logo Container */}
//           <motion.div 
//             className="relative z-[10001] w-72 h-72 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem] flex items-center justify-center"
//             animate={stage === "rotating" ? { 
//                 rotate: -360, // Rotate counter-clockwise for a "rolling" effect towards top-left
//                 x: exitProps.x,
//                 y: exitProps.y,
//                 scale: exitProps.scale,
//             } : {}}
//             transition={stage === "rotating" ? { duration: 1.5, ease: "easeInOut" } : {}}
//             onAnimationComplete={() => {
//               if (stage === "rotating") {
//                 setStage("finished");
//                 onComplete();
//               }
//             }}
//           >
//               {/* Left Half of the Logo */}
//               <motion.div
//                 className="absolute inset-0 w-full h-full"
//                 initial={{ x: 0 }}
//                 animate={{ 
//                   x: (stage === "opening" || stage === "open") ? "-55%" : "0%" 
//                 }}
//                 transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
//               >
//                  <img 
//                     src="/bblogo.png" 
//                     alt="Logo Left" 
//                     className="w-full h-full object-contain"
//                     style={{ clipPath: "inset(0 50% 0 0)" }} 
//                  />
//               </motion.div>

//               {/* Right Half of the Logo */}
//               <motion.div
//                 className="absolute inset-0 w-full h-full"
//                 initial={{ x: 0 }}
//                 animate={{ 
//                   x: (stage === "opening" || stage === "open") ? "55%" : "0%" 
//                 }}
//                 transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
//               >
//                  <img 
//                     src="/bblogo.png" 
//                     alt="Logo Right" 
//                     className="w-full h-full object-contain"
//                     style={{ clipPath: "inset(0 0 0 50%)" }} 
//                  />
//               </motion.div>
//           </motion.div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default WelcomeScreen;
