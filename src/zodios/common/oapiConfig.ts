import { openApiBuilder } from "@zodios/openapi";
import { craftApi } from "../api/craft/craftApi";
import geoApi from "../api/geo/geoApi";
import { inventoryApi } from "../api/inventory/inventoryApi";
import { specApi } from "../api/spec";

export const info = {
  title: "Moonshine Labs OPOS Geomine API Documentation",
  description:
    "Moonshine Labs Geomine api documentation for developers, team members, and partners.",
  contact: {
    name: "Moonshine Labs",
    url: "https://moonshinelabs.io",
    email: "team@moonshinelabs.io",
  },
  version: "0.5",
};
export const remoteServers = [
  {
    url: "https://devopos.moonshinelabs.io/api",
    description: "Development Server",
  },
  {
    url: "https://stageopos.moonshinelabs.io/api",
    description: "Staging Server",
  },
  {
    url: "https://opos.moonshinelabs.io/api",
    description: "Production Server",
  },
];
export const localServer = {
  url: "http://localhost:3000/api",
  description: "Local Server",
};
export const apiSpec = (lh = false) => {
  const servers = lh ? [localServer].concat(remoteServers) : remoteServers;
  return openApiBuilder(info)
    .addServer(servers[0])
    .addServer(servers[1])
    .addServer(servers[2])
    .addServer(localServer)
    .addPublicApi(geoApi)
    .addPublicApi(inventoryApi)
    .addPublicApi(craftApi)
    .addPublicApi(specApi)
    .build();
};
