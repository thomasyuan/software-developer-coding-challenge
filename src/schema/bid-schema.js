"use strict";

module.exports.bids = {
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" }
    },
    required: ["Authorization"]
  },

  body: {
    type: "object",
    properties: {
      vehicle_id: { type: "number" },
      price: { type: "number" }
    },
    required: ["vehicle_id", "price"],
    additionalProperties: false
  }
};

module.exports.vehicleBids = {
  params: {
    type: "object",
    properties: {
      id: { type: "number" }
    },
    required: ["id"]
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          account_id: { type: "string" },
          account_name: { type: "string" },
          time: { type: "string" },
          price: { type: "number" }
        },
        required: ["id", "account_id", "account_name", "time", "price"]
      }
    }
  }
};

module.exports.vehicleBidWinner = {
  params: {
    type: "object",
    properties: {
      id: { type: "number" }
    },
    required: ["id"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "number" },
        account_id: { type: "string" },
        account_name: { type: "string" },
        time: { type: "string" },
        price: { type: "number" }
      },
      required: ["id", "account_id", "account_name", "time", "price"]
    }
  }
};

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
          time: { type: "string" },
          price: { type: "number" }
        },
        required: ["id", "vehicle_id", "vehicle_name", "time", "price"]
      }
    }
  }
};
