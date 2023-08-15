import { ctx } from "../../common/context";
import { z } from "zod";
import { Collection } from "mongodb";
import { getMongoClient } from "../../db/dbConnect";
import registerApi from "./registerApi";

import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export const registerRouter = ctx.router(registerApi);

registerRouter.get("/register", async (req, res) => {
  const keypair = Keypair.generate();
  const privkey = keypair.secretKey;
  const pubkey = keypair.publicKey;

//   const client = await getMongoClient();
//   const db = client.db("YourDatabaseName"); // Replace with your database name
//   const playersCollection: Collection<any> = db.collection("players");

//   await playersCollection.insertOne({
//     secretKey: bs58.encode(privkey),
//     utc: Date.now(),
//   });
// https://phantom.app/ul/v1/connect?app_url=https%3A%2F%2Fopos.moonshinelabs.io%2Fapi%2Fqr%2F4SpRpH2DB5nLNtXqjTWnFtZfWDh8CnqEXYcQFy8JWhD9&dapp_encryption_public_key=triQem2gDXHXweNceTKWGfDfN6AnpCHmjR745LXcbix&redirect_link=unitydl://onPhantomConnected
  const redirectUrl = `https://phantom.app/ul/v1/connect?app_url=https%3A%2F%2Fdev.moonshinelabs.io%2Fapi%2Fqr%2F4SpRpH2DB5nLNtXqjTWnFtZfWDh8CnqEXYcQFy8JWhD9&dapp_encryption_public_key=${pubkey.toString()}&redirect=https%3A%2F%2Fopos.moonshinelabs.io%2Fapi%2Fredirect`;

  return res.redirect(redirectUrl);
});
