
import { useEffect, useRef } from "react";
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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Only initialize map once
    if (!mapInstanceRef.current) {
      // Create map
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

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
    <div 
      ref={mapRef} 
      className="rounded-lg overflow-hidden border border-gray-200 dark:border-mdpc-brown-dark/30 shadow-md" 
      style={{ height }}
    ></div>
  );
};

export default Map;
