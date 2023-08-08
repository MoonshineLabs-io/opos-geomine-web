import { makeApi, makeEndpoint } from "@zodios/core";
import { geomineSchema } from "../schemas/GeomineSchemas";
import { urlPathParamSchema } from "../schemas/SharedSchemas";
import { errors } from "./api";

const geomine = makeEndpoint({
  method: "get",
  path: "/geomine/:lat/:long",
  alias: "geomineByLatLong",
  parameters: [
    {
      type: "Path",
      name: "lat",
      schema: urlPathParamSchema,
      description: "latitute",
    },
    {
      type: "Path",
      name: "long",
      schema: urlPathParamSchema,
      description: "longitude",
    },
  ],
  response: geomineSchema.array(),
  description: "Get geomine items by lat/long",
  errors,
});
const geomineApi = makeApi([
  geomine,
]);
export { geomineApi };
