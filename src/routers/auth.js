const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/user");
const signUpValidate = require("../utils/signUpValidate");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    // validate signup data from client or user request
    signUpValidate(req);
    const { emailId, lastName, firstName, password, age } = req.body;

    // encrypt password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 8);
    // console.log(hashedPassword);

    const user = new User({
      emailId,
      lastName,
      firstName,
      age,
      password: hashedPassword,
    });
    await user.save();
    res.send("User successfully Added!");
  } catch (error) {
    res
      .status(500)
      .send("Unable to add user something went wrong! " + error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const client = await User.findOne({ emailId: emailId });

    if (!client) {
      throw new Error("Invalid crendentials");
    }
    const isPasswordValid = await client.getValidatePassword(password);
    if (isPasswordValid) {
      // Create JWt Token
      const token = await client.getJWT();
      // console.log(token);

      res.cookie("token", token);
      res.send("Succesfully login🙂");
    } else {
      throw new Error("Invalid crendentials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

router.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout succecfully");
});

module.exports = router;
