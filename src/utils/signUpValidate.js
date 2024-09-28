const validator = require("validator")

const signUpValidate = (req) => {
    const {firstName, lastName, emailId, password, } = req.body
    if(firstName.length < 3 || firstName.length > 30) {
        throw new Error("Firstname must have 3 to 30 characters 👍")
    } else if(lastName.length < 3 || lastName.length > 30) {
        throw new Error("Lastname must have 3 to 30 characters 👍")
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Must be a valid email address")
        
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Your password is not strong😔!")
    }
}

module.exports = signUpValidate