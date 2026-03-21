const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');
let client;
let database;

const initDb = (callback) => {
  if (database) {
    console.warn('Trying to init DB again!');
    return callback(null, database);
  } else {
    MongoClient.connect(process.env.MONGODB_URL)
      .then((connectedClient) => {
        client = connectedClient;
        database = client.db();
        console.log('Connected to MongoDB');
        callback(null, database);
      })
      .catch((err) => {
        console.error('Database connection error:', err);
        callback(err);
      });
  }
};

const getDb = () => {
  if (!client) {
    throw Error('Database not initialized');
  }
  return client;
};

module.exports = {
  initDb,
  getDb
};