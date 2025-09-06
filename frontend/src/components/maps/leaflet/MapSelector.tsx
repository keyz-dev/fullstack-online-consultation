import React, { useState, useEffect } from "react";
import {
  AddressInput,
  EnhancedLocationOptions,
  SuggestionList,
  LeafletMapView,
  LocationErrorHandler,
} from "./index";
import { StepNavButtons } from "../../ui";
import { extractAddressComponents } from "./AddressExtractor";
import ManualAddressModal from "./ManualAddressModal";
import { Address } from "@/api";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: unknown;
}

interface MapSelectorProps {
  prevStep: () => void;
  handleConfirm: (e?: React.FormEvent) => void;
  coordinates: Coordinates | null;
  setCoordinates: (coords: Coordinates | null) => void;
  address: string;
  setAddress: (address: string) => void;
  setAddressDetails: (details: Address) => void;
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
  const [locationError, setLocationError] = useState<unknown>(null);
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
          addressComponents.street,
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

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError({
        code: 0,
        message: "Geolocation is not supported by this browser.",
      });
      return;
    }

    setLoadingLocation(true);
    setLocationError(null);
    setInputFocused(false); // Close the options dropdown

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const coords = { lat: latitude, lng: longitude };
          const addressText = await reverseGeocode(latitude, longitude);

          setCoordinates(coords);
          setAddress(addressText);
          setSuggestions([]);
        } catch (error) {
          console.error("Error getting address:", error);
          setLocationError({
            code: 0,
            message: "Could not get address for your location",
          });
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        setLoadingLocation(false);
        console.error("Error getting location:", error);
        setLocationError(error);
      },
      {
        timeout: 10000, // 10 second timeout
        enableHighAccuracy: true,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleRetryLocation = () => {
    setLocationError(null);
    handleUseCurrentLocation();
  };

  const handleManualEntryFromError = (addressData: unknown) => {
    setLocationError(null);
    handleManualEntry(addressData);
  };

  const handleManualEntry = (addressData: unknown) => {
    setCoordinates(addressData.coordinates);
    setAddress(addressData.address);

    // Set detailed address components
    if (setAddressDetails) {
      setAddressDetails(addressData.details);
    }

    setSuggestions([]);
    setInputFocused(false);
    setShowManualModal(false);
  };

  const handleManualEntryClick = () => {
    setShowManualModal(true);
    setInputFocused(false); // Close the options dropdown
  };

  const handleSuggestionSelect = async (suggestion: Suggestion) => {
    try {
      const coords = {
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon),
      };

      // Extract and set detailed address components
      if (setAddressDetails && suggestion.address) {
        const addressComponents = extractAddressComponents(suggestion);
        setAddressDetails(addressComponents);

        // Create a formatted full address string
        const fullAddress = [
          addressComponents.street,
          addressComponents.city,
          addressComponents.state,
          addressComponents.country,
          addressComponents.postalCode,
        ]
          .filter(Boolean)
          .join(", ");

        setAddress(fullAddress || suggestion.display_name);
      } else {
        setAddress(suggestion.display_name);
      }

      setCoordinates(coords);
      setSuggestions([]);
      setInputFocused(false);
    } catch (error) {
      console.error("Error processing suggestion:", error);
      alert("Could not process this address");
    }
  };

  const handleBack = () => {
    prevStep();
    setAddress("");
    setCoordinates(null);
    setSuggestions([]);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900">
      {/* Address Input Section */}
      <div className="relative mb-6 z-10">
        <AddressInput
          value={address}
          onChange={setAddress}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setTimeout(() => setInputFocused(false), 200)}
          loading={loadingLocation}
          searchLoading={loadingSuggestions}
        />

        <EnhancedLocationOptions
          visible={inputFocused && !coordinates}
          onUseLocation={handleUseCurrentLocation}
          onManualEntry={handleManualEntryClick}
          loading={loadingLocation}
        />

        <SuggestionList
          suggestions={suggestions}
          visible={inputFocused && address.length >= 3}
          onSelect={handleSuggestionSelect}
          loading={loadingSuggestions}
        />
      </div>

      {/* Map */}
      <div className="h-[300px] md:h-[370px] overflow-hidden">
        <LeafletMapView coordinates={coordinates} address={address} />
      </div>

      {/* Navigation Buttons */}
      <StepNavButtons
        onBack={handleBack}
        onContinue={handleConfirm}
        canContinue={!!coordinates && !!address}
      />

      <LocationErrorHandler
        error={locationError}
        onRetry={handleRetryLocation}
        onManualEntry={handleManualEntryFromError}
        onDismiss={() => setLocationError(null)}
      />

      {/* Manual Address Modal - moved outside EnhancedLocationOptions */}
      <ManualAddressModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onAddressSubmit={handleManualEntry}
      />
    </div>
  );
};

export default MapSelector;
