// features/location/utils/adjustPrecision.js

export const adjustLocationPrecision = (latitude, longitude, precision) => {
  let adjustedLat = latitude;
  let adjustedLong = longitude;

  switch (precision) {
    case "exact":
      // No change, use provided coordinates
      break;
    case "city":
      adjustedLat = parseFloat(latitude.toFixed(2));
      adjustedLong = parseFloat(longitude.toFixed(2));
      break;
    case "state":
      adjustedLat = parseFloat(latitude.toFixed(1));
      adjustedLong = parseFloat(longitude.toFixed(1));
      break;
    default:
      throw new Error("Invalid precision type");
  }

  return [adjustedLat, adjustedLong];
};
