"use strict";

const supertest = require("supertest");
const { expect } = require("chai");
const fastify = require("./bootstrap");

describe("Test Account", function() {
  let token;

  describe("POST /accounts", function() {
    it("should return token", function(done) {
      supertest(fastify.server)
        .post("/accounts")
        .send({
          id: "johnsmith",
          name: "John Smith",
          email: "John.Smith@gmail.com",
          password: "secret"
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.key("token");
          token = res.body.token;
          done();
        });
    });

    it("same account id shouldn't be accepted", function(done) {
      supertest(fastify.server)
        .post("/accounts")
        .send({
          id: "johnsmith",
          name: "John Smith",
          email: "John.Smith@gmail.com",
          password: "secret"
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal("Account id johnsmith is taken.");
          done();
        });
    });

    it("invalid input should return bad request", function(done) {
      supertest(fastify.server)
        .post("/accounts")
        .send({
          id: "johnsmith"
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("post without body should return bad request", function(done) {
      supertest(fastify.server)
        .post("/accounts")
        .set("Accept", "application/json")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });
  });

  describe("HEAD /accounts/:id", function() {
    it("should return 200 for exist account", function(done) {
      supertest(fastify.server)
        .head("/accounts/johnsmith")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it("should return 404 for non-exist account", function(done) {
      supertest(fastify.server)
        .head("/accounts/nobody")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  describe("GET /me", function() {
    it("should return 401 without jwt", function(done) {
      supertest(fastify.server)
        .get("/me")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it("should return 200 with jwt", function(done) {
      supertest(fastify.server)
        .get("/me")
        .set("Authorization", `Bearer ${token}`)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body.id).to.equal("johnsmith");
          expect(res.body.name).to.equal("John Smith");
          expect(res.body.email).to.equal("John.Smith@gmail.com");
          done();
        });
    });
  });

  describe("PATCH /me", function() {
    it("should return 401 without jwt", function(done) {
      supertest(fastify.server)
        .patch("/me")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it("should return 400 with jwt and invalid input", function(done) {
      supertest(fastify.server)
        .patch("/me")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstname: "Thomas"
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it("should return 200 with jwt, and account info should be changed", function(done) {
      supertest(fastify.server)
        .patch("/me")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Thomas"
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
        });

      // verify
      supertest(fastify.server)
        .get("/me")
        .set("Authorization", `Bearer ${token}`)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body.id).to.equal("johnsmith");
          expect(res.body.name).to.equal("Thomas");
          expect(res.body.email).to.equal("John.Smith@gmail.com");
          done();
        });
    });
  });

  describe("POST /login", function() {
    it("should return token with correct id and password", function(done) {
      supertest(fastify.server)
        .post("/login")
        .send({
          id: "johnsmith",
          password: "secret"
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.key("token");
          done();
        });
    });

    it("should return 400 with invalid data", function(done) {
      supertest(fastify.server)
        .post("/login")
        .send({
          name: "johnsmith",
          password: "secret2"
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("should return 400 with in-correct id and password", function(done) {
      supertest(fastify.server)
        .post("/login")
        .send({
          id: "johnsmith",
          password: "secret2"
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });
  });
});
