import { makeApi, makeEndpoint } from "@zodios/core";
import { z } from "zod";
import { errors } from "../../common/errorHandler";
import { resourceSchema } from "./resources";
// POST: /opos/geomine/ {"lat":12.3, "lon": 13.4}
// and get back a list of things nearby, we can talk about how to distribute later if we need to, but maybe rarity is a formula run through with both positions and we get some cool distributions
const geomine = makeEndpoint({
  method: "post",
  path: "/geomine",
  alias: "geomineByLongLat",
  parameters: [
    {
      type: "Body",
      name: "account",
      schema: z.object({ longitude: z.number(), latitude: z.number() }),
    },
  ],
  response: resourceSchema.array(),
  description: "Get geomine items by long/lat",
  errors,
});
const geomineApi = makeApi([geomine]);
export { geomineApi };
