import express, { NextFunction, Request, Response } from 'express';
import { router } from './route';
import { AppError, globalErrorHandler } from './utils/errorhandler';

// Initialize express app
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Health check endpoint (similar to the gRPC health check in the original service)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'SERVING' });
});

// Use our routes
app.use('/api', router);

// Handle 404 errors for routes that don't exist
app.use('*', (req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: `Path ${req.originalUrl} not found` 
  });
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  globalErrorHandler(err, res);
});

export { app };