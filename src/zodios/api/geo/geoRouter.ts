import { playerId, playerIdSchema } from "../../schemas/SharedSchemas";
import { ctx } from "../../common/context";
import { z } from "zod";
import { Collection } from "mongodb";
import { getMongoClient } from "../../db/dbConnect";
import { Resource, resources } from "./resources";
import geoApi from "./geoApi";

export const geoRouter = ctx.router(geoApi);

import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
const keypair = Keypair.generate();
const privkey = keypair.secretKey;
const pubkey = keypair.publicKey;
console.log("privkey", bs58.encode(privkey));
console.log("pubkey", pubkey.toString());
const receivedPubkeyMock = Keypair.generate().publicKey.toString();


const RADIUS_IN_METERS = 10;

type MiningAttempt = z.infer<typeof miningSchema>;

export const miningSchema = z.object({
  playerId: playerIdSchema,
  utc: z.number(),
  location: z.object({
    type: z.string(),
    coordinates: z.array(z.number()),
  }),
});
geoRouter.post("/geo/scan", async (req, res) => {
  const { longitude, latitude } = req.body;
  const client = await getMongoClient();
  const db = client.db("StarlightArtifacts");
  const geoscanCollection: Collection<MiningAttempt> = db.collection("geoscan");
  // Calculate the number of previous mining attempts within 10 meters of the given location
  const nearbyAttempts = await geoscanCollection.countDocuments({
    location: {
      $geoWithin: {
        $centerSphere: [
          [longitude, latitude],
          RADIUS_IN_METERS / 6378100, // Convert radius from meters to radians
        ],
      },
    },
  });
  // Record the mining attempt
  await geoscanCollection.insertOne({
    playerId: req.body.playerId,
    utc: Date.now(),
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
  const baseCount = 100; // Base count for each item in the pool
  for (const item of resources) {
    let probability = (1 / item.rarity) * Math.pow(0.8, nearbyAttempts);
    probability = Math.min(Math.max(probability, 0), 1); // Clamp probability
    if (item.rarity === 1) probability = 1;
    const itemCount = Math.floor(baseCount * probability);
    weightedPool.push(...Array(itemCount).fill(item));
  }
  // Randomly select 10 items from the weighted pool
  const foundItems: Resource[] = [];
  for (let i = 0; i < 10; i++) {
    foundItems.push(getRandomItem(weightedPool));
  }

  return res.status(200).json(foundItems);
});
