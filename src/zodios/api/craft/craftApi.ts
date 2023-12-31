import { makeApi, makeEndpoint } from "@zodios/core";
import z from "zod";
import {
  amountSchema,
  urlPathParamSchema,
  pubkeyStrSchema,
  thirtyTwoBytesSchema,
  txResponseSchema,
  playerIdSchema,
} from "../../schemas/SharedSchemas";
import { errors } from "../../common/errorHandler";
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

export const craftStatusSchema = z.object({
  confirmed: z.boolean(),
  message: z.string(),
  txSignature: z.string().optional(),
});

// POST: /opos/craft {"item":"Energon Torch"}
const craft = makeEndpoint({
  method: "get",
  path: "/craft/:playerId/:itemId",
  alias: "craft",
  description: "Create a new Starlight Artifacts item",
  parameters: [
    {
      type: "Path",
      name: "playerId",
      schema: playerIdSchema,
      description: "Player ID",
    },
    {
      type: "Path",
      name: "itemId",
      schema: urlPathParamSchema,
      description: "Item ID to craft",
    },
    // {
    //   type: "Query",
    //   name: "amount",
    //   schema: amountSchema.optional(),
    //   description: "Number of items to craft. Omit for 1.",
    // },
  ],
  response: txResponseSchema,
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
        "Craft Reference ID (refId)- used as reference in transaction",
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
export const craftApi2 = makeApi([getCraftStatus, getAllCrafts]);

const getCraft = makeEndpoint({
  name: "getCraft",
  tags: ["craft"],
  description: "Entrypoint initiating item purchase",
  method: "get",
  path: "/craft/:playerId/:itemId",
  alias: "craftItem",
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
      description: "Number of items to craft. Omit for 1.",
    },
  ],

  response: txResponseSchema,
  status: 200,
  errors,
});

export const craftApi = makeApi([craft]);
export type CraftApi = typeof craftApi;
