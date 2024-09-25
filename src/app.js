const express = require("express");
const connectDB = require("./config/database");
const { userAuth } = require("./middlewares/auth");

const User = require("./models/user");
const app = express();

app.use("/", userAuth);
app.use(express.json());
app.get("/feeds", async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).send({ data });
  } catch (err) {
    res.status(500).send("Bad request feeds", err.message);
  }
});

app.get("/users", async (req, res) => {
  const userEmail = req.body.emailId;
  const userId = req.body._id;
  try {
    const item = await User.findById(userId);
    console.log(item);
    if (item.length === 0) {
      res.status(404).send("404 User not found ");
    } else {
      res.status(200).send(item);
    }
  } catch (err) {
    res.send("Bad of user request 🛠🛠⚒", err.message);
  }
});

app.patch("/users", async (req, res) => {
  const userId = req.body.userId;
  const content = req.body.firstName;
  const email = req.body.emailId;
  try {
    const item = await User.findByIdAndUpdate(
      userId,
      { firstName: content, emailId: email },
      { new: true }
    );
    await item.save();
    console.log(item);
    res.status(200).send("This Item  successfully updated");
  } catch (err) {
    res.status(404).send("404 User not found ");
  }
});

app.delete("/users", async (req, res) => {
  // const userEmail = req.body.emailId
  const userId = req.body.userId;
  try {
    const item = await User.findByIdAndDelete(userId);
    console.log(item);
    res.status(200).send("This Item deleted Successfully");
  } catch (err) {
    res.status(404).send("404 User not found ");
  }
});

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User successfully Added!");
  } catch (error) {
    res
      .status(500)
      .send("Unable to add user something went wrong!", error.message);
  }
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
