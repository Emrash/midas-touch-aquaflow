
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconGold from 'leaflet/dist/images/marker-icon.png'; // Replace with actual gold icon when available
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { toast } from "@/hooks/use-toast";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom gold icon for main locations
const goldIcon = new L.Icon({
  iconUrl: markerIconGold,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'gold-marker' // This class can be styled with CSS
});

interface MarkerData {
  position: [number, number];
  popup: string;
  isMain?: boolean;
}

interface MapProps {
  center: [number, number];
  zoom: number;
  markers?: MarkerData[];
  height?: string;
}

const Map = ({ center, zoom, markers, height = '400px' }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Create map instance
      const map = L.map(mapRef.current, {
        center: new L.LatLng(center[0], center[1]),
        zoom: zoom,
        scrollWheelZoom: false // Disable scroll wheel zoom by default
      });
      
      leafletMapRef.current = map;

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add markers if provided
      if (markers && markers.length > 0) {
        markers.forEach(markerData => {
          const { position, popup, isMain } = markerData;
          
          // Create marker with proper icon
          const marker = L.marker(new L.LatLng(position[0], position[1]), { 
            icon: isMain ? goldIcon : new L.Icon.Default()
          })
          .addTo(map)
          .bindPopup(popup);
          
          // Apply CSS class for main markers for additional styling
          if (isMain && marker.getElement()) {
            marker.getElement().classList.add('main-marker-element');
          }
        });
      }
      
      // Enable scrolling only on map click
      map.on('click', function() {
        map.scrollWheelZoom.enable();
        toast({
          title: "Map zooming enabled",
          description: "Click outside the map to disable zooming",
          duration: 2000
        });
      });
      
      // Disable scrolling when mouse leaves map or when focus is lost
      map.on('mouseout', function() {
        map.scrollWheelZoom.disable();
      });
      
      map.on('blur', function() {
        map.scrollWheelZoom.disable();
      });
      
      // Handle touch events for mobile
      if ('ontouchstart' in window) {
        map.on('touchstart', function() {
          map.scrollWheelZoom.enable();
        });
        
        // Add tap listener to document to disable zoom when tapping outside map
        document.addEventListener('touchstart', function(e) {
          if (!mapRef.current?.contains(e.target as Node)) {
            map.scrollWheelZoom.disable();
          }
        });
      }

      // Clean up on unmount
      return () => {
        // Remove event listeners
        document.removeEventListener('touchstart', () => {});
        
        if (map) {
          map.remove();
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [center, zoom, markers]);

  return (
    <div 
      ref={mapRef}
      style={{ height, width: '100%' }} 
      className="map-container relative"
    >
      <div className="absolute bottom-2 left-2 z-[1000] bg-white/70 backdrop-blur-sm py-1 px-2 rounded text-xs text-mdpc-brown-dark pointer-events-none">
        Click map to enable scrolling
      </div>
    </div>
  );
};

export default Map;
