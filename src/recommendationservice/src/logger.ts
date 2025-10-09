

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        severity: 'INFO',
        message,
        ...meta,
      })
    );
  },
  error: (message: string, meta?: any) => {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        severity: 'ERROR',
        message,
        ...meta,
      })
    );
  },
  warn: (message: string, meta?: any) => {
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        severity: 'WARN',
        message,
        ...meta,
      })
    );
  },
};