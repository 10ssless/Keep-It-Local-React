const router = require("express").Router();
const voucher_codes = require('voucher-code-generator');
const db = require("../../models");

router.post("/api/checkcode", function (req, res) {
  db.ReferralCodes.findOne({
    where: {
      code: req.body.referral
    }
  }).then(function (result) {
    if (!result) {
      res.statusMessage = "Bad Referral Code";
      res.status(400).end();
    }
    console.log(result);
    res.end();
  });
});

router.get("/api/allcodes", function (req, res) {
  db.ReferralCodes.findAll({
    where: {
      creatorID: req.user.userName
    },
    limit: 5
  }).then(function (allcodes) {
    mycodes = [];
    for (let i = 0; i < allcodes.length; i++) {
      console.log(allcodes[0].dataValues);
      if (allcodes[0].dataValues.creatorID === req.user.userName) {
        mycodes.push(allcodes[i].dataValues.code);
      }
    }
    console.log(mycodes);
    res.json({
      status: 0, // 'old' status
      codes: mycodes
    });
  })
})

router.get("/api/code", function (req, res) {
  // This generates a code for the user when the button is checked.
  db.User.findOne({
    where: {
      userName: req.user.userName
    }
  }).then(function (result) {
    // Gets the current time in a moment object
    let currentTime = moment().format();

    // Calls our helper function to format the current time to match format of the time on the database
    currentTime = momentToString(currentTime);
    currentTime = moment(currentTime);

    let lastRef = new Date(result.lastReferral).toISOString();
    lastRef = moment(lastRef);

    let userStart = new Date(result.createdAt).toISOString();
    userStart = moment(userStart);
    console.log(``)
    console.log(`userStart: ${userStart}`)
    console.log(`lastRef: ${lastRef}`)
    console.log(`currentTime: ${currentTime}`)
    console.log(`diff from userStart ${currentTime.diff(userStart, 'days')}`)
    console.log(`diff from lastRef ${currentTime.diff(lastRef, 'days')}`)
    console.log(``)



    // Check if user is older than 3 days on the network
    if (currentTime.diff(userStart, 'days') < 3) {
      console.log("New users must wait 3 days before getting codes")
      res.json({
        status: 1, // 'new' status 
        codes: []
      });
    } else {
      // Check if user is generated a new code in the last 3 days
      if (currentTime.diff(lastRef, 'days') < 3) {
        console.log("You're not eligible for a new code")
        res.redirect(307, "/api/allcodes");
      } else {
        console.log("You're eligible for a new code")
        // Route used to post a referral code on click
        db.ReferralCodes.create({
          creatorID: req.user.userName,
          // Generates an array of 5 random strings with 8 characters in length and selecting the first one.
          code: voucher_codes.generate({
            length: 8,
            count: 5
          })[0]
        }).then(newCodeResp => {
          console.log("new code created");
          console.log(newCodeResp);
          // res.redirect(307, "/api/allcodes");
        }).then(() => {
          db.User.update({
            lastReferral: moment.utc().format('YYYY-MM-DD HH:mm:ss')
          }, {
            where: {
              userName: req.user.userName
            }
          })
        }).then(userUpdate => {
          console.log("lastReferral date updated");
          console.log(userUpdate);
          res.redirect(307, "/api/allcodes");
        });
      }
    }
    // Checks the lastReferral with current time. Edit the int to set the amount of days
  })
});

router.post("/api/code/admin", function (req, res) {
  // Route used to post a referral code on click
  if (req.body.apiKey === 'MA3Igp6a') {
    db.ReferralCodes.create({
      creatorID: 'admin',
      // Generates an array of 5 random strings with 8 characters in length and selecting the first one.
      code: voucher_codes.generate({
        length: 8,
        count: 5
      })[0]
    }).then(function (resp) {
      console.log("code created");
      console.log(resp);
      res.json(resp);
    });
  } else {
    res.statusMessage = 'Bad API key';
    res.status(401).end();
  }
});

function momentToString(currentTime) {
  let x = currentTime.split('-');
  currentTime = currentTime.replace('-' + x[x.length - 1], '.000Z');
  return currentTime;
}

module.exports = router;