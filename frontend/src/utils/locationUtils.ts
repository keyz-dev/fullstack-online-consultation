// Global geolocation utilities that work anywhere in the world

export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 15000, // 15 second timeout
      enableHighAccuracy: true,
      maximumAge: 300000, // 5 minutes
    });
  });
};

export const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`
    );

    if (!response.ok) {
      throw new Error("Failed to get address from coordinates");
    }

    return await response.json();
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    throw error;
  }
};

// Global address formatter that works anywhere in the world
export const formatGlobalAddress = (geocodeData: any) => {
  if (!geocodeData || !geocodeData.address) {
    throw new Error("Invalid geocoding data");
  }

  const address = geocodeData.address;

  // Build street address - works globally
  const streetParts = [
    address.house_number,
    address.road ||
      address.street ||
      address.pedestrian ||
      address.path ||
      address.village,
  ].filter(Boolean);

  const streetAddress =
    streetParts.length > 0
      ? streetParts.join(" ")
      : address.neighbourhood || address.suburb || address.quarter || "";

  // City - try multiple possible fields (global)
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    address.district ||
    "";

  // State/Region (global)
  const state =
    address.state || address.region || address.province || address.area || "";

  // Postal code (global) - default to 0000
  const postalCode = address.postcode || "00000";

  // Country (global)
  const country = address.country || "Unknown";

  return {
    address: streetAddress,
    city,
    state,
    postalCode,
    country,
  };
};

// Enhanced error messages for geolocation
export const getLocationErrorMessage = (error: any) => {
  switch (error.code) {
    case 1:
      return "Location access denied. Please allow location access in your browser settings.";
    case 2:
      return "Location unavailable. Please check your device's location services.";
    case 3:
      return "Location request timed out. Please try again.";
    default:
      return (
        error.message ||
        "Failed to get your location. Please try again or enter manually."
      );
  }
};

// Search places globally (for address suggestions)
export const searchPlaces = async (query: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error("Failed to search places");
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching places:", error);
    throw error;
  }
};
