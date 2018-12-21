"use strict";

const supertest = require("supertest");
const { expect } = require("chai");
const fastify = require("./bootstrap");

describe("Test Bid", function() {
  let token;

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
              vehicle_id: 0,
              price: 12300
            })
            .end(function(err, res) {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.an("object");
              done();
            });
        });
    });

    it("should return 400 without body", function(done) {
      supertest(fastify.server)
        .post("/bids")
        .set("Authorization", `Bearer ${token}`)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("should return 400 without price", function(done) {
      supertest(fastify.server)
        .post("/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({
          vehicle_id: 0
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("should return 400 with incorrect vehicle_id", function(done) {
      supertest(fastify.server)
        .post("/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({
          vehicle_id: 0,
          price: 12000
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an("object");
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

    it("should return array of one bid with vehicle id 0", function(done) {
      supertest(fastify.server)
        .get("/vehicles/0/bids")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.equal(1);
          expect(res.body[0].account_name).to.equal("Thomas");
          done();
        });
    });
  });

  describe("GET /vehicles/:id/winner", function() {
    it("should return 404 with non-exist vehicle id", function(done) {
      supertest(fastify.server)
        .get("/vehicles/100/winner")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });

    it("should return winner with vehicle id 0", function(done) {
      supertest(fastify.server)
        .get("/vehicles/0/winner")
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

    it("should return array of one bid with jwt", function(done) {
      supertest(fastify.server)
        .get("/me/bids")
        .set("Authorization", `Bearer ${token}`)
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
