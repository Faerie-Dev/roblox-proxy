import axios from "axios";

async function fetchData(url) {
  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "RobloxProxy/1.0" },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default async function handler(req, res) {
  const { path = "", userId, universeId, category } = req.query;
  let url = "";

  if (path === "universes" && userId) {
    url = `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=100`;
  } else if (path === "gamepasses" && universeId) {
    url = `https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100`;
  } else if (path === "inventory" && userId) {
    const cat = category || 3;
    url = `https://catalog.roblox.com/v1/search/items/details?Category=${cat}&CreatorTargetId=${userId}&limit=100`;
  } else {
    return res.status(400).json({ success: false, error: "Invalid query" });
  }

  const result = await fetchData(url);
  res.status(result.success ? 200 : 500).json(result);
}
