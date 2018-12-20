"use strict";

const Schema = require("../schema/account-schema");
const HttpError = require("../util/http-error");

function accounts(fastify, ops, next) {
  const AccountService = require("../service/account-service");
  const accountService = new AccountService(fastify.storage);

  const accountsPostOpt = {
    schema: Schema.accountsPost
  };

  fastify.post("/accounts", accountsPostOpt, async req => {
    fastify.log.trace(req.body);

    try {
      await accountService.createAccount(Object.assign(req.body));
      const payload = {
        exp: Math.floor(Date.now() / 1000) + fastify.settings.jwt.lifetime,
        id: req.body.id
      };

      const token = await fastify.jwt.sign(payload);
      return { token: token };
    } catch (e) {
      throw HttpError.BadRequest(e.message);
    }
  });

  const accountsIdHeadOpt = {
    schema: Schema.accountsIdHead
  };

  fastify.head("/accounts/:id", accountsIdHeadOpt, async req => {
    fastify.log.trace(req.params);

    const exists = await accountService.hasAccount(req.params.id);
    if (exists) {
      return true;
    }

    throw HttpError.NotFound();
  });

  const meGetOpt = {
    schema: Schema.meGet,
    preValidation: fastify.jwtVerification
  };

  fastify.get("/me", meGetOpt, async req => {
    fastify.log.trace(req.head);

    const account = await accountService.getAccount(req.user.id);
    if (account) {
      return account;
    }
    throw HttpError.NotFound();
  });

  const mePatchOpt = {
    schema: Schema.mePatch,
    preValidation: fastify.jwtVerification
  };

  fastify.patch("/me", mePatchOpt, async (req, reply) => {
    fastify.log.trace(req.head);
    fastify.log.trace(req.body);

    // empty object
    if (Object.values(req.body).length === 0) {
      throw HttpError.BadRequest("invalid input");
    }

    try {
      await accountService.updateAccount(req.user.id, Object.assign(req.body));
      reply.code(200).send();
    } catch (e) {
      throw HttpError.BadRequest(e);
    }
  });

  const loginOpt = {
    schema: Schema.login
  };

  fastify.post("/login", loginOpt, async req => {
    fastify.log.trace(req.body);

    const passed = await accountService.verifyPassword(
      req.body.id,
      req.body.password
    );

    if (!passed) {
      throw HttpError.BadRequest("invalid username and password");
    }

    const payload = {
      exp: Math.floor(Date.now() / 1000) + fastify.settings.jwt.lifetime,
      id: req.body.id
    };

    const token = await fastify.jwt.sign(payload);
    return { token: token };
  });

  next();
}

module.exports = accounts;
