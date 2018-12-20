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

  async verifyPassword(id, password) {
    const account = await this.storage.getAccount(id);
    if (account && account.password === password) {
      return true;
    }

    return false;
  }
}

module.exports = Account;
