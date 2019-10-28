const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');
const routes = require("./routes/api-routes.js");
const passport = require("./config/passport");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 9000;
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static("public"));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// We need to use sessions to keep track of our user's login status
app.use(session({ 
    secret: "keyboard cat", 
    resave: true, 
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "production") {
    app.use(express.static(__dirname + "client/build"));
}
else{
  app.use(express.static(__dirname + '/client/public'));
}


// Requiring our routes
// require("./routes/html-routes.js")(app);
app.use(routes);

// Syncing our database and logging a message to the user upon success
  app.listen(PORT, function() {
    console.log(`==> 🌎  Listening on port ${PORT}. Visit http://localhost:%s/ in your browser.`);
    db.sequelize.sync({ force: false }).then(function() {
      console.log('connected');
  });
});