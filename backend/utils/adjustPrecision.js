// backend>utils>/adjustPrecision.js

export const adjustLocationPrecision = (latitude, longitude, precision) => {
  return new Promise((resolve, reject) => {
    let adjustedLat = latitude;
    let adjustedLong = longitude;

    switch (precision) {
      case "exact":
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
        return reject(new Error("Invalid precision type"));
    }

    return resolve([adjustedLat, adjustedLong]);
  });
};
