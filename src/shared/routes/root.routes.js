const { Router } = require('express');
const packageJson = require('../../../package.json');
const config = require('../../config');

module.exports = () => {
  const router = Router();

  router.get('/', (request, response) => {
    const APP_URL = `${config.APP.URL}:${config.APP.PORT}`;

    response.send({
      name: packageJson.name,
      description: packageJson.description,
      author: packageJson.author,
      version: packageJson.version,
      licence: packageJson.license,
      documentation: `${APP_URL}/api/v1/docs`,
      resources: {
        users: {
          paths: [
            {
              name: 'index',
              path: `${APP_URL}/api/v1/users`,
            },
            {
              name: 'show',
              path: `${APP_URL}/api/v1/users/[id]`,
            },
          ],
        },
        admins: {
          paths: [
            {
              name: 'index',
              path: `${APP_URL}/api/v1/admins`,
            },
            {
              name: 'show',
              path: `${APP_URL}/api/v1/admins/[id]`,
            },
          ],
        },
      },
    });
  });

  return router;
};
