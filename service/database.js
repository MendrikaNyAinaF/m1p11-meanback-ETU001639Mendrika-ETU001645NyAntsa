// db.js

const mongoose = require('mongoose');

// MongoDB connection string. Replace 'your_database_url' with the actual URL of your MongoDB database.
const mongoDBUrl = 'mongodb+srv://ranjalahynyantsa:c7jt3yoVjNP6vqq6@cluster0.cdwza34.mongodb.net/';

// Connect to the MongoDB database using the connection string and the options object.
mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;