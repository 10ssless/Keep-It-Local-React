// Requiring our models and passport as we've configured it
const router = require("express").Router();
require('dotenv').config();

const apiRoutes = require("./api")
router.use("/api", apiRoutes);

//set up user routes to be /user/*
const userRoutes = require("./user/user")
router.use("/user", userRoutes);

const path = require("path");

router.get('*', function (req, res) {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  }
  else {
    res.sendFile(path.join(__dirname, "../client/public/index.html"));
  }
})

module.exports = router;
