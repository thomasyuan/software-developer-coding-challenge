"use strict";

const fastify = require("../server")();

before(async function() {
  await fastify.ready();
});

after(async function() {
  await fastify.storage.shutdown();
  await fastify.close();
});

module.exports = fastify;
