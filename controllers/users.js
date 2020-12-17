// Imports
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const models = require('../models')
const User = require("../models/User");

// GET api/users/test (Public)
router.get("/test", (req, res) => {
  res.json({ msg: "User endpoint OK!" });
});
// POST api/users/register (Public)
router.post("/register", (req, res) => {
    // find user by email
    User.findOne({ email: req.body.email }).then((user) => {
      // if email already exists send 400 response
      if (user) {
        return res.status(400).json({ msg: "Email already exists" });
      } else {
        const newUser = new models.User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        console.log(newUser);
        // salt and hash password
        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            // Change password to hash
            newUser.password = hash;
            newUser.save().then((createdUser) => {
              return res.json(createdUser);
            }).catch(err => console.log(err))
          });
        });
      }
    });
  });
module.exports = router;
