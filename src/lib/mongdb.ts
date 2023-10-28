import { env } from "@/env";

import { MongoClient } from "mongodb";

const connectionString = env.ATLAS_URI;
export const client = new MongoClient(connectionString);

export const mongodb = () => {
  const database = client.db("test");
  return { database };
};
