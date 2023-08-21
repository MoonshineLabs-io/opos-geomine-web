import { EARTH_RADIUS_IN_METERS, RADIUS_IN_METERS } from "../../constants";
import { getGeoscansCollection } from "./dbConnect";

export const getNearbyAttempts = async (
  longitude: number,
  latitude: number
): Promise<number> => {
  // Calculate the number of previous mining attempts within 10 meters of the given location
  const geoscanCollection = await getGeoscansCollection();
  const nearbyAttempts = await geoscanCollection.countDocuments({
    location: {
      $geoWithin: {
        $centerSphere: [
          [longitude, latitude],
          RADIUS_IN_METERS / EARTH_RADIUS_IN_METERS, // Convert radius from meters to radians
        ],
      },
    },
  });
  return nearbyAttempts;
};

export const recordMiningAttempt = async (
  playerId: string,
  longitude: number,
  latitude: number
): Promise<void> => {
  // Record the mining attempt
  const geoscanCollection = await getGeoscansCollection();
  await geoscanCollection.insertOne({
    playerId: playerId,
    utc: Date.now(),
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  });
};
