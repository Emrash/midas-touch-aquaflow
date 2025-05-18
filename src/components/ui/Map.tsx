
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapProps {
  center: [number, number]; // Latitude and longitude
  zoom: number;
  markers: {
    position: [number, number];
    popup: string;
    isMain?: boolean;
  }[];
  height?: string;
}

const Map = ({ center, zoom = 10, markers, height = "400px" }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Only initialize map once
    if (!mapInstanceRef.current) {
      // Create map
      mapInstanceRef.current = L.map(mapContainer.current, {
        scrollWheelZoom: false,  // Disable scroll wheel zoom by default
        dragging: true,           // Allow dragging
        tap: false                // Disable tap handler for mobile
      }).setView(center, zoom);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      // Add markers
      markers.forEach((marker) => {
        const icon = marker.isMain 
          ? new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          : new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

        L.marker(marker.position, { icon: icon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(marker.popup);
      });

      // Add navigation controls
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstanceRef.current);

      // Event handlers for enabling/disabling scroll zoom
      mapInstanceRef.current.on('click', function() {
        if (!mapInstanceRef.current!.scrollWheelZoom.enabled()) {
          mapInstanceRef.current!.scrollWheelZoom.enable();
          setIsInteracting(true);
        }
      });

      // Disable scroll zoom when user clicks outside the map
      document.addEventListener('click', function(e) {
        if (mapContainer.current && !mapContainer.current.contains(e.target as Node) && mapInstanceRef.current) {
          mapInstanceRef.current.scrollWheelZoom.disable();
          setIsInteracting(false);
        }
      });
      
      // Disable scroll zoom when map loses focus
      mapInstanceRef.current.on('blur', function() {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.scrollWheelZoom.disable();
          setIsInteracting(false);
        }
      });
    } else {
      // Update map view if center or zoom changed
      mapInstanceRef.current.setView(center, zoom);
    }

    return () => {
      // Clean up if component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, markers]);

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        className="rounded-lg overflow-hidden border border-gray-200 dark:border-mdpc-brown-dark/30 shadow-md" 
        style={{ height }}
      ></div>
      {isInteracting && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          Map active - scrolling enabled
        </div>
      )}
      {!isInteracting && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 text-white text-sm px-4 py-2 rounded-full">
            Click to activate map
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
