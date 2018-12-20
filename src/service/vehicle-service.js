"use strict";

class Account {
  constructor(storage) {
    this.storage = storage;
  }

  async addVehicle(vehicle) {
    await this.storage.addVehicle(vehicle);
  }

  async getVehicles(filter) {
    return await this.storage.getVehicles(filter);
  }

  async getUserVehicles(uid) {
    return await this.storage.getVehicles({ account_id: uid });
  }
}

module.exports = Account;
