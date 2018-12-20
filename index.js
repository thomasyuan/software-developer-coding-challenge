"use strict";

const config = require("config");
const fastify = require("./server")();

const port = config.get("app.port");
const host = config.get("app.host");

fastify.listen(port, host, async function(err, address) {
  if (err) {
    fastify.log.fatal(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${address}`);
});
