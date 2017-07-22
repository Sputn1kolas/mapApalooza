"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get("/", (req,res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        // res.json(results);
        res.render('users', {heading: "List of users", users: results});
      });

  });

  return router;
}