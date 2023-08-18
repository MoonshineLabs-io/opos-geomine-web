import { makeApi, makeEndpoint } from "@zodios/core";
import { z } from "zod";
import { errors } from "../../common/errorHandler";
import { playerIdSchema } from "../../schemas/SharedSchemas";
import { scannedResourceSchema } from "../geo/resources";

export type SolanaPayGetQRResponse = z.infer<
  typeof solanaPayGetQrResponseSchema
>;
export const solanaPayGetQrResponseSchema = z.object({
  link: z.string().url(),
  label: z.string().nullish(),
  message: z.string().nullish(),
});
export type Player = z.infer<typeof playerSchema>;

export const playerSchema = z.object({
  playerId: playerIdSchema,
  playerWallet: z.string(),
  secret: z.string(),
  scannedItems: z.array(scannedResourceSchema),
  // npubkey: z.string(),
  utc: z.number(),
  location: z
    .object({
      type: z.string(),
      coordinates: z.array(z.number()),
    })
    .optional(),
});

export type Registration = z.infer<typeof registrationSchema>;

export const registrationSchema = z.object({
  // playerId: playerIdSchema,
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
const register = makeEndpoint({
  method: "get",
  path: "/register",
  alias: "registerUser",
  response: z.object({
    redirectUrl: z.string(),
  }),
  description:
    "Generates a Solana keypair, stores the secret key and UTC, then redirects to Phantom.com",
  errors,
});

const r = makeEndpoint({
  method: "get",
  path: "/register/r/:protocol/:name",
  alias: "testRedirect",
  response: z.object({
    redirectUrl: z.string(),
  }),
  description: "Testing protocol redirects",
  errors,
});

const redirect = makeEndpoint({
  method: "get",
  path: "/register/redirect/:npubkey",
  alias: "registerRedirect",
  parameters: [
    //phantom_encryption_public_key, nonce, data
    {
      type: "Query",
      name: "phantom_encryption_public_key",
      schema: z.string(),
      description: "Phantom's public key for encrypting data",
    },
    {
      type: "Query",
      name: "nonce",
      schema: z.string(),
      description: "Nonce for Phantom's encryption",
    },
    {
      type: "Query",
      name: "data",
      schema: z.string(),
      description: "Encrypted data from Phantom",
    },
  ],

  response: z.object({
    // redirectUrl: z.string(),
    playerId: z.string(),
  }),
  description:
    "Generates a Solana keypair, stores the secret key and UTC, then redirects to Phantom.com",
  errors,
});

const api = makeApi([register, redirect, r]);
export default api;
