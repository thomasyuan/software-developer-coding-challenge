"use strict";

const Schema = require("../schema/bid-schema");
const HttpError = require("../util/http-error");

function bids(fastify, ops, next) {
  const BidService = require("../service/bid-service");
  const bidService = new BidService(fastify.storage);

  const bidsPostOpt = {
    schema: Schema.bids,
    preValidation: fastify.jwtVerification
  };

  fastify.post("/bids", bidsPostOpt, async (req, reply) => {
    fastify.log.trace(req.header);
    fastify.log.trace(req.body);

    try {
      const bid = Object.assign(req.body);
      await bidService.createBid(req.user.id, bid);
      reply.code(200).send();
    } catch (e) {
      throw HttpError.BadRequest(e);
    }
  });

  const vehicleBidsGetOpt = {
    schema: Schema.vehicleBids
  };

  fastify.get("/vehicles/:id/bids", vehicleBidsGetOpt, async req => {
    fastify.log.trace(req.params);

    try {
      return await bidService.getVehicleBids(req.params.id);
    } catch (e) {
      throw HttpError.BadRequest(e);
    }
  });

  const vehicleBidWinnerGetOpt = {
    schema: Schema.vehicleBidWinner
  };

  fastify.get("/vehicles/:id/winner", vehicleBidWinnerGetOpt, async req => {
    fastify.log.trace(req.params);

    const winner = await bidService.getVehicleBidWinner(req.params.id);
    if (!winner) {
      throw HttpError.NotFound(`no bids for ${req.params.id}`);
    }

    return winner;
  });

  const meBidsOpt = {
    schema: Schema.meBids,
    preValidation: fastify.jwtVerification
  };

  fastify.get("/me/bids", meBidsOpt, async req => {
    fastify.log.trace(req.head);

    try {
      return await bidService.getUserBids(req.user.id);
    } catch (e) {
      throw HttpError.BadRequest(e);
    }
  });

  next();
}

module.exports = bids;
