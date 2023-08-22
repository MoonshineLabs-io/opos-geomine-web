import { craftItem } from "../../../utils/solanaPlay";
import { ctx } from "../../common/context";
import { makeError } from "../../common/errorHandler";
import { checkPlayerExists } from "../../common/middleware";
import { craftApi } from "./craftApi";
import { craftibles } from "./craftibles";

//makeCrudApi(":platformId/order", orderSchema);
// orderApi.push(getPurchase)
export const craftRouter = ctx.router(craftApi);

craftRouter.get(
  "/craft/:playerId/:itemId",
  checkPlayerExists,
  async (req, res) => {
    const { playerId, itemId } = req.params;
    console.log({ playerId, itemId });
    const validItemIds = craftibles.map((craftible) => craftible.itemId);
    // Check if the provided itemId exists in the craftibles array
    const itemExists = validItemIds.includes(itemId as string);

    if (!itemExists)
      return res
        .status(400)
        .json(
          makeError(
            400,
            `Item not found. Valid itemIds: ${validItemIds.toString()}`
          )
        );
    const getRandomMessage = (): string => {
      const messages = ["Missing Resources", "Error", "Completed"];

      return messages[Math.floor(Math.random() * messages.length)];
    };
    const message = getRandomMessage();
    const success = message === "Completed";
    const response1 = {
      success,
      message,
      // craftId: Keypair.generate().publicKey.toString(),
      // createdUTC: Date.now(),
    };
    const response = await craftItem(playerId, itemId);
    return res.status(200).json(response);
    // return res.status(200).json([] as Craftible[]);
  }
);

// craftRouter.get("/orders/:platformId", async (req, res) => {
//   const platformId = req.params.platformId;
//   const orderLookup = await getOrders({ $match: { platformId } });
//   if (!orderLookup)
//     return res.status(404).json(makeError(409, "Order not found."));
//   return res.status(200).json(orderLookup);
// });
