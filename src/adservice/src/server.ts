import http from 'http';
import { createApp } from './app';


const CONFIG = {
  port: parseInt(process.env.PORT || '9555', 10),
  host: process.env.HOST || '0.0.0.0',
  environment: process.env.NODE_ENV || 'development',
  shutdownTimeout: parseInt(process.env.SHUTDOWN_TIMEOUT || '10000', 10),
};

if (isNaN(CONFIG.port) || CONFIG.port < 1 || CONFIG.port > 65535) {
  console.error(`Invalid PORT: ${process.env.PORT}. Using default 9555.`);
  CONFIG.port = 9555;
}


const app = createApp();
const server = http.createServer(app);

let isShuttingDown = false;

const startServer = (): void => {
  server.listen(CONFIG.port, CONFIG.host, () => {
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${CONFIG.port} is already in use`);
    } else if (error.code === 'EACCES') {
      console.error(`Permission denied for port ${CONFIG.port}`);
    } else {
      console.error('Server error:', error);
    }
    process.exit(1);
  });
};


/**
 * Handles graceful shutdown of the server
 * @param signal - The signal that triggered the shutdown
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    console.log('Shutdown already in progress...');
    return;
  }

  isShuttingDown = true;
  
  console.log(`\n${'═'.repeat(63)}`);
  console.log(` ${signal} received - Starting graceful shutdown...`);
  console.log('═'.repeat(63));

  // Stop accepting new connections
  server.close((err) => {
    if (err) {
      console.error(' Error during server shutdown:', err);
      process.exit(1);
    }

    console.log('Server closed - no longer accepting connections');
    console.log('All existing connections finished');
    console.log('Ad Service shut down gracefully');
    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    console.error('Graceful shutdown timeout - forcing exit');
    console.error('Some connections may not have closed properly');
    process.exit(1);
  }, CONFIG.shutdownTimeout);

  // Optional: Close database connections, cleanup resources, etc.
  try {
    // await closeDatabase();
    // await flushLogs();
    console.log('Cleanup tasks completed');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};


// Handle termination signals (Docker, Kubernetes, etc.)
process.on('SIGTERM', () => {
  console.log('📨 SIGTERM signal received');
  gracefulShutdown('SIGTERM');
});

// Handle interrupt signal
process.on('SIGINT', () => {
  console.log('\n📨 SIGINT signal received (Ctrl+C)');
  gracefulShutdown('SIGINT');
});


// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('═'.repeat(63));
  console.error('UNCAUGHT EXCEPTION');
  console.error('═'.repeat(63));
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  console.error('═'.repeat(63));
  
  // Give time to log before exiting
  setTimeout(() => {
    gracefulShutdown('uncaughtException');
  }, 100);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('═'.repeat(63));
  console.error('UNHANDLED PROMISE REJECTION');
  console.error('═'.repeat(63));
  console.error('Reason:', reason);
  console.error('Promise:', promise);
  console.error('═'.repeat(63));
  
  // Give time to log before exiting
  setTimeout(() => {
    gracefulShutdown('unhandledRejection');
  }, 100);
});

// Handle warnings
process.on('warning', (warning: Error) => {
  console.warn('Process warning:', warning.name);
  console.warn('Message:', warning.message);
  if (warning.stack) {
    console.warn('   Stack:', warning.stack);
  }
});


startServer();

export default server;