"use strict";
const config = require("config");
const Knex = require("knex");

const dbConfig = config.get("storage.db");
const knex = new Knex({
  client: "pg",
  connection: {
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port,
    host: dbConfig.host,
    password: dbConfig.password
  },
  debug: dbConfig.debug === "true",
  pool: {
    min: dbConfig.min_conn,
    max: dbConfig.max_conn
  }
});

async function initializeDatabase() {}

module.exports.initialize = initializeDatabase;
module.exports.knex = knex;
