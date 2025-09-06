import React, { useRef, useEffect } from "react";
import ConfirmationBar from "./ConfirmationBar";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Marker {
  position: [number, number];
  popup?: string;
  icon?: "default" | "user" | "vendor" | "pickup";
}

interface LeafletMapViewProps {
  coordinates: Coordinates | null;
  address: string;
  center?: [number, number];
  zoom?: number;
  markers?: Marker[];
}

const LeafletMapView: React.FC<LeafletMapViewProps> = ({
  coordinates,
  address,
  center,
  zoom = 11,
  markers = [],
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersRef = useRef<any[]>([]);

  const defaultCenter: [number, number] = [4.0511, 9.7679]; // Douala, Cameroon
  const mapCenter =
    center ||
    (coordinates ? [coordinates.lat, coordinates.lng] : defaultCenter);

  useEffect(() => {
    // Initialize map only once
    if (!mapInstanceRef.current && mapRef.current) {
      // Load Leaflet dynamically
      const loadLeaflet = async () => {
        // Add Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href =
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
          document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!window.L) {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src =
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }

        // Initialize map
        mapInstanceRef.current = window.L.map(mapRef.current).setView(
          mapCenter,
          zoom
        );

        // Add tile layer
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap contributors",
          }
        ).addTo(mapInstanceRef.current);

        // Add markers if provided
        if (markers.length > 0) {
          addMarkersToMap(markers);
        } else if (coordinates) {
          // Legacy single marker support
          addSingleMarker(coordinates);
        }
      };

      loadLeaflet();
    }

    // Update map view and markers when props change
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(mapCenter, zoom);

      // Clear existing markers
      clearMarkers();

      // Add new markers
      if (markers.length > 0) {
        addMarkersToMap(markers);
      } else if (coordinates) {
        addSingleMarker(coordinates);
      }
    }
  }, [coordinates, center, zoom, markers]);

  const addMarkersToMap = (markers: Marker[]) => {
    markers.forEach((markerData) => {
      const { position, popup, icon: iconType } = markerData;

      // Create custom icon based on type
      const customIcon = window.L.divIcon({
        className: "custom-marker",
        html: getMarkerHTML(iconType || "default"),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = window.L.marker(position, { icon: customIcon }).addTo(
        mapInstanceRef.current
      );

      // Add popup if provided
      if (popup && typeof popup === "string") {
        marker.bindPopup(popup);
      }

      markersRef.current.push(marker);
    });
  };

  const addSingleMarker = (coordinates: Coordinates) => {
    const customIcon = window.L.divIcon({
      className: "custom-marker",
      html: getMarkerHTML("default"),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = window.L.marker([coordinates.lat, coordinates.lng], {
      icon: customIcon,
    }).addTo(mapInstanceRef.current);
    markersRef.current.push(marker);
  };

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => {
      if (mapInstanceRef.current && marker) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];
  };

  const getMarkerHTML = (iconType: string) => {
    const baseStyle = `
              width: 32px;
              height: 32px;
              border: 4px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              position: relative;
              transform: translate(-50%, -50%);
    `;

    switch (iconType) {
      case "user":
        return `<div style="${baseStyle} background: #3B82F6;"></div>`;
      case "vendor":
        return `<div style="${baseStyle} background: #EF4444;"></div>`;
      case "pickup":
        return `<div style="${baseStyle} background: #10B981;"></div>`;
      default:
        return `<div style="${baseStyle} background: #EF4444;"></div>`;
    }
  };

  return (
    <div className="relative h-full w-full rounded-md overflow-hidden border-2 z-[1] border-gray-200 dark:border-gray-600">
      <ConfirmationBar address={address} visible={!!coordinates} />
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default LeafletMapView;
