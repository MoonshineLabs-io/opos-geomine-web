import { makeApi, makeEndpoint } from "@zodios/core";
import { Document } from "mongodb";
import * as z from "zod";
import { errors } from "../../common/errorHandler";
import { craftibleSchema } from "../craft/craftibles";
import { resourceSchema } from "../geomine/resources";
// GET: /opos/inventory returns array of resources and crafted items
export type InventoryDoc = Document & Inventory;
export type Inventory = z.infer<typeof inventorySchema>;
export const inventorySchema = z.object({
  resources: resourceSchema.array(),
  craftibles: craftibleSchema.array(),
  lastModified: z.date().optional(),
});
const getInventory = makeEndpoint({
  method: "get",
  path: "/inventory/:id",
  alias: "getInventory",
  response: inventorySchema,
  description: "Get Starlight Artifacts inventory by player id",
  errors,
});

const inventoryApi = makeApi([getInventory]);
export { inventoryApi };
