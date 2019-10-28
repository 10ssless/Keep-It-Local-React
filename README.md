# KEEP IT LOCAL®

KEEP IT LOCAL is a tool to help people better connect with their local communities. 

This is a remake of the same app we created using JavaScript, JQuery, and Handlebars. We recreated the app which can be found at [https://github.com/shodges201/Keep-it-local](https://github.com/shodges201/Keep-it-local). New users sign are only asked for a username and password, no additional personal information is stored. In order to protect against possibly malicious users, a referral code is also required to create a new account, which can only be acquired from an existing user. Each time a user logs on, they are asked for their current location and are shown all the events coming up in their area. To build trust across the platform, we must ensure that a user is both in the local area and a mutual friend of someone in the network. To combat spammers, new users must wait 3 days initially before getting referral codes to pass to friends. After that, users can generate a new code every 3 days. Users can browse events and post messages anonymously while tapping into the different pockets of culture bubbling in their town.

## Preview

![Preview Photo](client/public/keep-it-local.png)

## Features

* Anonymously post and promote local events
* RSVP to and leave messages on events
* Refer your friends

## TODO
* Add referral code generation to the app
* Add a system for querying for messages using an interval so the messages are auto-updating

## Generating Referal Codes

In order to be able to be apart of the Keep It Local network, you must first be invited by a current users's Referal Code. Once you have created your own profile, you will be given your own Referal Code that will change every 3 days.

```js
app.post("/api/code", function (req, res) {
    db.ReferralCodes.create({
      creatorID: req.user.userName,
      code: voucher_codes.generate({
        length: 8,
        count: 5
      })[0]
    }).then(function (resp) {
      console.log("code created");
      console.log(resp);
      res.json(resp);
    })
  })
```

## Built With
* [React](https://reactjs.org/) - Front-end JavaScript library for creating single page applications
* [Moment](https://momentjs.com/docs/) - Library for parsing, manipulating time values
* [Passport](http://www.passportjs.org/) - Login Authentication for Node.js
* [Geocoder](https://developer.mapquest.com/documentation/geocoding-api/) - Library for geocoding via MapQuest API
* [Node.js](https://nodejs.org/en/) - A JavaScript server runtime environment
* [Express.js](http://expressjs.com/) - A Node.js framework used mostly for routing
* [Sequelize ORM](https://sequelize.org/) - Promise-based Node.js ORM for MySQL 


## Team Members
* Zubin Mulji
* Scott Hodges

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
