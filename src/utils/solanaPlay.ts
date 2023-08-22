const SOLANAPLAY_API_KEY = process.env.MSLNFT_SECRET as string;
const SOLANAPLAY_API_URL = "https://moonshinelabs.io/api/solanaplay";
export async function mintItem(playerId: string, itemId: string) {
  const result = await fetch(
    `${SOLANAPLAY_API_URL}/mint/starart/${playerId}/${itemId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SOLANAPLAY_API_KEY,
      },
    }
  );
  const json = await result.json();
  return json;
}
export async function getInventory(playerId: string) {
  const result = await fetch(
    `${SOLANAPLAY_API_URL}/inventory/starart/${playerId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SOLANAPLAY_API_KEY,
      },
    }
  );
  const json = await result.json();
  return json;
}
export async function craftItem(playerId: string, itemId: string) {
  const result = await fetch(
    `${SOLANAPLAY_API_URL}/craft/starart/${playerId}/${itemId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SOLANAPLAY_API_KEY,
      },
    }
  );
  const json = await result.json();
  return json;
}

export async function withdraw(playerId: string, itemId: string) {
  const result = await fetch(`${SOLANAPLAY_API_URL}/inventory/withdraw`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": SOLANAPLAY_API_KEY,
    },
    body: JSON.stringify({
      platformId: "starart",
      playerId,
      itemId,
    }),
  });
  const json = await result.json();
  return json;
}
