const mongoose = require("mongoose");
const validator = require("validator")
// Helper function to check if email exists
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
      validate: {
        validator: isEmailUnique,
        message: "This email is already been used",
        isAsync: true,  // Validate email only during creation
        skipOnupdate: true, // This ensures the check only happens on new user creation (not updates)
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

// Pre-save hook to ensure that email cannot be changed once the user is created
userSchema.pre('save', async function (next) {
    // If the document is being updated (not created), skip email validation
    if (!this.isNew && this.isModified('emailId')) {
      throw new Error('Email cannot be changed after the user is created');
    }
    next();
  });

const User = mongoose.model("User", userSchema);
module.exports = User;
