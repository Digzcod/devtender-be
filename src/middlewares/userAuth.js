const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      // throw new Error("Token is not valid !!!!");
      return res.status(401).send("Unathorized please login")
    }

    const decodedObj = await jwt.verify(token, "DevTender@Digz2024^");
    // console.log(decodedObj);

    const userId = decodedObj?._id;
    // console.log(userId);
    const user = await User.findById(userId);
    // console.log(user);
    if( !user) {
      throw new Error("User not found")
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("ERROR: Please authenticate " + error.message);
  }
};

module.exports = userAuth;
