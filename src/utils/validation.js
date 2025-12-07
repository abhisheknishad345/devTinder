

const validator = require("validator")


const validateSinupData = (req) => {
    const {Fname, Lname, emailId, password} = req.body;

    if (!Fname || !Lname) {
        throw new Error("Name is not valid")
        
    } else if (Fname.length < 3 || Lname.length > 50) {
        throw new Error("Firstname is 4-50 character")
        
    } else if (!validator.isEmail(emailId)) {
        
        throw new Error("Email is Invalid ")
        
    } else if (!validator.isStrongPassword(password)) {
        
        throw new Error("Password is weak, enter strong one")
    }

}

const validateEditProfile =( req )=>{
    const isAllowedEditFields = ["Fname", "Lname", "age", "about", "skills", "emailId"]

 const isEditAllowed =    Object.keys(req.body).every((field) => 
        isAllowedEditFields.includes(field)
    )

    return isEditAllowed;


}

module.exports = {
    validateSinupData,
    validateEditProfile
}