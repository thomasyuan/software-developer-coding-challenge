"use strict";

const accounts = new Map();
const bids = new Map();
const vehicles = new Map();

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

    const updated = Object.assign(exist, account);
    accounts.set(id, updated);
  }

  filterMap(map, filter) {
    const results = [];
    for (const v of map.values()) {
      let match = true;
      for (const k in filter) {
        if (v[k] !== filter[k]) {
          match = false;
          break;
        }
      }

      if (match) {
        results.push(Object.assign(v));
      }
    }

    return results;
  }

  async addVehicle(vehicle) {
    const id = vehicles.size;
    vehicle.id = id;
    vehicles.set(id, vehicle);
  }

  async getVehicle(vid) {
    return vehicles.get(vid);
  }

  async getVehicles(filter) {
    return this.filterMap(vehicles, filter);
  }

  async addBid(bid) {
    const id = bids.size;
    bid.id = id;
    bids.set(id, bid);
  }

  async getBids(filter) {
    return this.filterMap(bids, filter);
  }

  async getVehicleBidWinner(vid) {
    if (!vehicles.has(vid)) {
      return;
    }

    const bids = await this.getBids({ vehicle_id: vid });
    if (bids.length === 0) {
      return;
    }

    const max = bids.reduce((prev, current) =>
      prev.price > current.price ? prev : current
    );
    return max;
  }

  async shutdown() {}
}

module.exports = MemoryStorage;
