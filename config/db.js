// require mongoose here
const mongoose = require('mongoose');

// connect to db
const connectDB = async () => {
  // mongoose.connect() -> Promise - to resolve Promise, use 'await'
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log('MongoDb Connected to ' + conn.connection.host);
};

// export the
module.exports = connectDB;
