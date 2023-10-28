import { User } from "@/uses-cases/user/authenticate-use-case";
import { mongodb } from "@/lib/mongdb";
import { BSON } from "mongodb";
import { CompanyRepository } from "../company-repository";

export class MongodbCompanyRepository implements CompanyRepository {
  async findByName(name: string): Promise<any> {
    const { database } = mongodb();
    const company = database.collection("company");
    const query = { name: name };
    const user = await company.findOne(query);
    return user;
  }
  async create(data: User): Promise<any> {
    const { database } = mongodb();
    const company = database.collection("company");
    const arena = await company.insertOne(data);
    return { arena };
  }
  /* 
  async update(data: User): Promise<any> {
    const { database } = mongodb();
    const company = database.collection("company");
    const arena = await company.updateOne(data);
    return { arena };
  } */

  async listCompaniesByUser(
    id: string,
    pageNumber: number,
    pageSize: number
  ): Promise<User> {
    const { database } = mongodb();
    const company = database.collection("company");
    const nid = new BSON.ObjectId(id);
    const query = { user: nid };

    const startIndex = (pageNumber - 1) * pageSize;
    const totalCount = await company.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize) - 1;

    const arena = await company
      .find(query)
      .skip(startIndex)
      .limit(parseInt(pageSize))
      .toArray();

    return {
      content: arena,
      current: pageNumber,
      pages: totalPages,
      total: totalCount - 1,
    };
  }
}
