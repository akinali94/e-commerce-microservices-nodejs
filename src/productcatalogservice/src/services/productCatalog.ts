import { Product, ListProductsResponse, SearchProductsResponse } from '../types.js';
import { loadCatalog } from './catalogLoader.js';

class ProductCatalogService {
  private catalog: ListProductsResponse = { products: [] };
  private reloadCatalog: boolean = false;

  constructor() {
    this.setupSignalHandlers();
  }

  /**
   * Setup signal handlers for dynamic catalog reloading
   */
  private setupSignalHandlers(): void {
    // Enable catalog reloading on each request (performance bug feature)
    process.on('SIGUSR1', () => {
      console.log('Received SIGUSR1: Enable catalog reloading');
      this.reloadCatalog = true;
    });

    // Disable catalog reloading
    process.on('SIGUSR2', () => {
      console.log('Received SIGUSR2: Disable catalog reloading');
      this.reloadCatalog = false;
    });
  }

  /**
   * Initialize the catalog on service startup
   */
  async initialize(): Promise<void> {
    try {
      this.catalog = await loadCatalog();
      console.log(`Catalog initialized with ${this.catalog.products.length} products`);
    } catch (error) {
      console.error('Failed to initialize catalog:', error);
      throw error;
    }
  }

  /**
   * Get the current catalog, optionally reloading based on the flag
   */
  private async getCatalog(): Promise<Product[]> {
    if (this.reloadCatalog || this.catalog.products.length === 0) {
      this.catalog = await loadCatalog();
    }
    return this.catalog.products;
  }

  /**
   * List all products
   */
  async listProducts(): Promise<ListProductsResponse> {
    const products = await this.getCatalog();
    return { products };
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    const products = await this.getCatalog();
    
    const product = products.find(p => p.id === id);
    
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  /**
   * Search products by query (case-insensitive search in name and description)
   */
  async searchProducts(query: string): Promise<SearchProductsResponse> {
    const products = await this.getCatalog();
    
    const lowerQuery = query.toLowerCase();
    
    const results = products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
    );
    
    return { results };
  }
}

// Export a singleton instance
export const productCatalogService = new ProductCatalogService();