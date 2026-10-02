import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? "nia";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoClient() {
  if (!uri) {
    return null;
  }

  if (!globalThis._mongoClientPromise) {
    globalThis._mongoClientPromise = new MongoClient(uri).connect().catch((error) => {
      // Don't cache a failed connection attempt — e.g. a transient DNS/network
      // error — or every request would keep failing with the same error
      // until the server process restarts, even after the underlying issue
      // (network, Atlas Network Access list, paused cluster, etc.) is fixed.
      globalThis._mongoClientPromise = undefined;
      throw error;
    });
  }

  return globalThis._mongoClientPromise;
}

export async function getMongoDatabase() {
  const client = await getMongoClient();

  if (!client) {
    return null;
  }

  return client.db(dbName);
}

export default getMongoClient;
