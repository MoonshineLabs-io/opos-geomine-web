import { Collection } from "mongodb";
import nacl from "tweetnacl";
import { z } from "zod";
import { ctx } from "../../common/context";
import { getMongoClient } from "../../db/dbConnect";
import registerApi from "./registerApi";

import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { playerIdSchema } from "../../schemas/SharedSchemas";
import { makeError } from "../../common/errorHandler";

export const registerRouter = ctx.router(registerApi);
type Player = z.infer<typeof playerSchema>;

export const playerSchema = z.object({
  playerId: playerIdSchema,
  secret: z.string(),
  npubkey: z.string(),
  utc: z.number(),
  location: z
    .object({
      type: z.string(),
      coordinates: z.array(z.number()),
    })
    .optional(),
});

function getNaclKeypairFromSolanaKeypair(keypair: Keypair) {
  return nacl.box.keyPair.fromSecretKey(keypair.secretKey.slice(0, 32));
}
function getNaclKeypairFromSolanaPrivateKey(privateKey: Uint8Array) {
  return nacl.box.keyPair.fromSecretKey(privateKey.slice(0, 32));
}
function getNaclKeypairFromCustodialPrivateKey(privateKey: string) {
  return nacl.box.keyPair.fromSecretKey(
    Uint8Array.from(bs58.decode(privateKey)).slice(0, 32)
  );
}
registerRouter.get("/register", async (req, res) => {
  const custodialKeypair = Keypair.generate();
  const privkey = custodialKeypair.secretKey;
  const pubkey = custodialKeypair.publicKey;
  const cprivkey = bs58.encode(privkey);
  const cpubkey = pubkey.toString();
  const naclKeypair = getNaclKeypairFromCustodialPrivateKey(cprivkey);
  const npubkey = bs58.encode(naclKeypair.publicKey);
  const nprivkey = bs58.encode(naclKeypair.secretKey);
  console.log({ cprivkey, cpubkey, npubkey, nprivkey });
  // const receivedPubkeyMock = Keypair.generate().publicKey.toString();

  const client = await getMongoClient();
  const db = client.db("StarlightArtifacts");
  const playersCollection: Collection<Player> = db.collection("players");

  await playersCollection.insertOne({
    playerId: cpubkey,
    secret: cprivkey,
    npubkey: npubkey,
    utc: Date.now(),
  });

  const host1 = req.get("host") ?? "dev.moonshinelabs.io";
  console.log({ host1 });
  const isLocal = host1.includes("localhost") || host1.includes("192.168") || host1.includes(":3000");
  const hostMod = isLocal
    ? host1.replace("localhost", "192.168.0.226")
    : host1;

  const prot = isLocal ? "http" : "https"; // req.protocol;
  const hostPath = `${prot}://${hostMod}`;

  // works:
  // https://phantom.app/ul/v1/connect?app_url=https%3A%2F%2Fopos.moonshinelabs.io&dapp_encryption_public_key=FgMfaVrfjDa9kB3e9fNVcmimhVbgT7m7K5C7XWerxny4&redirect_link=unitydl://StarlightArtifacts
  const baseUrl = "https://phantom.app/ul/v1/";
  const method = "connect";

  // Parameters for the Phantom deep link
  const params = new URLSearchParams({
    app_url: "https://opos.moonshinelabs.io",
    dapp_encryption_public_key: npubkey,
    // redirect_link: `${hostPath}/api/register/redirect`, //"https://opos.moonshinelabs.io/api/register/redirect"
    // redirect_link: "unitydl://StarlightArtifacts", //"https://opos.moonshinelabs.io/api/register/redirect"
  });

  // Construct the full redirect URL
  const redirectUrl = baseUrl + method + "?" + params.toString() + `&redirect_link=${hostPath}/api/register/redirect`;
  console.log({ redirectUrl });
  return res.redirect(redirectUrl);
  // will hit redirect endpoint with:
});

registerRouter.get("/register/redirect", async (req, res) => {
  // ?phantom_encryption_public_key=KbnntHs2XQ4eusxo5psP8gJHSnwG736uREAeN63Bp5a&nonce=MYNdsCS2UE1958VH2r4NeLtbYG6usA3Tq&data=3TgXuzzoHVKMd8
  const { phantom_encryption_public_key, nonce, data } = req.query;
  const client = await getMongoClient();
  const db = client.db("StarlightArtifacts");
  const playersCollection: Collection<Player> = db.collection("players");
  const player = await playersCollection.findOne({
    npubkey: phantom_encryption_public_key,
  });
  if (!player) return res.status(400).json(makeError(400, `Player not found.`));
  const naclKeypair = getNaclKeypairFromCustodialPrivateKey(player.secret);
  const sharedSecret = nacl.box.before(
    Uint8Array.from(bs58.decode(phantom_encryption_public_key)),
    naclKeypair.secretKey
  );
  const decryptedData = nacl.box.open.after(
    bs58.decode(data as string),
    bs58.decode(nonce as string),
    sharedSecret
  );
  if (!decryptedData)
    return res.status(400).json(makeError(400, `Unable to decrypt data.`));
  const decryptedDataString = Buffer.from(decryptedData).toString("utf8");
  console.log(decryptedDataString);
  const playerWallet = decryptedDataString;
  const updatePlayerResult = await playersCollection.updateOne(
    { npubkey: phantom_encryption_public_key },
    {
      $set: {
        wallet: playerWallet,
      },
    }
  );
  console.log({ updatePlayerResult });
  
  // const meta = JSON.parse(decryptedDataString);
  // const meta: SolanaPayGetQRResponse
  return res.status(200).json({
    // redirectUrl: "https://opos.moonshinelabs.io",
    data: decryptedDataString,
  });
});
