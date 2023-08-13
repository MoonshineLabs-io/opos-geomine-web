import { ctx } from "../../common/context";
import { makeError } from "../../common/errorHandler";
import { thirtyTwoBytesSchema } from "../../schemas/SharedSchemas";
import { craftibles } from "../craft/craftibles";
import { Resource, resources } from "../geomine/resources";
import { Inventory, inventoryApi } from "./inventoryApi";

export const inventoryRouter = ctx.router(inventoryApi);
// I need to know what resources they've gathered, can be in a custodial wallet in the moonshine system for now, as long as I know what they have, then I need to be able to call a crafting endpoint. Users need to be able to export and trade them if they want as well.
inventoryRouter.get("/inventory/:id", async (req, res) => {
  const id = req.params.id;
  // const p = await getInventory(id);
  const parseInput = thirtyTwoBytesSchema.safeParse(id);
    if (!parseInput.success) return res.status(400).json(makeError(400, "Invalid id (wallet address)."));
  //     return res.status(401).json({
  //       error: { code: "Invalid input", message: zFail(parseInput.error) },
  //     });
  //   const playerInput = parseInput.data;

  // if (!p) return res.status(404).json(makeError(404, "Inventory not found"));
  // const inventory: Inventory = {
  //   resources: [],
  //   craftibles: [],
  //   lastModified: new Date(),
  // };
  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomItems = (arr: any[], count: number): any[] => {
    const shuffled = arr.slice(0);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  };

  const inventory: Inventory = {
    resources: getRandomItems(resources, getRandomNumber(0, 20)),
    craftibles: getRandomItems(craftibles, getRandomNumber(0, 20)),
    lastModified: new Date(),
  };
  return res.status(200).json(inventory);
});
