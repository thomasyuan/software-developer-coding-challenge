"use strict";

const Fastify = require("fastify");
const config = require("config");
const cors = require("cors");
const settings = require("./src/plugin/settings");
const storageInjector = require("./src/plugin/storage-injector");
const authentication = require("./src/plugin/authentication");
const account = require("./src/controller/account-controller");
const bid = require("./src/controller/bid-controller");
const vehicle = require("./src/controller/vehicle-controller");

function loadSetting() {
  const logSettings = config.get("log");
  if (logSettings.enable === "true") {
    return {
      logger: {
        level: logSettings.level
      }
    };
  }
  return {};
}

function buildFastify() {
  const setting = loadSetting();
  const fastify = Fastify(setting);

  fastify.use(cors());
  fastify.register(settings);
  fastify.register(storageInjector);
  fastify.register(authentication);
  fastify.register(account);
  fastify.register(bid);
  fastify.register(vehicle);

  return fastify;
}

module.exports = buildFastify;
