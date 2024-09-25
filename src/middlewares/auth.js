


const authAdmin = (req, res, next) => {
  console.log("Checking the auth Admin ✔✔✔");
  const token = "12345sa";
  const isAdminAuth = token === "12345";
  if (!isAdminAuth) {
    res.status(401).send("Unauthorize request please check your capabilities");
  } else {
    next();
  }
};

// user auth middleware
const userAuth = (req, res, next) => {
  console.log("user auth check ✔");
  const token = "123";
  const isUserAuth = token === "123";
  if (!isUserAuth) {
    res.status(401).send("Unauthorize user");
  } else {
    next();
  }
};

module.exports = { authAdmin, userAuth };
