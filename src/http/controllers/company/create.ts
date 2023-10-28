import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { UserAlreadyExistsError } from "@/uses-cases/errors/user-dont-exists-error";
import { MongodbCompanyRepository } from "@/repositories/mongodb/mongodb-company-repository";
import { CreateCompanyUseCase } from "@/uses-cases/company/create-company-use-case";
import { ObjectId } from "mongodb";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    user: z.string(),
    name: z.string(),
    street: z.string(),
    region: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    city: z.string(),
    coutry: z.string(),
    postalcode: z.string(),
    floor: z.array(z.string()).nonempty(),
    active: z.boolean().optional().default(true),
  });

  const {
    user,
    name,
    street,
    region,
    number,
    complement,
    city,
    coutry,
    postalcode,
    floor,
    active,
  } = registerBodySchema.parse(request.body);

  try {
    const companyRepository = new MongodbCompanyRepository();
    const registerUseCase = new CreateCompanyUseCase(companyRepository);

    await registerUseCase.execute({
      user: new ObjectId(user),
      name,
      street,
      region,
      number,
      complement,
      city,
      coutry,
      postalcode,
      floor,
      active,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
