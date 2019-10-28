// Requiring our models and passport as we've configured it
const router = require("express").Router();
const db = require("../models");
const passport = require("../config/passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const connection = require('../config/connection');
const voucher_codes = require('voucher-code-generator');
const moment = require('moment');
const NodeGeocoder = require('node-geocoder');
const turf = require('@turf/turf');
require('dotenv').config()

if(process.env.REDIS_URL){
  var redis = require('redis').createClient(process.env.REDIS_URL);
}
else{
  var redis = require('redis').createClient(6379, 'localhost');
}


const options = {
  provider: 'mapquest',
  apiKey: process.env.DB_MAPQUESTKEY
};
const geocoder = NodeGeocoder(options);
const path = require("path");

// ====================== render/html routes ========================================//

//returns user object as JSON object if the user is still logged in/session is still active
router.get("/currentUser", function (req, res) {
  req.user ? res.send(req.user) : res.sendStatus(400);
});

router.get("/api/logout", isAuthenticated, function (req, res) {
  req.logout();
  res.end();
});

router.get("/api/events", function (req, res) {
  if (req.user) {
    let all = []; //stores all events in the area
    let user = []; //stores all the events the user created
    let currentLoc = formatCoords(req.user.currentLocation);
    const options = {
      units: 'miles'
    };
    db.Events.findAll({
      where: {
        creatorID: {
          [db.Sequelize.Op.ne]: req.user.userName
        }
      },
      order: [
        ['date', 'DESC']
      ]
    }).then(function (dbEvents) {
      dbEvents.forEach(function (element) {
        let destinationCoords = formatCoords(element.dataValues.coords);
        let distance = turf.distance(currentLoc, destinationCoords, options);
        if (distance <= 30) {
          let dataVals = element.dataValues;
          dataVals['distance'] = toTwoPlaces(distance);
          all.push(dataVals);
        }
      })
    }).then(function () {
      db.Events.findAll({
        where: {
          creatorID: req.user.userName
        },
        order: [
          ['date', 'DESC']
        ]
      }).then(function (dbUserEvents) {
        dbUserEvents.forEach(function (item) {
          let destinationCoords = formatCoords(item.dataValues.coords);
          let distance = turf.distance(currentLoc, destinationCoords, options);
          let dataVals = item.dataValues;
          dataVals['distance'] = toTwoPlaces(distance);
          user.push(item.dataValues);
        });
        console.log(all);
        console.log(user);
        res.json({
          "all": all,
          "user": user
        });
      });
    });
  } else {
    res.end();
  }
});

//====================== api routes ========================================//

//used for logging in after signing up the first time
router.post("/api/login", passport.authenticate("local"), function (req, res) {
  res.end();
});

//logging in normally and updating location
router.put("/api/login", passport.authenticate("local"), function (req, res) {
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
router.post("/api/signup", function (req, res) {
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


router.get("/api/rsvp/:id", function (req, res) {
  // RSVP create and get
  let event_id = req.params.id;
  db.Events.findOne({
    where: {
      id: event_id
    }
  }).then(function (dbEvents) {
    let event = {
      upVotes: dbEvents.dataValues.upVotes
    }
    res.send(event)
  })
})

router.put("/api/rsvp", function (req, res) {
  let event_id = req.body.event_id;
  console.log(req.body.event_id);
  console.log(event_id);
  db.Events.update({
    upVotes: db.sequelize.literal('upVotes + 1')
  }, {
    where: {
      id: event_id
    }
  }).then(function (data) {
    db.Events.findOne({
      where: {
        id: event_id
      },
      plain: true
    }).then(function (data) {
      console.log(data.dataValues);
      redis.set(data.dataValues.id, JSON.stringify(data.dataValues), function () {
        res.json(data);
      });
    })
  }).catch(function (err) {
    console.log(err);
    res.json(err);
  });
})

router.get('/api/event/:id', function (req, res) {
  // get a single event
  redis.get(req.params.id, function (err, reply) {
    if (err) {
      console.log('error getting cached item');
    }
    else if (reply) //Book exists in cache
    {
      console.log('in cache!');
      console.log(JSON.parse(reply));
      res.json(JSON.parse(reply));
    }
    else {
      db.Events.findOne({
        where: {
          id: req.params.id
        },
        plain: true
      }).then(function (data) {
        console.log(data.dataValues);
        redis.set(data.dataValues.id, JSON.stringify(data.dataValues), function () {
          res.json(data);
        });
      })
    }
  })
})



router.put("/api/event/:id", function (req, res) {
  //change name and/or description of an event
  console.log(req.body.name);
  db.Events.update({
    name: req.body.name,
    description: req.body.description
  }, {
    where: {
      id: req.params.id
    }
  }).then(function () {
    // .update() function doesn't return any usable data
    // have to findOne to get the data and update the cache
    db.Events.findOne({
      where: {
        id: req.params.id
      },
      plain: true
    }).then(function (data) {
      console.log(data.dataValues);
      redis.set(data.dataValues.id, JSON.stringify(data.dataValues), function () {
        res.json(data);
      });
    })
  }).catch(function (err) {
    res.json(err);
  });
});

router.post("/api/event", function (req, res) {
  //create new event with a name, category, username, and location passed in
  //upVotes is initially 0, and the creatorID is the user's id that is currently logged in.
  let description = "";
  if (req.body.description) {
    description = req.body.description
  }
  geocoder.geocode(req.body.location, function (err, data) {

    let loc = data[0].latitude.toString() + ', ' + data[0].longitude.toString();

    let from = turf.point([data[0].latitude, data[0].longitude]);
    let userLoc = req.user.currentLocation;
    userLoc = userLoc.split(', ');

    let to = turf.point([userLoc[0], userLoc[1]]);

    let options = {
      units: 'miles'
    };

    let distance = turf.distance(from, to, options);

    if (distance >= 30) {
      res.statusMessage = "Too far away";
      res.status(400).end();
      return;
    }

    let now = moment().format('YYYY-MM-DD');
    let eventDate = req.body.date;
    let future = compareDashedDates(now, eventDate);
    if (!future) {
      res.statusMessage = "Invalid Date";
      res.status(400).end();
      return;
    }
    else {
      db.Events.create({
        name: req.body.name,
        description: description,
        date: req.body.date,
        category: req.body.category,
        // streetAddress: req.body.address,
        location: req.body.location,
        coords: loc,
        creatorID: req.user.userName,
        // startTime: req.body.startTime,
        // endTime: req.body.endTime,
        upVotes: 0
      }).then(function (resp) {
        eventID = resp.dataValues.id;
      }).then(function () {
        //create a new table with name Messages_<eventname>
        connection.query(`CREATE TABLE Messages_${eventID}
          (
            id INTEGER(10) AUTO_INCREMENT PRIMARY KEY,
            content VARCHAR(255) NOT NULL,
            creatorID VARCHAR(255) NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, function (err, resp) {
          res.end();
        });

      }).catch(function (err) {
        console.log(err);
        res.json(err);
      })
    }
  })
});

router.post("/api/message", function (req, res) {
  // create new message 
  let event_id = req.body.id;
  let content = escapeString(req.body.content);
  connection.query(`INSERT INTO Messages_${event_id}(content, creatorID) VALUES("${content}", "${req.user.userName}");`,
    function (err, result) {
      if (err) throw err.stack;
      console.table(result);
      res.end();
    });
});

router.get("/api/messages/:id", function (req, res) {
  //get all messages from a certain event
  let event_id = req.params.id;
  // ============= mysql method =======================
  connection.query(`SELECT * FROM Messages_${event_id} ORDER BY id ASC`, function (err, result) {
    if (err) throw err.stack;
    console.table(result);
    let msgs_time = {
      result: result,
      time: result
    }
    res.send(result);
  });
});

router.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, "../client/public/index.html"));
})


//====================== helper functions ========================================//
function escapeString(str) {
  //used for making mysql queries with strings including special characters
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\" + char; // prepends a backslash to backslash, percent,
      // and double/single quotes
    }
  });
}

function formatCoords(str) {
  str = str.split(', ');
  let list = [parseFloat(str[0]), parseFloat(str[1])];
  return list;
}

function toTwoPlaces(num) {
  return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

function momentToString(currentTime) {
  let x = currentTime.split('-');
  currentTime = currentTime.replace('-' + x[x.length - 1], '.000Z');
  return currentTime;
}

function distanceBetween(coords1, coords2) {
  //takes in comma seperated coordinates and returns the distance between them
  coords1 = formatCoords(coords1);
  coords2 = formatCoords(coords2);
  let from = turf.point(coords1);
  let to = turf.point(coords2);
  let options = {
    units: 'miles'
  };
  let distance = turf.distance(from, to, options);
  return distance;
}

// takes two string respresentations of dates in format "YYYY-MM-DD"
function compareDashedDates(date1, date2) {
  date1 = date1.split('-');
  date2 = date2.split('-');
  for (let i = 0; i < date1.length; i++) {
    if (parseInt(date1[i]) < parseInt(date2[i])) {
      return true;
    } else if (parseInt(date1[i]) > parseInt(date2[i])) {
      return false;
    }
  }
}


module.exports = router;
