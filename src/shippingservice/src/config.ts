export interface Config {
  port: number;
  nodeEnv: string;
  disableTracing: boolean;
  disableProfiler: boolean;
  disableStats: boolean;
  allowedOrigins: string[];
  logLevel: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '50051', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  disableTracing: process.env.DISABLE_TRACING === 'true',
  disableProfiler: process.env.DISABLE_PROFILER === 'true',
  disableStats: process.env.DISABLE_STATS === 'true',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
  logLevel: process.env.LOG_LEVEL || 'info'
};