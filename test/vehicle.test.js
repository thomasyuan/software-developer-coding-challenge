"use strict";

const supertest = require("supertest");
const { expect } = require("chai");
const fastify = require("./bootstrap");

describe("Test Vehicle", function() {
  let token;
  let vid;

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

  describe("GET /vehicles", function() {
    it("should return array with one vehicle", function(done) {
      supertest(fastify.server)
        .get("/vehicles")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send()
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.equal(1);
          expect(res.body[0].brand).to.equal("BMW");
          expect(res.body[0].year).to.equal(2017);
          expect(res.body[0].model).to.equal("X5");
          vid = res.body[0].id;
          done();
        });
    });

    it("should return array with query string brand=BMW", function(done) {
      supertest(fastify.server)
        .get("/vehicles?brand=BMW")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send()
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.equal(1);
          expect(res.body[0].brand).to.equal("BMW");
          expect(res.body[0].year).to.equal(2017);
          expect(res.body[0].model).to.equal("X5");
          done();
        });
    });

    it("should return empty with query string brand=Audi", function(done) {
      supertest(fastify.server)
        .get("/vehicles?brand=Audi")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send()
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.equal(0);
          done();
        });
    });
  });

  describe("GET /me/vehicles", function() {
    it("should return 401 without jwt", function(done) {
      supertest(fastify.server)
        .get("/me/vehicles")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send()
        .end(function(err, res) {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it("should return array with one vehicle", function(done) {
      supertest(fastify.server)
        .get("/me/vehicles")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send()
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.equal(1);
          expect(res.body[0].brand).to.equal("BMW");
          expect(res.body[0].year).to.equal(2017);
          expect(res.body[0].model).to.equal("X5");
          done();
        });
    });
  });

  describe("GET /vehicles/:id", function() {
    it("should return 404 with incorrect id", function(done) {
      supertest(fastify.server)
        .get(`/vehicles/${vid + 1}`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send()
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });

    it("should return one vehicle with correct id", function(done) {
      supertest(fastify.server)
        .get(`/vehicles/${vid}`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send()
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.id).to.equal(vid);
          expect(res.body.brand).to.equal("BMW");
          expect(res.body.year).to.equal(2017);
          expect(res.body.model).to.equal("X5");
          expect(res.body.color).to.equal("black");
          expect(res.body.odometer).to.equal(12000);
          done();
        });
    });
  });
});
