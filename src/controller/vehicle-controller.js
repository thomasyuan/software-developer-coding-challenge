"use strict";

const Schema = require("../schema/vehicle-schema");
const HttpError = require("../util/http-error");

function vehicles(fastify, ops, next) {
  const VehiclesService = require("../service/vehicle-service");
  const vehicleService = new VehiclesService(fastify.storage);

  const vehiclesPostOpt = {
    schema: Schema.vehiclesPost,
    preValidation: fastify.jwtVerification
  };

  fastify.post("/vehicles", vehiclesPostOpt, async (req, reply) => {
    fastify.log.trace(req.header);
    fastify.log.trace(req.body);

    try {
      const vehicle = Object.assign(req.body);
      vehicle.account_id = req.user.id;
      await vehicleService.addVehicle(vehicle);
      reply.code(200).send();
    } catch (e) {
      throw HttpError.BadRequest(e);
    }
  });

  const vehiclesGetOpt = {
    schema: Schema.vehiclesGet
  };

  fastify.get("/vehicles", vehiclesGetOpt, async req => {
    fastify.log.trace(req.query);

    try {
      return vehicleService.getVehicles(Object.assign(req.query));
    } catch (e) {
      throw HttpError.BadRequest(e);
    }
  });

  const meVehiclesGetOpt = {
    schema: Schema.meVehicles,
    preValidation: fastify.jwtVerification
  };

  fastify.get("/me/vehicles", meVehiclesGetOpt, async req => {
    fastify.log.trace(req.head);

    try {
      return vehicleService.getUserVehicles(req.user.id);
    } catch (e) {
      throw HttpError.BadRequest(e);
    }
  });

  next();
}

module.exports = vehicles;
