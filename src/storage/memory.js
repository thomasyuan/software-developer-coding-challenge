"use strict";

const accounts = new Map();

class MemoryStorage {
  async addAccount(account) {
    if (accounts.has(account.id)) {
      throw new Error(`Account id ${account.id} is taken.`);
    }
    accounts.set(account.id, account);
  }

  async getAccount(id) {
    return accounts.get(id);
  }

  async hasAccount(id) {
    return accounts.has(id);
  }

  async updateAccount(id, account) {
    const exist = accounts.get(id);
    if (!exist) {
      throw new Error(`Account ${id} does not exist.`);
    }

    for (const k in account) {
      exist[k] = account[k];
    }
  }

  async shutdown() {}
}

module.exports = MemoryStorage;
