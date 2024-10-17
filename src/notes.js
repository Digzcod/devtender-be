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
  
  app.get("/profile", async (req, res) => {
    try {
      const cookies = req.cookies;
      const { token } = cookies;
      if (!token) {
        throw new Error("Access denied");
      }
      // const decodedMessage =
      await jwt.verify(token, "DevTender@Digz2024^");
  
      // const { _id } = decodedMessage;
      // console.log("This token is user is having this id: " + _id);
  
      const user = await User.findById({ _id });
      // console.log("This token is user is having this id: " + user?.firstName);
  
      res.send("Reading cookies😚 " + user);
    } catch (error) {
      res
        .status(500)
        .send("Please check you authorization level " + error.message);
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
        // Create JWt Token
        const token = await jwt.sign({ _id: client?._id }, "DevTender@Digz2024^");
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