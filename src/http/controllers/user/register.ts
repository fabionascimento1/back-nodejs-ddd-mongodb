import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { RegisterUseCase } from "@/uses-cases/user/register";

import { MongodbUserRepository } from "@/repositories/mongodb/mongodb-users-repository";
import { UserAlreadyExistsError } from "@/uses-cases/errors/user-dont-exists-error";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    type: z.string().optional(),
  });

  const { name, email, password, type } = registerBodySchema.parse(
    request.body
  );

  try {
    const userRepository = new MongodbUserRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    await registerUseCase.execute({
      name,
      email,
      password,
      type,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
