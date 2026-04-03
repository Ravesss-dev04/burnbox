// "use client";
// import { useState, useRef, useEffect } from "react";
// import Image from "next/image";

// interface Card {
//   id: number;
//   img: string;
//   imgStyle?: string;
// }

// const cardsData: Card[] = [
//   { id: 1, img: "/1000008556-removebg-preview.png", imgStyle: "lg:w-[450px]" },
//   { id: 3, img: "/cup.png", imgStyle: "lg:w-[450px]" },
//   { id: 4, img: "/EXHIBIT_MOCKUP.png", imgStyle: "lg:w-[450px]"  },
//   { id: 5, img: "/BOOK.png",imgStyle: "lg:w-[450px]"  },
//   { id: 6, img: "/nn1.png", imgStyle: "lg:w-[450px]"  },
//   { id: 7, img: "/nn2.png", imgStyle: "lg:w-[250px]"  },
//   { id: 8, img: "/nn3.png", imgStyle: "lg:w-[300px]"  },
//   { id: 9, img: "/nn4.png", imgStyle: "lg:w-[300px]"  },
//   { id: 10, img: "/nn5.png", imgStyle: "lg:w-[390px]"  },
//   { id: 11, img: "/nn6.png", imgStyle: "lg:w-[400px]"  },
//   { id: 12, img: "/nn7.png", imgStyle: "lg:w-[450px]"  },
//   { id: 13, img: "/nn8.png", imgStyle: "lg:w-[350px]"  },
//   { id: 14, img: "/nn9.png", imgStyle: "lg:w-[350px]"  },
//   { id: 15, img: "/nn11.png", imgStyle: "lg:w-[300px]"  },
//   { id: 16, img: "/nn12.png", imgStyle: "lg:w-[295px]"  },
//   { id: 17, img: "/nn13.png", imgStyle: "lg:w-[395px]"  },
//   { id: 18, img: "/nn14.png", imgStyle: "lg:w-[395px]"  },
// ];

// export default function CardCarousel() {
//   const [centerIndex, setCenterIndex] = useState(2);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const dragStartX = useRef<number | null>(null);
//   const autoplayRef = useRef<NodeJS.Timeout | null>(null);

//   const total = cardsData.length;

//   const wrap = (i: number) => (i + total) % total;

//   const startAutoplay = () => {
//     if (autoplayRef.current) clearInterval(autoplayRef.current);
//     autoplayRef.current = setInterval(() => goNext(), 3500);
//   };

//   const stopAutoplay = () => {
//     if (autoplayRef.current) clearInterval(autoplayRef.current);
//     autoplayRef.current = null;
//   };

//   useEffect(() => {
//     startAutoplay();
//     return () => stopAutoplay();
//   }, []);

//   const goNext = () => {
//     if (isAnimating) return;
//     setIsAnimating(true);
//     setCenterIndex((prev) => wrap(prev + 1));
//     setTimeout(() => setIsAnimating(false), 400);
//   };

//   const goPrev = () => {
//     if (isAnimating) return;
//     setIsAnimating(true);
//     setCenterIndex((prev) => wrap(prev - 1));
//     setTimeout(() => setIsAnimating(false), 400);
//   };


//   const handleDragStart = (x: number) => {
//     dragStartX.current = x;
//     stopAutoplay();
//   };

//   const handleDragMove = (x: number) => {
//     if (dragStartX.current === null) return;

//     const delta = x - dragStartX.current;
//     if (Math.abs(delta) > 80 && !isAnimating) {
//       delta > 0 ? goPrev() : goNext();
//       dragStartX.current = null;
//       startAutoplay();
//     }
//   };

//   const handleDragEnd = () => {
//     dragStartX.current = null;
//     startAutoplay();
//   };

//   const calcScale = (offset: number) => {
//     if (offset === 0) return 1.8; 
//     const base = 1 - Math.abs(offset) * 0.25;
//     return Math.max(base, 0.35);
//   };


//   const calcLeft = (offset: number) => `${50 + offset * 22}%`;

//   return (
//     <section
     
//       className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden"
//     >

//       <div className="
//         pointer-events-none absolute top-1/2 left-1/2 
//         -translate-x-1/2 -translate-y-1/2
//         w-[200px] h-[400px] z-0
//         md:w-[800px] md:h-[300px]
//         lg:w-[1300px] lg:h-[500px]
//       ">
//         <div
//           className="
//           absolute
//             w-full h-full 
//             bg-[radial-gradient(ellipse_at_center,rgba(250,96,255,0.75)_0%,rgba(0,50,120,0.45)_50%,transparent_80%)]
//             blur-[40px] opacity-95 
//             rounded-[40%_60%_70%_30%]
//             md:blur-[70px]
//             lg:blur-[100px]
            
//           "
//         />
//         <div className="absolute w-[150px] h-[400px] md:w-[250px] md:h-[600px] lg:w-[300px] lg:h-[900px]  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
//       bg-[radial-gradient(ellipse_at_center,rgba(0,160,255,0.9)_0%,rgba(0,80,150,0.5)_50%,transparent_80%)]
//       blur-[80px] opacity-95 
//       rounded-[50%_50%_60%_40%]
//       md:blur-[50px]
//       lg:blur-[80px]
      
//       "/>
//       </div>
  
//       <div
//         className="relative w-full h-[700px]  flex items-center justify-center z-20"
//         onMouseDown={(e) => handleDragStart(e.clientX)}
//         onMouseMove={(e) => handleDragMove(e.clientX)}
//         onMouseUp={handleDragEnd}
//         onMouseLeave={handleDragEnd}
//         onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
//         onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
//         onTouchEnd={handleDragEnd}
//       >
//         {cardsData.map((card, i) => {
//           const offset = i - centerIndex;
//           const realOffset =
//             offset > total / 2 ? offset - total :
//             offset < -total / 2 ? offset + total :
//             offset;

//           const scale = calcScale(realOffset);
//           const left = calcLeft(realOffset);
//           const zIndex = 50 - Math.abs(realOffset);
//           return (
//             <div
//               key={card.id}
//               className={`
//                 absolute top-1/2 
//                 transition-all duration-500 ease-in-out 
//                 select-none pointer-events-none
//                 ${realOffset !== 0 ? "opacity-50 blur-[2px]" : "opacity-100"}
//               `}
//               style={{
//                 transform: `translate(-42%, -40%) scale(${scale})`,
//                 left,
//                 zIndex,
//               }}
//             >
//               <div className={`w-[150px] sm:w-[450px] md:w-[450px] ${card.imgStyle}`}>
//               <Image
//                 width={900}
//                 height={900}
//                 src={card.img}
//                 alt="Burnbox item"
//                 className="
//                  object-contain w-full 
//                 "
//               />
//               </div>
//             </div>
//           );
//         })}   
//       </div>
      
//     </section>
//   );
// }
