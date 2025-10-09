import { ListRecommendationsRequest, ListRecommendationsResponse, Product, ProductCatalogResponse } from './models';

export interface RecommendationServiceConfig {
  productCatalogUrl: string;
  maxRecommendations?: number;
}

export const createProductCatalogClient = (baseUrl: string) => {
  const listProducts = async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${baseUrl}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Product Catalog API error: ${response.status}`);
      }

      const data = await response.json() as ProductCatalogResponse;
      return data.products;
    } catch (error) {
      throw new Error(
        `Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  return { listProducts };
};

export const filterSeenProducts = (
  allProducts: Product[],
  seenProductIds: string[]
): Product[] => {
  const seenSet = new Set(seenProductIds);
  return allProducts.filter((product) => !seenSet.has(product.id));
};


export const sampleProducts = (
  products: Product[],
  count: number
): Product[] => {
  const numProducts = products.length;
  const numToReturn = Math.min(count, numProducts);

  if (numToReturn === 0) {
    return [];
  }

  // Fisher-Yates shuffle for random sampling
  const shuffled = [...products];
  for (let i = numProducts - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, numToReturn);
};


export const extractProductIds = (products: Product[]): string[] => {
  return products.map((product) => product.id);
};


export const createRecommendationService = (
  config: RecommendationServiceConfig
) => {
  const maxRecommendations = config.maxRecommendations || 5;
  const productCatalogClient = createProductCatalogClient(
    config.productCatalogUrl
  );

  /**
   * Lists product recommendations for a user
   */
  const listRecommendations = async (
    request: ListRecommendationsRequest
  ): Promise<ListRecommendationsResponse> => {
    // Fetch all products from catalog
    const allProducts = await productCatalogClient.listProducts();

    // Filter out products user has already seen
    const unseenProducts = filterSeenProducts(allProducts, request.productIds);

    // Sample random products
    const recommendedProducts = sampleProducts(
      unseenProducts,
      maxRecommendations
    );

    // Extract product IDs
    const productIds = extractProductIds(recommendedProducts);

    return { productIds };
  };

  return { listRecommendations };
};


//Factory Function
export const createRecommendationServiceWithClient = (
  productCatalogClient: ReturnType<typeof createProductCatalogClient>,
  maxRecommendations: number = 5
) => {
  const listRecommendations = async (
    request: ListRecommendationsRequest
  ): Promise<ListRecommendationsResponse> => {
    const allProducts = await productCatalogClient.listProducts();
    const unseenProducts = filterSeenProducts(allProducts, request.productIds);
    const recommendedProducts = sampleProducts(
      unseenProducts,
      maxRecommendations
    );
    const productIds = extractProductIds(recommendedProducts);

    return { productIds };
  };

  return { listRecommendations };
};