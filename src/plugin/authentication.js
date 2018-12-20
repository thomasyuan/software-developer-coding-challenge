"use strict";

const jwt = require("fastify-jwt");
const plugin = require("fastify-plugin");

async function authentication(fastify, opts, next) {
  fastify.register(jwt, { secret: fastify.settings.jwt.signing_key });

  fastify.decorate("jwtVerification", async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(403).send(err);
    }
  });

  next();
}

module.exports = plugin(authentication);
