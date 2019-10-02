const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const routes = require("./routes/sabotage-routes");
const app = express();
const passport = require("passport");
const session = require("express-session");

const PORT = process.env.PORT || 9000;
const URI = process.env.MONGODB_URI || 'mongodb://localhost/saboDB?replicaSet=rs';


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

app.use(session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/pointless", { useNewUrlParser: true });
mongoose.connect(URI, { useNewUrlParser: true });


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

app.listen(PORT, () => {
    console.log('Node server running on port ' + PORT);
});