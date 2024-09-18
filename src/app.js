const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Dashboard");
});

app.get("/test", (req, res) => {
  res.send("Test test");
});

app.get("/users", (req, res) => {
  res.send("Users users");
});

app.listen(5000, () => {
  console.log("Server is successfully listening at port: 5000 ");
});
