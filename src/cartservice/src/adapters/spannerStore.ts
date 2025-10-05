import type { CartStore } from "../types.js";

export function createSpannerStore(): CartStore {
  return {
    async addItem() { throw new Error("Spanner store not implemented yet."); },
    async getCart() { throw new Error("Spanner store not implemented yet."); },
    async emptyCart() { throw new Error("Spanner store not implemented yet."); },
    async ping() { return false; }
  };
}
