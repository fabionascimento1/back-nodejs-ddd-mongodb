import { FastifyInstance } from "fastify";
import { authenticate } from "./auth-singin";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { register } from "./register";
import { refresh } from "./refresh";
import { profile } from "./profile";

export async function appUserRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.patch("/token/refresh", refresh);

  /** Authenticated */
  app.get("/me", { onRequest: [verifyJwt] }, profile);
}
