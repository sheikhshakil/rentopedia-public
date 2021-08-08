const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const setLocals = require("./setLocals");

const middlewares = [
  express.static("public"),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 604800000,
    },
  }),
  setLocals(),
];

module.exports = (app) => {
  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
};
