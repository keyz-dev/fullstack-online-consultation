import React, { useState } from "react";
import { X, MapPin, Search } from "lucide-react";
import { ModalWrapper, Button, Input, Select } from "../../ui";

interface AddressData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  details: {
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

interface ManualAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSubmit: (addressData: AddressData) => void;
}

const ManualAddressModal: React.FC<ManualAddressModalProps> = ({
  isOpen,
  onClose,
  onAddressSubmit,
}) => {
  const [formData, setFormData] = useState({
    streetAddress: "",
    city: "",
    state: "",
    country: "Cameroon", // Default to Cameroon
    postalCode: "00000", // Default postal code
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const geocodeAddress = async (addressString: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addressString
        )}&countrycodes=cm&limit=1&addressdetails=1`
      );
      const results = await response.json();

      if (results && results.length > 0) {
        return {
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
          displayName: results[0].display_name,
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.streetAddress.trim()) {
      setError("Street address is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Build address string for geocoding
      const addressParts = [
        formData.streetAddress,
        formData.city,
        formData.state,
        formData.country,
      ].filter(Boolean);

      const addressString = addressParts.join(", ");

      // Geocode the address
      const geocodeResult = await geocodeAddress(addressString);

      if (geocodeResult) {
        // Create a formatted full address for display
        const fullAddress = [
          formData.streetAddress,
          formData.city,
          formData.state,
          formData.country,
          formData.postalCode,
        ]
          .filter(Boolean)
          .join(", ");

        // Submit the address with coordinates
        onAddressSubmit({
          address: fullAddress,
          coordinates: geocodeResult,
          details: {
            ...formData,
            // Override with geocoded data if available
            city: formData.city || "Unknown",
            state: formData.state || "Unknown",
            country: formData.country,
            postalCode: formData.postalCode,
          },
        });

        onClose();
      } else {
        setError(
          "Could not find coordinates for this address. Please try a more specific address."
        );
      }
    } catch (error) {
      setError("An error occurred while processing your address.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-2 w-full max-w-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <MapPin className="text-blue-500" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Enter Address Manually
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-4 min-w-sm lg:min-w-lg mx-auto flex flex-col"
        >
          <Input
            label="Street Address"
            name="streetAddress"
            value={formData.streetAddress}
            onChangeHandler={(e) =>
              handleInputChange("streetAddress", e.target.value)
            }
            placeholder="Enter street address"
            required
          />
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChangeHandler={(e) => handleInputChange("city", e.target.value)}
            placeholder="Enter city"
            required
          />
          <Input
            label="State/Province"
            name="state"
            value={formData.state}
            onChangeHandler={(e) => handleInputChange("state", e.target.value)}
            placeholder="Enter state or province"
            required
          />
          <Select
            label="Country"
            name="country"
            options={[
              { label: "Cameroon", value: "Cameroon" },
              { label: "Nigeria", value: "Nigeria" },
              { label: "Ghana", value: "Ghana" },
              { label: "Kenya", value: "Kenya" },
              { label: "South Africa", value: "South Africa" },
            ]}
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            placeholder="Enter country"
          />

          <Input
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChangeHandler={(e) =>
              handleInputChange("postalCode", e.target.value)
            }
            placeholder="Enter postal code"
            required
          />

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between space-x-3 pt-4">
            <Button
              type="button"
              isDisabled={isLoading}
              additionalClasses="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={isLoading}
              additionalClasses="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Find Location</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default ManualAddressModal;
