import { MongodbUserRepository } from "@/repositories/mongodb/mongodb-users-repository";
import { GetUserProfileUseCase } from "@/uses-cases/user/get-user-profile";
import { FastifyReply, FastifyRequest } from "fastify";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const userRepository = new MongodbUserRepository();
  const getUserProfile = new GetUserProfileUseCase(userRepository);

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
