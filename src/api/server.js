const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');

const config = require('../config');
const router = require('./router');
const logger = require('../shared/lib/winston/logger');

module.exports = () => {
  const app = express();

  app
    .use(cors())
    .use(express.json())
    .use(compression())
    .use(morgan('dev'))
    .use(helmet())
    .use(router())
    .use((err, req, res, next) => {
      logger.log({
        level: err.status ? 'info' : 'error',
        message: err.message,
      });

      // @ts-ignore
      if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({
          message: 'The JSON payload is malformed',
          error: 'Bad request',
        });
      }

      if (!err.fatal) {
        return res.status(err.status || 500).send({
          message: err.message,
          error: err.name !== 'Error' ? err.name : 'Internal server error',
          data: err.errors,
        });
      }

      process.exit(5);
    });

  return new Promise((resolve) => {
    app.listen(config.APP.PORT, () => {
      logger.log({
        level: 'info',
        message: `Application running on: ${config.APP.URL}:${config.APP.PORT}`,
      });

      resolve();
    });
  });
};
