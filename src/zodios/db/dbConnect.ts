import { Collection, MongoClient } from "mongodb";
import { z } from "zod";
import { ScannedResource } from "../api/geo/resources";
import { Player } from "../api/register/registerApi";
import { playerIdSchema } from "../schemas/SharedSchemas";
global.mongo = global.mongo || {};
export async function getMongoClient(): Promise<MongoClient> {
  if (!global.mongo.client) {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }
    global.mongo.client = new MongoClient(process.env.MONGODB_URI);
  }
  // It is okay to call connect() even if it is connected
  // using node-mongodb-native v4 (it will be no-op)
  // See: https://github.com/mongodb/node-mongodb-native/blob/4.0/docs/CHANGES_4.0.0.md
  await global.mongo.client.connect();
  return global.mongo.client;
}
export async function getStarlightArtifactsDb() {
  const client = await getMongoClient();
  return client.db("StarlightArtifacts");
}

export async function getPlayersCollection(): Promise<Collection<Player>> {
  const db = await getStarlightArtifactsDb();
  return db.collection("players");
}
export type MiningAttempt = z.infer<typeof miningSchema>;

export const miningSchema = z.object({
  playerId: playerIdSchema,
  utc: z.number(),
  location: z.object({
    type: z.string(),
    coordinates: z.array(z.number()),
  }),
});
export async function getGeoscansCollection(): Promise<
  Collection<MiningAttempt>
> {
  const db = await getStarlightArtifactsDb();
  return db.collection("geoscans");
}

export async function getPlayerById(playerId: string): Promise<Player | null> {
  const playersCollection = await getPlayersCollection();
  return playersCollection.findOne({ playerId });
}

export async function updatePlayerScannedItems(
  playerId: string,
  scannedItems: ScannedResource[]
): Promise<void> {
  const playersCollection = await getPlayersCollection();
  await playersCollection.updateOne({ playerId }, { $set: { scannedItems } });
}

// export const dbOperations = {
//   getMongoClient,
//   getPlayersCollection,
//   getPlayerById,
//   updatePlayerScannedItems
// };


class PlayerNotFoundError extends Error {
  constructor(message: string = "Player not found.") {
    super(message);
    this.name = "PlayerNotFoundError";
  }
}
