const router = require("express").Router();
const passport = require("../../config/passport");
const isAuthenticated = require("../../config/middleware/isAuthenticated");
const db = require("../../models/index.js");

//returns user object as JSON object if the user is still logged in/session is still active
router.get("/currentUser", function (req, res) {
    req.user ? res.send(req.user) : res.sendStatus(400);
  });
  
  router.get("/logout", isAuthenticated, function (req, res) {
    req.logout();
    res.end();
  });

  //used for logging in after signing up the first time
router.post("/login", passport.authenticate("local"), function (req, res) {
    res.end();
  });
  
  //logging in normally and updating location
  router.put("/login", passport.authenticate("local"), function (req, res) {
    console.log('tried to login');
    db.User.update({
      currentLocation: req.body.location
    }, {
      where: {
        userName: req.body.username
      }
    }).then(function (resp) {
      console.log(resp);
      res.end();
    });
  });
  
  //create entry in the table for new user
  router.post("/signup", function (req, res) {
    currentUser = req.body.username;
    currentPassword = req.body.password;
    if (!currentUser || !currentPassword) {
      res.statusMessage = 'Bad username or password';
      res.status(400).end();
    } else {
      db.User.create({
        userName: req.body.username,
        password: req.body.password,
        referral: req.body.referral,
        lastReferral: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
        currentLocation: req.body.location
      }).then(function () {
        db.ReferralCodes.destroy({
          where: {
            code: req.body.referral,
          }
        }).then(function (resp) {
          res.redirect(307, "/api/login");
        })
      }).catch(function (err) {
        console.log(err);
        res.json(err);
      });
    }
  });


module.exports = router;