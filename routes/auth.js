const express = require("express");
const Joi = require("joi");
const { User } = require("../model/users");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/", async (req, res) => {
  //validates user input

  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  }
  //validate system
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).send("Invalid Email");
    return;
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(400).send("Invalid Password");
    return;
  }

  //process
  const token = jwt.sign({ _id: user._id, biz: user.biz }, process.env.JWT_KEY);

  //response

  res.send({
    token,
  });
});

function validate(obj) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(obj);
}

module.exports = router;
