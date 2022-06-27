module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { "http": false };

    return config;
  },
};
