'use client'

import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

const images = [
  {
    src: '/labelstickerimg.png',
    title: 'Sample 2',
    desc: 'From wall art and decals to brand signage and banners, we specialize in producing large format printing applications perfect for the corporate image. Our experts will work with you to ensure that we find the right products and finishing for your needs.',
  },
  {
    src: '/labelstickerimg1.png',
    title: 'SAmple 1',
    desc: 'Breathtaking highlands and green landscapes waiting to be explored.',
  },

  {
    src: '/labelstickerimg3.png',
    title: 'sample 3',
    desc: 'Breathtaking highlands and green landscapes waiting to be explored.',
  },
]
export default function Labelpage() {
  const [selectedImg, setSelectedImg] = useState<number | null>(null)
  return (
    <section className="custom-gallery-bg  w-full min-h-[80vh] mt-20 flex items-center justify-center px-6">
      {/* Right side images */}
      <div className="flex gap-6 absolute right-10 z-20">
        {images.map((img, index) => (
          <motion.img
            key={index}
            src={img.src}
            alt={img.title}
            className="w-100 h-80 rounded-xl cursor-pointer shadow-lg object-cover"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedImg(index)}
          />
        ))}
      </div>
      {/* Animate full card section */}
      <AnimatePresence>
        {selectedImg !== null && (
          <motion.div
            key={selectedImg}
            className="absolute inset-0 flex items-center justify-between px-16 py-10 z-10 rounded-2xl shadow-xl overflow-hidden"
            style={{
              backgroundImage: `url(${images[selectedImg].src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left side text */}
            <motion.div
              className="bg-black/50 text-white p-6 rounded-lg max-w-md"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <h2 className="text-4xl font-bold">{images[selectedImg].title}</h2>
              <p className="mt-3 text-lg">{images[selectedImg].desc}</p>
              <button className="mt-5 px-5 py-2 bg-white text-black font-semibold rounded-md shadow-md hover:bg-gray-200">
                See More
              </button>
            </motion.div>

            {/* Close button */}
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-5 right-5 bg-black/50 text-white px-3 py-1 rounded-md hover:bg-black/70"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
