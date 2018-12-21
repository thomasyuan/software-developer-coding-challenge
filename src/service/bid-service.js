"use strict";

class Account {
  constructor(storage) {
    this.storage = storage;
  }

  async createBid(uid, bid) {
    bid.account_id = uid;
    bid.time = new Date().toLocaleString();
    await this.storage.addBid(bid);
  }

  async getVehicleBids(vid) {
    const bids = await this.storage.getBids({ vehicle_id: vid });
    for (let index = 0; index < bids.length; ++index) {
      const a = await this.storage.getAccount(bids[index].account_id);
      bids[index].account_name = a.name;
    }

    return bids;
  }

  async getVehicleBidWinner(vid) {
    return await this.storage.getVehicleBidWinner(vid);
  }

  async getUserBids(uid) {
    const bids = await this.storage.getBids({ account_id: uid });
    for (let index = 0; index < bids.length; ++index) {
      const v = await this.storage.getVehicle(bids[index].vehicle_id);
      bids[index].vehicle_name = `${v.year} ${v.brand} ${v.model}`;
    }

    return bids;
  }
}

module.exports = Account;
