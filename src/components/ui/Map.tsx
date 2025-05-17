
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center: [number, number]; // [lat, lng]
  zoom: number;
  markers?: {
    position: [number, number];
    popup?: string;
    isMain?: boolean;
  }[];
  height?: string;
  showControls?: boolean;
  className?: string;
}

const Map = ({ 
  center, 
  zoom, 
  markers = [],
  height = '400px',
  showControls = true,
  className = ''
}: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Check if Leaflet is loaded
    if (!L) {
      setLoadFailed(true);
      return;
    }

    try {
      // Initialize map if container is ready and map not already initialized
      if (mapContainerRef.current && !mapRef.current) {
        // Custom map style
        const customTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
        });
        
        // Create map
        mapRef.current = L.map(mapContainerRef.current, {
          center,
          zoom,
          layers: [customTileLayer],
          zoomControl: showControls,
          attributionControl: showControls
        });

        // Custom icon for main markers
        const mainIcon = L.divIcon({
          className: 'custom-marker-icon',
          html: `<div class="marker-main pulse-animation">
                  <div class="marker-dot"></div>
                  <div class="marker-pulse"></div>
                </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        // Custom icon for regular markers
        const regularIcon = L.divIcon({
          className: 'custom-marker-icon',
          html: `<div class="marker-regular">
                  <div class="marker-dot"></div>
                </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        // Add markers to the map
        markers.forEach((marker) => {
          const markerIcon = marker.isMain ? mainIcon : regularIcon;
          const mapMarker = L.marker(marker.position, { icon: markerIcon }).addTo(mapRef.current!);
          
          if (marker.popup) {
            mapMarker.bindPopup(`<div class="custom-popup">${marker.popup}</div>`, {
              className: 'custom-popup-container'
            });
          }
          
          markersRef.current.push(mapMarker);
        });

        // Custom styling
        const style = document.createElement('style');
        style.textContent = `
          .custom-marker-icon {
            background: transparent;
            border: none;
          }
          .marker-main {
            position: relative;
            width: 30px;
            height: 30px;
          }
          .marker-regular {
            position: relative;
            width: 20px;
            height: 20px;
          }
          .marker-dot {
            background-color: #D4AF37;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
          }
          .marker-main .marker-dot {
            width: 16px;
            height: 16px;
            z-index: 2;
          }
          .marker-regular .marker-dot {
            width: 12px;
            height: 12px;
            background-color: #3A7CA5;
            box-shadow: 0 0 8px rgba(58, 124, 165, 0.6);
          }
          .marker-pulse {
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: rgba(212, 175, 55, 0.3);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(0.5);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
          .custom-popup-container {
            border: none;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
          }
          .custom-popup {
            padding: 8px 12px;
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            font-weight: 500;
            color: #513A1F;
            background: white;
            border-left: 3px solid #D4AF37;
          }
          .leaflet-control-zoom a {
            border-radius: 8px !important;
            color: #3A7CA5 !important;
          }
        `;
        document.head.appendChild(style);

        // Set loaded status
        setIsLoaded(true);
        
        // Invalidate map size to handle any container size changes
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }, 200);
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      setLoadFailed(true);
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = [];
    };
  }, [center, zoom, markers, showControls]);

  // Update map center and zoom if they change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div className={`map-container relative rounded-xl overflow-hidden shadow-md ${className}`} style={{ height }}>
      {loadFailed && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-gray-600">Unable to load map. Please try refreshing the page.</p>
          </div>
        </div>
      )}
      
      {!isLoaded && !loadFailed && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-mdpc-blue/30 border-t-mdpc-blue animate-spin"></div>
        </div>
      )}
      
      <div 
        ref={mapContainerRef} 
        className="w-full h-full" 
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.5s" }}
      />
    </div>
  );
};

export default Map;
