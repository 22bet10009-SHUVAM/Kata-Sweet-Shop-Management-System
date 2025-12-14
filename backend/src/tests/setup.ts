import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

/**
 * Setup - runs before all tests
 * Creates in-memory MongoDB instance for testing
 */
beforeAll(async () => {
  // Create in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
});

/**
 * Cleanup - runs after each test
 * Clears all collections to ensure test isolation
 */
afterEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

/**
 * Teardown - runs after all tests
 * Disconnects from database and stops the server
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
