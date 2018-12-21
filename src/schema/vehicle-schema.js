"use strict";

module.exports.vehiclesPost = {
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
      brand: { type: "string" },
      model: { type: "string" },
      year: { type: "number" },
      odometer: { type: "number" },
      color: { type: "string" }
    },
    required: ["brand", "model", "year", "odometer", "color"],
    additionalProperties: false
  }
};

module.exports.vehiclesGet = {
  querystring: {
    brand: { type: "string" }
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          brand: { type: "string" },
          model: { type: "string" },
          year: { type: "number" }
        },
        required: ["id", "brand", "model", "year"]
      }
    }
  }
};

module.exports.meVehicles = {
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
          brand: { type: "string" },
          model: { type: "string" },
          year: { type: "number" }
        },
        required: ["id", "brand", "model", "year"]
      }
    }
  }
};

module.exports.vehicle = {
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
        brand: { type: "string" },
        model: { type: "string" },
        year: { type: "number" },
        odometer: { type: "number" },
        color: { type: "string" }
      },
      required: ["id", "brand", "model", "year", "odometer", "color"]
    }
  }
};
