import React, { useState, useEffect } from "react";
import { StepNavButtons } from "./index";
import { extractAddressComponents } from "@/utils/addressUtils";
import { Address } from "@/api";

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapSelectorProps {
  prevStep: () => void;
  handleConfirm: () => void;
  coordinates: Coordinates | null;
  setCoordinates: (coords: Coordinates | null) => void;
  address: string;
  setAddress: (address: string) => void;
  setAddressDetails: (details: Address) => void;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: any;
}

const MapSelector: React.FC<MapSelectorProps> = ({
  prevStep,
  handleConfirm,
  coordinates,
  setCoordinates,
  address,
  setAddress,
  setAddressDetails,
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  // Debounce search
  useEffect(() => {
    if (!address || address.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchPlaces(address);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [address]);

  const searchPlaces = async (query: string) => {
    setLoadingSuggestions(true);

    try {
      // Using Nominatim API for geocoding (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=cm&limit=5&addressdetails=1`
      );
      const results = await response.json();

      setSuggestions(results || []);
    } catch (error) {
      console.error("Error searching places:", error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const result = await response.json();

      // Extract detailed address components
      if (setAddressDetails && result.address) {
        const addressComponents = extractAddressComponents(result);
        setAddressDetails(addressComponents);
      }

      // Create a formatted full address string
      if (result.address) {
        const addressComponents = extractAddressComponents(result);
        const fullAddress = [
          addressComponents.streetAddress,
          addressComponents.city,
          addressComponents.state,
          addressComponents.country,
          addressComponents.postalCode,
        ]
          .filter(Boolean)
          .join(", ");

        return fullAddress || result.display_name || "Unknown location";
      }

      return result.display_name || "Unknown location";
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return "Unknown location";
    }
  };

  const handleSuggestionSelect = async (suggestion: Suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);

    setCoordinates({ lat, lng });
    setAddress(suggestion.display_name);
    setSuggestions([]);
    setInputFocused(false);

    // Extract and set detailed address components
    if (suggestion.address) {
      const addressComponents = extractAddressComponents(suggestion);
      setAddressDetails(addressComponents);
    }
  };

  const getCurrentLocation = () => {
    setLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };

        setCoordinates(coords);

        // Reverse geocode to get address
        const addressString = await reverseGeocode(latitude, longitude);
        setAddress(addressString);

        setLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError(
          "Unable to get your current location. Please enter manually."
        );
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleManualAddress = () => {
    setShowManualModal(true);
  };

  const canContinue = coordinates && address;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Clinic Location
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mt-2">
          Enter your clinic address or use your current location
        </p>
      </div>

      {/* Address Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Clinic Address
        </label>
        <div className="relative">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 200)}
            placeholder="Enter your clinic address"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />

          {loadingSuggestions && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {inputFocused && suggestions.length > 0 && (
          <div className="mt-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
              >
                <div className="text-sm text-gray-800 dark:text-white">
                  {suggestion.display_name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Location Options */}
      <div className="mb-6 space-y-3">
        <button
          onClick={getCurrentLocation}
          disabled={loadingLocation}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          {loadingLocation ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
          ) : (
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
          {loadingLocation ? "Getting location..." : "Use Current Location"}
        </button>

        <button
          onClick={handleManualAddress}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Enter Address Manually
        </button>
      </div>

      {/* Error Message */}
      {locationError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            {locationError}
          </p>
        </div>
      )}

      {/* Map Preview */}
      {coordinates && (
        <div className="mb-6">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl mb-2">📍</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Map preview will be shown here
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Lat: {coordinates.lat.toFixed(6)}, Lng:{" "}
                {coordinates.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <StepNavButtons
        onBack={prevStep}
        onContinue={handleConfirm}
        canContinue={canContinue ? true : false}
        onBackText="Back"
        onContinueText="Continue"
        isLoading={false}
      />
    </div>
  );
};

export default MapSelector;
