"use strict";

class Account {
  constructor(storage) {
    this.storage = storage;
  }

  async createAccount(account) {
    await this.storage.addAccount(account);
  }

  async hasAccount(id) {
    return await this.storage.hasAccount(id);
  }

  async getAccount(id) {
    return await this.storage.getAccount(id);
  }

  async updateAccount(id, account) {
    await this.storage.updateAccount(id, account);
  }
}

module.exports = Account;
