// config.js

const config = {
  development: {
    mongoURI: 'mongodb+srv://ranjalahynyantsa:c7jt3yoVjNP6vqq6@cluster0.cdwza34.mongodb.net/',
    dbName: 'mbs-dev'
    // Add other development-specific configuration here
  },
  production: {
    mongoURI: 'mongodb+srv://ranjalahynyantsa:c7jt3yoVjNP6vqq6@cluster0.cdwza34.mongodb.net/',
    dbName: 'mbs-prod'
    // Add other production-specific configuration here
  }
};

module.exports = config;
