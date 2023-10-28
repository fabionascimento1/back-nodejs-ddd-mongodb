import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { MongodbUserRepository } from "@/repositories/mongodb/mongodb-users-repository";
import { AuthenticateUseCase } from "@/uses-cases/user/authenticate-use-case";
import { InvalidCredentialsError } from "@/uses-cases/errors/invalid-credentials-error";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = registerBodySchema.parse(request.body);

  try {
    const userRepository = new MongodbUserRepository();
    const authenticateUseCase = new AuthenticateUseCase(userRepository);

    const { user } = await authenticateUseCase.signin({
      email,
      password,
    });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user._id.toString(),
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user._id.toString(),
          expiresIn: "7d",
        },
      }
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
