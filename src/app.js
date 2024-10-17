const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const auth = require("./routers/auth")
const profile = require("./routers/profile")
const request= require("./routers/request")


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", auth)
app.use("/", profile)
app.use("/", request)

app.use("/", (req, res) => {
  res.send("Welcome to port 5000");
});

connectDB()
  .then(() => {
    console.log("Connected successfully to Database");
    app.listen(5000, () => {
      console.log("Server is successfully listening at port: 5000 ");
    });
  })
  .catch((err) => {
    console.error(err, "Can't be connect to Database");
  });
