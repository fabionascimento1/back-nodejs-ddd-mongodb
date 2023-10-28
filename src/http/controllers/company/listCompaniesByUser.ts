import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { UserAlreadyExistsError } from "@/uses-cases/errors/user-dont-exists-error";
import { MongodbCompanyRepository } from "@/repositories/mongodb/mongodb-company-repository";

import { ListCompaniesUseCase } from "@/uses-cases/company/list-companies-use-case";

export async function listCompaniesByUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { user: id } = request.params;
  const { pageNumber, pageSize } = request.query;

  try {
    const companyRepository = new MongodbCompanyRepository();
    const listCompaniesUseCase = new ListCompaniesUseCase(companyRepository);

    const companies = await listCompaniesUseCase.execute({
      id,
      pageNumber,
      pageSize,
    });
    return reply.status(200).send(companies);
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
