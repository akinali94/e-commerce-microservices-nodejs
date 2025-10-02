import createApp from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT ?? '3000';
const app = createApp();

const server = app.listen(PORT, () => {
  logger.info(`PaymentService REST API started on port ${PORT}`);
  logger.info('Available endpoints:');
  logger.info(`  POST http://localhost:${PORT}/api/payment/charge`);
  logger.info(`  GET  http://localhost:${PORT}/api/payment/health`);
  logger.info('===========================================');
});

function shutdown(signal: string) {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default server;
