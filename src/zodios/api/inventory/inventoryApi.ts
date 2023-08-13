import { makeApi, makeEndpoint } from "@zodios/core";
import { Document } from "mongodb";
import * as z from "zod";
import { errors } from "../../common/errorHandler";
import { thirtyTwoBytesSchema } from "../../schemas/SharedSchemas";
import { craftibleSchema } from "../craft/craftibles";
import { resourceSchema } from "../geomine/resources";
export type InventoryDoc = Document & Inventory;
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
      schema: thirtyTwoBytesSchema,
      description: "Player ID (address)",
    },
  ],
  errors,
});

const inventoryApi = makeApi([getInventory]);
export { inventoryApi };
