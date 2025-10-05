import { Router } from "express";
import type { CartStore } from "./types.js";

import { addItem, getCart, emptyCart } from "./controllers.js";

export function cartsRouter(store: CartStore) {
  const r = Router();
  r.post("/:userId/items", addItem({ store }));
  r.get("/:userId", getCart({ store }));
  r.delete("/:userId", emptyCart({ store }));
  return r;
}
