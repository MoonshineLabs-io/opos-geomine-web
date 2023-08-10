import { ctx } from "../../common/context";
import { geomineApi } from "./geomineApi";

import { Collection } from "mongodb";
import { getMongoClient } from "../../db/dbConnect";
import { Resource, resources } from "./resources";

export const geomineRouter = ctx.router(geomineApi);

const RADIUS_IN_METERS = 10;

interface MiningAttempt {
  location: {
    type: string;
    coordinates: [number, number];
  };
}

geomineRouter.post("/geomine", async (req, res) => {
  const { longitude, latitude } = req.body;
  const client = await getMongoClient();
  const db = client.db("StarlightArtifacts");
  const geomineCollection: Collection<MiningAttempt> = db.collection("geomine");
  // Calculate the number of previous mining attempts within 10 meters of the given location
  const nearbyAttempts = await geomineCollection.countDocuments({
    location: {
      $geoWithin: {
        $centerSphere: [
          [longitude, latitude],
          RADIUS_IN_METERS / 6378100, // Convert radius from meters to radians
        ],
      },
    },
  });

  // Calculate the probability of finding rare materials based on the number of nearby attempts

  // Record the mining attempt
  await geomineCollection.insertOne({
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  });
  function getRandomItem(weightedPool: any[]): any {
    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    return weightedPool[randomIndex];
  }
  // Create a weighted pool of potential resources based on rarity and probability
  const weightedPool: Resource[] = [];
  for (const item of resources) {
    let probability = (1 / item.rarity) * Math.pow(0.8, nearbyAttempts);
    if (probability < 0) probability = 0;
    if (probability > 1) probability = 1;
    if (item.rarity === 1) probability = 1;
    const baseCount = 100; // Base count for each item in the pool
    const itemCount = Math.floor(baseCount * probability);
    for (let i = 0; i < itemCount; i++) {
      weightedPool.push(item);
    }
  }

  // Randomly select 10 items from the weighted pool
  const foundItems: Resource[] = [];
  for (let i = 0; i < 10; i++) {
    foundItems.push(getRandomItem(weightedPool));
  }

  return res.status(200).json(foundItems);
});
// geomineRouter.get("/geomine/:id", async (req, res) => {
//   const { id } = req.params;
//   // const item = await findItem(platformId, id);
//   console.log({ item });
//   if (!item) return res.status(404).json(makeError(404, "Item not found"));

//   return res.status(200).json(item);
// });
