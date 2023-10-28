import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { create } from "./create";
import { listCompaniesByUser } from "./listCompaniesByUser";

export async function appCompanyRoutes(app: FastifyInstance) {
  app.post("/company", { onRequest: [verifyJwt] }, create);
  app.get("/company/:user", { onRequest: [verifyJwt] }, listCompaniesByUser);
}
