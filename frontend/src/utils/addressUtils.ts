export interface AddressComponents {
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  fullAddress: string;
}

export const extractAddressComponents = (
  geocodingResult: any
): AddressComponents => {
  const address = geocodingResult.address || {};

  // Extract street address
  const streetAddress = [address.house_number, address.road, address.suburb]
    .filter(Boolean)
    .join(" ");

  // Extract city
  const city =
    address.city || address.town || address.village || address.county || "";

  // Extract state/province
  const state = address.state || address.province || "";

  // Extract country
  const country = address.country || "";

  // Extract postal code
  const postalCode = address.postcode || "";

  // Create full address
  const fullAddress = [streetAddress, city, state, country, postalCode]
    .filter(Boolean)
    .join(", ");

  return {
    streetAddress: streetAddress || "",
    city: city || "",
    state: state || "",
    country: country || "",
    postalCode: postalCode || "",
    fullAddress: fullAddress || geocodingResult.display_name || "",
  };
};

export const formatAddress = (address: AddressComponents): string => {
  return [
    address.streetAddress,
    address.city,
    address.state,
    address.country,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
};

export const validateAddress = (address: AddressComponents): boolean => {
  return !!(address.city && address.country);
};
