export type CartItem = { 
    productId: string; 
    quantity: number };

export type Cart = { 
    userId?: string; 
    items: CartItem[] 
}; 

export function addOrIncrement(items: CartItem[], productId: string, quantity: number): CartItem[] {
  const next = [...items];
  const idx = next.findIndex(i => i.productId === productId);
  if (idx >= 0) {
    next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
  } else {
    next.push({ productId, quantity });
  }
  return next;
}


export interface CartStore {
  addItem(userId: string, productId: string, quantity: number): Promise<void>;
  getCart(userId: string): Promise<Cart>;
  emptyCart(userId: string): Promise<void>;
  ping(): Promise<boolean>;
}