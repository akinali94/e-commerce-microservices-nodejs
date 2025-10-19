import { createLogger, format, transports } from 'winston';

// Create a custom format similar to the original JSON formatter
const customFormat = format.combine(
  format.timestamp(),
  format.printf((info) => {
    const { timestamp, level, message, ...rest } = info;
    return JSON.stringify({
      timestamp,
      severity: level.toUpperCase(),
      message,
      ...rest
    });
  })
);

// Create the logger
export const logger = createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    new transports.Console()
  ]
});