const bcrypt = require("bcrypt");
const User = require("../models/User"); // importing model

const jwt = require("jsonwebtoken");
const { faHandSparkles } = require("@fortawesome/free-solid-svg-icons");

require("dotenv").config();

// signUp route handler

exports.signUp = async (req, res) => {
  try {
    // get input data
    const { name, email, password, role } = req.body;

    // check if user already exists
    // DB interaction

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    // secure the password

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Error in hashing password",
      });
    }

    // create entry for user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered..Pls try again later !",
    });
  }
};

// login route handler

exports.login = async (req, res) => {
  try {
    // fetch the data
    const { email, password } = req.body;

    // validate email and password
    if (!email || !password) {
      // return response
      return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully !",
      });
    }

    const user = await User.findOne({ email }).lean();
    // .lean() converts mongoose object to plain javascript object
    // Another-Method => user.toObject() method

    // if not registered
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered..!",
      });
    }

    // verify password and generate JWT token
    // password => use of hashing

    const payLoad = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    if (await bcrypt.compare(password, user.password)) {
      // Passwords match

      let token = jwt.sign(payLoad, process.env.JWT_SECRET , {
        expiresIn : "2h",
      }); 

      user.token = token;
      user.password = undefined;

      const options = {
        expires : new Date(Date.now() + 3 * 24 * 60 *  60 * 1000),
        httpOnly : true,
      }

      res.cookie("token" , token , options).status(200).json({
        success : true,
        token,
        user,
        message : "User logged in successfully..!!",
      });


    } else {
      // passwords do not match
      return res.status(403).json({
        success: false,
        message: "Password Incorrect.!",
      });
    }
  } catch (err) {

    console.log(err);
    return res.status(500).json({
        success : false,
        message : "Login Failure.!!",
    });

  }
};
