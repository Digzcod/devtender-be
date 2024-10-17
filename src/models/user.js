const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const validator = require("validator")


const isEmailUnique = async function (email) {
  const existingUser = await mongoose.models.User.findOne({ emailId: email });
  return !existingUser;
};

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if(!validator.isEmail(value)) {
            throw new Error("Invalid email address " + value)
        }
      },
      immutable: true  // Makes sure the email cannot be changed after creation or tried to change
    },
    password: {
      type: String,
      minLength: 5,
      validate (value) {
        if(!validator.isStrongPassword(value)) {
            throw new Error("Your password is weak " + value)
        }
      }
    },
    age: {
      type: Number,
      min: 18,
      required: true,
    },
    gender: {
      type: String,
      validate: (value) => {
        if (!["male", "female"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    skills: {
      type: [String],
      maxLength: 5,

    },
    aboutMe: {
      type: String,
      default: "Software Engineer Specialist in MERN techs"
    },
  },
  {
    timestamps: true,
  }
);




userSchema.methods.getJWT = async function() {
  const user = this
  const token = await jwt.sign({_id: user?._id}, "DevTender@Digz2024^", {expiresIn: "5min"})

  return token
}

userSchema.methods.getValidatePassword = async function(passwordInputByUser) {
  const user = this
  const passwordHashed = user.password
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHashed)

  return isPasswordValid
  // return passwordHashed
}


const User = mongoose.model("User", userSchema);
module.exports = User;
