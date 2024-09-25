
// authenticity, isStudent, isAdmin
// authenticity middleware => isStudent middleware => isAdmin middleware


const jwt = require("jsonwebtoken");
require("dotenv").config();

// next => {next middleware that is going to be passed}
exports.auth = (req , res , next) => {
    try{

        // extract JWT Token 
        const token = req.body.token;

        if(!token){
            return res.status(401).json({
                success : false,
                message : "Token missing..!!",
            });
        }

        // verify the token
        
        try{
            // jwt => verify method
            const decode = jwt.verify(token , process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode; // storing the decoded-payload in the request body

        } catch(err) {
            return res.status(401).json({
                success : false,
                message : "Token is invalid..!!", 
            });
        }
        next(); // go to next middleware

    } catch(err) {
        return res.status(401).json({
            success : false,
            message : "Something went wrong, while verifying token..!!",
        });
    }
}


exports.isStudent = (req , res , next) => {
    try{

        if(req.user.role !== "Student"){
            return res.status(401).json({
                success : false,
                message : "This is a protected route for students..!!",
            });
        }

        next();

    } catch(err) {
        return res.status(500).json({
            success : false,
            message : "User role is not matching Student..!",
        });
    }
}


exports.isAdmin = (req , res , next) => {
    try{

        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success : "false",
                message : "This is a protected route for Admins",
            });
        }

        next();

    } catch(err) {
        return res.status(500).json({
            success : false,
            message : "User role is not matching Admin..!",
        });
    }
}



