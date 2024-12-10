const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connection");
const User = require("../models/user");

router.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");

    const fromUserIdData = connectionRequest.map(
      (fromUserId) => fromUserId.fromUserId
    );

    res.status(200).json({
      message: "Successfully fetch all the data which status is interested ",
      fromUserIdData,
      // connectionRequest
    });
  } catch (error) {
    throw new Error("ERROR: " + error.message);
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser?._id, status: "accepted" },
        { toUserId: loggedInUser?._id, status: "accepted" },
      ],
    })
      .populate("toUserId", "firstName lastName aboutMe")
      .populate("fromUserId", "firstName lastName aboutMe");

    const connectedPeople = connectionRequest.map((row) => {
      if (row.fromUserId.toString() === row.toUserId.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message: "You are connected to these people",
      // connectionRequest,
      connectedPeople,
    });
  } catch (error) {
    throw new Error("ERROR: " + error.message);
  }
});

router.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 0;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser?._id }, { toUserId: loggedInUser?._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString()),
        hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser?._id } },
      ],
    })
      .select("_id firstName lastName aboutMe")
      .skip(skip)
      .limit(limit);

    res
      .status(200)
      .json({ message: "Succesfully getData feed", feedsData: users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
