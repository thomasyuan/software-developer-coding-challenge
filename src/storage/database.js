"use strict";

const Knex = require("knex");
const config = require("./knexfile");

class DatabaseStorage {
  async initialize() {
    const env = process.env.NODE_ENV || "development";
    this.knex = new Knex(config[env]);
    await this.knex.migrate.latest([config]);
  }

  async addAccount(account) {
    try {
      await this.knex("account").insert(account);
    } catch (e) {
      throw new Error(`Account id ${account.id} is taken.`);
    }
  }

  async getAccount(id) {
    const accounts = await this.knex("account").where({ id: id });
    if (accounts.length === 1) {
      return accounts[0];
    }
  }

  async hasAccount(id) {
    const account = await this.getAccount(id);
    return account !== undefined;
  }

  async updateAccount(id, account) {
    const count = await this.knex("account")
      .where({ id: id })
      .update(account);
    if (count === 0) {
      throw new Error(`Account ${id} does not exist.`);
    }
  }

  async addVehicle(vehicle) {
    await this.knex("vehicle").insert(vehicle);
  }

  async getVehicle(vid) {
    const vehicles = await this.knex("vehicle").where({ id: vid });
    if (vehicles.length === 1) {
      return vehicles[0];
    }
  }

  async getVehicles(filter) {
    return this.knex("vehicle").where(filter);
  }

  async addBid(bid) {
    await this.knex("bid").insert(bid);
  }

  async getBids(filter) {
    return this.knex("bid").where(filter);
  }

  async getVehicleBidWinner(vid) {
    const v = await this.getVehicle(vid);
    if (!v) {
      throw new Error(`vehicle ${vid} does not exist.`);
    }

    const winner = await this.knex("bid")
      .where({ vehicle_id: vid })
      .orderBy("price", "desc")
      .limit(1);

    if (winner.length === 0) {
      return;
    }

    return winner[0];
  }

  async shutdown() {
    await this.knex.destroy();
  }
}

module.exports = DatabaseStorage;
