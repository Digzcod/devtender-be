const express = require("express");
const connectDB = require("./config/database");
const { userAuth } = require("./middlewares/auth");
const signUpValidate = require("./utils/signUpValidate");
const bcrypt = require("bcrypt");

const User = require("./models/user");
const app = express();

app.use("/", userAuth);
app.use(express.json());

app.get("/feeds", async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).send({ data });
  } catch (err) {
    res.status(500).send("Bad request feeds" + err.message);
  }
});

app.get("/users/:userId", async (req, res) => {
  const userId = req.params?.userId;
  try {
    const item = await User.findById(userId);
    console.log(item);
    if (item.length === 0) {
      res.status(404).send("404 User not found ");
    } else {
      res.status(200).send(item);
    }
  } catch (err) {
    res.send("Bad of user request 🛠🛠⚒" + err.message);
  }
});

app.patch("/users/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const DATA_ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "password",
    ];
    const isAllowedUpdates = Object.keys(data).every((k) =>
      DATA_ALLOWED_UPDATES.includes(k)
    );
    if (!isAllowedUpdates) {
      throw new Error("Updates not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const item = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(item);
    res.status(200).send("This Item  successfully updated");
  } catch (err) {
    res.status(404).send("404 User not found " + err.message);
  }
});

app.patch("/users/", async (req, res) => {
  const userId = req.body.userId;
  // const content = req.body.firstName;
  // const email = req.body.emailId;
  try {
    const item = await User.findByIdAndUpdate(
      userId,
      req.body,
      { returnDocument: "after", runValidators: true }
      // { firstName: content, emailId: email },
      // { new: true }
    );
    // await item.save();
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
    res.status(200).send("This Item deleted successfully");
  } catch (err) {
    res.status(404).send("404 User not found ");
  }
});

app.post("/signup", async (req, res) => {
  try {
    // validate signup data from client or user request
    signUpValidate(req);

    const { emailId, lastName, firstName, password, age } = req.body;

    // hashed password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const client = await User.findOne({ emailId: emailId });
    
    if (!client) {
      throw new Error("Invalid crendentials");
    }

    const isPasswordValid = await bcrypt.compare(password, client?.password);
    if (isPasswordValid) {
      res.send("Succesfully login🙂");
    } else {
      throw new Error("Invalid crendentials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
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
