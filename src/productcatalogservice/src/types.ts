// src/models/Money.ts
export type Money = {
  currencyCode: string;
  units: number;
  nanos: number;
}

export type Product = {
  id: string;
  name: string;
  description: string;
  picture: string;
  priceUsd: Money;
  categories: string[];
}


export type ListProductsResponse = {
  products: Product[];
}

export type SearchProductsRequest = {
  query: string;
}


export type SearchProductsResponse = {
  results: Product[];
}

export type GetProductRequest = {
  id: string;
}