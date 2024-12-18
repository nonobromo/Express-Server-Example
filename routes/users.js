const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const _ = require("lodash");
const { User, validateUser } = require("../model/users");
const authMW = require("../middleware/auth");

router.get("/me", authMW, async (req, res) => {
  res.json(await User.findById(req.user._id, { password: 0 }));
});

router.get("/", async (req, res) => {
  // validate user input
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // validate system
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("User already registered.");
    return;
  }

  // process
  user = await new User(req.body);
  user.password = await bcrypt.hash(user.password, 12);

  await user.save();

  // response
  res.json(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
