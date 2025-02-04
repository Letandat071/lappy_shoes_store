import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shoe_store';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const globalWithMongoose = global as { mongoose: { conn: null | typeof mongoose; promise: null | Promise<typeof mongoose> } };

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (globalWithMongoose.mongoose.conn) {
    // console.log("Reusing existing MongoDB connection");
    return globalWithMongoose.mongoose.conn;
  }

  if (!globalWithMongoose.mongoose.promise) {
    // console.log("Creating new MongoDB connection...");
    const opts = {
      bufferCommands: true,
    };

    globalWithMongoose.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // console.log("MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
  } catch (e) {
    console.error("MongoDB connection error:", e);
    globalWithMongoose.mongoose.promise = null;
    throw e;
  }

  return globalWithMongoose.mongoose.conn;
}

export default connectDB; 