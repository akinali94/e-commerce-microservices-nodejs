import express, { Application } from 'express';
import routes from './route';
import { errorHandler, notFoundHandler } from './middleware/errorhandler';
import { requestLogger } from './middleware/requestlogger';
import { corsMiddleware } from './middleware/cors';
import { jsonParser, urlencodedParser } from './middleware/bodyparser';
import { validateContentType } from './middleware/validation';


export const createApp = (): Application => {
  const app = express();

  app.use(corsMiddleware);

  app.use(jsonParser);
  app.use(urlencodedParser);

  app.use(validateContentType);

  app.use(requestLogger);

  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp();