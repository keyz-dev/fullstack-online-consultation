"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, Globe } from "lucide-react";
import Input from "./Input";
import {
  getCurrentPosition,
  reverseGeocode,
  formatGlobalAddress,
  getLocationErrorMessage,
  searchPlaces,
} from "../../utils/locationUtils";
import { Address } from "../../api";

interface AddressInputProps {
  value: Address;
  onChange: (address: Address) => void;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  label = "Address",
  required = false,
  error,
  className = "",
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{
      display_name: string;
      lat: string;
      lon: string;
      address?: {
        city?: string;
        country?: string;
      };
    }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Search for address suggestions
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      searchAddressSuggestions(searchQuery);
    }, 300);

    setSearchTimeout(timeoutId);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchAddressSuggestions = async (query: string) => {
    try {
      setIsSearching(true);
      const results = await searchPlaces(query);
      setSuggestions(results || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error searching addresses:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionSelect = async (suggestion: {
    display_name: string;
    lat: string;
    lon: string;
    address?: {
      city?: string;
      country?: string;
    };
  }) => {
    try {
      const coords = {
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon),
      };

      // Extract address components
      const addressData = formatGlobalAddress(suggestion);

      // Update address with coordinates and full address
      const newAddress: Address = {
        street: addressData.address,
        fullAddress: suggestion.display_name,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        postalCode: addressData.postalCode,
        coordinates: coords,
      };

      onChange(newAddress);

      // Update search query with the full address
      setSearchQuery(suggestion.display_name);

      // Clear suggestions
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      console.error("Error processing suggestion:", error);
    }
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);

    try {
      // Get current position
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Reverse geocode to get address
      const geocodeData = await reverseGeocode(latitude, longitude);

      // Format address globally
      const locationData = formatGlobalAddress(geocodeData);

      // Create full address string
      const fullAddressString =
        geocodeData.display_name ||
        `${locationData.address}, ${locationData.city}, ${locationData.state}, ${locationData.country}`;

      // Update address with coordinates and full address
      const newAddress: Address = {
        street: locationData.address,
        fullAddress: fullAddressString,
        city: locationData.city,
        state: locationData.state,
        country: locationData.country,
        postalCode: locationData.postalCode,
        coordinates: { lat: latitude, lng: longitude },
      };

      onChange(newAddress);

      // Update search query with the full address
      setSearchQuery(fullAddressString);
    } catch (error) {
      console.error("Error getting location:", error);
      alert(getLocationErrorMessage(error));
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Update search query when address fields change manually
  useEffect(() => {
    if (value.fullAddress && value.city && value.state) {
      const fullAddress = value.fullAddress;
      if (searchQuery !== fullAddress) {
        setSearchQuery(fullAddress);
      }
    }
  }, [value.fullAddress, value.city, value.state, value.country]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGettingLocation ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Globe size={16} />
          )}
          {isGettingLocation ? "Getting location..." : "Use current location"}
        </button>
      </div>

      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader2 size={16} className="animate-spin text-gray-400" />
            ) : (
              <Search size={16} className="text-gray-400" />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search and select your address from suggestions"
            className={`block w-full pl-10 pr-3 py-2 border ${
              error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white`}
          />
        </div>

        {/* Address Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {suggestion.display_name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {suggestion.address?.city}, {suggestion.address?.country}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Manual Address Fields */}
      <div className="space-y-4">
        <Input
          label="Street Address"
          name="street"
          value={value.street || ""}
          placeholder="Enter street address"
          onChangeHandler={(e) =>
            onChange({ ...value, street: e.target.value })
          }
          required={required}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            name="city"
            value={value.city}
            placeholder="Enter city"
            onChangeHandler={(e) =>
              onChange({ ...value, city: e.target.value })
            }
            required={required}
          />
          <Input
            label="State/Province"
            name="state"
            value={value.state}
            placeholder="Enter state or province"
            onChangeHandler={(e) =>
              onChange({ ...value, state: e.target.value })
            }
            required={required}
          />
          <Input
            label="Postal Code"
            name="postalCode"
            value={value.postalCode}
            placeholder="0000 if none"
            onChangeHandler={(e) =>
              onChange({ ...value, postalCode: e.target.value })
            }
            required={required}
          />
        </div>

        <Input
          label="Country"
          name="country"
          value={value.country}
          placeholder="Enter country"
          onChangeHandler={(e) =>
            onChange({ ...value, country: e.target.value })
          }
          required={required}
        />
      </div>

      {/* Coordinates Display (Optional) */}
      {value.coordinates && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Coordinates: {value.coordinates.lat.toFixed(6)},{" "}
          {value.coordinates.lng.toFixed(6)}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default AddressInput;
