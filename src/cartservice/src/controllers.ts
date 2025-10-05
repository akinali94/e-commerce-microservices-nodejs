import type { Request, Response, NextFunction } from "express";
import type { CartStore } from "./types.js";
import { addItemBodySchema } from "./utils/validate.js";

type Deps = { store: CartStore };

export const addItem =
  ({ store }: Deps) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const parse = addItemBodySchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ error: "bad_request", message: parse.error.message });
      }

      const { productId, quantity } = parse.data;
      await store.addItem(userId, productId, quantity);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };

export const getCart =
  ({ store }: Deps) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const cart = await store.getCart(userId);
      res.json(cart);
    } catch (err) {
      next(err);
    }
  };


export const emptyCart =
  ({ store }: Deps) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      await store.emptyCart(userId);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };


  export const healthz =
  ({ store }: Deps) =>
  async (_req: Request, res: Response, _next: NextFunction) => {
    const ok = await store.ping();
    res.status(ok ? 200 : 503).json({ status: ok ? "SERVING" : "NOT_SERVING" });
  };