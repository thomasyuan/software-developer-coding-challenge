"use strict";

const knex = require("../util/db-connection").knex;

class DatabaseStorage {
  async shutdown() {
    await knex.destroy();
  }
}

module.exports = DatabaseStorage;
