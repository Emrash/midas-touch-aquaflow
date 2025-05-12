
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
    isMain?: boolean;
  }>;
  height?: string;
  width?: string;
}

const Map = ({ 
  center, 
  zoom = 15, 
  markers = [], 
  height = "400px",
  width = "100%" 
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Only create map if it doesn't exist
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Custom icons
      const defaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      const goldIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconSize: [30, 45],
        iconAnchor: [15, 45],
        popupAnchor: [1, -34],
        className: "gold-marker", // We'll style this with CSS
      });

      // Add markers
      markers.forEach((marker) => {
        const icon = marker.isMain ? goldIcon : defaultIcon;
        const m = L.marker(marker.position, { icon }).addTo(map);
        
        if (marker.popup) {
          m.bindPopup(marker.popup);
        }
      });

      mapInstanceRef.current = map;

      // Add CSS for gold marker
      const style = document.createElement("style");
      style.innerHTML = `
        .gold-marker {
          filter: hue-rotate(30deg) saturate(2) brightness(1.2);
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, markers]);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} style={{ height, width }} className="z-10"></div>
      <div className="absolute bottom-4 right-4 z-20">
        <a 
          href={`https://www.openstreetmap.org/directions?from=&to=${center[0]},${center[1]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-mdpc-gold text-white px-3 py-2 rounded-md shadow-md hover:bg-mdpc-gold-dark transition-colors duration-300 flex items-center text-sm font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
          Get Directions
        </a>
      </div>
    </div>
  );
};

export default Map;
