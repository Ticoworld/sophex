import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const uri: string = process.env.MONGODB_URI!; // Non‑nullable after check
const options = {};

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Augment globalThis with a typed property for the cached promise
/* eslint-disable no-var */
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
/* eslint-enable no-var */

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Initialize Mongoose connection
let mongooseConnection: typeof mongoose | null = null;

async function connectMongoose(): Promise<typeof mongoose> {
  if (mongooseConnection) return mongooseConnection;

  try {
    mongooseConnection = await mongoose.connect(uri, {
      dbName: 'sophex',
      bufferCommands: false,
    });

    // Load models using dynamic import (or use top-level side‑effect imports if preferred)
    await Promise.all([
      import('@/models/User'),
      import('@/models/WhitelistWinner'),
    ]);

    console.log('Mongoose connected successfully');
    return mongooseConnection;
  } catch (error) {
    console.error('Mongoose connection error:', error);
    throw error;
  }
}

export { clientPromise, connectMongoose };