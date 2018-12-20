"use strict";

const config = require("config");
const plugin = require("fastify-plugin");

async function settings(fastify, opts, next) {
  const configuration = {
    storage: config.get("storage"),
    jwt: config.get("jwt"),
    app: config.get("app")
  };

  fastify.decorate("settings", configuration);

  next();
}

module.exports = plugin(settings);
