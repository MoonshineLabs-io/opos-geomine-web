import { makeApi, makeEndpoint } from "@zodios/core";
// import { Document } from "mongodb";
import * as z from "zod";
import { errors } from "../../common/errorHandler";
import { createItemSchema } from "../../schemas/ItemSchemas";
import { playerIdSchema } from "../../schemas/SharedSchemas";
import { craftibleSchema } from "../craft/craftibles";
import { resourceSchema } from "../geo/resources";
// export type InventoryDoc = Document & Inventory;
export type Inventory = z.infer<typeof inventorySchema>;
export const inventorySchema = z.object({
  resources: resourceSchema.array(),
  craftibles: craftibleSchema.array(),
  lastModified: z.date().optional(),
});
// GET: /opos/inventory returns array of resources and crafted items
const getInventory = makeEndpoint({
  method: "get",
  path: "/inventory/:id",
  alias: "getInventory",
  response: inventorySchema,
  description: "Get Starlight Artifacts inventory by player id",
  parameters: [
    {
      type: "Path",
      name: "id",
      schema: playerIdSchema,
      description: "Player ID (wallet address)",
    },
  ],
  errors,
});

const getAllItems = makeEndpoint({
  method: "get",
  path: "/inventory",
  alias: "getAllItems",
  response: createItemSchema.array(),
  description: "Get all Starlight Artifacts items",
  errors,
});
const inventoryApi = makeApi([getInventory, getAllItems]);
export { inventoryApi };
