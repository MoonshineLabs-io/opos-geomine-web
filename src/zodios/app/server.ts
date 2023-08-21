import cors from "cors";
import { ctx } from "../common/context";
import { inventoryRouter } from "../api/inventory/inventoryRouter";
import { craftRouter } from "../api/craft/craftRouter";
import { geoRouter } from "../api/geo/geoRouter";
import { specRouter } from "../api/spec";
import { registerRouter } from "../api/register/registerRouter";

const app = ctx.nextApp();
// Disable the "X-Powered-By: Express" HTTP header for security reasons.
// See https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#recommendation_16
app.disable("x-powered-by");
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});
app.use("/api", inventoryRouter);
app.use("/api", craftRouter);
app.use("/api", geoRouter);
app.use("/api", specRouter);
app.use("/api", registerRouter);
app.use("/api", (req, res, next) => {
  if (res.errored) {
    console.log("res.errored", res.errored);
  }
  next();
});
app.use("/api", (req, res) => {
  return res
    .status(404)
    .json({ error: { code: "Route Not Found", message: "Not Found" } });
});

export { app };
