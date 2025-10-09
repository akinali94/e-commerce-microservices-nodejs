import express, { Express } from 'express';
import { createRecommendationService } from './services';
import { createRoutes } from './routes';
import { errorHandler } from './middlewares';
import { logger } from './logger';


interface ServerConfig {
  port: number;
  productCatalogUrl: string;
  maxRecommendations?: number;
}

const getConfig = (): ServerConfig => {
  const port = parseInt(process.env.PORT || '8080', 10);
  const productCatalogUrl = process.env.PRODUCT_CATALOG_SERVICE_ADDR || '';
  const maxRecommendations = parseInt(
    process.env.MAX_RECOMMENDATIONS || '5',
    10
  );

  if (!productCatalogUrl) {
    throw new Error('PRODUCT_CATALOG_SERVICE_ADDR environment variable not set');
  }

  return {
    port,
    productCatalogUrl,
    maxRecommendations,
  };
};



export const createApp = (config: ServerConfig): Express => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const recommendationService = createRecommendationService({
    productCatalogUrl: config.productCatalogUrl,
    maxRecommendations: config.maxRecommendations,
  });

  const routes = createRoutes(recommendationService);
  app.use('/', routes);

  app.use(errorHandler);

  return app;
};


export const startServer = (app: Express, port: number): void => {
  app.listen(port, () => {
    logger.info('Recommendation service started', {
      port,
      service: 'recommendation-service',
      version: '1.0.0',
    });
  });
};

if (require.main === module) {
  try {
    logger.info('Initializing recommendation service');

    const config = getConfig();
    logger.info('Configuration loaded', {
      port: config.port,
      productCatalogUrl: config.productCatalogUrl,
      maxRecommendations: config.maxRecommendations,
    });

    const app = createApp(config);
    startServer(app, config.port);
  } catch (error) {
    logger.error('Failed to start server', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
}