import Geolocation from "react-native-geolocation-service";

/**
 * Get the current location of the user.
 * @returns {Promise} Resolves with an object containing latitude and longitude.
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    // Check for location permission
    if (!Geolocation.hasLocationPermission()) {
      reject("Location permission not granted");
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case 1:
            reject("Permission denied");
            break;
          case 2:
            reject("Location unavailable");
            break;
          case 3:
            reject("Timeout getting location");
            break;
          default:
            reject("An unknown error occurred");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
}
