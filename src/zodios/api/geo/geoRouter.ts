import crypto from "crypto";
import { RARITY_POOL_COUNT, SCAN_RETURN_QTY } from "../../../constants";
import { ctx } from "../../common/context";
import { makeError } from "../../common/errorHandler";
import { checkPlayerExists } from "../../common/middleware";
import { updatePlayerScannedItems } from "../../db/dbConnect";
import { getNearbyAttempts, recordMiningAttempt } from "../../db/dbOperations";
import { TxResponse } from "../../schemas/SharedSchemas";
import geoApi from "./geoApi";
import { Resource, resources, ScannedResource } from "./resources";

export const geoRouter = ctx.router(geoApi);

function getRandomItem(weightedPool: any[]): any {
  const randomIndex = Math.floor(Math.random() * weightedPool.length);
  return weightedPool[randomIndex];
}
const getRandomResources = (nearbyAttempts: number): Resource[] => {
  // Create a weighted pool of potential resources based on rarity and probability
  
  const weightedPool: Resource[] = [];
  for (const item of resources) {
    let probability = (1 / item.rarity) * Math.pow(0.8, nearbyAttempts);
    probability = Math.min(Math.max(probability, 0), 1); // Clamp probability
    if (item.rarity === 1) probability = 1;
    const itemCount = Math.floor(RARITY_POOL_COUNT * probability);
    weightedPool.push(...Array(itemCount).fill(item));
  }

  // Randomly select 10 items from the weighted pool
  const foundItems: Resource[] = [];
  for (let i = 0; i < SCAN_RETURN_QTY; i++) {
    foundItems.push(getRandomItem(weightedPool));
  }
  return foundItems;
};
const assignUniqueIdsToResources = (resources: Resource[]): ScannedResource[] =>
  resources.map((item) => ({
    ...item,
    eid: crypto.randomBytes(16).toString("hex"),
  }));

geoRouter.post("/geo/scan", checkPlayerExists, async (req, res) => {
  const { longitude, latitude } = req.body;
  const playerId = req.player.playerId;
  console.log({ longitude, latitude, playerId });
  const nearbyAttempts = await getNearbyAttempts(longitude, latitude);
  await recordMiningAttempt(playerId, longitude, latitude);
  const foundItems = getRandomResources(nearbyAttempts);
  const scannedItems = assignUniqueIdsToResources(foundItems);
  await updatePlayerScannedItems(playerId, scannedItems);
  return res.status(200).json(scannedItems);
});

geoRouter.get(
  "/geo/mine/:playerId/:eid",
  checkPlayerExists,
  async (req, res) => {
    const { eid } = req.params;
    const player = req.player;
    const { playerId, scannedItems } = player;
    console.log({ playerId, eid });
    const item = scannedItems.find((item) => item.eid === eid);
    if (!item) {
      return res
        .status(400)
        .json(makeError(400, `Item not found or already mined.`));
    }
    const itemIndex = scannedItems.indexOf(item);
    scannedItems.splice(itemIndex, 1);
    const updatePlayer = await updatePlayerScannedItems(playerId, scannedItems);
    const txResponse: TxResponse = {
      success: true,
      message: `Item mined.`,
    };
    return res.status(200).json(txResponse);
  }
);
