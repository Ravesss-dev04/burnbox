'use-client';

import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet';

const AltScrollZoom = () => {

  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    map.scrollWheelZoom.disable();
    const handleWheel = (e: WheelEvent) => {
      if(e.altKey) {
        map.scrollWheelZoom.enable();
      }else {
        map.scrollWheelZoom.disable();
      }
    };
    container.addEventListener("wheel", handleWheel); 
}, [map]);

    return null;
}
export default AltScrollZoom
