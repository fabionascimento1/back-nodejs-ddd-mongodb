import { User } from "@/uses-cases/authenticate-use-case";
import { UsersRepository } from "../users-repository";
import { mongodb } from "@/lib/mongdb";
import { BSON } from "mongodb";

export class MongodbUserRepository implements UsersRepository {
  async findByEmail(email: string): Promise<any> {
    const { database } = mongodb();
    const users = database.collection("users");
    const query = { email: email };
    const user = await users.findOne(query);
    return user;
  }
  async create(data: User): Promise<any> {
    const { database } = mongodb();
    const users = database.collection("users");
    const user = await users.insertOne(data);
    return { user };
  }

  async findById(id: string): Promise<User> {
    const { database } = mongodb();
    const users = database.collection("users");
    const nid = new BSON.ObjectId(id);
    const query = { _id: nid };
    const user = await users.findOne(query);
    return user;
  }
}
