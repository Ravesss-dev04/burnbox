// 'use client';

// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaExpand, FaTimes } from 'react-icons/fa';

// interface GalleryImage {
//   id: number;
//   imageUrl: string;
//   title: string;
//   altText: string;
//   createdAt: string;
// }

// const GalleryPhotos: React.FC = () => {
//   const [images, setImages] = useState<GalleryImage[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedId, setSelectedId] = useState<number | null>(null);
  
//   // Fetch images
//   useEffect(() => {
//     const loadImages = async () => {
//       try {
//         const res = await fetch('/api/gallery');
//         if (!res.ok) throw new Error('Failed to fetch');
//         const data = await res.json();
//         if (Array.isArray(data)) setImages(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadImages();
//   }, []);

//   const selectedImage = images.find(img => img.id === selectedId);

//   // Split images into two rows for the marquee effect
//   const firstRow = images.slice(0, Math.ceil(images.length / 2));
//   const secondRow = images.slice(Math.ceil(images.length / 2));

//   // Duplicate arrays to create seamless loop
//   const marqueeRow1 = [...firstRow, ...firstRow, ...firstRow, ...firstRow];
//   const marqueeRow2 = [...secondRow, ...secondRow, ...secondRow, ...secondRow];

//   if (loading) {
//     return (
//       <div className="w-full min-h-[40vh] flex items-center justify-center">
//         <div className="flex gap-2">
//           {[...Array(3)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="w-3 h-3 bg-pink-500 rounded-full"
//               animate={{ y: [0, -10, 0] }}
//               transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section className="relative w-full py-20 overflow-hidden bg-black/20 backdrop-blur-sm">
//       {/* Background Elements */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
//         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-pink-600/5 blur-[120px] rounded-full" />
//         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
//       </div>

//       <div className="relative z-10 w-full">
//         {/* Header */}
//         <div className="text-center mb-12 px-4">
//           <motion.h1 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
//           >
//             Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Gallery</span>
//           </motion.h1>
//           <motion.div 
//             initial={{ scaleX: 0 }}
//             whileInView={{ scaleX: 1 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2, duration: 0.8 }}
//             className="h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto rounded-full"
//           />
//         </div>

//         {/* Marquee Container */}
//         <div className="flex flex-col gap-8 w-full">
//           {/* Row 1 - Moves Left */}
//           <div className="relative w-full overflow-hidden">
//             <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10" />
//             <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10" />
            
//             <motion.div 
//               className="flex gap-6 w-max"
//               animate={{ x: ["0%", "-50%"] }}
//               transition={{ 
//                 duration: 40, 
//                 ease: "linear", 
//                 repeat: Infinity 
//               }}
//             >
//               {marqueeRow1.map((image, index) => (
//                 <div 
//                   key={`${image.id}-r1-${index}`}
//                   className="relative w-[300px] h-[200px] md:w-[400px] md:h-[260px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group border border-white/10"
//                   onClick={() => setSelectedId(image.id)}
//                 >
//                   <Image
//                     src={image.imageUrl}
//                     alt={image.altText || image.title || 'Gallery Image'}
//                     fill
//                     className="object-cover transition-transform duration-500 group-hover:scale-110"
//                     unoptimized
//                   />
//                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                     <FaExpand className="text-white text-2xl drop-shadow-lg" />
//                   </div>
//                 </div>
//               ))}
//             </motion.div>
//           </div>

//           {/* Row 2 - Moves Right (only if we have enough images) */}
//           {images.length > 3 && (
//             <div className="relative w-full overflow-hidden">
//               <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10" />
//               <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10" />
              
//               <motion.div 
//                 className="flex gap-6 w-max"
//                 animate={{ x: ["-50%", "0%"] }}
//                 transition={{ 
//                   duration: 45, 
//                   ease: "linear", 
//                   repeat: Infinity 
//                 }}
//               >
//                 {marqueeRow2.map((image, index) => (
//                   <div 
//                     key={`${image.id}-r2-${index}`}
//                     className="relative w-[300px] h-[200px] md:w-[400px] md:h-[260px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group border border-white/10"
//                     onClick={() => setSelectedId(image.id)}
//                   >
//                     <Image
//                       src={image.imageUrl}
//                       alt={image.altText || image.title || 'Gallery Image'}
//                       fill
//                       className="object-cover transition-transform duration-500 group-hover:scale-110"
//                       unoptimized
//                     />
//                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                       <FaExpand className="text-white text-2xl drop-shadow-lg" />
//                     </div>
//                   </div>
//                 ))}
//               </motion.div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Lightbox Modal */}
//       <AnimatePresence>
//         {selectedId && selectedImage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
//             onClick={() => setSelectedId(null)}
//           >
//             <button 
//               className="absolute top-6 right-6 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
//               onClick={() => setSelectedId(null)}
//             >
//               <FaTimes size={24} />
//             </button>

//             <motion.div
//               layoutId={`card-${selectedId}`}
//               className="relative w-full max-w-5xl max-h-[85vh] rounded-lg overflow-hidden shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <Image
//                 src={selectedImage.imageUrl}
//                 alt={selectedImage.altText || selectedImage.title}
//                 width={1200}
//                 height={800}
//                 className="w-full h-full object-contain max-h-[85vh] bg-black"
//                 unoptimized
//               />
              
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 md:p-8 pt-20">
//                 <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
//                   {selectedImage.title || ''}
//                 </h3>
//                 {selectedImage.altText && (
//                   <p className="text-gray-300 max-w-2xl">
//                     {selectedImage.altText}
//                   </p>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// };

// export default GalleryPhotos;
