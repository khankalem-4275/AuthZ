
const express = require("express");
const router = express.Router();

// handlers

const {login , signUp} = require("../controllers/Auth");

//  importing the middlewares 
const {auth ,  isStudent , isAdmin} = require("../middlewares/auth");

router.post("/login" , login); 
router.post("/signup" , signUp); 

// protected Routes

router.get("/student" , auth , isStudent , (req , res) => {
    return res.json({
        success : true,
        message : "Welcome to the Protected Route for Students..!!",
    });
});

router.get("/admin" , auth , isAdmin , (req , res) => {
    return res.json({
        success : true,
        message : "Welcome to the protected route for Admin..!!",
    });
});

router.get("/test" , auth , (req , res) => {
    return res.json({
        success : true,
        message : "Welcome to the protected route for Tests..!!",
    });
});

module.exports = router;
