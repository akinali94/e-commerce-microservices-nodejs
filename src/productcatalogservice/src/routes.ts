// src/routes/productRoutes.ts
import { Router, Request, Response } from 'express';
import { productCatalogService } from './services/productCatalog.js';

const router = Router();

/**
 * GET /products
 * List all products
 */
router.get('/products', async (req: Request, res: Response) => {
  try {
    // Apply extra latency if configured
    await applyExtraLatency();
    
    const response = await productCatalogService.listProducts();
    res.json(response);
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).json({ 
      error: 'Failed to list products',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /products/:id
 * Get a single product by ID
 */
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    // Apply extra latency if configured
    await applyExtraLatency();
    
    const { id } = req.params;
    const product = await productCatalogService.getProduct(id);
    res.json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({ 
        error: 'Product not found',
        message: error.message
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to get product',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

/**
 * GET /products/search?q=query
 * Search products by query string
 */
router.get('/products/search', async (req: Request, res: Response) => {
  try {
    // Apply extra latency if configured
    await applyExtraLatency();
    
    const query = req.query.q as string;
    
    if (!query) {
      res.status(400).json({ 
        error: 'Missing query parameter',
        message: 'Query parameter "q" is required'
      });
      return;
    }
    
    const response = await productCatalogService.searchProducts(query);
    res.json(response);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ 
      error: 'Failed to search products',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'SERVING',
    service: 'productcatalogservice'
  });
});

/**
 * Apply artificial latency for testing/demo purposes
 */
async function applyExtraLatency(): Promise<void> {
  const extraLatency = process.env.EXTRA_LATENCY;
  
  if (extraLatency) {
    const ms = parseDuration(extraLatency);
    if (ms > 0) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }
}

/**
 * Parse duration string (e.g., "5s", "500ms", "2.5s")
 */
function parseDuration(duration: string): number {
  const match = duration.match(/^([\d.]+)(ms|s)$/);
  
  if (!match) {
    console.warn(`Invalid EXTRA_LATENCY format: ${duration}`);
    return 0;
  }
  
  const value = parseFloat(match[1]);
  const unit = match[2];
  
  return unit === 's' ? value * 1000 : value;
}

export default router;