import nacl from "tweetnacl";
import bs58 from "bs58";

const decryptPayload = (data: string, nonce: string, sharedSecret?: Uint8Array) => {
  if (!sharedSecret) throw new Error("missing shared secret");

  const decryptedData = nacl.box.open.after(bs58.decode(data), bs58.decode(nonce), sharedSecret);
  if (!decryptedData) {
    throw new Error("Unable to decrypt data");
  }
  return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
};

const encryptPayload = (payload: any, sharedSecret?: Uint8Array) => {
  if (!sharedSecret) throw new Error("missing shared secret");

  const nonce = nacl.randomBytes(24);

  const encryptedPayload = nacl.box.after(
    Buffer.from(JSON.stringify(payload)),
    nonce,
    sharedSecret
  );

  return [nonce, encryptedPayload];
};

// Generate dappKeyPair
const dappKeyPair = nacl.box.keyPair();

// Test: Generate a phantom keypair for testing purposes
const phantomKeyPair = nacl.box.keyPair();

// Test: Create a shared secret using dapp's secret key and phantom's public key
const sharedSecret = nacl.box.before(phantomKeyPair.publicKey, dappKeyPair.secretKey);
const sharedSecret2 = nacl.box.before(dappKeyPair.publicKey, phantomKeyPair.secretKey);
console.log( bs58.encode(sharedSecret) === bs58.encode(sharedSecret2) ? "sharedSecrets match" : "sharedSecrets do not match" );
// Test: Encrypt a payload using the shared secret
const [nonce, encryptedPayload] = encryptPayload({ message: "Hello, Phantom!" }, sharedSecret);

// Test: Decrypt the encrypted payload using the shared secret
const decryptedPayload = decryptPayload(bs58.encode(encryptedPayload), bs58.encode(nonce), sharedSecret);

console.log("Original Payload:", { message: "Hello, Phantom!" });
console.log("Decrypted Payload:", decryptedPayload);
