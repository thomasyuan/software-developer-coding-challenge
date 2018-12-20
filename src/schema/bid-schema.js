"use strict";

module.exports.meBids = {
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" }
    },
    required: ["Authorization"]
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          vehicle_id: { type: "number" },
          vehicle_name: { type: "string" },
          bid_time: { type: "string" },
          bid_price: { type: "number" }
        },
        required: ["id", "vehicle_id", "vehicle_name", "bid_time", "bid_price"]
      }
    }
  }
};
