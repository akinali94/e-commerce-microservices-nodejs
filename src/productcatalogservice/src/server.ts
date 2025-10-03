// src/server.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import productRoutes from './routes.js';
import { productCatalogService } from './services/productCatalog.js';

const app: Express = express();
const PORT = process.env.PORT || 3550;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Register routes
app.use('/api', productRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Product Catalog Service',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      listProducts: '/api/products',
      getProduct: '/api/products/:id',
      searchProducts: '/api/products/search?q=query'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

/**
 * Initialize and start the server
 */
async function startServer() {
  try {
    // Initialize catalog before starting server
    console.log('Initializing product catalog...');
    await productCatalogService.initialize();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`✓ Product Catalog Service started`);
      console.log(`✓ Server listening on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      
      if (process.env.EXTRA_LATENCY) {
        console.log(`✓ Extra latency enabled: ${process.env.EXTRA_LATENCY}`);
      }
      
      if (process.env.RDS_CLUSTER_NAME) {
        console.log(`✓ Using AWS RDS: ${process.env.RDS_CLUSTER_NAME}`);
      } else {
        console.log(`✓ Using local JSON file: products.json`);
      }
      
      console.log('\nSignal handlers:');
      console.log('  - SIGUSR1: Enable catalog reloading (performance bug)');
      console.log('  - SIGUSR2: Disable catalog reloading');
      console.log('  - SIGTERM/SIGINT: Graceful shutdown');
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
function setupGracefulShutdown() {
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received, shutting down gracefully...`);
    process.exit(0);
  };
  
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Setup and start
setupGracefulShutdown();
startServer();