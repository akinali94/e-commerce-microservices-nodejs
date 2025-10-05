import dotenv from 'dotenv';
import app from './app';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 50051;
const disableTracing = process.env.DISABLE_TRACING !== '';
const disableProfiler = process.env.DISABLE_PROFILER !== '';
const disableStats = process.env.DISABLE_STATS !== '';

// Log configuration
if (disableTracing) {
  logger.info('Tracing disabled.');
} else {
  logger.info('Tracing enabled, but temporarily unavailable');
}

if (disableProfiler) {
  logger.info('Profiling disabled.');
} else {
  logger.info('Profiling enabled.');
}

if (disableStats) {
  logger.info('Stats disabled.');
} else {
  logger.info('Stats enabled, but temporarily unavailable');
}

// Start server
const server = app.listen(port, () => {
  logger.info(`Shipping Service listening on port ${port}`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, starting graceful shutdown`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.fatal('Uncaught exception', { error: error.message, stack: error.stack });
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled rejection', { reason });
});