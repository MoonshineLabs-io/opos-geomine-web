import { getInventory, withdraw } from "../../../utils/solanaPlay";
import { ctx } from "../../common/context";
import { checkPlayerExists } from "../../common/middleware";
import { CreateItem } from "../../schemas/ItemSchemas";
import { Craftible, craftibles } from "../craft/craftibles";
import { Resource, resources } from "../geo/resources";
import { Inventory, inventoryApi } from "./inventoryApi";

export const inventoryRouter = ctx.router(inventoryApi);
// I need to know what resources they've gathered, can be in a custodial wallet in the moonshine system for now, as long as I know what they have, then I need to be able to call a crafting endpoint. Users need to be able to export and trade them if they want as well.
inventoryRouter.get("/inventory/:id", checkPlayerExists, async (req, res) => {
  const id = req.params.id;
  console.log({ id });

  const inventory = await getInventory(id);
  const ret = inventory.platformItems ? inventory.platformItems : inventory;
  return res.status(200).json(ret);
});

// var requestUrl = $"{BASE_URL}/inventory/withdraw/{playerId}/{itemId}";
inventoryRouter.get(
  "/inventory/withdraw/:playerId/:itemid",
  async (req, res) => {
    const playerId = req.params.playerId;
    const itemId = req.params.itemid;
    const result = await withdraw(playerId, itemId);
    return res.status(200).json(result);
  }
);

inventoryRouter.get("/inventory", (req, res) => {
  const inventory = craftibles
    .map((c) => convertCraftibleToSolanaPlayFormat(c))
    .concat(resources.map((r) => convertResourceToSolanaPlayFormat(r)));

  return res.status(200).json(inventory);
});
function convertCraftibleToSolanaPlayFormat(craftible: Craftible) {
  const combinedRarity = craftible.recipe.reduce((acc, recipe) => {
    const combinedRarity =
      resources.find((r) => r.itemId === recipe.itemId)?.rarity || 0;
    return acc + combinedRarity;
  }, 0);
  return convertToSolanaPlayFormat(craftible as CreateItem, combinedRarity);
}
function convertResourceToSolanaPlayFormat(resource: Resource) {
  return convertToSolanaPlayFormat(resource as CreateItem, resource.rarity);
}
function convertToSolanaPlayFormat(
  item: CreateItem,
  rarity: number
): CreateItem {
  const priceArray = [
    {
      price: 10 * rarity,
      tokenName: "CAPS",
      token: "Hk3ADSjwrxZM9DBVeSbyGgjK9tui6VybqGWpPoes7qQE",
      active: true,
      decimals: 9,
    },
    {
      price: 1 * rarity,
      tokenName: "USDC",
      token: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      active: true,
      decimals: 6,
    },
    // {
    //   price: (1 / 20) * resource.rarity,
    //   tokenName: "SOL",
    //   token: "So11111111111111111111111111111111111111112",
    //   active: true,
    //   decimals: 9,
    // },
  ];
  return {
    ...item,
    priceArray,
    image:
      "https://shdw-drive.genesysgo.net/5RCFihRGuvxpQgzg3tw8B7TeUwCZuM2JsKyGcRsb7dia/" +
      item.itemId +
      ".png",
  };
}
