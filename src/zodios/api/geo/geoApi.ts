import { makeApi, makeEndpoint } from "@zodios/core";
import { z } from "zod";
import { errors } from "../../common/errorHandler";
import { playerIdSchema, txResponseSchema } from "../../schemas/SharedSchemas";
import { resourceSchema, scannedResourceSchema } from "./resources";
// POST: /opos/geomine/ {"lat":12.3, "lon": 13.4}
// and get back a list of things nearby, we can talk about how to distribute later if we need to, but maybe rarity is a formula run through with both positions and we get some cool distributions
const scan = makeEndpoint({
  method: "post",
  path: "/geo/scan",
  alias: "geoscanByLongLat",
  parameters: [
    {
      type: "Body",
      name: "postBody",
      schema: z.object({
        playerId: playerIdSchema.default("8VWiSEmgcZvNtok6zcrHgUp83ZAJN9NoiPD4X1TQiPUp"),
        longitude: z.number().default(42.79469),
        latitude: z.number().default(10.14980),
      }),
    },
  ],
  response: scannedResourceSchema.array(),
  description: "Scan for items by long/lat & playerId.",
  errors,
});
const mine = makeEndpoint({
  method: "get",
  path: "/geo/mine/:playerId/:eid",
  alias: "geomine",
  response: txResponseSchema,
  description: "Mine an item by EID & playerId.",
  errors,
});
const api = makeApi([scan, mine]);
export default api;
