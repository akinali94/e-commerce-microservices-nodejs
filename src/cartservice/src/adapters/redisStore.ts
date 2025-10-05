import { createClient } from "redis";
import type { Cart, CartStore } from "../types.js";
import { addOrIncrement } from "../types.js";

export type RedisConfig = {
  url: string; // e.g. redis://:password@host:port/db
};

function cartKey(userId: string) {
  return `cart:${userId}`;
}

export async function createRedisStore(config: RedisConfig): Promise<CartStore> {
  const client = createClient({ url: config.url });
  client.on("error", (err) => console.error("Redis error", err));
  await client.connect();

  return {
    async addItem(userId, productId, quantity) {
      const key = cartKey(userId);
      // Use optimistic locking with WATCH/MULTI to prevent lost updates
      for (;;) {
        await client.watch(key);
        const raw = await client.get(key);
        const cart: Cart = raw ? JSON.parse(raw) : { items: [] };
        const items = addOrIncrement(cart.items, productId, quantity);
        const next: Cart = { userId, items };

        const tx = client.multi();
        tx.set(key, JSON.stringify(next));
        const res = await tx.exec(); // null means transaction aborted
        if (res !== null) break; // success
      }
    },

    async getCart(userId) {
      const raw = await client.get(cartKey(userId));
      if (!raw) return { items: [] };
      return JSON.parse(raw) as Cart;
    },

    async emptyCart(userId) {
      await client.del(cartKey(userId));
    },

    async ping() {
      try {
        const pong = await client.ping();
        return pong === "PONG";
      } catch {
        return false;
      }
    }
  };
}
