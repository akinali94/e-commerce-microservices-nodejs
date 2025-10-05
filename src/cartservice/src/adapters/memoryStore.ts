import type { Cart } from "../types.js";
import { addOrIncrement, CartStore } from "../types.js";

export function createMemoryStore(): CartStore {
  const carts = new Map<string, Cart>();

  return {
    async addItem(userId, productId, quantity) {
      const current = carts.get(userId) ?? { items: [] };
      const items = addOrIncrement(current.items, productId, quantity);
      carts.set(userId, { userId, items });
    },

    async getCart(userId) {
      const cart = carts.get(userId);
      return cart ?? { items: [] }; // optional userId mimic
    },

    async emptyCart(userId) {
      carts.delete(userId);
    },

    async ping() {
      return true;
    }
  };
}
