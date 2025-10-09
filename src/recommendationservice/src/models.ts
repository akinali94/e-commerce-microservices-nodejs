
export interface ListRecommendationsRequest {
  userId: string;
  productIds: string[];
}

export interface ListRecommendationsResponse {
  productIds: string[];
}

export interface Product {
  id: string;
  name?: string;
  description?: string;
  categories?: string[];
}

export interface ProductCatalogResponse {
  products: Product[];
}


export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface HealthCheckResponse {
  status: 'SERVING' | 'NOT_SERVING' | 'UNKNOWN';
  timestamp: string;
  service: string;
  version?: string;
}