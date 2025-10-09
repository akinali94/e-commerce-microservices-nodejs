import path from 'path';

/**
 * Environment variables'ları oku
 */
function getEnvVariable(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  
  return value.toLowerCase() === 'true';
}

/**
 * Uygulama konfigürasyonu
 */
export const config = {
  // Server ayarları
  port: getEnvNumber('PORT', 3000),
  host: getEnvVariable('HOST', '0.0.0.0'),
  environment: getEnvVariable('NODE_ENV', 'development'),
  
  // Dosya yolları
  currencyDataPath: path.join(__dirname, '..', 'data', 'currency_conversion.json'),
  
  // CORS ayarları
  corsOrigin: getEnvVariable('CORS_ORIGIN', '*'),
  corsCredentials: getEnvBoolean('CORS_CREDENTIALS', false),
  
  // Cache ayarları
  cacheDuration: getEnvNumber('CACHE_DURATION_MS', 60 * 60 * 1000), // Default: 1 saat
  cacheEnabled: getEnvBoolean('CACHE_ENABLED', true),
  
  // Log ayarları
  logLevel: getEnvVariable('LOG_LEVEL', 'info'), // 'debug' | 'info' | 'warn' | 'error'
  logTimestamp: getEnvBoolean('LOG_TIMESTAMP', true),
  
  // Rate limiting (gelecekte kullanılabilir)
  rateLimitEnabled: getEnvBoolean('RATE_LIMIT_ENABLED', false),
  rateLimitMax: getEnvNumber('RATE_LIMIT_MAX', 100),
  rateLimitWindow: getEnvNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 dakika
  
  // Request ayarları
  requestTimeout: getEnvNumber('REQUEST_TIMEOUT_MS', 30000), // 30 saniye
  bodyLimit: getEnvVariable('BODY_LIMIT', '10mb'),
  
  // Güvenlik
  trustProxy: getEnvBoolean('TRUST_PROXY', false),
  
  // Shutdown ayarları
  shutdownTimeout: getEnvNumber('SHUTDOWN_TIMEOUT_MS', 10000), // 10 saniye
} as const;

/**
 * Development modunda mı?
 */
export function isDevelopment(): boolean {
  return config.environment === 'development';
}

/**
 * Production modunda mı?
 */
export function isProduction(): boolean {
  return config.environment === 'production';
}

/**
 * Test modunda mı?
 */
export function isTest(): boolean {
  return config.environment === 'test';
}

/**
 * Konfigürasyonu validate et
 */
export function validateConfig(): void {
  const errors: string[] = [];

  // Port kontrolü
  if (config.port < 1 || config.port > 65535) {
    errors.push(`Invalid port: ${config.port}. Must be between 1 and 65535.`);
  }

  // Log level kontrolü
  const validLogLevels = ['debug', 'info', 'warn', 'error'];
  if (!validLogLevels.includes(config.logLevel)) {
    errors.push(`Invalid log level: ${config.logLevel}. Must be one of: ${validLogLevels.join(', ')}`);
  }

  // Cache duration kontrolü
  if (config.cacheDuration < 0) {
    errors.push(`Invalid cache duration: ${config.cacheDuration}. Must be positive.`);
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

/**
 * Konfigürasyon bilgilerini logla (development için)
 */
export function logConfig(): void {
  if (!isDevelopment()) return;

  console.log('='.repeat(50));
  console.log('📋 Configuration:');
  console.log('='.repeat(50));
  console.log(`Environment:     ${config.environment}`);
  console.log(`Port:            ${config.port}`);
  console.log(`Host:            ${config.host}`);
  console.log(`CORS Origin:     ${config.corsOrigin}`);
  console.log(`Cache Enabled:   ${config.cacheEnabled}`);
  console.log(`Cache Duration:  ${config.cacheDuration}ms`);
  console.log(`Log Level:       ${config.logLevel}`);
  console.log('='.repeat(50));
}

// Startup'ta config'i validate et
try {
  validateConfig();
} catch (error) {
  console.error('❌ Configuration Error:', error);
  process.exit(1);
}