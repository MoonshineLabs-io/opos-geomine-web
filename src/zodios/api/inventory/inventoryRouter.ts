import { ctx } from "../../common/context";
import { makeError } from "../../common/errorHandler";
import { Resource } from "../geomine/resources";
import { inventoryApi } from "./inventoryApi";

export const inventoryRouter = ctx.router(inventoryApi);

inventoryRouter.get("/inventory/:id", async (req, res) => {
  // const p = await getInventory(id);
  // if (!p) return res.status(404).json(makeError(404, "Inventory not found"));
  return res.status(200).json([] as Resource[]);
});
