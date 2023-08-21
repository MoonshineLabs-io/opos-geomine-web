import { REGISTER_URL } from "../../constants";
import { getPlayerById } from "../db/dbConnect";
import { PlayerMiddleware } from "./context";
import { makeError } from "./errorHandler";

// Middleware to check if player exists
export const checkPlayerExists: PlayerMiddleware = async (req, res, next) => {
  const playerId: string = req.body.playerId ?? req.params.playerId;

  const player = await getPlayerById(playerId);
  if (!player) {
    // throw new PlayerNotFoundError();
    return res
      .status(400)
      .json(makeError(400, `Player not found. Register via ${REGISTER_URL}.`));
  }
  req.player = player; // Attach player to request object
  next();
};
