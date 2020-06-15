// require mongoose here
const mongoose = require('mongoose');
const { red, blue } = require('colors');

// connect to db
const connectDB = async () => {
  // mongoose.connect() -> Promise - to resolve Promise, use 'await'
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDb Connected to ' ${conn.connection.host}`.cyan.inverse);
};

// export the
module.exports = connectDB;
