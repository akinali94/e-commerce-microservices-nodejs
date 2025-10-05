import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./utils/http.js";
import type { CartStore } from "./types.js";
import { cartsRouter } from "./routes.js";
import { healthz } from "./controllers.js";

export function createApp(deps: { store: CartStore }) {
  const app = express();

  app.use(helmet());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/healthz", healthz({ store: deps.store }));
  app.use("/v1/carts", cartsRouter(deps.store));

  app.use(errorMiddleware);
  return app;
}
