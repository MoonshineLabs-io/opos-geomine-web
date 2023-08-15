import { craftApi } from "./craftApi";
import { ctx } from "../../common/context";
import { Craftible, craftibles } from "./craftibles";
import { Keypair } from "@solana/web3.js";
import { makeError } from "../../common/errorHandler";

//makeCrudApi(":platformId/order", orderSchema);
// orderApi.push(getPurchase)
export const craftRouter = ctx.router(craftApi);

craftRouter.post("/craft", async (req, res) => {
  const itemId = req.body.itemId;
  const validItemIds = craftibles.map(craftible => craftible.itemId);
  // Check if the provided itemId exists in the craftibles array
  const itemExists = validItemIds.includes(itemId)

  if (!itemExists) return res.status(400).json(makeError(400, `Item not found. Valid itemIds: ${validItemIds.toString()}` ));
  const getRandomMessage = (): string => {
    const messages = ["Missing Resources", "Error", "Completed"];

    return messages[Math.floor(Math.random() * messages.length)];
  };
  const message = getRandomMessage();
  const success = message === "Completed";
  const response = {
    success,
    message,
    // craftId: Keypair.generate().publicKey.toString(),
    // createdUTC: Date.now(),
  };
  return res.status(200).json(response);
  // return res.status(200).json([] as Craftible[]);
});

// craftRouter.get("/orders/:platformId", async (req, res) => {
//   const platformId = req.params.platformId;
//   const orderLookup = await getOrders({ $match: { platformId } });
//   if (!orderLookup)
//     return res.status(404).json(makeError(409, "Order not found."));
//   return res.status(200).json(orderLookup);
// });
