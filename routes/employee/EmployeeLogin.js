const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Employee } = require("../../models/employee");

const route = express.Router();

route.post("/", async (req, res) => {
  try {
    // query

    const user = await Employee.findOne({
      Username: req.body.Username,
    });

    // Sending Response with status
    if (!user) return res.status(404).send("Invalid Username!");
    const authPassword = await bcrypt.compare(req.body.Password, user.Password);
    if (!authPassword) return res.status(404).send("Invalid Password!");

    const token = jwt.sign(
      { Username: user.Username, Role: user.Role },
      "x-auth-token"
    );

    // Setting Header
    res.header("x-auth-token", token);
    res.header("access-control-expose-header", "x-auth-token").send(token);
  } catch (ex) {
    console.log(ex.message);
  }
});

module.exports = route;
