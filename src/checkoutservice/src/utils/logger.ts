import { config } from '../utils/config';

/**
 * Log seviyeleri
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Log level string'ini enum'a çevir
 */
function getLogLevelFromString(level: string): LogLevel {
  const levelMap: Record<string, LogLevel> = {
    debug: LogLevel.DEBUG,
    info: LogLevel.INFO,
    warn: LogLevel.WARN,
    error: LogLevel.ERROR,
  };
  return levelMap[level.toLowerCase()] ?? LogLevel.INFO;
}

/**
 * Renk kodları (terminal için)
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

/**
 * Renk ekle (sadece terminal için)
 */
function colorize(text: string, color: string): string {
  // Production'da veya renk desteği yoksa renk ekleme
  if (config.environment === 'production' || !process.stdout.isTTY) {
    return text;
  }
  return `${color}${text}${colors.reset}`;
}

/**
 * Timestamp formatla
 */
function getTimestamp(): string {
  if (!config.logTimestamp) return '';
  
  const now = new Date();
  const date = now.toISOString();
  return colorize(`[${date}]`, colors.gray);
}

/**
 * Log seviyesi badge'i
 */
function getLevelBadge(level: LogLevel): string {
  switch (level) {
    case LogLevel.DEBUG:
      return colorize('[DEBUG]', colors.cyan);
    case LogLevel.INFO:
      return colorize('[INFO] ', colors.green);
    case LogLevel.WARN:
      return colorize('[WARN] ', colors.yellow);
    case LogLevel.ERROR:
      return colorize('[ERROR]', colors.red);
    default:
      return '[LOG]  ';
  }
}

/**
 * Log mesajını formatla
 */
function formatMessage(level: LogLevel, message: string, ...args: any[]): string {
  const timestamp = getTimestamp();
  const badge = getLevelBadge(level);
  
  let formattedMessage = `${timestamp} ${badge} ${message}`;
  
  // Eğer ek argümanlar varsa
  if (args.length > 0) {
    const argsString = args
      .map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(' ');
    
    formattedMessage += ` ${argsString}`;
  }
  
  return formattedMessage;
}

/**
 * Mevcut log seviyesi
 */
const currentLogLevel = getLogLevelFromString(config.logLevel);

/**
 * Log mesajı yaz
 */
function log(level: LogLevel, message: string, ...args: any[]): void {
  // Eğer log seviyesi yeterince yüksek değilse, loglamayı atla
  if (level < currentLogLevel) {
    return;
  }

  const formattedMessage = formatMessage(level, message, ...args);

  switch (level) {
    case LogLevel.DEBUG:
    case LogLevel.INFO:
      console.log(formattedMessage);
      break;
    case LogLevel.WARN:
      console.warn(formattedMessage);
      break;
    case LogLevel.ERROR:
      console.error(formattedMessage);
      break;
  }
}

/**
 * Debug seviyesinde log
 */
export function debug(message: string, ...args: any[]): void {
  log(LogLevel.DEBUG, message, ...args);
}

/**
 * Info seviyesinde log
 */
export function info(message: string, ...args: any[]): void {
  log(LogLevel.INFO, message, ...args);
}

/**
 * Warning seviyesinde log
 */
export function warn(message: string, ...args: any[]): void {
  log(LogLevel.WARN, message, ...args);
}

/**
 * Error seviyesinde log
 */
export function error(message: string, ...args: any[]): void {
  log(LogLevel.ERROR, message, ...args);
}

/**
 * HTTP request logger
 */
export function logRequest(method: string, path: string, statusCode?: number, duration?: number): void {
  const methodColored = colorize(method.padEnd(6), colors.cyan);
  const pathColored = colorize(path, colors.white);
  
  let message = `${methodColored} ${pathColored}`;
  
  if (statusCode !== undefined) {
    const statusColor = statusCode >= 500 ? colors.red
      : statusCode >= 400 ? colors.yellow
      : statusCode >= 300 ? colors.cyan
      : colors.green;
    
    message += ` ${colorize(String(statusCode), statusColor)}`;
  }
  
  if (duration !== undefined) {
    message += ` ${colorize(`${duration}ms`, colors.gray)}`;
  }
  
  log(LogLevel.INFO, message);
}

/**
 * Başarı mesajı
 */
export function success(message: string, ...args: any[]): void {
  const successMessage = colorize(`✅ ${message}`, colors.green);
  log(LogLevel.INFO, successMessage, ...args);
}

/**
 * Hata mesajı (Error object ile)
 */
export function logError(message: string, error: Error | unknown): void {
  log(LogLevel.ERROR, message);
  
  if (error instanceof Error) {
    console.error(colorize(error.stack || error.message, colors.red));
  } else {
    console.error(colorize(String(error), colors.red));
  }
}

/**
 * Başlık yazdır (görsel ayrım için)
 */
export function header(title: string): void {
  const line = '='.repeat(50);
  console.log(colorize(line, colors.cyan));
  console.log(colorize(title, colors.bright + colors.cyan));
  console.log(colorize(line, colors.cyan));
}

/**
 * Tablo yazdır
 */
export function table(data: Record<string, any>): void {
  console.table(data);
}

/**
 * Logger object (eski class-based API ile uyumlu)
 */
export const logger = {
  debug,
  info,
  warn,
  error,
  success,
  logError,
  logRequest,
  header,
  table,
};