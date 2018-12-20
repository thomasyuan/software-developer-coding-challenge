"use strict";

const plugin = require("fastify-plugin");

/*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/
async function storageInjector(fastify, opts, next) {
  let Storage;
  switch (fastify.settings.storage.type) {
    case "memory":
      Storage = require("../storage/memory");
      break;

    case "database": {
      const db = require("../util/db-connection");
      await db.initialize();
      Storage = require("../storage/database");
      break;
    }
  }

  const storage = new Storage();
  fastify.decorate("storage", storage);

  next();
}

module.exports = plugin(storageInjector);
