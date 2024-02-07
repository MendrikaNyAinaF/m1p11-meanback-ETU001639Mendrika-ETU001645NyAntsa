// Import the MongoDB connection
const db = require('./database');

// find all from a collection
const findAll = (collection) => {
    return db.collection(collection).find()
}

exports.crud ={
    findAll
}