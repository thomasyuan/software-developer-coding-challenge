"use strict";

class Account {
  constructor(storage) {
    this.storage = storage;
  }

  async getUserBids(uid) {
    return await this.storage.getBids({ account_id: uid });
  }
}

module.exports = Account;
