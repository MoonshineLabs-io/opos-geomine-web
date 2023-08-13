import { makeApi, makeEndpoint } from "@zodios/core";
import z from "zod";
import { ctx } from "../common/context";
import { apiSpec } from "../common/oapiConfig";

const getSpec = makeEndpoint({
  method: "get",
  path: "/spec",
  alias: "getSpec",
  response: z.any(),
});
export const specApi = makeApi([getSpec]);
export const specRouter = ctx.router(specApi);
specRouter.get("/spec", (req, res) => res.status(200).json(apiSpec()));
// const oapiRouter = zodiosRouter([...platformApi, ...itemApi]);
