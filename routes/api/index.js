const router = require("express").Router();

// set up referral code routes to use /referralCodes/*
router.use("/referralCodes", require("./referralCodeRoutes"));

// set up events routes to use /events/*
router.use("/events", require("./eventRoutes"));

//set up messages routes to use /messages/*
router.use("/messages", require("./messageRoutes"));

module.exports = router;