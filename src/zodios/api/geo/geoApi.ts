import { makeApi, makeEndpoint } from "@zodios/core";
import { z } from "zod";
import { errors } from "../../common/errorHandler";
import { playerIdSchema } from "../../schemas/SharedSchemas";
import { resourceSchema } from "./resources";
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
        playerId: playerIdSchema,
        longitude: z.number(),
        latitude: z.number(),
      }),
    },
  ],
  response: resourceSchema.array(),
  description: "Scan for items by long/lat",
  errors,
});
const mine = makeEndpoint({
  method: "patch",
  path: "/geo/mine",
  alias: "geomineByEID",
  parameters: [
    {
      type: "Body",
      name: "postBody",
      schema: z.object({
        eid: z.string(),
      }),
    },
  ],
  response: resourceSchema.array(),
  description: "Scan for items by long/lat",
  errors,
});
const api = makeApi([scan, mine]);
export default api;
