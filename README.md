[![pipeline status](https://gitlab.com/thomasyuan/software-developer-coding-challenge/badges/master/pipeline.svg)](https://gitlab.com/thomasyuan/software-developer-coding-challenge/commits/master)
[![coverage report](https://gitlab.com/thomasyuan/software-developer-coding-challenge/badges/master/coverage.svg)](https://gitlab.com/thomasyuan/software-developer-coding-challenge/commits/master)

## Code Structure

```
/api            The API specification, by OPEN API 3.0
/config         App configuration, you can overwrite some of them by provide an environment variable.
/docker         Dockerfile for app and document, and docker-compose for quick running.
/migrations     Database schema, app support auto migration.
/test:          Test code, using mocha, chai and supertest.
/src:
  /controller   Handle http request
  /plugin       Fastify plugins for authentication, setting and storage injection.
  /schema       Input/output validation using JSON-Schema.
  /service      Business logic.
  /storage      Where does data go, could be memory or database.
  /util         Utils, right now, only one for http error.
```

## Features

- Storage configable, without touching code or docker image.
- Test code, coverage over 90%.
- Database migration, powered by [knex](https://knexjs.org/).
- Multiple database support, powered by [knex](https://knexjs.org/).
- Stateless Authentication using [JWT](https://jwt.io/).
- Input/output validation, powered by [JSON-Schema](https://json-schema.org/).
- Interactive API document, powered by [Swagger UI](https://swagger.io/tools/swagger-ui/)

## Run

#### 1. docker-compose

`cd docker && docker-compose up`

It will start 3 docker containers: postgresql, app and document.
You can open brower http://localhost:8080 to check out the document and try the API.

#### 2. from source code

```
npm install
npm start
```

By default, it will use sqlit3 as database for development. You can even use memory as storage if you want by `STORAGE_TYPE=memory npm start`.

> Check out `config/custom-environment-variables.json` for all environment variable you can use.

You can also change the setting in `config/default.json` without provide environment variable everytime.

#### 3. other commands

- `npm run lint` run eslint on code, check out the rules in .eslintrc.json.
- `npm run prettylint` run prettylint on source code, for code format.
- `npm test` testing app. (try `STORAGE_TYPE=memory npm test`, it's faster! :) )

# Software Developer Coding Challenge

This is a coding challenge for software developer applicants applying through http://work.traderev.com/

## Goal:

#### You have been tasked with building a simple online car auction system which will allow users to bid on cars for sale and with the following funcitionalies:

- [x] Fork this repo. Keep it public until we have been able to review it.
- [x] A simple auction bidding system
- [x] Record a user's bid on a car
- [x] Get the current winning bid for a car
- [x] Get a car's bidding history

### Bonus:

- [x] Unit Tests on the above functions
- [ ] Develop a UI on web or mobile or CLI to showcase the above functionality

## Evaluation:

- [ ] Solution compiles. Provide a README to run/build the project and explain anything that you leave aside
- [ ] No crashes, bugs, compiler warnings
- [ ] App operates as intended
- [ ] Conforms to SOLID principles
- [ ] Code is easily understood and communicative
- [ ] Commit history is consistent, easy to follow and understand
