const express = require("express");

const app = express();



// This will match the http method get API calls to /user
app.get("/user", (req, res) => {
  res.send({firstName: "Stephen", lastName: "Jaramillo", userId: Date.now()});
});

app.post("/user", (req, res) => {
  console.log("Successfully save to database")
  res.send("Successfully save to DB");
});

app.delete("/user", (req, res) => {
  console.log("Successfully Delete database")
  res.send("Successfully Delete to DB");
});


// This will match all the http method API calls to /user
// app.use("/", (req, res) => {
//   res.send("Hello from Dashboard");
// });

app.listen(5000, () => {
  console.log("Server is successfully listening at port: 5000 ");
});
