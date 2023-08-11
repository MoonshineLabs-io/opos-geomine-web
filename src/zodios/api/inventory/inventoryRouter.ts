import { ctx } from "../../common/context";
import { makeError } from "../../common/errorHandler";
import { Resource } from "../geomine/resources";
import { Inventory, inventoryApi } from "./inventoryApi";

export const inventoryRouter = ctx.router(inventoryApi);
// I need to know what resources they've gathered, can be in a custodial wallet in the moonshine system for now, as long as I know what they have, then I need to be able to call a crafting endpoint. Users need to be able to export and trade them if they want as well.
inventoryRouter.get("/inventory/:id", async (req, res) => {
  // const p = await getInventory(id);
  // if (!p) return res.status(404).json(makeError(404, "Inventory not found"));
  const inventory: Inventory = {
    resources: [],
    craftibles: [],
    lastModified: new Date(),
  };
  return res.status(200).json(inventory);
});
