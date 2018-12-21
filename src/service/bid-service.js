"use strict";

class Account {
  constructor(storage) {
    this.storage = storage;
  }

  async createBid(uid, bid) {
    const vehicle = await this.storage.getVehicle(bid.vehicle_id);
    if (!vehicle) {
      throw new Error(`vehicle ${bid.vehicle_id} does not exist.`);
    }

    // Can't bid self's vehicle
    if (vehicle.owner_id === uid) {
      throw new Error("can't bid yourself's vehicle.");
    }

    // If price is not greater than before, invalid bid.
    const winner = await this.getVehicleBidWinner(bid.vehicle_id);
    if (winner && winner.price >= bid.price) {
      throw new Error("invalid bid, price is not greater than current bid.");
    }

    if (winner && winner.account_id === uid) {
      throw new Error("need't beat yourself.");
    }

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
