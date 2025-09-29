import app from './app';
import { config } from './utils/config';
import { logger } from './utils/logger';

// Start server
const server = app.listen(config.port, () => {
  logger.info(`===========================================`);
  logger.info(`Currency Service REST API started`);
  logger.info(`Port: ${config.port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`===========================================`);
});

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default server;