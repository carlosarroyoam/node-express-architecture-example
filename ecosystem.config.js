module.exports = {
  apps: [
    {
      name: 'nodejs_api',
      script: './index.js',
      instances: 2,
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
