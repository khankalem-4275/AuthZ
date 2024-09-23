
const bcrypt = require("bcrypt");
const User = require("../models/User"); // importing model

// signUp route handler

exports.signUp = async(req , res) => {
    try{

        // get input data
        const {name , email , password , role} = req.body;

        // check if user already exists
        // DB interaction

        const existingUser = await User.find({email}); 

        if(existingUser){
            return res.status(400).json({
                success : false,
                message : "User already exists.",
            });
        }

        // secure the password

        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password , 10);
        } catch(err){
            return res.status(500).json({
                success : false,
                error : "Error in hashing password",
            });
        }

        // create entry for user
        const user = await User.create({
            name,email,
            password : hashedPassword,
            role
        });

        return res.status(200).json({
            success : true,
            message : "User registered successfully",
        });

    }catch(err) {

        console.error(err);
        return res.status(500).json({
            success : false,
            message : "User cannot be registered..Pls try again later !",
        });
    }
}








