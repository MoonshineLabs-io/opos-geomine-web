import { makeApi, makeEndpoint } from "@zodios/core";
import z from "zod";
import { urlPathParamSchema } from "../../schemas/SharedSchemas";
import {
  amountSchema,
  currencySchema,
  pubkeyStrSchema,
  thirtyTwoBytesSchema,
} from "../../schemas/SolanaPaySchemas";
import { errors } from "../api";
import { craftibleSchema } from "./craftibles";


export type CreateCraft = z.infer<typeof createCraftSchema>;
export const createCraftSchema = z.object({
  // blockhash: z.string(),
  // craftUTC: z.number(),
});
export type Craft = z.infer<typeof craftSchema>;
export const craftSchema = createCraftSchema.extend({
  tx: z.string(),
  txUTC: z.number(),
  txSignature: z.string().optional(),
  txLookupUTC: z.number().optional(),
});
export const craftGetResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  craftId: urlPathParamSchema,
  platCustPub: pubkeyStrSchema,
  craftRefId: thirtyTwoBytesSchema,
  createdUTC: z.number(),
});

export const craftStatusSchema = z.object({
  confirmed: z.boolean(),
  message: z.string(),
  txSignature: z.string().optional(),
});

// POST: /opos/craft {"item":"Energon Torch"}
const craft = makeEndpoint({
  method: "post",
  path: "/craft",
  alias: "craft",
  description: "Create a new Starlight Artifacts item",
  parameters: [
    {
      type: "Body",
      name: "inventory",
      schema: z.object({
        item: z.string(),
        craftId: urlPathParamSchema,
        createdUTC: z.number(),
      }),
      description: "Inventory to create",
    },
  ],
  response: craftGetResponseSchema,
  errors,
});
const getCraftStatus = makeEndpoint({
  method: "get",
  path: "/crafts/status/:id",
  alias: "getCraftStatus",
  response: craftStatusSchema,
  description: "Check payment status for an craft by id",
  parameters: [
    {
      type: "Path",
      name: "id",
      schema: thirtyTwoBytesSchema,
      description:
        "Craft Reference ID (qrRefId)- used as reference in transaction",
    },
  ],
  errors,
});
const getAllCrafts = makeEndpoint({
  method: "get",
  tags: ["craft"],
  path: "/craft/:playerId",
  alias: "getCrafts",
  parameters: [
    {
      type: "Path",
      name: "playerId",
      schema: urlPathParamSchema,
      description: "Player ID to filter",
    },
  ],
  response: z.array(craftibleSchema),
  description: "Get all crafts by playerId",
  errors,
});
export const craftApi = makeApi([getCraftStatus, getAllCrafts]);

const getCraft = makeEndpoint({
  name: "getCraft",
  tags: ["craft"],
  description: "QR entrypoint initiating item purchase",
  method: "get",
  path: "/craft/:playerId/:itemId/:playerId",
  alias: "getPurchase",
  parameters: [
    {
      type: "Path",
      name: "playerId",
      schema: urlPathParamSchema,
      description: "Player ID, this must be unique for each player",
    },
    {
      type: "Query",
      name: "amount",
      schema: amountSchema.optional(),
      description: "Number of items to purchase. Omit for 1.",
    },
    {
      type: "Query",
      name: "token",
      schema: currencySchema.optional(),
      description: "Token to use for purchase. Omit for SOL.",
    },
  ],

  response: craftGetResponseSchema,
  status: 200,
  errors,
});

export const craftApiSchema = makeApi([getCraftStatus]);
export type CraftApi = typeof craftApiSchema;
