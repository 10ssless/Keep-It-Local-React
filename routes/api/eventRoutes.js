const router = require("express").Router();
const db = require("../../models");
const moment = require('moment');
const NodeGeocoder = require('node-geocoder');
const turf = require('@turf/turf');
const connection = require("../../config/connection")

const options = {
    provider: 'mapquest',
    apiKey: process.env.DB_MAPQUESTKEY
};
const geocoder = NodeGeocoder(options);

if (process.env.REDIS_URL) {
    var redis = require('redis').createClient(process.env.REDIS_URL);
}
else {
    var redis = require('redis').createClient(6379, 'localhost');
}

// 
router.get("/allUserandArea", function (req, res) {
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

router.get("/rsvp/:id", function (req, res) {
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

router.put("/rsvp", function (req, res) {
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

router.get('/:id', function (req, res) {
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



router.put("/:id", function (req, res) {
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

router.post("/newEvent", function (req, res) {
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
        console.log(future);
        if (!future) {
            console.log('not in future');
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
                console.log(resp.dataValues.id);
            }).then(function () {
                //create a new table with name Messages_<eventname>
                connection.query(`CREATE TABLE Messages_${eventID}(
              id INTEGER(10) AUTO_INCREMENT PRIMARY KEY,
              content VARCHAR(255) NOT NULL,
              creatorID VARCHAR(255) NOT NULL,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
              );`,
                    function (err, resp) {
                        if (err) throw err.stack;
                        res.end();
                    });

            }).catch(function (err) {
                console.log(err);
                res.json(err);
            })
        }
    })
});

// takes two string respresentations of dates in format "YYYY-MM-DD"
function compareDashedDates(date1, date2) {
    console.log(date1);
    console.log(date2);
    date1 = date1.split('-');
    date2 = date2.split('-');
    console.log(date1);
    console.log(date2);
    for (let i = 0; i < date1.length; i++) {
        if (parseInt(date1[i]) < parseInt(date2[i])) {
            return true;
        } else if (parseInt(date1[i]) > parseInt(date2[i])) {
            return false;
        }
    }
    return true;
}

function toTwoPlaces(num) {
    return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

function formatCoords(str) {
    str = str.split(', ');
    let list = [parseFloat(str[0]), parseFloat(str[1])];
    return list;
}


module.exports = router;