const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connection");

// POST route to send connection request
router.post("/requested/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const status = req.params.status;
    const toUserId = req.params.toUserId;

    // Validate the toUserId format (if invalid, return early)
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({ message: "Invalid UserId format" });
    }
    
   // Check if the user to whom the request is being sent exists
   const toUser = await User.findById(toUserId);
   if (!toUser) {
     return res.status(404).json({ message: "User not found!" });
   }
   
    // Validate the allowed status values
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Status ${status} is not allowed` });
    }


    // Check if a connection request already exists between the users
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({ message: "Connection request already exists!" });
    }

    // Create a new connection request
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    // Save the new connection request
    const data = await connectionRequest.save();
    return res.status(200).json({
      message:
        req.user.firstName +
        " connection request successfully sent to " +
        toUser.firstName,
      connection: data,
    });
  } catch (error) {
    // Catch any other errors and return a generic error message
    return res.status(500).json({ message: "ERROR: " + error.message });
  }
});

module.exports = router;
