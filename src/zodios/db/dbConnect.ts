import { MongoClient } from "mongodb";
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
