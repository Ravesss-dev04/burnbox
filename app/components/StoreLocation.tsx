// app/components/StoreLocation.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Branch } from "@/data/branches";

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const AltScrollZoom = dynamic(() => import("./AltScrollZoom"), { ssr: false });

import "leaflet/dist/leaflet.css";

interface StoreLocationProps {
  target?: [number, number];
  mapStyle?: string;
  branches: Branch[];
  onSelectBranch: (branch: Branch) => void;
  is3DMode?: boolean;
}

export default function StoreLocation({ 
  target, 
  mapStyle = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  branches,
  onSelectBranch,
  is3DMode = false
}: StoreLocationProps) {
  const mapRef = useRef<any>(null);
  const [L, setL] = useState<any>(null);
  const [DefaultIcon, setDefaultIcon] = useState<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Load Leaflet only on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
        setL(leaflet);
        
        // Fix for default markers in react-leaflet
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          iconUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
        });

        const customIcon = leaflet.divIcon({
          className: 'bg-transparent border-none',
          html: `<div class="w-full h-full transition-transform duration-300 hover:scale-125 drop-shadow-lg flex items-center justify-center">
                   <img src="/burnbox-logo-only.png" alt="Store" class="w-full h-full object-contain" />
                 </div>`,
          iconSize: [50, 50],
          iconAnchor: [25, 50],
          popupAnchor: [0, -50],
        });
        
        setDefaultIcon(customIcon);
        setIsMapReady(true);
      });
    }
  }, []);

  // Fly to target when it changes
  useEffect(() => {
    if (target && mapRef.current && isMapReady) {
      mapRef.current.flyTo(target, 18, { 
        duration: 2,
        easeLinearity: 0.25
      });
    }
  }, [target, isMapReady]);

  // Don't render the map until leaflet and icon are ready
  if (!isMapReady || !L || !DefaultIcon) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#111]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full transition-all duration-1000 overflow-hidden ${is3DMode ? 'perspective-map' : ''}`}>
      <MapContainer
        center={[14.428425252312016, 120.98849405250161]}
        zoom={15}
        className={`h-full w-full z-0 transition-transform duration-1000 ${is3DMode ? 'rotate-x-30 scale-125' : ''}`}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={false}
        attributionControl={false}
        ref={mapRef}
      >
        <TileLayer
          url={mapStyle}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {branches.map((branch) => (
          <Marker 
            key={branch.id}
            position={[branch.coordinates.lat, branch.coordinates.lng]}
            icon={DefaultIcon}
            eventHandlers={{
              click: () => {
                onSelectBranch(branch);
                mapRef.current?.flyTo([branch.coordinates.lat, branch.coordinates.lng], 18, { duration: 1.5 });
              },
            }}
          >
          </Marker>
        ))}

        <AltScrollZoom />
      </MapContainer>
      <style jsx global>{`
        .perspective-map {
          perspective: 1200px;
        }
        .rotate-x-30 {
          transform: rotateX(45deg);
          transform-origin: center 70%;
        }
        /* Removed darkening filter for better visibility */
        .leaflet-tile-pane {
          filter: contrast(1.1) saturate(1.1);
        }
        /* Custom marker animation */
        .leaflet-marker-icon {
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
}