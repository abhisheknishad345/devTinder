

export  const adminAuth =  (req, res, next) =>{
    console.log("Admin auth is getting checked");
    const token = "xyz"
    const isAuthorised = token === "xyz"
    if (!isAuthorised) {
        res.status(401).send("Unauthorised admin request")
        
    } else {
        next()
    }
}

export  const userAuth =  (req, res, next) =>{
    console.log("User auth is getting checked");
    const token = "xyz"
    const isAuthorised = token === "xyz"
    if (!isAuthorised) {
        res.status(401).send("Unauthorised user request")
        
    } else {
        next()
    }
}

//module.exports = { adminAuth }