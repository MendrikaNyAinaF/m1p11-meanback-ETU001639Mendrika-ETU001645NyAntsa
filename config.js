// config.js

const config = {
  development: {
    mongoURI: 'mongodb+srv://ranjalahynyantsa:y6SEIUJTvmJlJx0y@cluster0.cdwza34.mongodb.net/',
    dbName: 'mbs-dev',
    secretKey:'secretKeyDev2024!'
    // Add other development-specific configuration here
  },
  production: {
    mongoURI: 'mongodb+srv://ranjalahynyantsa:y6SEIUJTvmJlJx0y@cluster0.cdwza34.mongodb.net/',
    dbName: 'mbs-prod',
    secretKey:'secretKeyProd2024!'
    // Add other production-specific configuration here
  }
};

module.exports = config;
