
const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

// ** cookie-parser middleware and why do we need this ? **

app.use(express.json()); // for parsing json body
require("./config/database").connect();

// routes import and mount

const user = require("./routes/user");
app.use("/api/v1" , user); // mounting the routes


// activate the server
app.listen(PORT , () => {
     console.log(`App is listening at port number ${PORT}`);
})


