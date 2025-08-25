import React from "react";
import { Address } from "@/api";

interface NominatimResult {
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    province?: string;
    country?: string;
    postcode?: string;
  };
}

interface AddressExtractorProps {
  nominatimResult: NominatimResult | null;
  onAddressExtracted: (components: Address) => void;
}

// Utility function to extract address components from Nominatim response
export const extractAddressComponents = (
  nominatimResult: NominatimResult
): Address => {
  if (!nominatimResult || !nominatimResult.address) {
    return {
      street: "",
      city: "",
      state: "",
      country: "Cameroon",
      postalCode: "00000",
    };
  }

  const address = nominatimResult.address;

  // Extract street address
  const streetAddress = [
    address.house_number,
    address.road,
    address.suburb,
    address.neighbourhood,
  ]
    .filter(Boolean)
    .join(", ");

  // Extract city (prefer city, fallback to town, then village)
  const city = address.city || address.town || address.village || "";

  // Extract state/province
  const state = address.state || address.province || "";

  // Extract country
  const country = address.country || "Cameroon";

  // Extract postal code
  const postalCode = address.postcode || "00000";

  return {
    street: streetAddress || nominatimResult.display_name.split(",")[0] || "",
    city,
    state,
    country,
    postalCode,
  };
};

// Component to display extracted address details
const AddressExtractor: React.FC<AddressExtractorProps> = ({
  nominatimResult,
  onAddressExtracted,
}) => {
  React.useEffect(() => {
    if (nominatimResult) {
      const components = extractAddressComponents(nominatimResult);
      onAddressExtracted(components);
    }
  }, [nominatimResult, onAddressExtracted]);

  return null; // This is a utility component, no UI
};

export default AddressExtractor;
