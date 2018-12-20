"use strict";

const supertest = require("supertest");
const { expect } = require("chai");
const fastify = require("./bootstrap");

describe("Test Vehicle", function() {
  let token;

  describe("POST /vehicles", function() {
    it("should return 401 without token", function(done) {
      supertest(fastify.server)
        .post("/vehicles")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          id: "johnsmith",
          name: "John Smith",
          email: "John.Smith@gmail.com",
          password: "secret"
        })
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
            .post("/vehicles")
            .set("Authorization", `Bearer ${token}`)
            .send({
              brand: "BMW",
              model: "X5",
              year: 2017,
              odometer: 12000,
              color: "black"
            })
            .end(function(err, res) {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.an("object");
              done();
            });
        });
    });
  });
});
