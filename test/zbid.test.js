"use strict";

const supertest = require("supertest");
const { expect } = require("chai");
const fastify = require("./bootstrap");

describe("Test Bid", function() {
  let token;
  let anotherToken;

  describe("POST /bids", function() {
    it("should return 401 without token", function(done) {
      supertest(fastify.server)
        .post("/bids")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("should return 200 with jwt", function(done) {
      supertest(fastify.server)
        .post("/accounts")
        .send({
          id: "kevin",
          name: "Kevin",
          email: "kevin@gmail.com",
          password: "secret"
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.key("token");
          anotherToken = res.body.token;

          supertest(fastify.server)
            .post("/bids")
            .set("Authorization", `Bearer ${anotherToken}`)
            .send({
              vehicle_id: 1,
              price: 12300
            })
            .end(function(err, res) {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.an("object");
              done();
            });
        });
    });

    it("should return 400 with jwt, but user is the owner", function(done) {
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
          token = res.body.token;

          supertest(fastify.server)
            .post("/bids")
            .set("Authorization", `Bearer ${token}`)
            .send({
              vehicle_id: 1,
              price: 12300
            })
            .end(function(err, res) {
              expect(res.statusCode).to.equal(400);
              expect(res.body).to.be.an("object");
              expect(res.body.message).to.be.equal(
                "Error: can't bid yourself's vehicle."
              );
              done();
            });
        });
    });

    it("should return 400 without body", function(done) {
      supertest(fastify.server)
        .post("/bids")
        .set("Authorization", `Bearer ${anotherToken}`)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("should return 400 without price", function(done) {
      supertest(fastify.server)
        .post("/bids")
        .set("Authorization", `Bearer ${anotherToken}`)
        .send({
          vehicle_id: 1
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("should return 400 with incorrect vehicle_id", function(done) {
      supertest(fastify.server)
        .post("/bids")
        .set("Authorization", `Bearer ${anotherToken}`)
        .send({
          vehicle_id: 10,
          price: 13000
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal(
            "Error: vehicle 10 does not exist."
          );
          done();
        });
    });

    it("should return 400 with lower price", function(done) {
      supertest(fastify.server)
        .post("/bids")
        .set("Authorization", `Bearer ${anotherToken}`)
        .send({
          vehicle_id: 1,
          price: 11000
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal(
            "Error: invalid bid, price is not greater than current bid."
          );
          done();
        });
    });

    it("should return 400 with higher price but user is already the winner", function(done) {
      supertest(fastify.server)
        .post("/bids")
        .set("Authorization", `Bearer ${anotherToken}`)
        .send({
          vehicle_id: 1,
          price: 15000
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal("Error: need't beat yourself.");
          done();
        });
    });
  });

  describe("GET /vehicles/:id/bids", function() {
    it("should return empty array with non-exist vehicle id", function(done) {
      supertest(fastify.server)
        .get("/vehicles/100/bids")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.equal(0);
          done();
        });
    });

    it("should return array of one bid with vehicle id 1", function(done) {
      supertest(fastify.server)
        .get("/vehicles/1/bids")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.equal(1);
          expect(res.body[0].account_id).to.equal("kevin");
          done();
        });
    });
  });

  describe("GET /vehicles/:id/winner", function() {
    it("should return 400 with non-exist vehicle id", function(done) {
      supertest(fastify.server)
        .get("/vehicles/100/winner")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body.message).to.equal("vehicle 100 does not exist.");
          done();
        });
    });

    it("should return winner with vehicle id 1", function(done) {
      supertest(fastify.server)
        .get("/vehicles/1/winner")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("object");
          done();
        });
    });
  });

  describe("GET /me/bids", function() {
    it("should return 401 without token", function(done) {
      supertest(fastify.server)
        .get("/me/bids")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it("should return empyt array with john's jwt", function(done) {
      supertest(fastify.server)
        .get("/me/bids")
        .set("Authorization", `Bearer ${token}`)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.equal(0);
          done();
        });
    });

    it("should return array of one bid with kevin's jwt", function(done) {
      supertest(fastify.server)
        .get("/me/bids")
        .set("Authorization", `Bearer ${anotherToken}`)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.equal(1);
          expect(res.body[0].vehicle_name).to.equal("2017 BMW X5");
          done();
        });
    });
  });
});
