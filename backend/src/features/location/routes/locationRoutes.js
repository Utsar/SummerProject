// features/location/routes/locationRoutes.js
import express from "express";
import {
  createLocation,
  getNearbyStreamingUsers,
  updateLocationWithPrecision,
} from "../controllers/locationController";
import auth from "../../../middlewares/auth"; // adjust the path
import { validateCreateLocation } from "../../../middlewares/validation"; // New
import { rateLimiter } from "../../../middlewares/rateLimiter"; // New
import { adjustLocationPrecision } from "../../../middlewares/adjustLocationPrecision"; // New

const locationRouter = express.Router();

locationRouter.post(
  "/",
  auth,
  rateLimiter,
  validateCreateLocation,
  createLocation
);
locationRouter.get(
  "/users/near/streaming",
  rateLimiter,
  getNearbyStreamingUsers
);
locationRouter.put(
  "/location",
  auth,
  rateLimiter,
  adjustLocationPrecision,
  updateLocationWithPrecision
);

export default locationRouter;
