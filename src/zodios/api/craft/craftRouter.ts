import { craftApi } from "./craftApi";
import { ctx } from "../../common/context";
import { Craftible } from "./craftibles";

//makeCrudApi(":platformId/order", orderSchema);
// orderApi.push(getPurchase)
export const craftRouter = ctx.router(craftApi);

craftRouter.get("/craft/:playerId", async (req, res) => {
  
  return res.status(200).json([] as Craftible[]);
});

// craftRouter.get("/orders/:platformId", async (req, res) => {
//   const platformId = req.params.platformId;
//   const orderLookup = await getOrders({ $match: { platformId } });
//   if (!orderLookup)
//     return res.status(404).json(makeError(409, "Order not found."));
//   return res.status(200).json(orderLookup);
// });
