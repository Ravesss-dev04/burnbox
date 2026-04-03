"use client";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";

interface Visitor {
  latitude?: number | null;
  longitude?: number | null;
  location: string;
}

interface Globe3DProps {
  visitors: Visitor[];
}

export default function Globe3D({ visitors }: Globe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000, // Render at high res
      height: 1000,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [236 / 255, 72 / 255, 153 / 255], // Pink-500: #ec4899
      glowColor: [0.5, 0, 0.2],
      opacity: 0.8,
      markers: visitors
        .filter((v) => v.latitude && v.longitude)
        .map((v) => ({
          location: [v.latitude!, v.longitude!],
          size: 0.08,
        })),
      onRender: (state) => {
        // Rotate the globe
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, [visitors]);

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", maxWidth: "600px", aspectRatio: "1/1" }}
      />
    </div>
  );
}
