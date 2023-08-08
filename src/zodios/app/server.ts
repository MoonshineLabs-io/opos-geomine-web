import cors from "cors";
import { ctx } from "../common/context";
import { geomineRouter } from "../routers/geomine";
import { craftRouter } from "../routers/craft";
import { specRouter } from "../routers/spec";
import { inventoryRouter } from "../routers/inventory";

const app = ctx.nextApp();
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
app.use("/api/opos", inventoryRouter);
app.use("/api/opos", craftRouter);
app.use("/api/opos", geomineRouter);
app.use("/api/opos", specRouter);
app.use("/api/opos", (req, res, next) => {
  if (res.errored) {
    console.log("res.errored", res.errored);
  }
  next();
});
app.use("/api/opos", (req, res) => {
  return res
    .status(404)
    .json({ error: { code: "Route Not Found", message: "Not Found" } });
});

export { app };
