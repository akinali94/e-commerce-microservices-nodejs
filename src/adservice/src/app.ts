import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createRoutes } from './route';
import { adErrorHandler } from './controller';

/**
 * Creates and configures the Express application
 * Separates app configuration from server startup for better testability
 */
export const createApp = (): Application => {
  const app: Application = express();

  
  // Helmet
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
    })
  );
  
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400, // 24 hours
  };
  
  app.use(cors(corsOptions));

  // Parse JSON bodies (limit: 10mb)
  app.use(express.json({ limit: '10mb' }));
  
  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }

  
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.id = req.headers['x-request-id'] as string || 
             `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    res.setHeader('X-Request-Id', req.id);
    next();
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `[${req.id}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
      );
    });
    
    next();
  });

  
  // Mount all application routes
  app.use('/api/v1', createRoutes());
  

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Cannot ${req.method} ${req.path}`,
        path: req.path,
        method: req.method,
      },
      timestamp: new Date().toISOString(),
      requestId: req.id,
    });
  });

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('[Error Handler]', {
      requestId: req.id,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });

    adErrorHandler(error, req, res, next);
  });

  return app;
};

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export default createApp;