import express from 'express';

/**
 * Body parser middleware configuration
 */
export const jsonParser = express.json({
  limit: '10mb',
  strict: true
});

export const urlencodedParser = express.urlencoded({
  extended: true,
  limit: '10mb'
});