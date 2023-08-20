import { Collection } from "mongodb";
import { z } from "zod";
import { ctx } from "../../common/context";
import { makeError } from "../../common/errorHandler";
import { getMongoClient } from "../../db/dbConnect";
import { playerIdSchema, TxResponse } from "../../schemas/SharedSchemas";
import { Player } from "../register/registerApi";
import geoApi from "./geoApi";
import { Resource, resources, ScannedResource } from "./resources";
import crypto from "crypto";

export const geoRouter = ctx.router(geoApi);

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
  const { longitude, latitude, playerId } = req.body;
  console.log({ longitude, latitude, playerId });
  const client = await getMongoClient();
  const db = client.db("StarlightArtifacts");
  const playersCollection: Collection<Player> = db.collection("players");
  const player = await playersCollection.findOne({ playerId });
  if (!player)
    return res
      .status(400)
      .json(
        makeError(
          400,
          `Player not found. Register via https://warp.moonshinelabs.io/registeropos`
        )
      );

  const geoscanCollection: Collection<MiningAttempt> =
    db.collection("geoscans");
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
  const scannedItems: ScannedResource[] = foundItems.map((item) => ({
    ...item,
    eid: crypto.randomBytes(16).toString("hex"),
  }));
  const updatePlayer = await playersCollection.updateOne(
    { playerId },
    { $set: { scannedItems } }
  );
  return res.status(200).json(scannedItems);
});

geoRouter.get("/geo/mine/:playerId/:eid", async (req, res) => {
  const { playerId, eid } = req.params;
  console.log({ playerId, eid });
  const client = await getMongoClient();
  const db = client.db("StarlightArtifacts");
  const playersCollection: Collection<Player> = db.collection("players");
  const player = await playersCollection.findOne({
    playerId: playerId as string,
  });
  if (!player)
    return res
      .status(400)
      .json(
        makeError(
          400,
          `Player not found. Register via https://warp.moonshinelabs.io/registeropos`
        )
      );
  const scannedItems = player.scannedItems;
  const itemIndex = scannedItems.findIndex((item) => item.eid === eid);
  if (itemIndex === -1)
    return res
      .status(400)
      .json(makeError(400, `Item not found or already mined.`));
  const minedItem = scannedItems[itemIndex];
  scannedItems.splice(itemIndex, 1);
  const updatePlayer = await playersCollection.updateOne(
    { playerId: playerId as string },
    { $set: { scannedItems } }
  );
  const txResponse: TxResponse = {
    success: true,
    message: `Item mined.`,
  };
  return res.status(200).json(txResponse);
});
