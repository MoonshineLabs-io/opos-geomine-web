import { RARITY_POOL_COUNT, SCAN_RETURN_QTY } from "../constants";
import { Resource, resources } from "../zodios/api/geo/resources";

const originalGetRandomResources = (nearbyAttempts: number): Resource[] => {
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
export const getRandomItem = (weightedPool: Resource[]): Resource => {
  const randomIndex = Math.floor(Math.random() * weightedPool.length);
  return weightedPool[randomIndex];
};

export const refactoredGetRandomResources = (
  nearbyAttempts: number
): Resource[] => {
  const weightedPool: Resource[] = resources.flatMap((item) => {
    let probability = (1 / item.rarity) * Math.pow(0.8, nearbyAttempts);
    probability = Math.min(Math.max(probability, 0), 1);
    if (item.rarity === 1) probability = 1;
    return Array(Math.floor(RARITY_POOL_COUNT * probability)).fill(item);
  });
  return Array(SCAN_RETURN_QTY)
    .fill(null)
    .map(() => getRandomItem(weightedPool));
};

const measurePerformance = (nearbyAttempts: number, resources: Resource[]) => {
  let startTime, endTime;

  // Measure original function
  startTime = performance.now();
  const og = originalGetRandomResources(nearbyAttempts);
  console.log(og.map((r) => r.itemId));
  endTime = performance.now();
  const originalTime = endTime - startTime;

  // Measure refactored function
  startTime = performance.now();
  const ref = refactoredGetRandomResources(nearbyAttempts);
  console.log(ref.map((r) => r.itemId));
  endTime = performance.now();
  const refactoredTime = endTime - startTime;

  return {
    originalTime,
    refactoredTime,
  };
};

const nearbyAttemptsSample = 2;
const resourcesSample = [];

const results = measurePerformance(nearbyAttemptsSample, []);
console.log(`Original function took: ${results.originalTime}ms`);
console.log(`Refactored function took: ${results.refactoredTime}ms`);
