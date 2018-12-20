"use strict";

module.exports.accountsPost = {
  body: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string" }
    },
    required: ["id", "name", "email", "password"]
  },

  response: {
    200: {
      type: "object",
      properties: {
        token: { type: "string" }
      },
      required: ["token"]
    }
  }
};

module.exports.accountsIdHead = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" }
    },
    required: ["id"]
  }
};

module.exports.meGet = {
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" }
    },
    required: ["Authorization"]
  },

  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        email: { type: "string" }
      },
      required: ["id", "name", "email"]
    }
  }
};

module.exports.mePatch = {
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
      name: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string" }
    },
    additionalProperties: false
  }
};
