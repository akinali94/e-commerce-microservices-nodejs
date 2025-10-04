/**
 * Structured logger matching the Go service's JSON format
 */
interface LogEntry {
  timestamp: string;
  severity: string;
  message: string;
  [key: string]: any;
}

export const createLogger = () => {
  const log = (severity: string, message: string, meta: object = {}) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      severity,
      message,
      ...meta
    };
    console.log(JSON.stringify(entry));
  };

  return {
    debug: (message: string, meta?: object) => log('debug', message, meta),
    info: (message: string, meta?: object) => log('info', message, meta),
    warn: (message: string, meta?: object) => log('warn', message, meta),
    error: (message: string, meta?: object) => log('error', message, meta),
    fatal: (message: string, meta?: object) => {
      log('fatal', message, meta);
      process.exit(1);
    }
  };
};

export const logger = createLogger();