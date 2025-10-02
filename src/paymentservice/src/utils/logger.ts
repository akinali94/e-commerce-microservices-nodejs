import pino from 'pino';

export const logger = pino({
  name: 'paymentservice-rest',
  messageKey: 'message',
  formatters: {
    level(level) {
      return { severity: level };
    }
  }
});