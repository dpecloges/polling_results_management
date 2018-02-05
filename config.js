var environments = {
  development: {
    ENV_VARS: {
      name: process.env.NAME,
      version: process.env.VERSION,
      profile: process.env.DEVELOPMENT_PROFILE,
      baseUrl: process.env.DEVELOPMENT_BASE_URL,
      authDomain: process.env.DEVELOPMENT_AUTH_DOMAIN,
      debug: (process.env.DEVELOPMENT_DEBUG === 'true')
    }
  },
  testing: {
    ENV_VARS: {
      name: process.env.NAME,
      version: process.env.VERSION,
      profile: process.env.TESTING_PROFILE,
      baseUrl: process.env.TESTING_BASE_URL,
      authDomain: process.env.TESTING_AUTH_DOMAIN,
      debug: (process.env.TESTING_DEBUG === 'true')
    }
  },
  support: {
    ENV_VARS: {
      name: process.env.NAME,
      version: process.env.VERSION,
      profile: process.env.SUPPORT_PROFILE,
      baseUrl: process.env.SUPPORT_BASE_URL,
      authDomain: process.env.SUPPORT_AUTH_DOMAIN,
      debug: (process.env.SUPPORT_DEBUG === 'true')
    }
  },
  staging: {
    ENV_VARS: {
      name: process.env.NAME,
      version: process.env.VERSION,
      profile: process.env.STAGING_PROFILE,
      baseUrl: process.env.STAGING_BASE_URL,
      authDomain: process.env.STAGING_AUTH_DOMAIN,
      debug: (process.env.STAGING_DEBUG === 'true')
    }
  },
  production: {
    ENV_VARS: {
      name: process.env.NAME,
      version: process.env.VERSION,
      profile: process.env.PRODUCTION_PROFILE,
      baseUrl: process.env.PRODUCTION_BASE_URL,
      authDomain: process.env.PRODUCTION_AUTH_DOMAIN,
      debug: (process.env.PRODUCTION_DEBUG === 'true')
    }
  },
  external: {
    ENV_VARS: {
      name: process.env.NAME,
      version: process.env.VERSION,
      profile: process.env.EXTERNAL_PROFILE,
      baseUrl: process.env.EXTERNAL_BASE_URL,
      authDomain: process.env.EXTERNAL_AUTH_DOMAIN,
      debug: (process.env.EXTERNAL_DEBUG === 'true')
    }
  }
};

module.exports = environments;