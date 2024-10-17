const validator = require("validator");

const newPassValidate = (req) => {
  const { newPassword, retypePassword } = req.body;

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Your new password is weak!");
  }
  // check if the newpassword and retype password are provided
  if (!newPassword || !retypePassword) {
    throw new Error("Both new password and re-type password are required");
  }
  if (newPassword !== retypePassword) {
    throw new Error(" Re-type password did not match to new passwords");
  }
};

module.exports = newPassValidate;
