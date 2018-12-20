"use strict";

const Schema = require("../schema/bid-schema");
const HttpError = require("../util/http-error");

function bids(fastify, ops, next) {
  const BidService = require("../service/bid-service");
  const bidService = new BidService(fastify.storage);

  const meBidsOpt = {
    schema: Schema.meBids,
    preValidation: fastify.jwtVerification
  };

  fastify.get("/me/bids", meBidsOpt, async req => {
    fastify.log.trace(req.head);

    try {
      return bidService.getUserBids(req.user.id);
    } catch (e) {
      throw HttpError.BadRequest(e);
    }
  });

  next();
}

module.exports = bids;
