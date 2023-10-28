import fastify from "fastify";
import { env } from "@/env";
import cors from "@fastify/cors";
import { ZodError } from "zod";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { appUserRoutes } from "./http/controllers/user/routes";
import { appCompanyRoutes } from "./http/controllers/company/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "1d",
  },
});

app.register(fastifyCookie);

app.register(appUserRoutes);
app.register(appCompanyRoutes);

app.register(cors, {
  origin: true,
  credentials: true,
});

/* next usar ....
const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
}) */
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
