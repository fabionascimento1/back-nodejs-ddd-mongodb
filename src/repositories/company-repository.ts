import { Prisma, User } from "@prisma/client";

export interface CompanyRepository {
  findByName(name: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  listCompaniesByUser(
    id: string,
    pageNumber: number,
    pageSize: number
  ): Promise<User | null>;
}
