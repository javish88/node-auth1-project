const express = require("express");
const sessions = require("express-session");
const KnexSessionStore = require("connect-session-knex")(sessions);

const apiRouter = require("./api-router.js");
const knex = require("../database/dbConfig");
const configureMiddleware = require("./configure-middleware.js");

const server = express();

const sessionConfiguration = {
  name: "secret cookie",
  secret: "keep it secret, keep it safe!",
  saveUninitialized: true,
  resave: false,

  store: new KnexSessionStore({
    knex,
    tablename: "sessions",
    createtable: true
  }),

  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: true
  }
};

configureMiddleware(server);
server.use(sessions(sessionConfiguration));

server.use("/api", apiRouter);

module.exports = server;
