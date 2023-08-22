import { Collection } from "mongodb";
import nacl from "tweetnacl";
import { ctx } from "../../common/context";
import { getMongoClient } from "../../db/dbConnect";
import { registerApi, Player, Registration } from "./registerApi";
import { TipLink } from "@tiplink/api";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { makeError } from "../../common/errorHandler";

export const registerRouter = ctx.router(registerApi);

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
  const registrationCollection: Collection<Registration> =
    db.collection("registrations");

  await registrationCollection.insertOne({
    // playerId: cpubkey,
    secret: cprivkey,
    npubkey: npubkey,
    utc: Date.now(),
  });

  const host1 = req.get("host") ?? "dev.moonshinelabs.io";
  console.log({ host1 });
  const isLocal =
    host1.includes("localhost") ||
    host1.includes("192.168") ||
    host1.includes(":3000");
  const hostMod = isLocal ? host1.replace("localhost", "192.168.0.226") : host1;

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
  const redirectUrl: string =
    baseUrl +
    method +
    "?" +
    params.toString() +
    `&redirect_link=${hostPath}/api/register/redirect/${npubkey}`;
  console.log({ redirectUrl });
  return res.redirect(redirectUrl);
  // will hit redirect endpoint with:
});

registerRouter.get("/register/tip/:uuid", async (req, res) => {
  const uuid = req.params.uuid as string;
  const client = await getMongoClient();
  const db = client.db("StarlightArtifacts");
  const playersCollection: Collection<Player> = db.collection("players");
  const player = await playersCollection.findOne({
    uuid: uuid,
  });
  if (!player || !player.tipLink)
    return res.status(400).json(makeError(400, `Player or tiplink not found.`));
  return res.redirect(player.tipLink);
});
registerRouter.get("/register/noob/:uuid", async (req, res) => {
  const custodialKeypair = Keypair.generate();
  const uuid = req.params.uuid as string;
  const privkey = custodialKeypair.secretKey;
  const cprivkey = bs58.encode(privkey);
  const pubkey = custodialKeypair.publicKey;
  const tip = await TipLink.create().then((tiplink) => {
    console.log("link: ", tiplink.url.toString());
    console.log("publicKey: ", tiplink.keypair.publicKey.toBase58());
    return tiplink;
  });
  const client = await getMongoClient();
  const db = client.db("StarlightArtifacts");
  const playersCollection: Collection<Player> = db.collection("players");
  const tipPubkey = pubkey.toBase58();
  const saveLoadPlayer = await playersCollection.findOneAndUpdate(
    {
      uuid: uuid,
    },
    {
      $setOnInsert: {
        playerId: tipPubkey,
        playerWallet: tip.keypair.publicKey.toBase58(),
        secret: cprivkey,
        uuid: uuid,
        tipSecret: bs58.encode(tip.keypair.secretKey),
        tipLink: tip.url.toString(),
        utc: Date.now(),
      },
    },
    { upsert: true }
  );
  console.log({ saveLoadPlayer });
  const status = saveLoadPlayer.ok;
  if (!status)
    return res
      .status(400)
      .json(makeError(400, `Player could not be loaded/created.`));
  const playerId = saveLoadPlayer.value?.playerId ?? tipPubkey;
  return res.redirect("starlightartifacts://login?" + playerId);
});
registerRouter.get("/register/redirect/:npubkey", async (req, res) => {
  // ?phantom_encryption_public_key=KbnntHs2XQ4eusxo5psP8gJHSnwG736uREAeN63Bp5a&nonce=MYNdsCS2UE1958VH2r4NeLtbYG6usA3Tq&data=3TgXuzzoHVKMd8
  const { phantom_encryption_public_key, nonce, data } = req.query;
  const { npubkey } = req.params;
  console.log({ phantom_encryption_public_key, nonce, data });
  const client = await getMongoClient();
  const db = client.db("StarlightArtifacts");
  const registrationCollection: Collection<Registration> =
    db.collection("registrations");
  const playersCollection: Collection<Player> = db.collection("players");
  const registration = await registrationCollection.findOne({
    npubkey: npubkey as string,
  });
  if (!registration)
    return res.status(400).json(makeError(400, `Registration not found.`));
  const naclKeypair = getNaclKeypairFromCustodialPrivateKey(
    registration.secret
  );
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
  const playerWallet = JSON.parse(decryptedDataString).public_key;
  if (!playerWallet)
    return res
      .status(444)
      .json(makeError(444, `No public key found in decrypted data.`));
  const secretToId = Keypair.fromSecretKey(
    bs58.decode(registration.secret)
  ).publicKey.toString();
  const saveLoadPlayer = await playersCollection.findOneAndUpdate(
    {
      playerWallet: playerWallet,
    },
    {
      $setOnInsert: {
        playerId: secretToId,
        playerWallet: playerWallet,
        secret: registration.secret,
        utc: Date.now(),
      },
    },
    { upsert: true }
  );
  console.log({ saveLoadPlayer });
  const status = saveLoadPlayer.ok;
  if (!status)
    return res
      .status(400)
      .json(makeError(400, `Player could not be loaded/created.`));
  const playerId = saveLoadPlayer.value?.playerId ?? secretToId;
  return res.redirect("starlightartifacts://login?" + playerId);
  // return res.status(200).json({
  //   playerId,
  // });
});
