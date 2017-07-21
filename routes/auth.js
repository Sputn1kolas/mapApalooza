const express = require('express');
const router = express.Router();

const authHelpers = require('../auth_helpers');

const passport = require('../auth/local');

router.post('/register', (req, res, next) => {
  return authHelpers.createUser(req, res)
} )