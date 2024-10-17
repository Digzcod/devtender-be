const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const validateEditFields = require("../utils/validateEditFields");
const newPassValidate = require("../utils/passwordChangeValidate");
const bcrypt = require("bcrypt");

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send("Reading cookies😚 " + req?.user);
  } catch (error) {
    res
      .status(500)
      .send("Please check you authorization level " + error.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // res.send("Reading cookies😚 " + req?.user);
    if (!validateEditFields(req)) {
      throw new Error("Invalid Edit request");
    }
    const loggedInUser = req.user;
    // console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    // console.log(loggedInUser);
    await loggedInUser.save();
    res.status(201).json({
      message: loggedInUser.firstName + " Successfully edit",
      users: loggedInUser,
    });
  } catch (error) {
    res.status(500).send("ERROR " + error.message);
  }
});

router.patch("/profile/change-password", userAuth, async (req, res) => {
  try {
    newPassValidate(req);
    const { newPassword } = req.body;
    const loggedInUser = req.user; // Get the authenticated user

    const newPassHash = await bcrypt.hash(newPassword, 8);
    loggedInUser.password = newPassHash;
    await loggedInUser.save();

    res
      .status(200)
      .json({
        message: loggedInUser.firstName + " password successfully updated",
        data: loggedInUser.password,
      });
  } catch (error) {
    res.status(401).json({ message: "ERROR: " + error.message });
  }
});



module.exports = router;
